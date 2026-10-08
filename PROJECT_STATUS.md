# FitnessPod — Project Status

Last updated: 2026-10-08

## Direction

FitnessPod is staying on **ClubSolution** (Globus Data) for bookings, payments, member accounts and door codes. This website is a marketing site: every Book button goes straight to the ClubSolution booking site. There is no booking page, payment or login on this website.

## Where it lives

- Staging: https://fitness-pods.vercel.app (deploys from `main`; Vercel root = `website/`)
- Real domain fitnesspod.im: not connected yet (still shows the client's old site)

## What the website has

- `index.html` — homepage: live pod status, pricing, how it works, FAQ, contact form (Web3Forms)
- `pods.html` — all 6 pods with equipment
- `privacy.html`, `terms.html`
- `manuals/` — the safety sheet (rules + equipment weight limits) and equipment manuals, copied from the old site
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
- [x] Site icon for Google results, browser tabs and iPhone home screen ("FP" in the logo's navy and red), plus sitemap, robots.txt, real-address tags, site name and WhatsApp/Facebook link previews (2026-10-08)
- [x] Old fitnesspod.im page addresses (`how-it-works.php`, `frequently-asked-questions.php`, `contact-us.php`, `take-a-tour.php`, `blog/`) and old safety/manual PDF links move to the new site, so Google results and bookmarks don't break (2026-10-08)

## To do before go-live

- [ ] Ask the client: the old site linked the safety instructions, weight limits and equipment manuals from each pod. The new Pods page doesn't. Add links to `manuals/` on the Pods page?
- [ ] Real test message through the contact form, checked in enquiries@fitnesspod.im
- [ ] Decide what to do with the old Supabase project and the old `fitness-pods-app` Vercel deployment (both still live; the old `bookings` and `slot_locks` tables can be read by anyone). Back up, then pause or delete.
- [x] Contact form uses the owner's Web3Forms key (account: enquiries@fitnesspod.im, 2026-09-28)
- [x] Both domains added in Vercel (2026-10-08). Main address is `www.fitnesspod.im`; `fitnesspod.im` redirects to it. Checked: Vercel serves the new site for both.
- [ ] Chris changes the DNS at 20i: add Vercel's records, and delete the old A (185.151.30.182) and AAAA (2a07:7800::182) records on both `fitnesspod.im` and `www`. Do not touch the Microsoft 365 email records (MX, autodiscover, TXT/SPF).
- [ ] After go-live: add fitnesspod.im to Google Search Console and submit `sitemap.xml`, so Google picks up the new icon and pages sooner
- [ ] UptimeRobot monitoring
- [x] Tested on real phones (2026-10-08)
- [x] Client approved the site
- [ ] Handover document
