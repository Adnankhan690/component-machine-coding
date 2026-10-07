# 03 — Adding tabs to the genui system

The goal: ask *"Show me the React hooks lifecycle in tabs"* and get a real,
clickable `<Tabs>` back.

Five steps. Step 0 is the one that teaches the most, so don't skip it.

---

## Step 0 — Find out why the current Tab can't be used

Before writing anything, look at what you already have. Open
[src/screens/tab/hooks/useTab.tsx](../../src/screens/tab/hooks/useTab.tsx):

```tsx
export const tabData: Tab[] = [
    { id: "tab-1", title: "tab-1", content: <ComponentA /> },
    { id: "tab-2", title: "tab-2", content: (<div><ComponentB /></div>) },
    ...
]
```

and [src/screens/tab/components/tab.tsx](../../src/screens/tab/components/tab.tsx):

```tsx
export default function Tab() {
    const { handleTabClick, activeTabContent } = useTab();
    ...
}
```

**This component cannot be driven by a model.** Three independent reasons, and
each one is a general lesson:

### Reason 1: it takes no props

`<Tab />`. There is no input. The data is baked into a module-level `const` that
the hook imports. A model can only influence a component through **props** — if
there's no prop, there's no way in.

> **Lesson:** genui components are *controlled from the outside*. Data in via
> props, always.

### Reason 2: `content` is `React.ReactNode`

```tsx
content: <ComponentA />
```

This is the fatal one. The model's output has to travel as **JSON over HTTP**.
JSX is a function call that produces a JavaScript object full of symbols and
component references. It is not serialisable, and even if it were, letting a
model name arbitrary components to mount is exactly the "model writes code"
hole the whole design exists to avoid.

> **Lesson:** every prop must survive `JSON.stringify` → `JSON.parse`. Strings,
> numbers, booleans, arrays, plain objects. No JSX, no functions, no `Date`,
> no class instances.

### Reason 3: the data and the component are welded together

`tab.tsx` imports `tabData` from the hook. Even if you fixed the other two, you
couldn't hand it a *different* set of tabs without editing the hook.

> **Lesson:** separate *what it renders* (props, from outside) from *how it
> behaves* (internal state — which tab is active). The hook keeping
> `activeTab` in `useState` is correct and should stay.

### Compare against the component that already works

[AccordianV3.tsx](../../src/screens/accordian/components/AccordianV3.tsx) is
already genui-ready, and it's instructive to see why:

```tsx
export interface Accordian { id: string; title: string; description: string; }

export default function AccordianV3({ data }: { data: Accordian[] }) {
```

- data arrives as a prop ✅
- every field is a `string` ✅
- open/closed state is internal, in `useAccordianV3` ✅

**That's the target shape.** Build the tab equivalent.

---

## Step 1 — Build a genui-ready tabs component

New file, leaving the existing `Tab` untouched (it's a fine hand-written demo —
this is a second variant, same as `AccordianV3` sits next to `accordian.tsx`).

`src/screens/tab/components/TabsV3.tsx`:

```tsx
import { useState } from "react";
import "../tabsV3.css";

export interface TabItem {
	id: string;
	title: string;
	content: string;
}

interface TabsV3Props {
	tabs: TabItem[];
}

export default function TabsV3({ tabs }: TabsV3Props) {
	// Internal interaction state — the model supplies data, not behaviour.
	const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");

	// Guard: the model controls the array, so it can be empty.
	if (tabs.length === 0) return null;

	// Guard: if the model's ids shift between turns, fall back to the first tab
	// instead of rendering an empty panel.
	const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

	return (
		<div className="tabs-v3">
			<div className="tabs-v3-strip" role="tablist">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						role="tab"
						aria-selected={tab.id === active.id}
						className={`tabs-v3-tab ${tab.id === active.id ? "is-active" : ""}`}
						onClick={() => setActiveId(tab.id)}>
						{tab.title}
					</button>
				))}
			</div>

			<div className="tabs-v3-panel" role="tabpanel">
				{active.content}
			</div>
		</div>
	);
}
```

`src/screens/tab/tabsV3.css`:

```css
.tabs-v3 { border: 1px solid #e2e2e2; border-radius: 8px; overflow: hidden; }
.tabs-v3-strip { display: flex; gap: 2px; background: #f6f6f6; border-bottom: 1px solid #e2e2e2; }
.tabs-v3-tab { border: 0; background: transparent; padding: 10px 16px; cursor: pointer; font-size: 14px; border-bottom: 2px solid transparent; }
.tabs-v3-tab.is-active { background: #fff; border-bottom-color: #3b82f6; font-weight: 600; }
.tabs-v3-panel { padding: 16px; line-height: 1.6; white-space: pre-wrap; }
```

Note the two guards. **A hand-written component can assume its data is sane.
A genui component cannot** — its props came from a probabilistic system. The
empty check and the `?? tabs[0]` fallback are not paranoia, they're the job.

---

## Step 2 — Add the contract entry

In [src/genui/tools.js](../../src/genui/tools.js), add the constant:

```js
export const SHOW_TABS = "show_tabs";
```

and a new entry in `UI_COMPONENTS`:

```js
{
	name: SHOW_TABS,
	description:
		"Render a tabbed panel showing one section at a time. Use when the answer " +
		"is a small number of alternative views of the SAME subject that the reader " +
		"compares by switching between them — variants, versions, approaches, or " +
		"before/after. Prefer show_accordion when the sections are independent " +
		"topics the reader may want open at once. Use between 2 and 5 tabs.",
	schema: {
		type: "object",
		properties: {
			tabs: {
				type: "array",
				description: "2 to 5 tabs, shown one at a time.",
				items: {
					type: "object",
					properties: {
						id: { type: "string", description: "Unique slug for this tab." },
						title: { type: "string", description: "Short label, 1-3 words." },
						content: {
							type: "string",
							description: "The full text shown when this tab is selected.",
						},
					},
					required: ["id", "title", "content"],
					additionalProperties: false,
				},
			},
		},
		required: ["tabs"],
		additionalProperties: false,
	},
},
```

That's all you touch for *both* providers — `toAnthropicTools()` and
`toGeminiTools()` map over `UI_COMPONENTS`, so Gemini gets it automatically with
`additionalProperties` stripped.

---

## Step 3 — Earn your keep on the description

This is the real work of the step, and it's worth slowing down for.

**You now have a collision.** Look at the two shapes:

```
show_accordion   items: { id, title, description }[]
show_tabs         tabs: { id, title, content     }[]
```

Structurally **identical**. Same cardinality, same field types, different names.
If you write a bland description, the model will pick between them more or less
at random, and you'll think the system is broken.

The model cannot tell them apart by shape. It can only tell them apart by
**what you say the reader does with them.**

| | Accordion | Tabs |
|---|---|---|
| Can you see several at once? | yes, open many | no, exactly one |
| Relationship between sections | independent topics | alternatives for the *same* subject |
| Reader behaviour | scan, expand the few that matter | switch back and forth to compare |
| Natural count | 3-10+ | 2-5 |
| Example question | "explain the React lifecycle stages" | "show the same fetch in XHR vs fetch vs axios" |

Three techniques are doing the work in that description:

**1. Name the reading behaviour, not the visual.**
"showing one section at a time" and "compares by switching between them" are
decision criteria. "A tabbed panel with a blue underline" is not.

**2. Point at the competitor explicitly.**
`"Prefer show_accordion when the sections are independent topics..."` — directly
telling the model how to break the tie is legitimate and effective. Do this
whenever two components have similar shapes.

**3. Put the count in the description *and* the schema description.**
"Use between 2 and 5 tabs" steers selection; JSON Schema can enforce it with
`minItems`/`maxItems`. Prose guides the choice, schema guards the result — use
both, they do different jobs.

> **The general lesson:** when a model picks the wrong component, your first
> instinct should be *"which two descriptions are too close?"*, not *"let me add
> a code rule."*

---

## Step 4 — Register the renderer

In [src/genui/GenerativeUi.tsx](../../src/genui/GenerativeUi.tsx):

```tsx
import TabsV3, { type TabItem } from "@/screens/tab/components/TabsV3";
import { SHOW_ACCORDION, SHOW_TABLE, SHOW_TABS } from "./tools";
```

and a branch in `renderBlock`, matching the style of the existing two:

```tsx
if (name === SHOW_TABS) {
	const { tabs } = (props ?? {}) as Record<string, unknown>;
	if (!Array.isArray(tabs) || tabs.length === 0) return null;

	const isTab = (item: unknown): item is TabItem => {
		const candidate = (item ?? {}) as Record<string, unknown>;
		return (
			typeof candidate.id === "string" &&
			typeof candidate.title === "string" &&
			typeof candidate.content === "string"
		);
	};
	if (!tabs.every(isTab)) return null;

	return <TabsV3 tabs={tabs} />;
}
```

Why validate when `strict: true` already guarantees the schema?

- `strict` is **Anthropic-only** — Gemini has no equivalent, and this codebase
  runs either provider.
- The type assertion `as Record<string, unknown>` is a *compile-time* claim about
  data that arrived at *runtime* over HTTP. TypeScript checked nothing here.
- The failure modes differ in kind: `return null` silently skips one block;
  an unguarded `.map` on a non-array throws and blanks the entire page.

The existing comment in that file says it well: *"a bad block should drop out,
not blank the page."*

---

## Step 5 — Run it and watch what the model does

```bash
npm run dev
```

Go to `/generative-ui` and try prompts across the decision boundary:

| Prompt | Expected |
|---|---|
| "Show the same HTTP request in fetch, axios and XHR" | `show_tabs` — alternatives, same subject |
| "Compare useMemo, useCallback and useRef" | `show_table` — same attributes across things |
| "Explain the main stages of the React rendering lifecycle" | `show_accordion` — independent topics |
| "What is a closure?" | no tool — plain prose, and that's correct |

The screen already prints what was chosen:

```tsx
{turn.model} → {turn.ui.length > 0 ? turn.ui.map(b => b.name).join(", ") : "plain text (no component matched)"}
```

**That line is your debugging tool.** Use it deliberately — write five prompts
you're confident about, run them, and note what got picked. When something is
wrong, the fix is almost always one of:

1. **Wrong component chosen** → the two descriptions are too close. Sharpen the
   contrast, add an explicit "prefer X when…".
2. **Never chosen** → the description doesn't match how people phrase the
   question. Put the user's vocabulary into it.
3. **Chosen but renders nothing** → your validation rejected the props. `console.log`
   the block in `renderBlock` and compare against the schema.
4. **Too eager** (tabs for everything) → the description is too broad, or the
   system prompt's "call no tool" escape hatch needs strengthening.

---

## What you actually changed

```
 src/screens/tab/components/TabsV3.tsx   NEW   genui-ready component
 src/screens/tab/tabsV3.css              NEW   styles
 src/genui/tools.js                      EDIT  +1 constant, +1 contract entry
 src/genui/GenerativeUi.tsx              EDIT  +1 import, +1 branch
```

Four files, and two of them are the component itself. **That's the payoff of the
three-layer split** — adding a component to the model's vocabulary is a contract
entry and a renderer branch. Nothing about the API route, the screen, or the
provider adapters changes.

---

Next: [04 — designing components for genui](04-component-design-rules.md)
