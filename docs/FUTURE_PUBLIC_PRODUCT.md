# Future public product — GuestFlow

The internal version of this app is **High Functioning Guest Portal** — optimized for the High Functioning Podcast workflow first. The shared codebase is still called **GuestFlow**. This document captures the public-SaaS shape we will eventually offer, so we keep today's code flexible enough for that future without building any of it yet.

Nothing in this document is on the active roadmap. Do not build accounts, billing, or integrations from this doc.

## Why split internal vs public

- Internal v1 ships fast because it doesn't have to be a product. It only has to be useful for one show.
- Validating internally lets us cut features that look great in a screenshot but don't survive a real Tuesday morning.
- Once internal v1 has been used for ~10 real guests across the High Functioning lifecycle, we know which parts of the workflow actually deserve a paid SaaS shell.

## Free tier (eventual)

- One show
- Up to 5–10 guests
- Basic guest portal (current internal feature set, minus branding controls)
- Basic templates
- Generic `guestflow.app/g/<slug>` portal URLs
- Local-first mode still works (no signup required)
- JSON / CSV export

## Pro tier (eventual)

- Unlimited guests
- Branded portals (custom show wordmark, accent color, footer text)
- Custom guest links (`/g/<your-show>/<guest-slug>`)
- Passcode / private portals (link-with-password)
- Multiple shows on one account
- Custom SOP sections per show
- Transcript review with line-level cut requests
- Hosted share kit pages with engagement tracking
- Team access (future) — invite a producer / editor / VA with scoped permissions

## Not for now

These are explicitly *not* on the roadmap until validated:

- Stripe / Lemon Squeezy billing
- Google / Apple login
- Team accounts and granular permissions
- Email automation (Resend / Postmark)
- Instagram / LinkedIn API integrations
- Real file upload (S3 / Supabase storage)
- Backend services beyond the smallest thing needed for hosted portal URLs
- Full transcript-comment system
- Calendly / scheduling-platform integrations

## Architecture flexibility we want to preserve

So the public product is buildable later without rewrites:

- `Guest` shape can extend cleanly — add fields without breaking existing localStorage records (already true; `normalizeGuest` handles missing fields).
- Storage layer is a single seam (`src/lib/storage.ts`) so swapping localStorage for a remote backend is a contained change.
- Share link encoding (`src/lib/portalShare.ts`) is a pure function — easy to replace with a DB-resolved fetch later.
- All branding strings live in `Sidebar`, `WelcomePage`, `PublicGuestPortal`, and `ShowDefaults`. To re-brand for public GuestFlow we touch ~5 files.
- No tight coupling between business logic (`guestLogic.ts`, `nextActions.ts`, `readiness.ts`) and UI components — those files stay regardless of frontend changes.

## Validation gate before building public

Build public GuestFlow only after at least one of:

1. Internal use has surfaced 5+ feature requests that genuinely require multi-show or branding controls.
2. A second podcast producer has asked, unprompted, to use it for their show.
3. We have 10 paid pre-orders / waitlist signups at the eventual public price.

Until then this is a tool for one show.
