# Process overview

## What I built

SLOP4787, "The Science of Waiting," is a twelve-week course built on one
claim: waiting is an experience, not merely a duration. Ten mechanisms —
time, attention, expectation, information, interfaces, environment, queue
rules, priority, value, control — organise the teaching, and four
assessments move from a student's own observation log, to a real system's
case study, to one deliberate experiment, to a whole-system audit.

## How I got here

Directing this course changed what I asked the agent for. I decided early
that a good university course needed constraints an agent could actually be
held to, not a paragraph of aspiration, so before any week existed I wrote
CLAUDE.md's rules and the `spec/` checks that verify them together, in one
commit
([`45a5a2e`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AbhaySKahlon/commit/45a5a2e)).
Those checks — a fixed assessment phase order, a single Week 5 deck, a
mechanism tag on every week drawn from a closed taxonomy — started red on
purpose: I wanted tests that described what the course had to become, not
tests written afterward to describe whatever got built. That is the harness
doing what a harness is for, protecting structural promises an agent cannot
quietly drift away from.

Some decisions only became visible once weeks existed to test them against.
After drafting six weeks, I noticed the shape a citation-heavy week falls
into by default — hypothesis, method, findings, limits — was starting to
read like the papers it cited rather than a lecture for a student. I added
CLAUDE.md rule 11 mid-development
([`ccfd3f9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AbhaySKahlon/commit/ccfd3f9))
so weeks 7 onward had to state their idea in plain language before any
source was named — the harness evolving in response to a failure mode I
could see forming, not one predicted in advance.

Honesty of sourcing mattered enough that the ten-mechanism list says, on the
homepage itself, that it is a teaching structure I chose, not an established
scientific classification
([`b143fd7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AbhaySKahlon/commit/b143fd7)) —
the same discipline that keeps Maister cited as a practitioner framework,
not a law. A closer re-read later caught two smaller slips in that spirit: a
Week 7 citation that overstated what Rafaeli, Barron and Haber measured
([`75a4af9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AbhaySKahlon/commit/75a4af9)),
and a term that had drifted inside the Waiting Audit brief
([`37b9119`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AbhaySKahlon/commit/37b9119)).
Neither was a design failure — both were precision corrections a second
reading caught.

Week 11
([`8177e18`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AbhaySKahlon/commit/8177e18))
exists because weeks 1–4's mechanisms came from a student's own log, while
weeks 5–9's came from watching an external system — two different epistemic
positions the Audit needed reconciled before asking anyone to classify ten
mechanisms honestly. Making that its own week, rather than folding it into
the Audit brief, gave the transition room to be taught rather than asserted.

The clearest self-referential decision was rejecting a filled progress-track
"week N of 12" navigation in favour of twelve individually labelled tabs
([`2e8ead7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-AbhaySKahlon/commit/2e8ead7)):
a course whose own Week 5 teaches that progress-bar behaviour misrepresents
process state cannot then use that exact device as its own chrome.

What the harness does not, and could not, decide: whether the course reads
as coherent, whether its voice is distinctive, whether any given week is
pedagogically useful, whether the visual design is good, or whether the
whole thing is worth taking. Those stayed human judgement throughout,
checked only by rereading, not by any test in `spec/`.

## Before you ship

`pnpm check:evidence` verifies that this comment is gone, that citations
resolve to real commits, that a crit week's reflection entry is in
`reflections/`, and that `CLAUDE.md` is there. It checks that this account
is traceable, not that it is good: that is the marker's call.
