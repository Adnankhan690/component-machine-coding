# 06 — Questions you should be able to answer

Questions I'd want answered before calling a genui system "done" — grouped by
area. Some are answered by the code in this repo; some are deliberately open and
are the natural next things to learn. Each has a short answer so the doc is
useful on its own.

---

## A. Concept

**A1. Why is a tool call a good fit for "render this", when nothing is executed?**
Because function calling is really a *typed, schema-validated output channel*.
You want structured output that conforms to a shape; tool calling is the
best-supported way to get that from any provider. The "function" framing is
vestigial.

**A2. Why not just ask for JSON in the system prompt and `JSON.parse` it?**
You can, and it mostly works. Tool calling buys you: provider-enforced schema
validation (`strict: true`), no prose-wrapping or markdown-fence stripping, a
clean "no tool" signal, and native multi-call support. Prompt-and-parse puts all
of that on you.

**A3. What stops the model from inventing a component you didn't build?**
Nothing stops it *asking* — the guard is `renderBlock` returning `null` for
unknown names. This is why the renderer is a whitelist and not a dynamic lookup.
Worth internalising: **the renderer is a security boundary, not just a switch.**

**A4. Where's the line between genui and "the model writes the UI"?**
The line is who authors the markup. Here you author every pixel; the model picks
and populates. Systems where the model emits HTML/JSX are a different (and much
riskier) thing that happens to share the name.

---

## B. Contract design

**B1. Two components have near-identical schemas. How does the model choose?**
Only by the `description`. It cannot see your CSS. This is why `show_tabs` and
`show_accordion` must be separated by *reading behaviour* — see
[03, Step 3](03-tabs-step-by-step.md).

**B2. What happens as the component set grows to 20?**
Two things degrade: cost (every schema is in every request) and accuracy
(more near-neighbours to confuse). The mitigations are prompt caching for cost
and ruthless pruning for accuracy. Some providers also support deferred tool
loading / tool search for large sets.

**B3. How do you version a component contract?**
If you change a schema while old transcripts are stored, replaying them breaks.
Options: never make breaking changes (add optional fields only), or version the
name (`show_table_v2`) and keep the old renderer branch. Decide *before* you
persist transcripts.

**B4. Should the model ever supply ids, hrefs or anything that must be real?**
No. It will produce something plausible and wrong. Anything that must correspond
to real data gets injected by your code at render time.

**B5. Can one answer render more than one component?**
Yes — `ui` is an array and `GenerativeUi` maps over it. The Anthropic adapter
already collects *all* `tool_use` blocks. Whether you *want* multi-block answers
is a product decision; if not, say so in the system prompt.

---

## C. Rendering and safety

**C1. `strict: true` guarantees the schema — so why validate again?**
Three reasons: it's Anthropic-only (Gemini has no equivalent, and this repo runs
either), the TypeScript cast is a compile-time claim about runtime data, and the
blast radius differs — `return null` skips a block, an uncaught throw blanks the
page.

**C2. What happens today if a model returns 500 table rows?**
It renders all 500 and wrecks the layout. There is no `maxItems` in the current
schemas. Worth adding.

**C3. Could a genui system be an XSS vector?**
Not in this design — props are strings rendered as text by React, which escapes
them. It *becomes* one the moment someone adds `dangerouslySetInnerHTML` or a
prop that feeds an `href`/`src`. If you ever accept a URL from the model,
validate the scheme.

**C4. Is prompt injection a concern here?**
Yes, once any model input is attacker-controlled (a pasted document, a fetched
page, user-generated content). Injected text can steer *which* component renders
and what it says. The schema limits the damage — the model can't render anything
you didn't build — but it can still render *misleading* content in your UI
chrome, which carries your credibility.

---

## D. Interaction and state

**D1. The user clicks tab 2. Does the model know?**
No. Interaction state is local to the component and never flows back. That's the
right default — but it means the model can't react to UI interaction. If you need
that, you have to lift the state and send it back as context on the next turn.

**D2. What happens to a rendered component when the next turn arrives?**
Here, nothing — each turn is appended to `turns[]` and prior blocks stay mounted
with their own state. Alternative designs replace/patch earlier blocks; that
needs stable block identity across turns.

**D3. How would you let a component send something *back* to the model?**
The usual pattern: the renderer passes a callback that appends a synthetic user
message ("user selected the 'axios' tab") and re-asks. Note this needs real
conversation history — see D4.

**D4. Does this app have conversation memory?** *(it does not)*
Look at [ScreenGenerativeUi.tsx](../../src/screens/GenerativeUi/ScreenGenerativeUi.tsx):

```tsx
body: JSON.stringify({ messages: [{ role: "user", content: trimmed }] })
```

Only the current question is sent. Every turn is independent — "and now show it
as a table" cannot work, because there is no "it". The server already accepts a
`messages` array, so the fix is client-side: accumulate and send prior turns.
**Know this is a deliberate simplification, not an oversight you missed.**

---

## E. Production concerns

**E1. How do you test a system whose output is nondeterministic?**
Split it. The *components* are ordinary React and unit-test normally. The
*selection* needs an eval set: ~30 questions with an expected component, run
periodically, measure accuracy. Treat description edits as changes you re-measure
— otherwise you're editing prompts blind.

**E2. What does each request cost, and what drives it?**
Every request carries the system prompt + every tool schema, whether used or not.
That's your fixed floor, and it grows with the component set. Prompt caching
makes the stable prefix much cheaper on repeat calls — worth reaching for once
the contract is stable.

**E3. Users wait for the whole response. Can it stream?**
Not currently — `ScreenGenerativeUi` awaits the full JSON. Streaming genui is
possible (render the component shell as soon as the tool name arrives, fill props
as they stream) but it's a real jump in complexity. Know it exists; don't start
there.

**E4. What happens when the provider returns 503?**
Today the error text goes straight to `genui-error`. There's no retry. Overload
responses are explicitly transient and deserve a backoff retry.

**E5. How do you debug a wrong component choice?**
The screen prints `model → chosen components` for every turn. Start there, then
work through the four failure modes in
[03, Step 5](03-tabs-step-by-step.md#step-5--run-it-and-watch-what-the-model-does).
The fix is almost always in the description, not the code.

**E6. What's the fallback when the model is unavailable entirely?**
Worth deciding deliberately: plain prose from a cheaper model? A cached answer?
A plain error? A genui feature that hard-fails when the provider is down is a
feature that is down.

---

## F. Product judgement

**F1. Does the user know a machine chose this layout?**
An unexpected layout change between two similar questions reads as a bug unless
framed. This repo's subtitle does that framing explicitly.

**F2. What's the cost of a wrong-but-valid choice?**
An accordion where a table belonged is mildly annoying. The same mistake in a
medical or financial context is a different conversation. The higher the stakes,
the narrower the component set should be.

**F3. Is the variability actually serving the user, or you?**
The honest question. If a fixed layout would serve users equally well, genui is
engineering you're doing for its own sake. The right answer is often "markdown is
enough" — being able to say that is part of knowing the technique.

**F4. How do you know it's working?**
Not "it rendered a component." Pick something real: fewer follow-up questions,
faster time-to-answer, higher thumbs-up rate. Then check it against a prose-only
baseline. Without that comparison you can't tell whether the components helped.

---

## The short list

If you only keep five:

1. **The `description` is the prompt** — component choice is a prompting problem,
   not a code problem.
2. **Validate at the render boundary** regardless of what the provider guarantees.
3. **Props are data; interaction state is the component's own.**
4. **"No component" must be a reachable, acceptable outcome.**
5. **You need an eval set**, or you're editing descriptions blind.
