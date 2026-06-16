# GuestFlow — Claude Design Prompt (Next Pass)

Copy/paste this into Claude to drive the next design + build pass on GuestFlow.

---

## Context

GuestFlow is a local-first producer dashboard and guest portal for podcasters, creator collabs, and interview shows. The product positioning is **"Send one link. Stop chasing guests."**

The full product vision lives in [`GOALS.md`](./GOALS.md). Read it before making any decisions — especially the **MVP principles**, **What GuestFlow is / is not**, and **Design direction** sections. Do not drift toward a generic CRM. Do not add backend, auth, file uploads, email integrations, or automatic sending. Local-first only.

The current MVP scaffold lives at `fuzmaster/guestflow` and is already deployed on Vercel. Stack: React + TypeScript + Vite + plain CSS + localStorage. Page roster: Today, Pipeline, Guest Detail, Guest Portal, Missing Assets, Launch/Share, Templates, Settings.

## The job

Make GuestFlow feel **real enough to send to a podcast producer today** — specifically, raise the guest portal from "scaffold" to "wow" and make the producer dashboard genuinely useful every morning.

## Design direction (non-negotiable)

- Dark theme. Background `#080b12` with the existing radial gradient. Accent `#72f2c7` (mint). Use sparingly.
- Typography: Inter for UI, JetBrains Mono only for the footer attribution.
- Feel: clean, calm, modern, trustworthy, producer-focused. Polished beyond a spreadsheet, simpler than a CRM. Avoid generic todo-app energy.
- No emojis in the UI unless they appear in user-entered content. No icon libraries — keep it CSS + inline SVG.
- Respect the existing component vocabulary in `src/styles.css` (`.guest-card`, `.portal-hero`, `.pill`, etc.) and extend rather than replace.

## What to ship in this pass

Build these seven things in order. Each is small. Do not skip ahead.

### 1. Copyable guest portal link

On the Guest Detail page and at the top of the Guest Portal editor, add a **"Copy guest portal link"** button. It should copy `https://guestflow.app/g/<slug>` (mock URL — the link doesn't have to work). Use the existing `slug.ts` helper. On copy, show a brief inline "Copied" confirmation that fades, no toast library.

### 2. Guest readiness score

A 0–100 score per guest, derived from the existing data:

- Recording date set
- Location/remote link set
- Bio present
- Headshot present
- Social handles present (any)
- Release form marked received
- Launch date set
- Episode link present
- Clips present (any)
- Share checklist complete

Each filled item adds equal weight. Show the score as a small ring or bar on the guest card (Pipeline), on Guest Detail (large), and at the top of the guest portal (subtle, framed as "You're 80% ready for your interview"). Color: red < 50, amber 50–84, mint ≥ 85.

### 3. "Next Action Queue" page

A new top-level page (replaces or augments Today). For every guest needing attention, show one row with:

- Guest name + show
- Reason they're in the queue (overdue follow-up, missing assets, records in 3 days, launches tomorrow, hasn't shared)
- Recommended template (link to copy that template, prefilled with guest name)
- Primary action button (open guest, open portal, mark contacted)

Sort by urgency. The producer should be able to work this queue top-to-bottom in 5 minutes.

### 4. Show-level defaults (Settings)

Add a "Show defaults" section to Settings with: host name, show name, default location, default parking notes, default prep notes, default release form link, default YouTube/Spotify/Apple URLs. New guests inherit these. Existing guests do not change. Persist to localStorage alongside `guests`.

### 5. Polished guest portal layout

Restructure `GuestPortalPage.tsx` (the preview) into five clear sections, each visually distinct:

1. **Before the Interview** — date, time, location/link, parking, arrival instructions, host name
2. **What We Need From You** — bio, headshot, social handles, release form (each with a visible "missing" or "received" state)
3. **Recording Day** — prep notes, talking points, what to expect, timing
4. **After We Launch** — episode link, platform links, launch date
5. **Clips & Captions** — clips with thumbnails (or empty state), suggested captions with copy buttons, Instagram collab status

Hero section at top with guest greeting, readiness score, and the show name. Make it feel like a guest could open it on their phone in bed the night before and feel calm.

### 6. Empty states + sample data

Every empty list/section needs a deliberate empty state with one sentence of guidance ("No clips yet — drop YouTube or social links here once they're cut"). When the user resets data, the mock guests should cover the full pipeline — at least one in each stage, one almost done, one missing nearly everything — so the workflow is visible immediately.

### 7. Public landing route

Add a `/welcome` route (or `?welcome=1` flag — whatever's simplest with the current setup) that renders a single-page marketing explainer:

- Hero: "Send one link. Stop chasing guests." + one-line subhead from GOALS.md
- Three-up: the problem (scattered tools), the fix (one portal link), the result (clean dashboard)
- Inline mock screenshot of the guest portal
- One CTA: "Open the dashboard" → goes to Today

Not a separate site. Same React app, same styles. Skippable.

## Constraints recap

- No backend, no auth, no API calls, no file uploads, no email/Instagram automation
- Everything still persists to localStorage
- No new heavy dependencies — no UI libraries, no CSS frameworks, no icon packs
- TypeScript strict mode must pass (`npm run build`)
- Mobile breakpoint at 980px continues to work

## Deliverable checklist

Before you say "done":

- [ ] `npm run build` exits 0
- [ ] All seven items above are working in the browser
- [ ] Guest portal screen passes the "would I send this to a real guest?" gut check
- [ ] Today / Next Action Queue passes the "would a producer open this every morning?" gut check
- [ ] README screenshot section updated with a fresh screenshot of the new guest portal
- [ ] Commit messages explain the *why*, not just the *what*

## What success looks like

A podcast producer opens the deployed site, clicks through Today → a guest → the portal preview, and says **"oh — I'd actually use this."** That's the bar.
