# 05 — How to identify a generative UI use case

You said you're unsure what genui is *for*. This is the part that takes the
longest to develop intuition for, so here's a concrete test.

---

## The core test

> **Generative UI pays off when the *shape* of the answer is predictable, but
> *which* shape is needed isn't known until the question arrives.**

Unpack that into two questions:

**1. Can you enumerate the shapes?**
If every answer in your domain is one of {table, steps, comparison, timeline,
single value, prose} — yes. That's your component set.

**2. Can you predict *which* one, in code, before seeing the question?**
If yes → **don't use genui.** Just render that component. You don't need a model
to decide something you already know.
If no → that's the gap genui fills.

Generative UI is a **dispatch mechanism for an unpredictable input space.** If
your input space isn't unpredictable, it's overhead.

---

## The three-question screen

Run a candidate feature through these:

### Q1. Is the input space open-ended?

A free-text box where users can ask anything → open. A form with a dropdown of
six report types → closed, and a `switch` statement beats a model.

### Q2. Would a human expert reach for different formats for different questions?

Picture a senior colleague answering at a whiteboard. If they'd draw a table for
one question, a numbered list for the next, and a timeline for a third — that
variation is the signal. If they'd write a paragraph every time, markdown is
enough and you should stop here.

### Q3. Does structure preserve something prose loses?

Compare 4 items × 5 attributes as prose and you get 20 facts in a wall of text
where the reader can't do column-wise comparison. As a table, the comparison is
free. That delta is the value.

If the answer is a single number or one short fact, structure adds nothing.

**All three yes → good candidate. Any no → probably not.**

---

## The shape-of-the-answer heuristic

In practice you'll do this by feel. Train the feel on this mapping:

| The answer is… | Component | Tell-tale question words |
|---|---|---|
| same attributes across several things | **table** | compare, vs, difference between, breakdown |
| independent topics, read selectively | **accordion** | explain the stages/types/reasons, what are the |
| alternatives for one subject | **tabs** | in X vs Y vs Z, show the same thing in |
| ordered, must be done in sequence | **steps** | how do I, walk me through, set up |
| events positioned in time | **timeline** | history of, what changed in, roadmap |
| one number plus context | **stat card** | how many, what's the current |
| options with a decision to make | **cards** | which should I pick, what are my options |
| none of the above | **prose** | what is, why does, is it true that |

Note the last row. **"No component" is a first-class outcome**, not a failure —
the system prompt in this repo explicitly permits it, and the screen explicitly
reports it. A genui system that always renders a component is miscalibrated.

---

## Worked examples from this repo's domain

Your app is a component-practice codebase, so take questions a learner would ask:

| Question | Shape | Why |
|---|---|---|
| "Compare useMemo, useCallback and useRef" | table | 3 things × same attributes |
| "Explain the React rendering lifecycle stages" | accordion | independent topics, read some |
| "Show a debounce in vanilla JS, React hook, and lodash" | tabs | 3 versions of one thing |
| "How do I set up a controlled input?" | steps | ordered, sequential |
| "What is reconciliation?" | **prose** | a definition — structure adds nothing |
| "What's the default React batching behaviour?" | **prose** | single fact |

The last two matter most. Being able to say *"this one shouldn't render a
component"* is the skill that separates a calibrated system from a gimmick.

---

## Where it genuinely pays off

Patterns that recur in real products:

**Support / documentation assistants.** Users ask anything; answers are
naturally sometimes a table of plan limits, sometimes steps, sometimes a
definition. Textbook case.

**Analytics and data Q&A.** "Revenue by region" wants a table or a chart;
"total revenue" wants one big number. The model is choosing a *visualisation*,
which is exactly shape-selection.

**Internal tooling / admin copilots.** Wildly varied questions over structured
data, small expert audience, the UI vocabulary is already built.

**Onboarding and configuration flows.** The next thing to show depends on what
the user just said.

**Search over heterogeneous content.** Results that are sometimes a person,
sometimes a document, sometimes a setting — render each as its own card type.

## Where it doesn't

**The format is always the same.** A dashboard that always shows the same six
widgets. Render them.

**The input is a known, enumerable set.** Six report types from a dropdown →
`switch`. A model adds latency, cost and nondeterminism to a solved problem.

**Transactional or safety-critical UI.** Checkout, payment, destructive
confirmations, anything regulated. You want these pixel-identical every time
and auditable. Hand-build them.

**Latency-critical paths.** Every genui render waits on a model round trip.
Fine for "ask a question", wrong for a keystroke-level interaction.

**Correctness-critical content.** Genui controls *presentation*; it does not
make the content true. A beautifully-rendered table of wrong numbers is worse
than prose, because structure reads as authority.

---

## A smell test for "am I overusing this?"

- The model picks a component for **every** question → set too broad, or the
  escape hatch is too weak.
- You have twelve components and three are used → you're guessing at shapes
  rather than observing them.
- You keep adding `if` statements in the renderer to fix choices → you're
  fighting the contract in the wrong layer; fix the descriptions.
- You could replace the whole thing with a `switch` on a dropdown and lose
  nothing → you didn't need genui.

---

## How to actually find your component set

Don't design it up front. Do this instead:

1. Ship with **prose only**, and log the real questions.
2. Read 50 logged answers and ask: *"what did I wish this looked like?"*
3. The 3-4 shapes that keep recurring are your first components.
4. Add the fifth only when a real logged question has no good home.

This gets you a vocabulary that matches your actual traffic, instead of one that
matches your imagination. The repo already has two components — observing which
questions they do and don't fit is the cheapest way to discover the third.

---

Next: [06 — questions to be aware of](06-questions-to-be-aware-of.md)
