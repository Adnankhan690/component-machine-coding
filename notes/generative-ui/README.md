# Generative UI — learning notes

Notes written against the actual implementation in this repo:

| File | What lives in it |
|---|---|
| [01-mental-model.md](01-mental-model.md) | What generative UI actually is, and the one idea everything else follows from |
| [02-architecture-diagrams.md](02-architecture-diagrams.md) | How the whole thing works, diagram by diagram |
| [03-tabs-step-by-step.md](03-tabs-step-by-step.md) | Adding tabs to the genui system — the full walkthrough |
| [04-component-design-rules.md](04-component-design-rules.md) | What makes a component usable by a model (and what makes it unusable) |
| [05-identifying-use-cases.md](05-identifying-use-cases.md) | How to recognise a genui-shaped problem |
| [06-questions-to-be-aware-of.md](06-questions-to-be-aware-of.md) | Questions worth being able to answer |

## The code these notes describe

```
src/genui/tools.js                  the component contract (shared by both providers)
src/genui/GenerativeUi.tsx          the renderer: block name -> React component
server/genui-plugin.js              the dev-only API route that calls the model
src/screens/GenerativeUi/           the screen that drives it
```

## Suggested reading order

Read 01 and 02 first — they set up the vocabulary. Then 03, which is the hands-on
part. 04 and 05 are the ones worth re-reading later, once you've shipped one
component and have intuition to attach them to.
