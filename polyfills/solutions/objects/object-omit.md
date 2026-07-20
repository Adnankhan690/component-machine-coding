# Why are we converting to string? --> `omitKeys.add(String(key))`

We convert the keys to strings (`String(key)`) to prevent lookup failures caused by type mismatches in `Set.prototype.has`. 

In JavaScript, object keys are strictly **strings** or **symbols**. However, developers often pass keys as numbers or other primitives when calling omit/pick functions.

---

### The Problem: Strict Equality in `Set.has`
A `Set` checks for existence using strict equality (`===`). If we don't convert the keys, lookups will fail when comparing different types:

```javascript
const mySet = new Set([0]); // Numeric 0 is added

console.log(mySet.has(0));   // true
console.log(mySet.has('0')); // false! (because '0' === 0 is false)
```

---

### How this affects `myOmit` (Example)
Consider Test 7 in your test suite:
```javascript
Object.myOmit('abc', [0, 2]);
```
1. `Object('abc')` turns into the string wrapper object: `{'0': 'a', '1': 'b', '2': 'c'}`.
2. The object keys retrieved via `Object.keys(source)` are strings: `['0', '1', '2']`.
3. The iterable passed contains numbers: `[0, 2]`.

#### Without `String(key)` coercion:
* `omitKeys` contains: `Set { 0, 2 }` (numbers).
* When iterating through the object keys (`'0'`, `'1'`, `'2'`):
  * `omitKeys.has('0')` is **false** (string `'0'` does not match number `0`).
  * As a result, the key `'0'` is **not** omitted, and the function incorrectly returns `{ '0': 'a', '1': 'b', '2': 'c' }`.

#### With `String(key)` coercion:
* `omitKeys` contains: `Set { '0', '2' }` (strings).
* When iterating:
  * `omitKeys.has('0')` is **true** (the key is successfully omitted!).
  * The function correctly returns `{ '1': 'b' }`.