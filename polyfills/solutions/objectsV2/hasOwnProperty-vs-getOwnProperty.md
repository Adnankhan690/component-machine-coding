### why we should not use Object.getOwnPropertyNames ?

Good question — you actually *can* use it, and in some ways it's more "correct" for filtering own properties without needing `hasOwnProperty`. But here's why `for...in` + `hasOwnProperty` is usually shown as the standard polyfill approach, and where each has trade-offs.

**What `Object.getOwnPropertyNames` actually does differently:**
- Returns **all own properties** — including **non-enumerable** ones
- `Object.keys` (the real one) only returns **own + enumerable** ones

So if you use `getOwnPropertyNames` directly, you'd get properties that `Object.keys` is *not supposed* to return — meaning your polyfill would be behaviorally wrong for a specific edge case.

**Example that breaks it:**
```javascript
const obj = {};
Object.defineProperty(obj, 'hidden', {
  value: 42,
  enumerable: false  // this is the key part
});
obj.visible = 'yes';

Object.keys(obj);                  // ["visible"]  ✅ correct
Object.getOwnPropertyNames(obj);   // ["hidden", "visible"]  ❌ includes non-enumerable
```

If you build your polyfill purely on `getOwnPropertyNames`, you'd need an *extra* filtering step anyway — checking each property's descriptor for `enumerable: true`:

```javascript
function myKeys(obj) {
  return Object.getOwnPropertyNames(obj).filter(key =>
    Object.getOwnPropertyDescriptor(obj, key).enumerable
  );
}
```

This works too — it's just doing more work (fetching descriptors) than the `for...in` + `hasOwnProperty` version, which naturally skips non-enumerable properties as a side effect of how `for...in` works.

**Bottom line for the interview:**
- `for...in` + `hasOwnProperty` is simpler and does the enumerable-filtering "for free" — this is why it's the commonly taught version.
- `getOwnPropertyNames` + descriptor check is **also correct**, just more verbose, and it's actually a great answer if asked *"is there another way to do this?"* — showing you understand *why* the extra filter step is needed proves deeper understanding, not less.

So the real answer isn't "never use it" — it's "know both, and know why the simple one behaves correctly without the extra call."