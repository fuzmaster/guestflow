# GuestFlow — Visual Design Pass (Make It Look Better)

This pass is **purely visual**. Do not add new features, new pages, or new data fields. Do not restructure routes. The previous build pass (see `DESIGN_PROMPT.md`) shipped all seven features and they work. The job now is to make the app look like a real product instead of a scaffold.

Read [`GOALS.md`](./GOALS.md) for the brand direction. Look at [`docs/screenshots/`](./docs/screenshots/) before changing anything — those are the screens we're upgrading.

## What's wrong today

Be honest about the problems before fixing them:

1. **Card-on-card monotony.** Every section uses the same dark-navy panel with the same border radius and the same border color. The eye has nothing to land on. Hero, list rows, callouts, and side panels all weigh the same.
2. **Too many buttons.** Next Actions rows have four equally-weighted buttons. Guest Portal hero has three controls jammed in the top-right. Without primary/secondary distinction the UI looks like a control panel, not a workflow.
3. **No signature element.** The readiness ring is the strongest unique visual we have, and right now it's a tiny 36–88px circle in the corner. It should be the thing people remember.
4. **Hero treatments are timid.** "Guest Portal" and "Who needs a nudge?" sit in the same small `h2` as section headings. The page never opens up.
5. **Typography lacks rhythm.** Everything is Inter at four sizes that look the same. No display weight, no editorial accent, no contrast between metadata and content.
6. **Empty states look like real states.** Dashed boxes feel like skeleton loaders, not deliberate "this is fine" messages.
7. **Spacing is uniform 12–18px everywhere.** Generous whitespace would do more for "premium feel" than any color change.

## Design direction

Stay inside the existing palette: dark background `#080b12`, mint accent `#72f2c7`, amber `#ffc857`, soft text `#ecf2ff`. Do not introduce new colors casually. **Add one new texture** — a subtle grain or noise overlay on hero areas to break up the flat dark. Use SVG inline, no asset files.

Typography: keep Inter for body. Add a tighter, larger display treatment for page heroes (clamp 56–96px, letter-spacing -0.05em, weight 700). Keep JetBrains Mono only for the portal URL slug and code blocks. Introduce an **all-caps micro-label** style for section eyebrows (10–11px, letter-spacing 0.16em, muted color) — already partially used as `.eyebrow`, just be more consistent.

Spacing: jump the rhythm. Page heroes get 64–96px of breathing room above content. Sections within a page get 40–56px gaps. List rows can stay tight, but list groups get distance.

## Specific upgrades (do all of these)

### 1. Page hero treatment

Every top-level page gets a true hero, not a header. The current `.page-header` should be replaced with a `.page-hero` for: Next Actions, Guest Pipeline, Guest Portal, Missing Assets, Launch / Share, Templates, Settings. Each hero:

- Lives in its own container with significant top padding
- Display-weight title (the clamp size above)
- Eyebrow micro-label above the title
- One line of context copy below, max 56ch
- Right-side metadata only when load-bearing — single stat or single action, never a row of three buttons

### 2. Readiness ring as a signature

Promote it. On the Guest Portal hero, the ring should be **160–200px**, with the score in the center using the display font weight. Below the ring, a single sentence: "Maya is 80% ready for her interview." Move the small stat triplet ("missing / share / live links") under the ring as muted secondary text — not in a separate boxed column. The ring should feel like the focal point of the hero.

Add a subtle ring animation on first render: stroke-dashoffset transition from full to actual value over ~600ms ease-out. Once only, not on every re-render.

### 3. Next Actions: collapse the button row

Right now each row has Copy / Open portal / Open guest / Mark contacted side-by-side. Restructure:

- **One primary action** ("Copy message" or "Send first invite" — driven by the action type) as a real primary button
- **A "..." overflow menu** for the rest (Open portal, Open guest, Mark contacted, Snooze, Skip). Native `<details>` is fine — no library.
- Row layout: readiness ring, then a single content column (urgency pill + name + reason + detail in vertical stack), then primary button on the right
- Increase row padding to 20–24px
- Hover state should lift the row (subtle box-shadow + 1px border-color shift), not change background
- The urgency pill stays — but make `critical` actually pop with a left-edge color bar (3px wide stripe) instead of just a tinted background

### 4. Guest Portal: stop looking like a form

Each section currently uses identical cards. Differentiate by purpose:

- **Before the Interview** — a horizontal banner-style card with the recording date set in display weight. Location and parking nest under it. Single card, not three.
- **What We Need From You** — a checklist, not four cards. Each item is one row: icon-status on the left (filled circle for received, outlined for waiting, dashed for needed), label in the middle, "what to do" copy on the right. Aligns the receive/wait/need state visually so guests can scan in one second.
- **Recording Day** — keep it as a card pair (prep notes + what to expect) but drop the bulleted "What to bring" placeholder. If we don't have that data, don't show it.
- **After We Launch** — episode links should be a clean horizontal row of just brand chips (YouTube / Spotify / Apple / Main) without the "Not added" placeholder cluttering things. Replace empty links with quiet greyed pills that don't link anywhere.
- **Clips & Captions** — current is fine, but the caption block needs to feel like a quote. Add a left-border accent in mint and italicize the caption text. Copy button stays.

### 5. Welcome page: own the moment

The welcome screen is the marketing pitch — it can be more confident:

- Hero title can go 88–96px on desktop
- Add a faint radial-gradient glow behind the title using the mint accent at very low opacity
- The three-up cards (mess / fix / result) should not all weigh the same — give "the fix" a slightly brighter border and mint-tinted background so the eye reads it as the answer
- The mock browser frame is a nice idea but currently looks flat. Add a thin top reflection (linear gradient highlight) and a deeper shadow so it feels like a real product window
- Move the "Built by Jacob Britten" footer onto the welcome page with more breathing room than the dashboard footer

### 6. Sidebar polish

- The brand block currently looks like a hover-able button (because it is). Style it so it doesn't look like a nav item — drop the border, increase the size of "GuestFlow" to feel like a real wordmark, and use the mint gradient brand-mark as the click target instead of the whole row
- Active nav item gets a left-edge mint accent stripe instead of (or in addition to) the full mint-fill button. A mint stripe + slightly bolder text reads more refined than the giant mint pill
- Add hairline section dividers in the nav between *Next Actions / Today* (the daily group), *Pipeline / Guest Portal / Missing Assets / Launch & Share* (the work group), and *Templates / Settings* (the meta group)

### 7. Pipeline: breathe

- 12 kanban columns at full width crush the cards. Give the page horizontal scroll with snap-to-column, and make each column a fixed 280px
- Column headers get more weight — bigger stage label, smaller count
- Cards stay roughly the same size but reduce per-card metadata clutter; the readiness ring + name + one-line stage hint is enough

### 8. Empty states

Stop using dashed borders for "this is empty." Use a small inline SVG illustration (10–12 lines, no library) plus a tight headline plus a thin sentence. Examples:

- "No follow-ups due" — a tiny envelope with a check
- "No clips yet" — a tiny film strip with a plus
- "No one here yet" (kanban column) — a tiny dot, nothing more

The shape of an empty state should not look like a card with content missing.

### 9. Footer

The mono "BUILT BY JACOB BRITTEN — MEDIA SYSTEMS ARCHITECT" treatment is fine but right now it's nearly invisible against the dark background. Lift it slightly — increase opacity to ~70%, give the "Jacob Britten" link the mint accent on hover, and align the link group with a softer separator (a thin vertical line between the brand block and the link block).

## What to leave alone

- Routing, page structure, localStorage shape, mockGuests count
- The readiness score logic and signals
- The Next Action urgency logic
- All copy in templates.ts
- The footer's *content* (links + name) — that's locked
- Font choice — Inter + JetBrains Mono only

## Acceptance check

When you finish, re-run `node scripts/screenshots.mjs`. Open the four new images side-by-side with the originals in `docs/screenshots/`. You should be able to point at any one screen and say:

1. **Where's the focal point?** — there should be exactly one obvious answer per page
2. **What's the primary action?** — one button per row, not four
3. **What's the texture?** — there should be one moment of grain, glow, or accent that wasn't there before
4. **Does the readiness ring feel like the thing?** — on the portal, yes

If those four questions land cleanly, commit. If any feel weak, push another iteration before stopping.

## Deliverable checklist

- [ ] `npm run build` exits 0
- [ ] All seven existing pages still work — feature parity
- [ ] New screenshots committed at `docs/screenshots/`
- [ ] README screenshots replaced with the new captures
- [ ] No new dependencies added
- [ ] All inline styles removed if any crept in — everything in `src/styles.css`
- [ ] Commit message explains what changed *visually* and why each call was made

## Success bar

A podcast producer opens the welcome page, scrolls once, and says **"this looks like something I'd actually pay for."** That's the bar. Not "it's fine for an MVP" — actually nice.
