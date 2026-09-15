module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { type, customerEmail, customerName } = req.body ?? {}

  if (!type || !customerEmail) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const key = process.env.RESEND_API_KEY
  if (!key) {
    return res.status(500).json({ error: 'Email service not configured' })
  }

  // Swap FROM to 'FitnessPod IOM <hello@fitnesspod.im>' once DNS is verified in Resend
  const FROM = 'FitnessPod IOM <onboarding@resend.dev>'

  try {
    if (type === 'approved') {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM,
          to: customerEmail,
          subject: "You're approved — FitnessPod IOM",
          html: approvedHtml(customerName),
        }),
      })
      if (!r.ok) throw new Error(await r.text())
      return res.status(200).json({ ok: true })
    }

    return res.status(400).json({ error: 'Unknown email type' })
  } catch (err) {
    console.error('send-email error:', err.message)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}

function approvedHtml(name) {
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
            <div style="width:56px;height:56px;background:#f0fdf4;border:2px solid #86efac;border-radius:50%;margin:0 0 24px;text-align:center;line-height:52px;font-size:24px;">✓</div>
            <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#0d1226;">You're approved, ${name}!</h1>
            <p style="margin:0 0 24px;font-size:15px;color:#4b5563;line-height:1.7;">Great news — your FitnessPod IOM account has been approved. You're all set to start booking sessions.</p>
            <div style="background:#fefce8;border:1px solid #fde047;border-radius:12px;padding:20px;margin:0 0 28px;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#92400e;">Don't forget</p>
              <p style="margin:0;font-size:16px;font-weight:700;color:#b45309;">Your 1.5 free Pod Points are ready — enough for any session.</p>
            </div>
            <p style="margin:0 0 32px;font-size:14px;color:#6b7280;line-height:1.7;">Open the FitnessPod app to browse available pods and book your first session today.</p>
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
