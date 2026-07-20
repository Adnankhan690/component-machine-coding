# what this condition checks ? --> `if (keys && typeof keys[Symbol.iterator] === "function")`

The condition `keys && typeof keys[Symbol.iterator] === "function"` checks if the `keys` argument is **iterable** (i.e., whether it can be looped over using a `for...of` loop).

Here is the breakdown of how it works:

### 1. The `keys` check (Truthy Guard)
This ensures `keys` is not `null` or `undefined` (or any other falsy value) before we try to read a property from it. Without this guard, checking `keys[Symbol.iterator]` on `null` or `undefined` would throw a runtime `TypeError: Cannot read properties of null`.

### 2. The `typeof keys[Symbol.iterator] === "function"` check (Iterable Contract)
In JavaScript, an object is **iterable** if it implements the **Iterable Protocol**. This protocol requires the object to have a method at the special, globally unique symbol key `Symbol.iterator`.

If `typeof keys[Symbol.iterator] === "function"`, it guarantees that the object can produce an iterator and can be safely used with:
* `for...of` loops
* The spread operator (`[...keys]`)
* Passing into constructors like `new Set(keys)` or `new Map()`

---

### Examples of what passes vs. fails the check

#### Passing values (Iterable)
* **Arrays**: `[1, 2, 3]`
* **Sets**: `new Set(['a', 'b'])`
* **Strings**: `'abc'`
* **Maps**: `new Map()`
* **Arguments** object: `arguments`
* **TypedArrays**: `new Uint8Array()`

#### Failing values (Not Iterable)
* **Plain Objects**: `{ a: 1, b: 2 }` (they do not have `Symbol.iterator` by default)
* **Numbers**: `123`
* **Booleans**: `true`
* **Functions**: `(val) => val > 15`

---

### Why this is used in [object-omit.ts](file:///Users/adnan/Desktop/js-practice/polyfills/solutions/objects/object-omit.ts#L72-L80)
If the user passes an iterable (such as an array `['a', 'b']` or a Set `new Set(['a'])`), we enter this block and safely use a `for...of` loop to iterate over the keys:

```typescript
for (const key of keys) {
    // Safely extract elements because keys is guaranteed to be iterable
}
```
If the user passes something that is neither a predicate function (checked earlier) nor an iterable (checked here), we fall through to the `else` block and throw a descriptive `TypeError`.