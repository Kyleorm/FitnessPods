// Secure proxy to the ClubSolution / Halbooking "FitnessPOD Bookings" report (report id 7).
//
// Why this exists: the ClubSolution API authenticates with a username + password
// (HTTP Basic auth). Those credentials must NEVER live in the public website code.
// This serverless function runs on the server, holds the credentials in environment
// variables, and returns ONLY the list of booked pod/hour slots for a given date.
// The homepage treats every pod NOT in that list for the current hour as available.
//
// Abuse protection (so nobody can use this endpoint to flood ClubSolution):
//   1. Rate limit — each visitor (IP address) gets RATE_LIMIT requests per minute.
//   2. Date window — only yesterday, today and tomorrow (UTC) are accepted, which
//      covers "today" for a visitor in any time zone and nothing else.
//   3. Short cache — each date is fetched from ClubSolution at most once every
//      CACHE_MS, however many requests arrive, including ones that try to dodge the
//      edge cache with extra query-string junk.
// The rate limit and cache live in memory, so each running server instance keeps its
// own copy. That is best-effort, but together with the date window it caps how often
// ClubSolution can be called.
//
// Required Vercel environment variables:
//   CLUBSOLUTION_API_URL       e.g. https://fitnesspod.clubsolution.co.uk/api/report/reporting
//   CLUBSOLUTION_API_USER      API username
//   CLUBSOLUTION_API_PASS      API password
//   CLUBSOLUTION_API_PREFIX    "Prefix" header value (e.g. 01)
//   CLUBSOLUTION_API_AFDELING  "Afdeling" (department) header value (e.g. 0)

const RATE_LIMIT = 30;           // requests per visitor per window
const RATE_WINDOW_MS = 60_000;   // 1 minute
const CACHE_MS = 30_000;         // how long one ClubSolution answer is reused
const UPSTREAM_TIMEOUT_MS = 8_000;

const requestCounts = new Map(); // ip -> { count, windowStart }
const cache = new Map();         // date -> { promise, expires }

// Vercel sets x-real-ip / x-forwarded-for to the visitor's real IP (it overwrites
// any value the visitor sends), so these can be trusted there.
function clientIp(req) {
  const headers = req.headers || {};
  const forwarded = String(headers['x-forwarded-for'] || '').split(',')[0].trim();
  return headers['x-real-ip'] || forwarded || 'unknown';
}

// Fixed-window counter. Returns true when this visitor is over the limit.
function isRateLimited(ip, now) {
  // Drop finished windows now and then so the map can't grow without limit.
  if (requestCounts.size > 5000) {
    for (const [key, entry] of requestCounts) {
      if (now - entry.windowStart >= RATE_WINDOW_MS) requestCounts.delete(key);
    }
  }
  const entry = requestCounts.get(ip);
  if (!entry || now - entry.windowStart >= RATE_WINDOW_MS) {
    requestCounts.set(ip, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

// Yesterday, today and tomorrow in UTC.
function allowedDates(now) {
  const day = 24 * 60 * 60 * 1000;
  return [isoDate(new Date(now - day)), isoDate(new Date(now)), isoDate(new Date(now + day))];
}

// Asks ClubSolution for the bookings on one date and returns [{ pod, hour }].
async function fetchBooked(date, config) {
  // The Halbooking report filters expect dd-MM-yyyy.
  const [y, m, d] = date.split('-');
  const apiDate = `${d}-${m}-${y}`;

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

  const apiRes = await fetch(config.url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${config.user}:${config.pass}`).toString('base64'),
      'Prefix': config.prefix,
      'Afdeling': config.afdeling,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });

  if (!apiRes.ok) {
    throw new Error(`ClubSolution API returned HTTP ${apiRes.status}`);
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
  return booked;
}

// Returns the cached answer for a date, or fetches it once. Requests that arrive
// while a fetch is running share it instead of starting their own.
function getBooked(date, config, now) {
  const hit = cache.get(date);
  if (hit && hit.expires > now) return hit.promise;

  // Drop expired answers so the cache stays small.
  for (const [key, entry] of cache) {
    if (entry.expires <= now) cache.delete(key);
  }

  const promise = fetchBooked(date, config);
  cache.set(date, { promise, expires: now + CACHE_MS });
  // Never keep a failure: the next request should try ClubSolution again.
  promise.catch(() => {
    if (cache.get(date)?.promise === promise) cache.delete(date);
  });
  return promise;
}

module.exports = async function handler(req, res) {
  const now = Date.now();

  if (isRateLimited(clientIp(req), now)) {
    res.setHeader('Retry-After', String(Math.ceil(RATE_WINDOW_MS / 1000)));
    res.setHeader('Cache-Control', 'no-store');
    return res.status(429).json({ error: 'Too many requests. Please try again in a minute.' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate the requested date — expect YYYY-MM-DD, and only the dates the
  // homepage can ask for (see allowedDates).
  const date = (req.query && req.query.date) || '';
  if (typeof date !== 'string' || !allowedDates(now).includes(date)) {
    return res.status(400).json({ error: 'Invalid or missing date (expected today as YYYY-MM-DD)' });
  }

  const config = {
    url:      process.env.CLUBSOLUTION_API_URL,
    user:     process.env.CLUBSOLUTION_API_USER,
    pass:     process.env.CLUBSOLUTION_API_PASS,
    prefix:   process.env.CLUBSOLUTION_API_PREFIX,
    afdeling: process.env.CLUBSOLUTION_API_AFDELING,
  };

  if (!config.url || !config.user || !config.pass || !config.prefix || config.afdeling == null || config.afdeling === '') {
    return res.status(500).json({ error: 'Availability service not configured' });
  }

  try {
    const booked = await getBooked(date, config, now);

    // Cache briefly at the edge so repeat visits don't reach this function at all,
    // while staying near real-time.
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    return res.status(200).json({ date, booked });
  } catch (err) {
    // Server log only; visitors get a plain message and the page keeps its default status.
    console.error('availability error:', err.message);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(502).json({ error: 'Could not load availability' });
  }
};
