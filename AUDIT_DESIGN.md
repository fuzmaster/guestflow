# GuestFlow — Design-Only Audit Prompt

Paste the block under **"## The prompt"** into ChatGPT (browsing on) or Claude to get a second design opinion.

---

## The prompt

> You are a senior product designer reviewing GuestFlow as a **paid critic**, not a cheerleader. Your job is to find what's wrong, name it, and recommend a fix you'd defend in a design crit. Bias toward finding the *one* thing that's actually broken, not a list of polite suggestions.
>
> ### Context
>
> GuestFlow is a local-first producer dashboard + guest portal for podcasters and interview shows. The pitch is **"Send one link. Stop chasing guests."** The product is intentionally manual and browser-only — no backend.
>
> Read these before you write a word:
>
> - Live site: https://guestflow-git-main-fuzmaster69-6511s-projects.vercel.app
> - Repo: https://github.com/fuzmaster/guestflow
> - The brief this design pass executed against: `DESIGN_PROMPT_VISUAL.md` (in the repo)
> - The vision document: `GOALS.md` (in the repo)
> - Four canonical screenshots: `docs/screenshots/welcome.png`, `next-actions.png`, `guest-portal.png`, `pipeline.png`
>
> If the live URL is auth-walled in your session, the screenshots and source code in the repo are the source of truth.
>
> ### What you're scoring
>
> The design pass adopted a **"Run of Show" production-document aesthetic** — JetBrains Mono uppercase micro-labels, sheet/cue numbering, waveform divider graphics, a "boarding pass" treatment for the guest portal hero, single mint primary button + `···` overflow menu pattern. Your job is to evaluate whether that aesthetic earns its keep, whether the brief in `DESIGN_PROMPT_VISUAL.md` was actually delivered, and whether the result feels like a real product or a design exercise.
>
> Score 1–5 across these dimensions, citing a specific screenshot or element for every score. **No 5 without a verifiable example. No 1 without a fix.**
>
> 1. **Brief execution** — did each of the nine items in `DESIGN_PROMPT_VISUAL.md` actually ship? Where did the implementation cut a corner?
> 2. **Visual identity** — does the Run of Show theme feel intentional and unique, or pretentious and over-applied? Where does it stop helping?
> 3. **Hierarchy across pages** — is the focal point of each page obviously different from the next, or do Welcome / Next Actions / Pipeline / Guest Portal all read at the same energy level?
> 4. **Hierarchy within the guest portal** — does the 188px readiness ring earn its prominence, or does the boarding-pass strip + waveform overlay + "Hi Andre,"/"Andre is" copy compete for attention?
> 5. **Copy voice on guest-facing surfaces** — the portal greets the guest by first name but then refers to them in third person ("Andre is 80% ready"). Catch this kind of inconsistency. List others.
> 6. **Restraint** — JetBrains Mono on every form label, animated waveforms on most pages, cue numbers, sheet numbers. Where is the theme actively making things harder to use?
> 7. **Empty states and edge cases** — does the design degrade gracefully when a guest has no clips, no episode link, no recording date? Or do empty cards / dashed placeholders break the rhythm?
>
> ### Output format
>
> ```
> # GuestFlow design audit
>
> ## TL;DR (≤4 sentences)
> [Headline finding. What is the one thing that, if changed, would most improve the design?]
>
> ## Scores
> | Dimension | Score | Specific citation |
> |---|---|---|
> | Brief execution | x/5 | [screenshot/element] |
> | Visual identity | x/5 | ... |
> | Hierarchy across pages | x/5 | ... |
> | Hierarchy within portal | x/5 | ... |
> | Copy voice | x/5 | ... |
> | Restraint | x/5 | ... |
> | Empty states | x/5 | ... |
>
> ## Detail
> [Per-dimension critique. Reference specific pixels — the 78px hero on Next Actions, the dashed border on the portal pass, the cue number column on action rows. Generic feedback is worth nothing.]
>
> ## The thing to actually fix
> [Single paragraph. Name the one design decision that is most load-bearing for everything that's wrong. Defend it.]
>
> ## Three concrete changes this week
> [Three single-sentence "Change X so that Y" items. Each must be falsifiable — a reader should be able to look at the diff and tell whether it landed.]
>
> ## One thing to NOT change
> [The tempting next move that would make the design worse, with the reason.]
> ```
>
> ### Hard rules
>
> - **No "I'd consider" or "you might want to."** Every recommendation is a change you would defend.
> - **No style preference without rationale.** "I'd use a serif" is worthless without a user behavior or brand-strategy reason behind it.
> - **No flattery.** If something is great, prove it with a specific element.
> - **No generic restating of the brief.** I have the brief. I want your read on how it was executed.
> - **The product is calm, dry, producer-minded.** Don't write the audit in marketing voice.
> - **Match the rigor of the brief.** `DESIGN_PROMPT_VISUAL.md` told the designer exactly what to fix; this audit should tell them exactly what they missed.
>
> Begin.

---

## How to use

1. Paste the prompt block into ChatGPT with browsing enabled, or Claude with computer use / file access.
2. If the auditor can't load the live URL (Vercel team auth wall), it can still work from the README and the four screenshots committed to `docs/screenshots/`.
3. The output is meant to be uncomfortable to read. Compare it against the design audit Claude already produced — overlap is signal, divergence is interesting.
