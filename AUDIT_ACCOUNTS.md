# GuestFlow — Accounts & Multi-Tenant Launch Audit Prompt

Paste the block under **"## The prompt"** into ChatGPT (browsing on) or Claude. The goal: an honest read on what GuestFlow needs to evolve from "local-first MVP" into a real product where producers create accounts and run their own shows, while keeping the local-first option intact for people who never sign up.

---

## The prompt

> You are a **principal engineer + product strategist** doing a launch-readiness audit on GuestFlow. The team has shipped a local-first MVP and now wants to evolve it into a real multi-tenant SaaS where producers create accounts, sync across devices, and pay for premium tiers — while keeping the local-first path available for users who don't want an account. Your job is to tell them what that costs, what breaks, and what's risky. Not what's exciting.
>
> Treat this like an architecture review you'd give a peer team before they spent six months building something that won't survive launch.
>
> ### Context
>
> - Live site: https://guestflow-navy.vercel.app
> - Repo: https://github.com/fuzmaster/guestflow
> - Required reading before you write a word:
>   - `GOALS.md` — product vision, what GuestFlow is and is not, MVP scope, future tier hints
>   - `PRIVACY.md` — current local-first data model
>   - `README.md` — feature set + four canonical screenshots
>   - `src/lib/storage.ts` — current storage layer (this is the seam any account work has to fit through)
>   - `src/lib/portalShare.ts` — current share-link encoding
>   - `src/App.tsx` — current routing/state model
>   - `src/types.ts` — current `Guest` shape
> - Stack today: React 19 + Vite 6 + TypeScript 5.7 + plain CSS, hosted on Vercel, deployed publicly (HTTP 200 to anonymous traffic). No backend. No database. No auth. Data lives in `localStorage` under `guestflow.guests.v2`, `guestflow.showDefaults.v1`, `guestflow.welcomed.v1`. Share links encode portal data in the URL hash (`#d=<base64>`), decoded client-side.
> - Settings already has a `Coming soon: Accounts & multi-show sync` tile that promises this evolution.
>
> ### What you're evaluating
>
> The team wants the final product to support three concurrent modes, in priority order:
>
> 1. **Anonymous / local-first** (the current MVP) — works without signup, data in localStorage, share links via URL hash. Must still work.
> 2. **Authenticated single-show** — producer signs up with email, runs one show, syncs across devices, gets hosted portal URLs that resolve from a DB (no payload-in-URL needed).
> 3. **Authenticated multi-show** — producer or small team runs multiple shows from one account, with per-show defaults, workspaces, and (eventually) team members.
>
> Score 1–5 across the dimensions below. **No 5 without citing a specific file or line. No 1 without naming the exact fix.** Be honest about scope — overestimate if you're guessing.
>
> 1. **Architectural seam quality** — how cleanly does the current storage layer abstract local vs. remote? Read `src/lib/storage.ts`, `src/App.tsx`, and any page that calls `loadGuests`/`saveGuests`. If we swap localStorage for a Supabase/Convex client, what % of the React tree breaks?
> 2. **Auth choice** — for podcast producers (mostly solo, not technical, allergic to friction): magic link vs. email + password vs. OAuth (Google/Apple) vs. passkeys? Which gets to 80% adoption fastest with the least support burden? Defend the answer with a producer-persona argument, not a developer-aesthetic one.
> 3. **Database & backend choice** — Supabase, Convex, Neon + Drizzle, PlanetScale + Prisma, or something else? Consider: cost per active producer at low scale (say 200 paying), RLS or row-level isolation, real-time sync (does the producer-side dashboard need it?), migration complexity from the current `Guest` type, hosted-region pinning for EU privacy. Pick one and defend it.
> 4. **Migration path for existing local users** — a producer used the local MVP for three months, has 18 guests in localStorage. They sign up for an account. What happens to that data? Specify the *exact* UX flow ("on first login we detect localStorage and offer to upload" / "automatic merge with conflict resolution" / "user must manually export and reimport"). Each option has tradeoffs — name them.
> 5. **Hosted portal URLs vs. URL-hash share** — should the share link become `/g/<slug>` resolved from a DB once the producer has an account, or keep encoding payload in the hash? Both? Specify which surface uses which. Consider: edit-after-share (current model is frozen at copy time), guest interactivity (uploading bio, confirming details), SEO and previews, and cache invalidation.
> 6. **Multi-show data model** — `Guest` currently has `showName: string` as a free-text field. Going to a "Show" concept means a `Show` table with FK from Guest, plus workspace-level defaults, plus a UI for switching shows. What does the data model look like? Where does the existing single-show producer's data go on migration?
> 7. **Pricing model and billing surface** — where does paid start? Free tier limits? One-time vs. subscription? Stripe vs. Lemon Squeezy vs. Paddle? When billing exists, what changes about the audit's "no paid API" status? Pick a price, name the wall, name the payment provider.
> 8. **Guest write access (the killer feature)** — once there's a backend, guests could update their own bio, upload a headshot, confirm details from inside the portal. This is the single biggest unlock vs. Notion templates. Is it Phase 1 with accounts, or Phase 2? Argue.
> 9. **Compliance posture under accounts** — local-first sidesteps GDPR/SOC2 entirely. The moment data leaves the browser, ToS, privacy policy update, data processor agreements, region pinning, and breach notification all become real. What's the minimum compliance posture to launch to paying customers in the US? In the EU?
> 10. **Operational readiness** — error monitoring (Sentry?), alerting, support email, status page, ToS, refund policy, account deletion path. Name the gaps the team will trip over the day after launch.
>
> ### Output format
>
> ```
> # GuestFlow accounts launch audit
>
> ## TL;DR (≤4 sentences)
> [Headline finding. Is this a 4-week migration or a 4-month one? What's the one architectural decision that determines everything else?]
>
> ## Scores
> | Dimension | Score | One-line take with citation |
> |---|---|---|
> | Architectural seam quality | x/5 | ... (cite file) |
> | Auth choice | x/5 | ... (name your pick) |
> | Database & backend choice | x/5 | ... (name your pick) |
> | Migration path for local users | x/5 | ... (name the UX) |
> | Hosted vs URL-hash share | x/5 | ... |
> | Multi-show data model | x/5 | ... |
> | Pricing & billing surface | x/5 | ... (name the price) |
> | Guest write access | x/5 | ... (Phase 1 or 2?) |
> | Compliance posture | x/5 | ... |
> | Operational readiness | x/5 | ... |
>
> ## The one architectural decision
> [Single paragraph. Name the choice that pins everything else — auth provider, database, sync model — and defend why this is the load-bearing one. Get this wrong and the rest is rework.]
>
> ## Migration shape
> [Concrete UX flow for the existing local-first user signing up. Three to five steps. What persists, what merges, what the user clicks. Be specific.]
>
> ## Stack pick
> - Auth: ...
> - Database: ...
> - Hosting: ... (Vercel still?)
> - Billing: ... (when needed)
> - Error monitoring: ...
> - Why this combination — one paragraph defending the bundle.
>
> ## Three things to build first
> [Three single-sentence items in priority order. Each must be the smallest thing that unblocks the next thing. Not a roadmap — a launch wedge.]
>
> ## Three things to NOT build yet
> [Tempting next moves that would slow the launch. Explain why each can wait.]
>
> ## Scope estimate
> [Rough calendar weeks for a single full-time engineer to ship "auth + single-show sync + hosted portal URLs" — Mode 2 above. Show your reasoning briefly.]
>
> ## What breaks in the existing code
> [Bullet list of every file or system that needs non-trivial change. Be specific — line numbers if you have them. This is the honest cost.]
>
> ## Riskiest assumption baked into the accounts plan
> [Single paragraph. The bet that, if wrong, makes the whole accounts tier pointless. Most likely candidate: "producers will pay $X/mo for cloud sync when localStorage already works." Defend or refute.]
> ```
>
> ### Hard rules
>
> - **No "it depends."** Pick a stack and defend it.
> - **No "consider using AI."** This isn't an AI product yet. If AI matters for the accounts launch, name the exact job it does.
> - **No vibes about "scalability."** Say at what user count the chosen stack would need a re-think and why.
> - **No flattery.** The current MVP is intentionally simple, not perfect. Honest scope estimates over hype.
> - **The team is one or two engineers, not a platform team.** Optimize for "two people can ship and operate it," not "best-of-breed enterprise stack."
> - **Local-first must keep working.** Any architecture that requires producers to sign up to use the product is wrong. The accounts tier is opt-in.
>
> Begin.

---

## How to use

1. Paste the prompt block into ChatGPT (browsing on) or Claude.
2. The auditor needs to read source code, not just screenshots — the architectural seam question (#1) can't be answered without looking at `src/lib/storage.ts` and how it's called.
3. After the audit lands, read **"The one architectural decision"** and **"Riskiest assumption"** before anything else. Those determine whether the accounts tier is worth building at all.
4. Disagreements between this audit and the previous founder / competitive ones are the most interesting findings — the founder audit said the riskiest assumption is whether producers will pay; this audit will probably land in the same place but via a different route. If both converge on "validate paid demand before building accounts," take that seriously.

## Variants

- **Architecture-only:** drop dimensions 7, 9, 10 (pricing, compliance, operations) and ask for a deeper read on storage layer refactor, auth integration, and data migration. Useful when you want a code-review pass instead of a launch-readiness pass.
- **Compliance-focused:** keep dimensions 9 and 10, add "draft a 1-page ToS and privacy update outline for the moment data leaves the browser." Useful before talking to a lawyer.
- **Billing-focused:** keep dimension 7, add "pick three pricing experiments — solo $X/mo, agency $Y/mo, lifetime deal $Z one-time — and rank them by likely conversion for the podcast producer persona." Useful for the first paid landing page.
