---
title: Who Doesn't Have to Wait?
description:
  Priority doesn't remove waiting from a system — it reallocates it between
  classes of people, and what that reallocation does depends on facts a
  published policy rarely tells you.
week: 8
date: 2027-04-12
tags:
  - priority
teachers:
  - marisol-quaye
related:
  - sessions/08-mapping-a-priority-rule
  - lectures/week-07
---

Imagine a supermarket with an ordinary checkout and an express lane for
customers with only a few items. This is a hypothetical, not a documented
case — but it's a familiar enough shape to think with. Nobody in the ordinary
line breaks a rule. The store simply decides, in advance, that people
needing less checkout time will wait less. The person still standing in the
ordinary line doesn't get any of their time back — someone else's wait gets
shorter, while theirs stays the same or grows relative to what it would have
been in a single shared line.

That's what a priority rule actually is: not a feature added on top of a
queue, but a decision about whose waiting a system will reduce, and whose it
won't. Last week asked whether you could verify a queue's rule at all. This
week keeps the rule fully visible and asks a different question: once a
system has decided to treat two classes differently, what does that decision
change about who gets served sooner, and who is left under the ordinary rule
regardless?

## A formal way of asking the same question

A group of queueing researchers — Raz, Avi-Itzhak and Levy — built a
precise, mathematical version of this question ([Raz, Avi-Itzhak & Levy,
2004](https://doi.org/10.1145/1035334.1035341); detailed claims below are
drawn from the fuller technical report underlying that extended abstract).
They start from a simple baseline: at any moment, everyone currently waiting
could be said to deserve an equal share of whatever service capacity the
system is granting right then. How far a customer's actual treatment departs
from that equal share, added up over their time in the system, is what they
call *discrimination* — their technical term, meaning only "distance from an
equal share," not anything about identity or bias.

Applying this baseline to an ordinary first-come-first-served system, they
find that customers needing more service are already structurally worse off
relative to it, even with no priority rule at all. Giving shorter-service
customers priority — like the express lane — can improve this formal
fairness measure. But it doesn't always: their own result is conditional on
how different the two classes' typical service needs actually are. Below a
certain point, giving one class priority can make the measure worse, not
better.

Two things follow, and both matter more than any equation. First, this
measure describes an allocation, not a feeling — it says nothing about
whether the person still in the ordinary line notices, minds, or resents the
difference. Second, whether priority even helps by this measure depends on
facts — how much service time each class typically needs — that a policy
posted on a sign essentially never tells you. You can read "5 items or
fewer." You cannot read off whether the underlying numbers make that rule
formally favourable.

## Where Maister fits, and where it doesn't

That's exactly the gap Maister's older, unproven idea sits in, deliberately
unmerged with Raz et al.'s result rather than folded into it: Maister
proposed that waits people read as inequitable are experienced as worse than
waits they read as equitable, regardless of length. Nobody has tested this
the way Raz et al. tested their formal claim — it's a practitioner's
proposition, not evidence. But it names what the fairness measure can't:
what redistributing waiting might mean to the person who didn't get the
shorter version of it. Two separate, honest answers to two different
questions, not one strengthened by two citations.

## What this doesn't establish

Raz et al. show that the redistribution itself is a structural consequence
of priority rules; that is a different claim from how the resulting wait is
experienced. Their result comes from a mathematical model with its own
assumptions, not from an observed system, and it holds only under specific
conditions on the classes' service-time difference — not universally.
Maister's proposition, meanwhile, has not been tested here or anywhere in
this course's sources; it's included as a named framework, not as
confirmation of anything Raz et al. calculated.

## Why this matters

Waiting is an experience, not merely a duration — and priority is one of
the clearest ways a system can make two people's experience of "the same
queue" diverge on purpose. Raz et al. show that divergence has a real,
structural shape, describable before anyone's feelings even enter the
picture. Maister is the reminder that the structural fact and the felt one
are not the same claim, and this course won't treat one as proof of the
other.

Once you can see how a system distributes the right to wait less, the next
question is what it's trading for that. That's next week.
