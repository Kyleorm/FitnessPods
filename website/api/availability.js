// Secure proxy to the ClubSolution / Halbooking "FitnessPOD Bookings" report (report id 7).
//
// Why this exists: the ClubSolution API authenticates with a username + password
// (HTTP Basic auth). Those credentials must NEVER live in the public website code.
// This serverless function runs on the server, holds the credentials in environment
// variables, and returns ONLY the list of booked pod/hour slots for a given date.
// The booking grid treats every slot NOT in that list (within opening hours) as available.
//
// Required Vercel environment variables:
//   CLUBSOLUTION_API_URL       e.g. https://fitnesspod.clubsolution.co.uk/api/report/reporting
//   CLUBSOLUTION_API_USER      API username
//   CLUBSOLUTION_API_PASS      API password
//   CLUBSOLUTION_API_PREFIX    "Prefix" header value (e.g. 01)
//   CLUBSOLUTION_API_AFDELING  "Afdeling" (department) header value (e.g. 0)

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate the requested date — expect YYYY-MM-DD from the booking grid.
  const date = (req.query && req.query.date) || '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid or missing date (expected YYYY-MM-DD)' });
  }

  const API_URL  = process.env.CLUBSOLUTION_API_URL;
  const USER     = process.env.CLUBSOLUTION_API_USER;
  const PASS     = process.env.CLUBSOLUTION_API_PASS;
  const PREFIX   = process.env.CLUBSOLUTION_API_PREFIX;
  const AFDELING = process.env.CLUBSOLUTION_API_AFDELING;

  if (!API_URL || !USER || !PASS || !PREFIX || AFDELING == null || AFDELING === '') {
    return res.status(500).json({ error: 'Availability service not configured' });
  }

  // The Halbooking report filters expect dd-MM-yyyy.
  const [y, m, d] = date.split('-');
  const apiDate = `${d}-${m}-${y}`;

  const auth = 'Basic ' + Buffer.from(`${USER}:${PASS}`).toString('base64');

  const body = {
    post_report_id: 7,
    post_report_fields: '',
    post_report_subtotal_fields: '',
    post_report_orderby_fields: '',
    post_report_pagenumber: 1,
    post_report_select_filters: [
      { post_report_filter_id: 1, post_report_filter_value: apiDate }, // date from
      { post_report_filter_id: 2, post_report_filter_value: apiDate }, // date to
    ],
  };

  try {
    const apiRes = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Prefix': PREFIX,
        'Afdeling': AFDELING,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!apiRes.ok) {
      const detail = await apiRes.text().catch(() => '');
      console.error('ClubSolution API error', apiRes.status, detail.slice(0, 300));
      return res.status(502).json({ error: 'Could not reach availability service' });
    }

    const json = await apiRes.json();
    const rows = Array.isArray(json.data) ? json.data : [];

    // Each row is a BOOKED slot. `bane` = pod name, `fra` = start time (ISO/UTC).
    // We only expose pod name + booking hour — no member or personal data.
    const seen = new Set();
    const booked = [];
    for (const row of rows) {
      if (!row || typeof row.bane !== 'string' || !row.fra) continue;
      const hour = new Date(row.fra).getUTCHours();
      if (!Number.isInteger(hour)) continue;
      const key = `${row.bane}-${hour}`;
      if (seen.has(key)) continue; // de-dupe (a slot can appear more than once)
      seen.add(key);
      booked.push({ pod: row.bane, hour });
    }

    // Cache briefly at the edge so rapid day-switching doesn't hammer the API,
    // while staying near real-time.
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    return res.status(200).json({ date, booked });
  } catch (err) {
    console.error('availability error:', err.message);
    return res.status(502).json({ error: 'Could not load availability' });
  }
};
