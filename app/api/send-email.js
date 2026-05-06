export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { type, customerEmail, customerName, customerPhone } = req.body ?? {}

  if (!type || !customerEmail) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const key = process.env.RESEND_API_KEY
  if (!key) {
    return res.status(500).json({ error: 'Email service not configured' })
  }

  // Swap FROM to 'FitnessPod IOM <hello@fitnesspod.im>' once DNS is verified in Resend
  const FROM = 'FitnessPod IOM <onboarding@resend.dev>'
  // TODO: swap for real owner email once confirmed
  const OWNER_EMAIL = 'owner@fitnesspod.im'

  async function send({ to, subject, html }) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    })
    if (!r.ok) throw new Error(await r.text())
  }

  try {
    if (type === 'welcome') {
      await Promise.all([
        send({
          to: customerEmail,
          subject: 'Welcome to FitnessPod IOM',
          html: welcomeHtml(customerName),
        }),
        send({
          to: OWNER_EMAIL,
          subject: `New signup — ${customerName}`,
          html: ownerNotifHtml(customerName, customerEmail, customerPhone),
        }),
      ])
      return res.status(200).json({ ok: true })
    }

    return res.status(400).json({ error: 'Unknown email type' })
  } catch (err) {
    console.error('send-email error:', err.message)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}

function welcomeHtml(name) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#0d1226;padding:32px 40px;text-align:center;">
            <div style="font-size:26px;font-weight:900;letter-spacing:3px;color:#ffffff;">FITNESSPOD <span style="color:#d42028;">IOM</span></div>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#0d1226;">Welcome, ${name}!</h1>
            <p style="margin:0 0 20px;font-size:15px;color:#4b5563;line-height:1.7;">Thanks for signing up to FitnessPod IOM. Your account is pending approval — we'll have you confirmed within a few hours.</p>
            <div style="background:#fefce8;border:1px solid #fde047;border-radius:12px;padding:20px;margin:0 0 24px;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#92400e;">Reserved for you</p>
              <p style="margin:0 0 6px;font-size:22px;font-weight:900;color:#b45309;">1.5 Free Pod Points</p>
              <p style="margin:0;font-size:14px;color:#78350f;">Covers any session — ready to use once you're approved.</p>
            </div>
            <p style="margin:0 0 32px;font-size:14px;color:#6b7280;line-height:1.7;">Once approved you'll get a confirmation email and can start booking through the FitnessPod app straight away.</p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;" />
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">FitnessPod IOM &middot; Isle of Man</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function ownerNotifHtml(name, email, phone) {
  const now = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#0d1226;padding:32px 40px;text-align:center;">
            <div style="font-size:26px;font-weight:900;letter-spacing:3px;color:#ffffff;">FITNESSPOD <span style="color:#d42028;">IOM</span></div>
            <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.5);letter-spacing:0.1em;text-transform:uppercase;">Admin Notification</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <h1 style="margin:0 0 6px;font-size:20px;font-weight:800;color:#0d1226;">New member signed up</h1>
            <p style="margin:0 0 28px;font-size:13px;color:#9ca3af;">${now}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
              <tr style="background:#f9fafb;">
                <td style="padding:14px 18px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;width:100px;">Name</td>
                <td style="padding:14px 18px;font-size:15px;font-weight:600;color:#111827;">${name}</td>
              </tr>
              <tr style="border-top:1px solid #e5e7eb;">
                <td style="padding:14px 18px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">Email</td>
                <td style="padding:14px 18px;font-size:15px;color:#111827;">${email}</td>
              </tr>
              <tr style="border-top:1px solid #e5e7eb;">
                <td style="padding:14px 18px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">Phone</td>
                <td style="padding:14px 18px;font-size:15px;color:#111827;">${phone || '—'}</td>
              </tr>
            </table>
            <div style="margin-top:24px;padding:14px 18px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;">
              <p style="margin:0;font-size:14px;color:#15803d;">Log in to the admin dashboard to approve or review this account.</p>
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
