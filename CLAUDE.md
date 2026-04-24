FitnessPod IOM — Full Project Brief
What We're Building
A complete digital package for FitnessPod Isle of Man (fitnesspod.im). Replacing their existing ClubSolution booking system with a modern, mobile-first solution. The package includes a website, mobile app, admin dashboard and shared design system.
Folder Structure
fitnesspod/

CLAUDE.md
app/ → mobile app (the main product)
website/ → public facing website
admin/ → owner dashboard
shared/ → colours, fonts, components used by both

Design System (shared across everything)

Bold and energetic aesthetic
Dark theme (#0d1b2a background)
Primary accent: Red (#CC1F2D)
Secondary accent: Navy Blue (#1B3A6B)
White text throughout
Fonts: Bebas Neue (headings) + Barlow (body)
Mobile first throughout
Reference: fitnesspod-demo.html (already built as demo)

Brand Colours (from official logo)

Red: #CC1F2D
Navy: #t
Background: #0d1b2a
Tagline: "YOUR PERSONAL GYM 24/7"

1. WEBSITE
The public facing site. Simpler than the app but same look and feel.
Pages

Home — hero, live pod availability, pricing, CTA to book
How It Works — two pathways explained (website booking vs app)
Pods — all 6 pods with images, descriptions and equipment
Pricing — pay as you go rates and credit bundles
PT Marketplace — list of available personal trainers
FAQ — common questions in accordion style
Contact — basic contact form

Features

Book a session via the booking grid
View credit bundle options
View available PTs
Mobile responsive
Free session CTA driving app downloads

Website Goal
Gets people in the door. Drives them to download the app. Less features than the app — app is always the better experience.
2. BOOKING SYSTEM
The booking grid shows all 6 pods as columns and 24 hours as rows. Each pod has a staggered start time offset:

GymPod 1 — starts on the hour (6:00, 7:00, 8:00 etc)
GymPod 2 — starts at :15 past (6:15, 7:15, 8:15 etc)
GymPod 3 — starts at :30 past (6:30, 7:30, 8:30 etc)
GymPod 4 — starts at :45 past (6:45, 7:45, 8:45 etc)
HIITPod — starts on the hour same as GymPod 1
PowerPod — starts at :30 past same as GymPod 3

Each session is 1 hour long. Pods run 24 hours a day. Grid defaults to today on page load. Day selector shows next 7 days as buttons (Mon 16th, Tue 17th etc).
3. PRICING & REVENUE MODEL
Pay As You Go

Daytime sessions (before 4:30pm): £6.50/hr per pod
Evening sessions (after 4:30pm): £10/hr per pod
Prices are per pod not per person (up to 3 users)

Credit Bundles
Credits replace memberships. Customers buy credits upfront and spend them on sessions.

1 credit = £6.50 (daytime session)
Evening sessions cost 1.5 credits
Credits expire after 3 months
Maximum 7 days advance booking for all customers regardless of credits

Bundle options:

10 credits — £65
20 credits — £120 (4 credits free)
30 credits — £175 (5 credits free)

Gift Cards

Customers buy gift cards with a £ value
Recipient redeems gift card for credits
Pure upfront revenue for the owner

Specialist Pod Pricing

Standard pods — £6.50 daytime / £10 evening
Specialist pods (HIITPod, PowerPod) — slight premium TBC with owner

4. APP
The main product. More powerful than the website in every way.
Core Features

Pod selection across all 6 pods with live availability
Full booking grid same as website
Payment integration (PayPal or SumUp — NOT Stripe)
Instant door access code delivery via SMS and email
Saved payment details — one tap checkout
Credit bundle purchasing and management
Credits balance visible on dashboard
Gift card purchasing and redemption
Push notifications for offers and filling dead time slots
Post session review prompts
PT booking
7 day advance booking limit enforced

Free Session Incentive

Download app → create account → get 1 free session
Drives app downloads and builds customer database

PT Marketplace

Trainers list themselves in the app
Customers browse and book direct
Trainers pay a monthly listing fee (separate revenue stream)

App Goal
Keeps customers coming back. Everything in one place. Faster, more powerful and more valuable than the website.
5. ADMIN DASHBOARD
For the business owner only. Private login.
Core Features

View all bookings in real time
See which pods are booked and when
Revenue overview — daily, weekly, monthly
Customer list and history
Credits sold and redeemed tracking
Gift card sales tracking
Push notification sender — blast deals to app users
Manage PT listings

Upsell Feature (Premium)

Expense tracking — owner logs outgoings
Profit and loss overview
Charged as an extra monthly fee on top of base package

6. PAYMENT PROCESSOR

DO NOT use Stripe (owner is IOM based, no UK entity)
Use PayPal or SumUp — integrate via their API
Owner sets up their own business account
We connect via API key they provide

7. BUSINESS CONTEXT

First client: FitnessPod IOM
Goal: Replace clunky system, reduce friction, grow their revenue
Bigger goal: Help them open a second location on the island
Long term: Roll this out as a SaaS to other IOM businesses
Monthly fee charged to client: £100-£150/month base
Expense tracking dashboard: additional monthly upsell


