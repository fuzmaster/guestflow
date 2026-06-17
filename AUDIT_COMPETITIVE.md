# GuestFlow — Competitive Landscape Audit Prompt

For a sharp read on who GuestFlow actually competes with and where it disappears. Paste the block under **"## The prompt"** into ChatGPT (browsing on) or Claude.

---

## The prompt

> You are a competitive analyst who has done market maps for SaaS companies before. You're being paid to tell GuestFlow's team the **uncomfortable truth about who their real competitors are** — including the ones they aren't thinking about. Your output is not a feature comparison table; it's a strategic positioning read.
>
> ### Context
>
> GuestFlow is a local-first producer dashboard + guest portal for podcasters and interview shows. Pitch: **"Send one link. Stop chasing guests."** Browser-only MVP, no backend.
>
> Read these before you start:
>
> - Live site: https://guestflow-git-main-fuzmaster69-6511s-projects.vercel.app
> - Repo: https://github.com/fuzmaster/guestflow
> - `GOALS.md` — what the product is and is not
> - `README.md` and screenshots in `docs/screenshots/`
>
> ### The trap to avoid
>
> The founder's stated competitors are **Riverside, SquadCast, and Podchaser**. Take that list seriously *and* push past it. Riverside and SquadCast own recording, not coordination — they're adjacent, not competitive. Podchaser is audience-side, not producer-side. The real competition is almost certainly **somewhere the founder isn't looking**: free Notion templates, Airtable, a Google Doc + Calendly + Drive folder, the Riverside Backstage product, podcast-specific tools the founder may not be tracking (Castmagic, Headliner, Podpage, Hindenburg, Streamyard guest features).
>
> Your job is to give an honest market map, including the competitor that's actually most dangerous (which is probably free software the producer already has open in another tab).
>
> ### What you're scoring
>
> 1–5 scale. Cite specific competitor features. **No 5 without naming exactly where GuestFlow wins. No 1 without naming exactly where it loses.**
>
> 1. **Position vs Riverside / SquadCast** — recording-platform incumbents with guest-invite flows. Does GuestFlow complement, compete, or get absorbed?
> 2. **Position vs Notion / Airtable templates** — free, infinitely customizable, already on every serious producer's machine. This is probably the real competition.
> 3. **Position vs Calendly + Google Drive + Gmail** — the duct-tape stack most producers actually run today. Does GuestFlow replace it or just compete with one corner of it?
> 4. **Position vs Riverside Backstage / Castmagic / Podpage** — adjacent products with overlapping ambitions. Where do they win and where do they leave room?
> 5. **The guest-facing portal as a differentiator** — is the polished guest portal a real moat, or a feature that anyone could ship in six weeks?
> 6. **Switching costs** — a senior producer has a 2-year-old Notion guest database with embedded Drive links and Calendly automations. What's the actual cost to abandon that for GuestFlow?
> 7. **The competitor you're underestimating** — name them. Defend it.
>
> ### Output format
>
> ```
> # GuestFlow competitive map
>
> ## TL;DR (≤3 sentences)
> [Who is the actual #1 competitor, and where does GuestFlow currently disappear?]
>
> ## Scores
> | Competitor / category | Score | Where GuestFlow wins / loses |
> |---|---|---|
> | Riverside | x/5 | ... |
> | SquadCast | x/5 | ... |
> | Notion templates | x/5 | ... |
> | Airtable | x/5 | ... |
> | Calendly + Drive + Gmail combo | x/5 | ... |
> | Riverside Backstage | x/5 | ... |
> | Castmagic / clip tools | x/5 | ... |
> | Podpage / podcast websites | x/5 | ... |
>
> ## Market map (one paragraph)
> [Place GuestFlow on the map. What slice of the workflow does it own? What slices does it not own and shouldn't try to?]
>
> ## Where GuestFlow wins cleanly
> [Be specific. One paragraph. Name the use case and the user it wins on.]
>
> ## Where GuestFlow disappears
> [Be specific. Name the use case and the user where another tool wins easily.]
>
> ## The competitor you're underestimating
> [Single paragraph. Name them. Explain why they're more dangerous than the founder thinks.]
>
> ## Three positioning changes this week
> [Three single-sentence "Reposition X so it reads as Y" changes. Each must be visible in either landing copy or the product within a week.]
>
> ## One competitor to ignore
> [The one in the founder's head that doesn't actually matter, and why mentioning them in pitches is hurting positioning.]
> ```
>
> ### Hard rules
>
> - **No generic feature comparison tables** with green checkmarks. Strategic positioning, not feature parity.
> - **Name real competitors**, not categories. "Recording tools" is lazy; "Riverside, with Backstage v2 hinted at on their roadmap" is useful.
> - **No "GuestFlow is unique" claims.** Nothing is unique. Name what competitor would have to *not do* for GuestFlow to remain differentiated.
> - **No flattery.** The polished portal page is genuinely strong — say *why* and what it actually defends against.
> - **The founder thinks Riverside / SquadCast / Podchaser are the competition.** Don't let them stay comfortable with that frame.
>
> Begin.

---

## How to use

1. Paste the prompt block into ChatGPT (browsing on) or Claude.
2. The auditor can lean on the README and screenshots in `docs/screenshots/` if the live site is auth-walled.
3. After the audit lands, look at the **"competitor you're underestimating"** section first. That's where the real positioning work is hiding.
4. If the auditor's competitor map disagrees with Claude's previous read (which named Notion as the real competition), the disagreement itself is the interesting finding — figure out which read matches what your earliest paying customers will actually do.
