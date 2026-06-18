# GuestFlow / High Functioning — Brand Identity & Custom Graphics Pass

This is the third design pass on the project. The first one (`DESIGN_PROMPT.md`) shipped the feature shell. The second (`DESIGN_PROMPT_VISUAL.md`) gave the app the Run of Show aesthetic — mono micro-labels, sheet/cue numbering, waveform dividers, boarding-pass portal. That work succeeded. This pass takes the next step: **give the product a real visual identity instead of a really good-looking dark dashboard.**

Specifically: a bespoke logo system, a small but cohesive illustration library, a unified icon set, an optional texture layer, and a couple of signature graphic moments. All built in inline SVG. No external assets, no icon libraries, no heavy dependencies. Self-hosted fonts stay.

Read [`GOALS.md`](./GOALS.md), [`PRIVACY.md`](./PRIVACY.md), and the four canonical screenshots in [`docs/screenshots/`](./docs/screenshots/) before writing a single line of SVG. The existing design tokens (mint `#72f2c7`, amber `#ffc857`, dark `#080b12`, Inter Variable + JetBrains Mono) are non-negotiable inputs.

---

## What's wrong today

Be honest about the problem before drawing the fix:

1. **The wordmark does not exist.** Sidebar says "High Functioning" in plain Inter. Welcome strip says the same. There is no logo — just a 46px square with the letters "HF" on a mint-to-blue gradient that looks like every fintech app from 2021. The brand mark has to do real work.
2. **GuestFlow is an invisible parent.** The product is called High Functioning Guest Portal. GuestFlow is the underlying tech / future SaaS. Right now "Powered by GuestFlow" is a 9px line of mono text. There's no parent/child mark relationship.
3. **Illustrations are all dashed circles.** Every empty state in the app uses one of two SVG glyphs (a dashed circle, or a clock/check icon). The visual vocabulary is too small.
4. **No texture.** Every surface is a flat dark panel or a subtle radial gradient. The boarding-pass hero on the guest portal hints at production-document texture but doesn't deliver any.
5. **Header moments have nowhere to land the eye.** The welcome page has a big title and a waveform divider. The portal pass hero has a big ring. There is no signature graphic that says "this is GuestFlow" the same way a brand mark or a hero illustration would.
6. **The pipeline columns and section headers are visually identical.** Every kanban column is a dark rounded rectangle with the same border. Every portal section starts with the same eyebrow + h3. No glyphs, no patterning, nothing to anchor scan.

## Design direction

Preserve everything that works:

- The Run of Show production-document language (sheet numbers, cue numbers, mono micro-labels, waveform dividers)
- Inter Variable + JetBrains Mono — no new typefaces
- Dark background + mint accent + amber warning + red critical
- Local-first, no-backend, no-third-party-CDN principle (so all assets stay inline SVG in the React tree, no external fonts, no icon CDN)

Add a layer on top:

- **A logo system** — both an HF mark and a GuestFlow mark, with a defined relationship between them
- **A small bespoke illustration set** — line drawings in one consistent style, used for empty states and section markers
- **A unified icon library** — replace ad-hoc inline SVGs with a single coherent set, all at the same stroke weight, viewBox, and corner radius
- **One optional secondary accent** — a deep cool tone (purple, indigo, or deep teal) to break up the mint monotone. Used sparingly, only for stage / state distinction.
- **A subtle texture layer** — grain or contour-line patterns in hero areas only

## Specific deliverables

Do all of these. The success bar is at the bottom — measure your work against it.

### 1. High Functioning brand mark

Design a single SVG mark that:

- Reads as a real podcast brand identity, not generic dashboard chrome
- Works at **24px** (favicon / tiny), **46px** (sidebar brand button — current size), and **200px+** (welcome hero / share-kit hero) without re-drawing
- Uses only the existing palette — primary fill `#72f2c7`, on a `#080b12` ground, with optional `#06111f` foreground for negative space
- Has a concept rooted in the show name. "High Functioning" suggests calm under load, signal vs. noise, clarity. Some directions worth trying before committing:
  - **Audio-meter / mic level rooted** — a vertical bar cluster that reads as "signal" but resolves into letterforms
  - **HF monogram with intent** — a custom ligature where the H crossbar becomes the F crossbar, with a calm geometric rhythm
  - **Studio-on indicator** — a small "on air" or "recording" glyph paired with the wordmark
- Has an SVG version with a `currentColor`-respecting fill so it can render in both light and dark contexts in the future
- Saves to `src/components/brand/HighFunctioningMark.tsx` as a React component accepting `size` and `tone` props

Avoid: gradient meshes, drop shadows, embossed effects, anything 2010s-tech-bro. The mark should look like it came from a print run-of-show document, not a SaaS landing page.

### 2. GuestFlow parent mark

Design a separate SVG mark that:

- Reads as a sibling to the HF mark, not a twin
- Is **simpler** than the HF mark — it lives in "Powered by" contexts at 16–24px most of the time
- Has a concept rooted in the product job: one link between many guests and one show
  - **Flow line** — a single curve that connects three nodes
  - **Portal door** — a minimal threshold/arch glyph
  - **Concentric ring** — riffs on the readiness ring already in the product
- Uses mint accent with one secondary cool tone if introducing the secondary accent
- Saves to `src/components/brand/GuestFlowMark.tsx`

The two marks together should make sense in a single horizontal lockup: `[HF mark] High Functioning Guest Portal — Powered by [GuestFlow mark] GuestFlow`. That lockup is the test of whether the relationship reads.

### 3. Sidebar brand block rework

Replace the current 46px "HF" gradient square with the new HighFunctioningMark at 46px. Keep the brand button as a click target to the welcome screen. The wordmark below stays. Below the wordmark + meta line, add a tiny "Powered by [GuestFlow mark] GuestFlow" lockup that replaces the current "Powered by GuestFlow" mono line.

### 4. Favicon + theme-color refresh

Generate a 32×32 and 16×16 favicon from the HF mark, inline as SVG via `<link rel="icon" type="image/svg+xml" href="...">` in `index.html`. Keep `theme-color: #080b12`.

### 5. Welcome hero signature graphic

The current welcome page is `chip → big title → sub → CTA → waveform divider → three-up`. The hero is doing real work but it has no signature visual. Add one — **and only one** — large bespoke SVG that lives behind or beside the title. Options:

- A **scaled boarding-pass outline** with perforated edge, faintly drawn behind the title with very low opacity
- An **isobar / contour pattern** that suggests an audio waveform topology
- A **single-stroke line illustration** of a microphone arm + headphones drawn at 600px, positioned right-aligned

Pick one. Make it generous (400–800px wide). It must not compete with the title — opacity 0.08–0.18, no animation, no flourish. The point is *texture*, not *decoration*.

### 6. Bespoke illustration system (line-art empty states)

Replace all current empty states with a small library of inline SVG line drawings. All in **one** consistent style:

- Single-stroke (no fills), 1.5px stroke weight
- 80×80px viewBox normalized
- `currentColor` stroke so they tint via CSS
- Rounded line caps, rounded line joins
- A clear single subject per illustration

Build these specific illustrations as React components in `src/components/illustrations/`:

- `EmptyMic.tsx` — empty studio (mic on stand)
- `EmptyClips.tsx` — a film-strip line drawing for "no clips yet"
- `EmptyInbox.tsx` — a calm sunrise-over-desk for "nothing to do"
- `EmptyPipelineCol.tsx` — a tiny abstract empty-stage marker (current single dot is fine but should match the new style)
- `EmptyShareKit.tsx` — a line-drawn paper airplane for share kit when nothing is ready

Wire them into the existing `EmptyState` component as an optional `illustration` prop.

### 7. Unified icon set

Build 12 icons in a single style. Replace the current ad-hoc inline SVGs (the check icon, clock icon, dashed circle in `PortalPreview.tsx`) with consistent versions.

- 24×24 viewBox
- 1.75px stroke, `currentColor`
- Rounded caps/joins
- One file: `src/components/icons/Icon.tsx` exports a typed `Icon` component with a `name` prop: `check`, `clock`, `dashed-circle`, `calendar`, `pin`, `mic`, `headphones`, `transcript`, `link`, `share`, `copy`, `arrow-right`

Use them everywhere the current ad-hoc SVGs are used. Lock the visual vocabulary.

### 8. Section header glyph treatment (portal)

Each of the five guest portal sections (Before / What We Need / Recording Day / After We Launch / Clips & Captions) should get a tiny 20×20 glyph from the icon set sitting beside the eyebrow label. Not a full illustration — just an icon. This anchors the eye and gives each section a different first impression.

### 9. Optional secondary accent (decide and commit)

The current palette is mint + amber + danger. Decide whether to introduce one cool secondary accent. If yes:

- Pick **one** color: deep indigo (`#6ea8fe`), warm purple (`#a78bfa`), or deep teal (`#3ec5b6`)
- Add it as `--accent-2` in the CSS variables
- Use it ONLY for: launch-scheduled / live stage pills, the GuestFlow parent mark, and one secondary CTA style
- Do NOT use it for hover states, generic borders, or backgrounds

If no: document why in the commit message and stick with the current three-color system.

### 10. One texture moment

Add **one** texture treatment somewhere meaningful. Just one. Options:

- A faint SVG grain pattern (`<filter><feTurbulence/></filter>`) on the portal pass hero
- A perforated dashed edge on the share-kit standalone view, mimicking a ticket stub
- A contour-line pattern at 5% opacity behind the welcome strip

Pick one. Texture should be felt, not seen.

## Hard rules

- **All graphics ship as inline SVG components** under `src/components/brand/`, `src/components/illustrations/`, `src/components/icons/`. No PNG, no external CDN, no icon-library dependency, no `<img>` tag pointing anywhere off-origin.
- **No new fonts.** Inter Variable + JetBrains Mono only.
- **No animations** on logos, illustrations, or icons. The waveform on the welcome divider is the only animated graphic in the system. New graphics are static.
- **All SVGs use `currentColor`** for primary fills/strokes wherever possible, so CSS controls the actual color. The HF mark may break this rule for its accent color.
- **Build clean.** `npm run build` exits 0. No new dependencies added.
- **CSP-safe.** The CSP in `vercel.json` blocks external script and connect origins. Don't add anything that would require relaxing it.
- **Mobile-first illustrations.** They render at the same size on mobile as desktop. Don't make them depend on hover.

## Success bar

Re-run `node scripts/screenshots.mjs`. Open the four new images next to the current ones. Answer all four honestly:

1. **Could someone identify a screenshot of this app as GuestFlow without seeing any text?** If the only thing identifying it is the wordmark in the corner, the identity is not doing its job.
2. **Does the High Functioning mark read at 46px in the sidebar AND at 200px on a hero?** If it only works at one size, redraw.
3. **Are the empty states recognizably from the same illustration family?** If they look like they came from three different apps, restart the illustration step.
4. **Is the GuestFlow parent mark visible without being loud?** If you have to squint, it's underweight. If it competes with the HF mark, it's overweight.

If all four land cleanly, commit. If any feel weak, push another iteration before stopping.

## Deliverable checklist

- [ ] `src/components/brand/HighFunctioningMark.tsx` — accepts `size`, `tone`
- [ ] `src/components/brand/GuestFlowMark.tsx` — sibling mark
- [ ] `src/components/icons/Icon.tsx` — 12 unified icons, named API
- [ ] `src/components/illustrations/` — at least 5 line-art empty-state SVGs
- [ ] `EmptyState` component accepts an `illustration` prop
- [ ] Sidebar brand block uses new HF mark + GuestFlow parent lockup
- [ ] Welcome page has one signature hero graphic
- [ ] All five portal sections get a glyph beside the eyebrow
- [ ] Favicon updated to SVG of HF mark
- [ ] Optional secondary accent decided (commit message explains the call)
- [ ] One texture moment added
- [ ] `npm run build` clean
- [ ] New screenshots committed at `docs/screenshots/`
- [ ] Commit message explains *what visually changed* and *why each design call was made*

## What success looks like

A podcast producer scrolls the welcome page, lands on the dashboard, opens a guest portal, forwards a share kit — and at no point does the product look like a generic dashboard. The identity is felt without being shouted. The HF mark is a podcast-brand identity that could survive on a coffee mug. The GuestFlow mark is a quiet parent. The illustrations look hand-drawn rather than stock. And the producer says: *"this looks like a thing, not a template."*
