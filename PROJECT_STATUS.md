# FitnessPod — Project Status

Last updated: 2026-09-15

## Direction

FitnessPod is staying on **ClubSolution** (Globus Data) for bookings, payments, member accounts and door codes. This website is a marketing site: every Book button goes straight to the ClubSolution booking site. There is no booking page, payment or login on this website.

## Where it lives

- Staging: https://fitness-pods.vercel.app (deploys from `main`; Vercel root = `website/`)
- Real domain fitnesspod.im: not connected yet (still shows the client's old site)

## What the website has

- `index.html` — homepage: live pod status, pricing, how it works, FAQ, contact form (Web3Forms)
- `pods.html` — all 6 pods with equipment
- `privacy.html`, `terms.html`
- `api/availability.js` — server-side proxy to the ClubSolution bookings report; returns pod + hour only, no personal data
- Retired code lives in `archive/` and is not deployed

## Done

- [x] Book buttons go straight to ClubSolution (booking page retired; `/booking.html` redirects to ClubSolution)
- [x] Booking, door-code, membership and cancellation wording matches the client's ClubSolution process
- [x] Old admin and booking pages, unused email endpoint and dev files removed from the live site
- [x] Contact form only sends after validation passes
- [x] Playwright tests for homepage, pods page, legal pages, retired pages and availability API (desktop + mobile)

## To do before go-live

- [ ] Client checks the new FAQ wording (door codes, cancellations, no membership fee)
- [ ] Client confirms solo training is allowed (their current site says at least 2 people should be present)
- [ ] Full security review (rate limiting on `/api/availability`, security headers, dependencies)
- [ ] Swap the temporary Web3Forms key for the owner's key (enquiries@fitnesspod.im)
- [ ] Connect fitnesspod.im (needs DNS access from the owner)
- [ ] UptimeRobot monitoring
- [ ] Test on a real iPhone and Android phone
- [ ] Client review, approval and handover document
