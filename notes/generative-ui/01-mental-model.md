# 01 — The mental model

## The one idea

A normal LLM call has one output channel: **a string**. You get text back, you
print it. Everything the model wants to say has to be squeezed through prose.

Generative UI gives the model a **second output channel**: a *typed function
call*. And here is the trick that makes the whole thing work —

> **You never execute the function.**

The function call *is* the answer. Its name says *which component to render*,
and its arguments *are that component's props*.

That is the entire concept. Everything else is plumbing.

## Seeing it in this repo

Look at the comment at the top of [src/genui/tools.js](../../src/genui/tools.js):

```js
// These "tools" have NO implementation: a tool call means "render this", not "run this".
```

In ordinary tool use (function calling), the loop is:

```
model asks to call get_weather("Pune")
  -> you run get_weather("Pune")
  -> you send the result back
  -> model writes an answer using it
```

In generative UI, the loop stops early:

```
model asks to call show_table({caption, columns, rows})
  -> you render <DataTable caption=... columns=... rows=... />
  -> done. There is no "sending it back".
```

You hijacked the function-calling mechanism to get **structured, validated,
typed output** instead of prose. The "tool" is just a schema-carrying envelope.

## What the model is and isn't doing

This is the part people get wrong, so be precise about it:

| ❌ The model is NOT | ✅ The model IS |
|---|---|
| writing HTML | choosing a name from a closed list |
| writing JSX or React code | filling in a JSON object you specified |
| generating CSS | picking *which* of your components fits |
| inventing new components | deciding *what data goes in* them |

You wrote `DataTable`. You wrote `AccordianV3`. You styled them, you tested
them, you own them. The model's entire job is **selection + population**.

This is why the approach is safe and why the output always looks like your
product: there is no path by which the model can emit markup.

## Why not the obvious alternatives

Worth understanding *why* this design, because the alternatives all seem easier:

**"Just let the model write HTML."**
Unsafe (XSS via `dangerouslySetInnerHTML`), visually inconsistent with your app,
slow (markup is a lot of tokens), unstyleable, and untestable. Every serious
implementation rejects this.

**"Just render markdown."**
Safe and cheap, and genuinely the right answer much of the time. But markdown is
*inert* — no collapsing, no tab switching, no sorting, no state. The moment the
answer wants interaction, markdown is out.

**"Just pick the component in code with keywords/regex."**
Works for 5 cases and collapses at 50. The model's advantage is that it judges
*the shape of the answer*, which is a semantic judgement, not a keyword match.
"Compare X and Y" should be a table — but so should "what are the differences
between X and Y", "X vs Y", "give me a breakdown of X across Y", and a thousand
phrasings you'd never enumerate.

**Component + props** is the design that keeps safety and consistency while
still getting interactivity and flexibility.

## The three layers

Every genui system, including this one, has exactly these three:

**1. The contract** — [`src/genui/tools.js`](../../src/genui/tools.js)
The closed vocabulary of what can be rendered. A name, a description of *when*
to use it, and a JSON Schema for its props. This is the only thing the model
sees about your UI.

**2. The selection** — the model, called in [`server/genui-plugin.js`](../../server/genui-plugin.js)
Reads the user's question and the contract, decides which component (if any)
matches the shape of the answer, and emits the props.

**3. The rendering** — [`src/genui/GenerativeUi.tsx`](../../src/genui/GenerativeUi.tsx)
Maps `name` back to a real React component, validates the props at the boundary,
and drops anything malformed rather than crashing.

Keep these three separate in your head. Most bugs are "I put logic in the wrong
layer" — e.g. trying to fix a bad component *choice* by patching the renderer,
when the real fix is a clearer `description` in the contract.

## The contract is a prompt

This is the least obvious thing in the whole system and the thing that most
affects quality.

```js
description:
  "Render a data table. Use when the answer compares things across the same
   set of attributes, or is a grid of values. ..."
```

That `description` string is not documentation. **It is the prompt that decides
whether this component gets used.** The model has nothing else to go on.

Notice the existing descriptions say *when to use it*, not *what it looks like*.
"Render a data table" is one clause; the rest is a usage rule. Writing
"A styled table with borders and a caption" would be useless to the model —
it doesn't care what it looks like, it cares when it applies.

**Rule of thumb: write descriptions for a new teammate who can't see the UI and
has to decide from the user's question alone.**

## The escape hatch matters

From the system prompt in `tools.js`:

```
"If neither tool fits the answer, just reply with plain text and call no tool."
```

Without this, the model will force a square answer into a round component,
because you handed it tools and tools look like instructions. Explicitly
permitting "none of the above" is what keeps the output honest.

You can see this in the screen — `turn.ui.length === 0` renders
`"plain text (no component matched)"`. That's a *success* state, not a failure.

---

Next: [02 — architecture diagrams](02-architecture-diagrams.md)
