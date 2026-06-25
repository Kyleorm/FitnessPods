# Archived: Old Custom Booking System (Supabase)

**Date archived:** 2026-06-25

## What this folder is
This is the **saved, original version of the booking page** from when FitnessPod
was going to run its **own custom booking system**. It is kept here on purpose as
a backup. **Do not delete it.**

The FitnessPod owner has said they *might* switch back to this custom system later,
so the full working version is preserved so we can bring it back if needed.

## The file
- `booking-supabase-version.html` — the complete original booking page.

### What this old version did (all fully built and working)
- Customer login / signup / password reset (Supabase authentication)
- Live availability pulled from a Supabase database
- Slot locking: held a slot for 10 minutes so two people couldn't book the same one
  (`try_lock_slot`)
- Booking confirmation written to the database (`confirm_booking`)
- Automatic 6-digit door-code generation
- A 4-step flow: Choose Time → Account → Payment → Confirmation
- Account approval / banned states

## Why it was taken off the live website
The client decided **not** to go ahead with the custom system. Instead they are
keeping their existing booking platform, **ClubSolution** (run by a company called
**Globus Data**). The live `website/booking.html` was therefore stripped down to
just the **timetable grid design** (kept) so it can show availability from the
ClubSolution API and then send customers to ClubSolution to actually book and pay.

See `website/finishing project/claude-code-context-prompt.txt` for the full
explanation of the ClubSolution direction.

## How to bring the old system back (if the client switches)
1. Copy `booking-supabase-version.html` back over `website/booking.html`.
2. Make sure the Supabase project still exists (the database tables and the
   `try_lock_slot` / `confirm_booking` functions live in Supabase, not in this file).
3. Re-test login, slot locking, and payment before going live.

## IMPORTANT — the backend lives in Supabase, not here
This HTML file is only the **front end**. The database tables and the booking logic
(`try_lock_slot`, `confirm_booking`, user accounts) are stored in the **Supabase
project**. As long as that Supabase project is **not deleted**, the full system can
be restored. If the Supabase project is ever removed, this file alone is not enough
to rebuild the backend.
