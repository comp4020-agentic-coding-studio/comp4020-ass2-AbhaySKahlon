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
- Harrison, Amento, Kuznetsov & Bell, on progress-bar behaviour and
  perceived speed/preference under a controlled, fixed duration
- Myers, on the effect of percent-done progress indicators on preference,
  from an early HCI experiment (not a practitioner heuristic)
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

## 11. Course-first pedagogy: the weekly shape

This is a teaching-and-design rule, not a stylistic preference. Every
week's lecture and session are teaching artefacts for a prospective
student, not a literature review of the sources they cite. Research
supports teaching; it does not become the structure of the teaching.
Concretely, every week's lecture and session must cover these six teaching
jobs, in an order and form appropriate to that week's subject and
activity:

1. **Experience** — begin from a concrete waiting situation, observation,
   question, or tension. Open here, not with a citation or a claim about
   what a study found.
2. **Concept** — introduce the week's mechanism in clear, student-facing
   language, before any source is named. A student should be able to
   state the week's idea in their own words from this section alone.
3. **Evidence** — use research to substantiate the teaching point, with
   methodological detail included only where it changes what a student
   can legitimately conclude. A source earns its place because the
   week's claim needs it, not because it is available, well known, or
   impressive.
4. **Action** — give the student something concrete to observe, compare,
   analyse, test, or build.
5. **Reflection/limits** — state plainly what the week's activity and
   evidence can and cannot establish.
6. **Progression** — explicitly connect the week's work to the course
   thesis and to the next stage or week.

Important: these are required teaching functions, not a rigid six-section
page template. Do not force every week into identical headings, ordering,
or prose structure. The shape should be adapted to the week's pedagogical
purpose so the course does not become formulaic.

Alongside the six teaching jobs, the following constraints hold for every
week's content:

- Weekly pages must not read as mini literature reviews. If a week's
  structure could be mistaken for the structure of the paper(s) it cites
  — hypotheses, method, results, limitations, in that order — it has
  failed this rule, regardless of how accurate the citations are.
- Do not remove useful evidence merely to make a page shorter. A week
  that lost its research grounding in service of crisper prose has
  failed this rule as surely as one buried in citations.
- Do not dump participant demographics, measurement scales, statistical
  detail, or paper-style methodological exposition (sample sizes,
  exclusion counts, item wording, test statistics, and the like) unless
  that specific detail changes what a student is entitled to conclude
  from the evidence. When it does change that, state it plainly and
  briefly, in the reflection/limits stage — not as scholarly
  throat-clearing folded into the evidence stage.
- Preserve accurate citations and the source's own stated limitations.
  This rule constrains *placement and proportion*, never accuracy. Rule 3
  still governs honesty of sourcing; this rule governs where and how much
  of that sourcing appears on the page.
- Every week must remain visibly tied to the course thesis — "waiting is
  an experience, not merely a duration" — not just tied to its own
  mechanism in isolation.
- Every week must advance the course's measure → explain → analyse →
  experiment → audit progression; the progression stage is not
  decorative and must say something specific about why this week matters
  for what comes next, not a generic transition sentence.

This rule does not relax rule 3's sourcing honesty, rule 2's
progression requirement, or rule 1's taxonomy framing — it constrains how
those other rules' material is proportioned and sequenced on the page.
