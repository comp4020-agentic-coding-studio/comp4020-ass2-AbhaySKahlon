# Your harness — SLOP4787 "The Science of Waiting"

The platform under you is fixed and documented in `README.md`. Everything
below is course-design and process discipline this repo has decided on for
itself; it is not restating the platform.

## 1. One thesis, ten subordinate mechanisms, named as a taxonomy

The course has exactly one thesis: **waiting is an experience, not merely a
duration.** Time, attention, expectation, information, interfaces,
environment, queue rules, priority, value and control are **a deliberately
chosen course taxonomy** for organising twelve weeks of teaching around that
thesis — not a canonical or exhaustive scientific classification of why
waiting feels different. Say so explicitly in course content wherever the
list of ten is introduced (e.g. on the home page or in Week 1). Nothing in
the course drifts into generic psychology-of-time, generic service-design, or
generic sociology content that isn't tied to one of these ten mechanisms and
back to the thesis.

## 2. Progression, not restatement

Each week's session and lecture must explicitly build on a concrete prior
week's output — the shared wait-observation log from Week 1, reinterpreted in
weeks 2–4; the sibling analytical lenses in weeks 5–9 — rather than reading as
a standalone essay. A week that could be lifted out and dropped into a
different course unchanged has failed this rule.

## 3. Real, directly relevant sources, honestly used, no invented findings

Ground factual claims in:

- Block & Zakay, on duration judgement
- Block, Hancock & Zakay, on cognitive load and duration judgement
- Hui & Tse, on the effect of waiting information
- Pruyn & Smidts, on waiting environments
- Maister, cited by name as a practitioner/historical framework (the
  "psychology of waiting lines" propositions) — **never presented as a
  settled scientific law**

Do not reach for famous-but-peripheral concepts just because they're well
known. Never invent citations, findings, studies, statistics, or data.
State mechanism effects — e.g. occupied vs. unoccupied attention — as
context- and judgement-type-dependent (prospective vs. retrospective duration
judgement matters here), never as a universal rule.

## 4. Assessment-phase order is load-bearing

Waiting Field Notes is due at the end of week 4, Queue Case Study at the end
of week 9, Waiting Experiment at the end of week 10, Waiting Audit at the end
of week 12 — matching the course's measure → explain → analyse → experiment →
audit progression. If this ever changes, update this rule and the
phase-order spec test together, in the same commit.

## 5. Deck scope starts at one, deliberately

Week 5 ("The Progress Bar") is the only lecture that gets a full slide deck
in this pass — chosen because digital progress indicators are the most
visually demonstrable of the ten mechanisms, and because it anchors the
Week 5/6 digital-vs-physical comparison. Do not expand deck scope to other
weeks without a stated reason tied to the course actually needing it. Do not
treat any fixed deck count as permanent policy — a second deck can be added
later if the finished course genuinely benefits from one.

## 6. No starter imagery; no people photos

Never leave `card.png`, `hero-home.avif`, or the two starter portraits
unmodified. `people` entries carry a name and a concise bio only — no
`photo` or `photoAlt`.

## 7. Experiment ethics is a design constraint, not an afterthought

Any Week 10 experiment or Week 12 audit that involves real people in a real
waiting system:

- defaults to self-observation, simulation, or a controlled
  interface/prototype
- only uses a live real-world intervention when it is genuinely low-risk,
  non-disruptive, privacy-preserving, and authorised where authorisation is
  needed (e.g. never disrupting an actual clinic or emergency-service queue)
- must name its own confounds and limitations
- must never present a small observational or intervention exercise as
  strong causal proof

This constraint must show up in three places, not just here: the policies
page's experiment-ethics policy, the Waiting Experiment assessment brief, and
the Waiting Audit assessment brief. One policy, referenced from the other two
— not restated three different ways.

## 8. Commit per unit of work, real citations only

Commit one week's session+lecture pair, one assessment, or the deck as its
own unit of work — not a single dump. `PROCESS.md` citations must resolve to
real commits. Preserve important decisions as commits *as the work happens*;
`PROCESS.md` is not reconstructed from memory at the end.

## 9. Never ship without being asked

No flipping the repo public, no running `ship`, no touching Pages settings
unless explicitly instructed.

## 10. The platform stays fixed

The four content collections' base shape, `astro.config.ts`'s integrations,
and the generated API are not modified. The course is built to fit them, not
the reverse.
