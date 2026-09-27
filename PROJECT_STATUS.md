# FitnessPod — Project Status

Last updated: 2026-09-27

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
- [x] Booking, door-code, membership and cancellation wording matches the client's ClubSolution process (confirmed by Kyle 2026-09-27; door codes are sent by text message)
- [x] Solo training confirmed as allowed — most customers train alone
- [x] Old admin and booking pages, unused email endpoint and dev files removed from the live site
- [x] Contact form only sends after validation passes
- [x] Playwright tests for homepage, pods page, legal pages, retired pages, availability API and security headers (desktop + mobile)
- [x] Security review (2026-09-27): rate limit + date window + short cache on `/api/availability`, security headers (CSP etc.) on every page, no inline scripts, unused Supabase package removed, 0 npm vulnerabilities

## To do before go-live

- [ ] Decide what to do with the old Supabase project and the old `fitness-pods-app` Vercel deployment (both still live; the old `bookings` and `slot_locks` tables can be read by anyone). Back up, then pause or delete.
- [ ] Swap the temporary Web3Forms key for the owner's key (enquiries@fitnesspod.im)
- [ ] Connect fitnesspod.im (Kyle has DNS access at 20i). This is go-live, so do it after client approval. Do not touch the Microsoft 365 email records.
- [ ] UptimeRobot monitoring
- [ ] Test on a real iPhone and Android phone
- [ ] Client review, approval and handover document
