# why are we checking this ? and what does propertyIsEnumrable do ? `if (Object.prototype.propertyIsEnumerable.call(source, sym))`


The check `if (Object.prototype.propertyIsEnumerable.call(source, sym))` is performed to filter out **non-enumerable** Symbol properties, ensuring we only copy Symbols that are intended to be visible.

Here is the detailed breakdown:

### 1. What does `propertyIsEnumerable` do?
`propertyIsEnumerable(prop)` returns `true` if and only if:
1. The property `prop` exists directly on the object as an **own property** (i.e. it is not inherited from the prototype chain).
2. The property `prop` is **enumerable** (it can be iterated over in loops like `for...in` or returned by `Object.keys()`).

---

### 2. Why are we checking this here?
The method `Object.getOwnPropertySymbols(source)` returns **all** Symbol properties found directly on `source`. This includes both:
* **Enumerable Symbols** (visible, loopable).
* **Non-enumerable Symbols** (hidden, internal symbols).

In standard JavaScript (e.g. `Object.assign` or `lodash.omit`), we are only supposed to operate on **enumerable own properties**. We should ignore any hidden (non-enumerable) properties.

Therefore, because `Object.getOwnPropertySymbols()` is "too greedy" (it returns hidden symbols too), we must filter them:

```typescript
// 1. Get ALL own symbols (both visible and hidden)
const symbols = Object.getOwnPropertySymbols(source); 

for (let i = 0; i < symbols.length; i++) {
    const sym = symbols[i];
    // 2. ONLY keep the visible (enumerable) ones
    if (Object.prototype.propertyIsEnumerable.call(source, sym)) {
        allKeys.push(sym);
    }
}
```

---

### 3. Why the indirect `.call()`?
We write `Object.prototype.propertyIsEnumerable.call(source, sym)` instead of `source.propertyIsEnumerable(sym)` for two safety reasons:

1. **Object.create(null)**: If `source` has no prototype (e.g., created via `Object.create(null)`), calling `source.propertyIsEnumerable(sym)` directly throws `TypeError: source.propertyIsEnumerable is not a function`.
2. **Property Overriding**: An object could have a custom property actually named `"propertyIsEnumerable"`, which would break a direct call. Calling it from the prototype is 100% safe.