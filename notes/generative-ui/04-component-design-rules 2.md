# 04 — Designing components a model can drive

A component that works fine when *you* pass it props can still be unusable by a
model. These are the properties that make the difference.

Think of it as: **a normal component trusts its caller. A genui component has a
caller that is fluent, well-meaning, and occasionally wrong.**

---

## A. The props contract

### 1. Everything must survive JSON

```tsx
// ❌ unusable
content: React.ReactNode       // JSX doesn't serialise
onSelect: () => void           // functions don't serialise
createdAt: Date                // arrives as a string, silently
icon: <ChevronIcon />          // same problem as content

// ✅ usable
content: string
selectedId: string
createdAt: string              // ISO string, parse inside the component
icon: "chevron" | "star"       // a name you map to a component internally
```

That last line is the useful pattern: when you *do* want the model to influence
something visual, let it pick a **token from a closed set**, then map the token
to the real thing inside your component. The model names `"chevron"`; your code
decides what `"chevron"` renders.

### 2. Keep the shape flat and shallow

Every level of nesting is another level the model can get subtly wrong, and
nested schemas eat tokens on every single request.

```js
// ❌ three levels deep
{ sections: [{ groups: [{ items: [{ label, value }] }] }] }

// ✅ one level
{ items: [{ id, title, description }] }
```

Both existing components are one level deep. If you find yourself needing three,
that's usually a sign it should be **two components**, not one.

### 3. Required means required — and ask for nothing the model can't know

```js
required: ["caption", "columns", "rows"],
additionalProperties: false,
```

`required` stops half-populated renders. `additionalProperties: false` stops
invented fields. (Remember Gemini rejects the latter — `stripUnsupported()`
handles it.)

The flip side: never require a prop the model has no way to produce. A
`userId`, a `tenantId`, a `href` to a real route — the model will hallucinate
something plausible. Inject those from your own code at render time instead.

### 4. Bound every array

A model asked for "all HTTP status codes" will happily try to emit 60 rows.

```js
rows: { type: "array", maxItems: 20, items: {...} }
```

Say the bound in the `description` too ("between 2 and 5 tabs"). Schema enforces,
prose steers — you want both.

### 5. Make the model mint stable ids

```js
id: { type: "string", description: "Unique slug for this section." }
```

React needs a key, and index keys break when a list re-renders in a different
order. Making `id` a required field is cheaper and more reliable than generating
one at render time.

---

## B. Behaviour

### 6. Data from outside, interaction state inside

This is the cleanest line to draw:

| Model supplies | Component owns |
|---|---|
| which tabs exist, their titles and content | which tab is currently active |
| the accordion items | which items are expanded |
| the table rows | the current sort column |

`useAccordianV3` keeping `accordianId` internally is exactly right. `TabsV3`
keeping `activeId` internally is exactly right. The model describes *what is
there*, never *what the user is doing*.

### 7. Never trust the props at runtime

```tsx
if (tabs.length === 0) return null;
const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
```

Both guards exist because the data source is probabilistic. The general rule:

> Degrade to *less UI*, never to a crash. A missing block is a bad answer; a
> thrown error is a broken product.

### 8. Self-contained — no ambient dependencies

If the component needs a context provider, a store, a router, or a fetch of its
own, it can't be dropped into an arbitrary position in a chat transcript. Genui
components should be **presentational**: props in, markup out.

### 9. Stay accessible

The model is choosing the component, so you can't hand-tune ARIA per use. Build
it in once — `role="tablist"`, `aria-selected`, keyboard handling — and every
model-generated instance inherits it.

---

## C. The contract entry

### 10. Describe *when*, not *what*

```js
// ❌ the model can't act on this
"A collapsible accordion with a plus/minus toggle and smooth height animation."

// ✅ a decision rule
"Use when the answer is a set of independent topics, steps, or questions where
 each needs a paragraph of explanation and the reader will only care about some."
```

### 11. Make neighbouring components mutually exclusive on purpose

Two components with similar shapes will be confused unless you explicitly
separate them. State the tie-break in the description itself:

```
"Prefer show_accordion when the sections are independent topics the reader may
 want open at once."
```

Before adding a component, ask: **which existing component is this closest to,
and what single sentence separates them?** If you can't write that sentence, you
probably don't need the new component.

### 12. Use the words users use

The description is matched against real questions. If people say "breakdown",
"side by side", "vs", or "options", those words belong in the description — not
only your internal vocabulary.

### 13. Keep the set small

Every component's full schema goes into **every request**: more tokens, more
cost, and more ways for the model to pick wrong. Six sharp components beat twenty
overlapping ones. Add one only when a real question has no good home.

---

## The checklist

Before adding a component to the contract:

```
PROPS
  [ ] every prop survives JSON.stringify / JSON.parse
  [ ] one level of nesting, not three
  [ ] required[] lists everything needed to render
  [ ] additionalProperties: false
  [ ] arrays have maxItems
  [ ] list items carry a model-supplied id
  [ ] no prop the model would have to invent (ids, hrefs, tenant data)

BEHAVIOUR
  [ ] renders from props alone — no context, store, router, or fetch
  [ ] interaction state is internal
  [ ] empty / short / overlong arrays degrade instead of throwing
  [ ] accessible by construction

CONTRACT
  [ ] description says WHEN, not what it looks like
  [ ] names its nearest neighbour and the tie-break
  [ ] uses the phrasing real users use
  [ ] a validation branch exists in GenerativeUi.tsx
```

---

Next: [05 — identifying use cases](05-identifying-use-cases.md)
