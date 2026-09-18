---
title: The Progress Bar
description:
  What a progress bar's own behaviour communicates about an unfolding
  wait, and what Harrison et al.'s controlled comparison actually
  measured when they varied that behaviour under a fixed duration.
week: 5
date: 2027-03-22
tags:
  - interfaces
teachers:
  - marisol-quaye
slides: /decks/week-05/
related:
  - sessions/05-logging-the-interface
  - lectures/week-04
---

A file is copying. A bar fills from left to right. A percentage climbs:
40, 50, 60… This is a hypothetical, not a specific observation — but it's
one you'll recognise, because almost every digital wait now comes with
some piece of interface trying to represent how it's going while it goes.

## This week's claim, plainly

*How an interface represents an ongoing wait does more than disclose that
progress exists: its changing behaviour gives the waiter a particular
picture of how the process is unfolding.* In Harrison et al.'s controlled
comparison, different progress-bar behaviours changed which bar was
perceived as faster, even though the actual duration behind every bar
stayed fixed. That's the empirical backbone this week rests on — a
measured change in perceived speed and preference under a fixed,
controlled duration. It is *not* a measured change in what someone
expected, and this lecture doesn't claim otherwise.

## From the log to the system

Three mechanisms have built our vocabulary for reading a wait: what we
attend to, what we expected, and what information arrived. Now we turn
that vocabulary onto the system doing the waiting with us.

## Redrawing Week 4's line

Week 4 established a first distinction: whether explicit information was
available during the wait — arriving only after it had already begun,
and kept separate from Week 3's expectation, which is fixed before a wait
starts. This week's question follows that distinction: given that a
system represents the wait's progress in some way, what does the
specific behaviour of that representation communicate about the process
as it unfolds? Two interfaces can both satisfy Week 4's distinction —
both disclose something, during the wait — and still differ completely
on this week's question, because one behaves as though steadily
converging on completion and the other behaves as stalled, erratic, or
offers no positional claim at all.

This course's own vocabulary for that behaviour — representation,
trajectory, shape, implied completion — is ours, not the research
literature's. Keep that apart from what the cited studies themselves
measured, which is narrower: perceived speed and preference, under a
fixed duration.

## What Harrison et al. actually did

Harrison, Amento, Kuznetsov and Bell built nine different progress-bar
behaviours — linear, ones that paused early or late, ones that
accelerated or decelerated, ones that moved in visible steps — and had 22
participants compare pairs of them, judging which of the two *seemed to
finish faster*, while every bar in every trial ran for the same fixed 5.5
seconds ([Harrison, Amento, Kuznetsov & Bell,
2007](https://doi.org/10.1145/1294211.1294231)). That's a tightly
controlled, paired-comparison task on a short, fixed, identical duration —
not a study of how a real, longer wait gets judged in minutes, and not a
measure of expectation. Read their findings at that scope:

- Progress bars with a pause near the end of their run were reliably
  perceived as slower, even though the underlying duration hadn't
  changed.
- Accelerating bars — ones that moved fastest right before finishing —
  were reliably preferred and perceived as faster.
- Participants also showed an order bias, tending to rate whichever bar
  they saw first as the faster one, independent of its actual behaviour.

Harrison et al. don't claim any of this generalises to how long a wait
*feels* in general, and they didn't measure whether a bar's behaviour
changes what someone expects would happen next, or a free-form
judged-duration report of the kind this course's log collects. What their
result licenses is narrower: within a short, controlled, paired
comparison, a progress bar's own behaviour near its end changed which one
people perceived as faster, and which one they preferred.

## Reading Myers alongside Harrison

Myers ran an earlier experiment on a related but different question:
whether having a percent-done indicator at all changes anything ([Myers,
1985](https://doi.org/10.1145/317456.317459)). His work establishes that
a percent-done indicator gives a user information about a task's progress
and completion — something to estimate how much has been done, or roughly
when a task might finish — and that a formal experiment found a
significant preference for systems that included a progress indicator
over systems that didn't. Read that as evidence about *whether* an
indicator is present, not about which specific behaviour a bar should
show. That's why this week reads Myers and Harrison together rather than
treating either as sufficient alone: Myers speaks to presence, closer to
Week 4's territory; Harrison speaks to behaviour, which is this week's new
question.

## What this doesn't establish

None of this licenses "progress bars make waits feel shorter" as a
general claim, and it doesn't license "an accelerating bar is always the
better design." Harrison et al.'s result is about perceived speed and
preference in a short, fixed, paired-comparison task; it says nothing
about longer real-world waits, about this course's free-form "Judged
duration" field, about what someone expected going in, or about whether a
misleading bar backfires once someone notices the trick. That's a
question this course is raising, not one either paper answers.

## Why this matters

Weeks 1 to 4 built one log and reread it through three mechanisms that
live in what a person attends to, expects, and is told. From this week,
the course turns outward, to how waits get built — starting with the most
literal act of representing a wait's state that exists, a progress bar or
a spinner. Week 6 asks the same question of a physical room instead of a
screen: what a waiting environment, rather than an interface,
communicates about how a wait will go. Together they're the first
matched pair in this course's analyse block, one designed and digital,
one physical and social, both asking what a wait's own design
communicates about itself.

## What you're doing this week

Keep the wait-observation log's method — a structured entry, no
manipulation, honest about what you actually saw — but extend it with one
new, clearly labelled field. The session has you log what a digital
wait's progress or status representation actually did, not just whether
one existed, and think through what its behaviour communicated about the
process as it unfolded.
