# FitnessPod — Project Status & Task Tracker

Last updated: 2026-05-06

---

## Blocked — waiting on external dependencies

These cannot be started until the owner provides the following:

- [ ] **Secure360Pay API key** — needed to process real payments
- [ ] **Electric door system API key** — needed to send real door codes to customers
- [ ] **Domain DNS access** — needed to point fitnesspod.im to Vercel

---

## What's built (completed)

### Website
- [x] `index.html` — homepage (hero, pod availability strip, how it works, pricing, FAQ, contact, footer)
- [x] `pods.html` — all 6 pods with equipment lists and photos
- [x] `gift.html` — Pod Points purchase page (UI only, no payment wired)
- [x] `reveal.html` — animated gift reveal
- [x] `booking.html` — full booking flow with real Supabase slot locking and race condition handling
- [x] `admin.html` — admin dashboard UI (built but connected to mock data, not live Supabase)
- [x] `privacy.html` — privacy policy
- [x] `terms.html` — terms and conditions

### App (React/Vite PWA)
- [x] Splash, Welcome, Login, Signup screens
- [x] Home dashboard (UI, demo data)
- [x] Pods browser (UI, demo data)
- [x] Book screen — 3-step flow (UI, demo data, no real Supabase)
- [x] BookConfirm screen (UI, hardcoded)
- [x] Sessions screen (UI, hardcoded data)
- [x] Profile screen (partially connected — reads pod_points from Supabase)
- [x] Shop screen — Pod Points bundles (UI only, no payment)
- [x] Supabase auth — signup, login, logout, session persistence
- [x] AuthContext — user + profile state management

---

## To do — in priority order

### 1. Database — verify and complete Supabase schema
*Everything else depends on this being correct and complete.*

- [x] Confirm `profiles` table exists with correct columns
- [x] Add `approved` (boolean, default false) column to profiles
- [x] Add `banned` (boolean, default false) column to profiles
- [x] Confirm `bookings` table exists with correct columns
- [x] Confirm `slot_locks` table exists with correct columns
- [x] Confirm `admins` table exists
- [x] Create `pod_points_transactions` table (track purchases and spending)
- [x] Create `gift_cards` table
- [x] Verify/create `try_lock_slot` RPC function
- [x] Verify/create `confirm_booking` RPC function
- [x] Enable Row Level Security on every table
- [x] Write and apply RLS policies (users see only their own data)
- [x] Soft delete — confirm bookings use `deleted_at` not hard delete
- [x] Set up automatic daily backups in Supabase — Supabase Pro active on FitnessPod IOM org

### 2. Connect admin dashboard to real Supabase
*Owners need to see real data before launch.*

- [x] Replace placeholder Supabase URL in admin.html with real credentials
- [x] Replace mock customer list with live query from profiles
- [x] Replace mock bookings with live query from bookings table
- [x] Replace mock pod status with live query
- [x] Replace mock revenue stats with real calculated totals (overview stats: bookings today, pods occupied, total customers)
- [x] Replace mock door codes with real codes from bookings

### 3. Owner approval + banning flow
*Owner has confirmed they want this. Build end-to-end.*

- [x] Signup sets `approved: false` on new profile (website + app)
- [x] AuthContext blocks unapproved users from reaching booking flow
- [x] Show clear "Your account is pending approval" screen to unapproved users
- [x] Admin dashboard: Approve / Ban button per user in customer list
- [x] Banning immediately revokes access (approved=false blocks booking flow)
- [x] Set up Resend — email owner instantly when someone signs up
- [x] Resend — email customer when their account is approved
- [x] Resend — welcome email on signup (confirm free session)

### 4. Connect app to real Supabase
*Replace all demo/random data with live data.*

- [x] Book.jsx — fetch real slot availability from `bookings` + `slot_locks`
- [x] Book.jsx — call `try_lock_slot` RPC on slot tap (10-min hold)
- [x] Book.jsx — show 10-minute countdown timer while slot is locked
- [x] Book.jsx — release lock if user navigates away without paying
- [x] Sessions.jsx — pull real upcoming + past bookings for logged-in user
- [x] Home.jsx — pull real pod availability (live orbs)
- [x] Home.jsx — pull real upcoming session for "next session" card
- [x] Home.jsx — pull real session count and Pod Points balance

### 5. Email system — Resend
*Build all transactional emails. Independent of payment/door API keys.*

- [x] Set up Resend account and get API key
- [ ] Booking confirmation email — pod, date, time, door code (random for now)
- [x] Account approval email — "You're approved, you can now book"
- [x] New signup notification to owner — name, email, phone
- [x] Welcome email on signup — free session reminder
- [ ] Test all emails in sandbox before going live
- [ ] Swap FROM address to hello@fitnesspod.im once DNS is verified in Resend
- [ ] Add real owner email to app/api/send-email.js (currently placeholder)

### 6. Payment flow — Secure360Pay (structure ready, key placeholder)
*Build the full integration. API key drops in when received.*

- [ ] Update CLAUDE.md global standards — add Secure360Pay as approved processor for IOM clients
- [ ] Build Secure360Pay payment initiation (website booking.html)
- [ ] Build Secure360Pay payment initiation (app Book.jsx)
- [ ] Build payment success handler — triggers confirm_booking + door code email
- [ ] Build payment failure handler — releases slot lock, shows error
- [ ] Build Secure360Pay webhook endpoint (Supabase Edge Function or Railway)
- [ ] Build Pod Points purchase via Secure360Pay (app Shop.jsx)
- [ ] Build Pod Points purchase via Secure360Pay (website gift.html)
- [ ] Sandbox/test mode working end-to-end before live key used

### 7. Door code delivery
*Random code generated now. Real API key swapped in later.*

- [x] Generate random 6-digit code on booking confirmation (Pod Points path)
- [x] Store door code against booking record in Supabase
- [ ] Email door code to customer via Resend on booking confirmation
- [ ] SMS door code to customer (confirm SMS provider — Twilio or similar)
- [ ] Admin dashboard shows door code per booking
- [ ] When door API key arrives: swap random generator for real API call

### 8. Pod Points — full end-to-end flow
- [ ] Book with Pod Points — option to pay with points instead of cash (website)
- [x] Book with Pod Points — option to pay with points instead of cash (app)
- [x] Deduct points from balance on booking confirmation
- [ ] Add points to balance on Pod Points purchase (needs Secure360Pay)
- [x] Transaction log per user (what points were added/spent and when)
- [x] Profile screen — show transaction history
- [x] Handle evening session correctly (1.5 points, not 1)

### 9. Security hardening
*CLAUDE.md non-negotiables — must be done before go-live.*

- [ ] Rate limit auth endpoints (signup, login) — prevent brute force
- [ ] Rate limit booking endpoint — prevent slot farming
- [ ] Full RLS audit — run SQL check, confirm users cannot read other users' data
- [x] Input validation audit — every form field sanitised before hitting database
- [x] Confirm no raw error messages shown to users anywhere
- [x] Confirm no API keys or secrets hardcoded in frontend code
- [x] Confirm all console.log statements removed from production code
- [ ] Security review of `try_lock_slot` and `confirm_booking` RPCs

### 10. Playwright tests
*Required by CLAUDE.md after every feature. None exist yet.*

- [ ] Test: signup flow (happy path + unhappy path)
- [ ] Test: login flow
- [ ] Test: account pending approval screen
- [ ] Test: slot selection and locking (10-min countdown)
- [ ] Test: payment flow (sandbox mode)
- [ ] Test: booking confirmation + door code email
- [ ] Test: Pod Points purchase
- [ ] Test: Pod Points spend at booking
- [ ] Test: admin approval flow
- [ ] Test: admin ban flow
- [ ] Test: mobile viewport for all flows

### 11. UptimeRobot monitoring
- [ ] Set up UptimeRobot account
- [ ] Monitor website (fitnesspod.im)
- [ ] Monitor app
- [ ] Alert goes to owner email on downtime

### 12. Before going live checklist (CLAUDE.md)
- [ ] All Playwright tests passing
- [ ] Full self review completed
- [ ] Payment flow tested in sandbox mode
- [ ] Booking flow tested with real scenarios
- [ ] Race condition tested and confirmed working
- [ ] Privacy policy and terms in place ✓
- [ ] All environment variables set correctly on Vercel
- [ ] Database backed up and backup restore tested
- [ ] UptimeRobot set up
- [ ] Tested on iPhone and Android
- [ ] Tested on desktop and mobile browsers
- [ ] Code pushed to GitHub
- [ ] Client has reviewed and approved
- [ ] Client trained on admin dashboard
- [ ] Client handover document completed

---

## Notes

- Payment processor: **Secure360Pay** (not PayPal — owner's preference for IOM)
- Door system: unknown provider — waiting on API key from owner
- SMS provider: TBD — need to confirm with owner (Twilio recommended)
- Resend API key: needs to be obtained and added to Vercel env vars
- The website booking.html already has correct slot locking logic — the payment step needs to sit in between the lock and the confirm_booking call
