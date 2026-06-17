# GuestFlow — ChatGPT Audit Prompt

Paste this into ChatGPT (or any frontier model with browsing) to get a sharp, structured outside read on GuestFlow.

---

## The prompt

> You are an experienced product designer reviewing a real product as a **paid critic**, not a cheerleader. You will produce a structured audit, not a list of compliments. Bias toward finding the thing that's actually wrong.
>
> ### Context
>
> GuestFlow is a local-first producer dashboard + guest portal for podcasters, creator collabs, and interview shows. The one-liner is **"Send one link. Stop chasing guests."** It owns the messy middle between booking and recording: onboarding, missing assets, launch reminders, post-launch sharing. The current build is an intentionally manual, browser-only MVP — no backend, no auth, no integrations, no email automation.
>
> Read these three sources before doing anything else:
>
> - Live site (welcome screen + dashboard): https://guestflow-git-main-fuzmaster69-6511s-projects.vercel.app
> - GitHub repo (README has feature list and screenshots): https://github.com/fuzmaster/guestflow
> - `GOALS.md` in the repo — full product vision and what GuestFlow is explicitly *not*
>
> If the live site is auth-walled for you, work from the README screenshots and the source in the repo. The four canonical screenshots are at `docs/screenshots/welcome.png`, `next-actions.png`, `guest-portal.png`, and `pipeline.png`.
>
> ### Who would use this
>
> Target user: a podcast producer / interview-show host running things mostly solo, currently coordinating guests through Gmail + Instagram DMs + Calendly + Drive. They're already booking guests manually and constantly forgetting things.
>
> ### What to audit
>
> Score and critique each section **1–5** (1 = broken, 3 = serviceable, 5 = genuinely great), with at least one specific quoted-or-cited example per score. **Never give a 5 without an example so concrete a stranger could verify it.** Never give a 1 without saying what would fix it.
>
> 1. **Positioning & messaging** — is "Send one link. Stop chasing guests." actually sharp, or does it sound like every other "all-in-one" tool? Is the welcome page's three-up (mess → fix → result) doing real work or filler?
> 2. **Information architecture** — does the sidebar order make sense? Does the daily flow (Next Actions → guest detail → portal) feel like a real workflow, or like a dashboard cosplaying a workflow?
> 3. **Guest portal (the hero feature)** — if you were the guest receiving this link the night before your recording, would you feel calm or confused? Where does the eye land? What's missing? What's there that shouldn't be?
> 4. **Visual design** — does the "Run of Show" / production-document aesthetic feel intentional and unique, or pretentious? Is the readiness ring earning its prominence? Is JetBrains Mono on every label crisp or noisy?
> 5. **Producer dashboard (Next Actions)** — would a real producer open this every morning, or would they default back to Gmail? Cue numbers, urgency stripes, copyable templates — useful or theater?
> 6. **Trust & polish** — does the unauthenticated, localStorage-only model show through in a *good* way (calm, focused, no demands) or a *bad* way (looks like an unfinished prototype)?
> 7. **What's the riskiest assumption?** — name the one thing about this product that, if wrong, makes the whole thing pointless. Defend the answer.
>
> ### Output format
>
> ```
> # GuestFlow audit
>
> ## TL;DR (≤4 sentences)
> [What's the headline finding? What should the team work on next?]
>
> ## Scores
> | Area | Score | One-line take |
> |---|---|---|
> | Positioning & messaging | x/5 | ... |
> | Information architecture | x/5 | ... |
> | Guest portal | x/5 | ... |
> | Visual design | x/5 | ... |
> | Producer dashboard | x/5 | ... |
> | Trust & polish | x/5 | ... |
>
> ## Detail
> [Per-section critique, each ~3–6 sentences. Cite specifics — screenshot names, copy, layout elements.]
>
> ## Riskiest assumption
> [Single paragraph, named and defended.]
>
> ## Three things to fix this week
> [Three concrete, scoped, falsifiable items. Each one a single sentence in the form: "Change X so that Y."]
>
> ## One thing to NOT do
> [The most tempting next move that would be wrong, and why.]
> ```
>
> ### Rules
>
> - **No "consider adding" wishlists.** Every recommendation must be a change you would defend in a design crit.
> - **No style-preference notes without a rationale.** "I'd use a serif" is worthless unless tied to user behavior or brand strategy.
> - **No flattery.** If something is great, prove it with an example.
> - **No "you should add AI" unless you can name the exact job AI would do and the exact user moment it would land.**
> - **Match the tone of the product.** GuestFlow is calm, dry, producer-minded. Don't write the audit in marketing voice.
>
> Begin.

---

## How to use this

1. Open ChatGPT (web, with browsing enabled) or Claude.
2. Paste the prompt above as-is.
3. If the live URL is auth-walled in your browser session, tell the model to lean on the GitHub README and screenshots instead — the prompt already covers that fallback.
4. The output is meant to be uncomfortable. Resist the urge to argue back in the same thread — let it land, then triage the "Three things to fix this week" list against `GOALS.md`.

## Variants

- For a **design-only** audit: replace the seven audit areas with just *Visual design* and *Guest portal*, and ask for a critique against the original `DESIGN_PROMPT_VISUAL.md` brief.
- For a **founder-track** audit: replace the rules section with "You are a seed-stage investor doing a 30-minute diligence pass," and add an eighth section: *Would you take a meeting?*
- For a **competitive** audit: add "Compare against Riverside, SquadCast, and Podchaser. Where does GuestFlow win? Where does it disappear?"
