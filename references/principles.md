# Principles (how to work)

Every other reference in Sleak is **craft and hierarchy**, what good UI looks like. This one
is the **decision layer**, how you arrive at it: research, framing, low-fidelity iteration,
and feedback. Process, not pixels.

Use it **upstream** (discovery, problem framing, exploration); switch to the craft references
once you're shaping the actual interface.

## Purpose

Catch the process failures that no amount of visual polish fixes: designing from assumptions,
polishing the wrong thing, or hiding work until it's "done."

## Guess less, decide from evidence

Assumptions are the expensive mistake. Talk to users and look at data. Two kinds of research,
used at different moments:

- **Generative** (before you design): what do people need? Uncovers the real problem.
- **Evaluative** (after you have something): does this work for them? Validates or kills it.

The goal is to **guess less**, replace one assumption per round with a fact.

## Grill the brief before you design

"Guess less" above is the principle; this is the mechanic. Before the first pixel, map the
brief as a **decision tree**: every open question branches into the questions that hang off
its answer. Adapted from [grilling](sources.md#external-craft-skills).

Work it in **rounds**, not one long list:

1. Find the **frontier**, every question whose prerequisites are already settled, the ones
   answerable *now* without guessing at something not yet decided. A question that depends on
   another still-open question waits for a later round.
2. Ask the whole frontier at once. Number each question and give a recommended answer, so the
   other person is reacting to a position, not staring at a blank field.
3. Each answer reshapes the tree. Settled decisions push the frontier outward and unblock what
   depended on them. Recompute, ask the next round.
4. Stop when the frontier is empty, every branch visited, nothing silently assumed. Don't start
   building until then.

Finding **facts** (existing brand guidelines, the current component inventory, what the
competitor actually does) is your job, look them up, don't spend a round asking for them. Put
only real **decisions**, the calls only the stakeholder can make, in front of them.

## Reframe the problem before solving it

The sharpest lever is the **problem statement**, not the solution. First empathize, collect
real user stories and insights, then write a **point of view (POV)** that reframes the problem.
A good reframe opens solutions a literal reading hides (the classic: reframing "patients fear
the MRI machine" as "make the scan an adventure" changed the whole design).

## Story first, set the North Star

Before pixels, agree the **narrative**: what future are we creating, and for whom. A shared
North Star aligns the team and gives every later decision something to measure against.

## Diverge before you converge

Generate **many** options before committing to one. Frame exploration as *"How might we…?"* to
open the space. **Pencils before pixels:** sketch low-fidelity and widely first, polished
pixels too early shut down exploration and pull critique toward colour instead of the idea.

## Prototype to learn

A prototype is a **question, not a deliverable**. Build at the **lowest fidelity that answers
the question**, a prototype settles disagreements and tests a hypothesis faster than any
debate. Match fidelity to the question: pen-and-paper for flow, clickable for interaction.

## Show early, build a feedback culture

Share work **early and often**. Low-fidelity work *invites* honest critique; finished-looking
work suppresses it, because people assume it's done. Frame feedback by the **project goals**,
not personal taste. Giving and receiving critique is a skill, make it routine, specific, and
safe (hard on the work, easy on the people).

## Test early and often

Put it in front of **real users** sooner than is comfortable. Each round removes a guess.
Early-and-often beats one big test at the end, when it's too late (and too expensive) to change.

## Work laterally, break the black box

Design is a team sport. Involve **engineering and stakeholders early**, a design-engineering
bridge closes the gap between what's designed and what's built. Keep the process **visible**: an
opaque "black box" breeds mistrust and rework. Product design is people.

## How this relates to the craft rules

The craft references tell you **what** to build; these principles tell you **how to decide**
what to build. They sit upstream of the pixels, when you're shaping the interface itself,
follow the craft rules.

## Do / Don't

| Do | Don't |
|----|-------|
| Replace assumptions with research each round | Design from opinion and hope |
| Grill the brief in rounds, one recommended answer each | Ask everything at once, or nothing, and assume the rest |
| Reframe the problem before solving it | Jump straight to a solution |
| Agree the story/North Star first | Start in the pixel editor |
| Sketch many low-fi options | Polish one idea too early |
| Prototype the lowest fidelity that answers the question | Build a "real" thing to ask a small question |
| Share early; critique against goals | Hide work until it looks finished |
| Test with real users, early and often | Save all testing for the end |
| Involve engineering/stakeholders early | Toss a finished design over the wall |

## Notes

- This is the one **process/methodology** layer in Sleak; it is deliberately distinct from the
  visual-craft rules.
- Not every project needs every step, treat these as the moves available when a decision is
  bigger than "what should this look like?"
