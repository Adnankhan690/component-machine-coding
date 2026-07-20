how Object.prototype.hasOwnProperty is different from Object.prototype.propertyIsEnumerable 


Both `hasOwnProperty` and `propertyIsEnumerable` are methods found on `Object.prototype`, and both are used to inspect an object's properties without digging down into its prototype chain.

The core difference is that **`propertyIsEnumerable` is stricter**. It checks for two conditions instead of just one.

Here is the breakdown of how they differ:

---

### The Main Difference

* **`hasOwnProperty(key)`**: Checks for **only one** thing. Is this property a direct ("own") property of the object? It doesn't care if the property is hidden, visible, or loopable.
* **`propertyIsEnumerable(key)`**: Checks for **two** things. Is this property a direct ("own") property of the object **AND** is its internal `enumerable` flag set to `true`? (Meaning, will it show up in a `for...in` loop or `Object.keys()`?)

---

### A Code Example to See the Difference

Every property in JavaScript has hidden settings called descriptors. One of these settings is `enumerable`. By default, when you create a property normally, it is enumerable. But we can create "hidden" properties using `Object.defineProperty`.

```javascript
const user = {
  username: "adnan_dev" // Normal, enumerable property
};

// Let's create a hidden, non-enumerable property
Object.defineProperty(user, 'internalId', {
  value: "usr_9821",
  enumerable: false // 👈 Hidden from loops
});

// --- Case 1: Checking the normal property ---
console.log(user.hasOwnProperty('username'));         // true
console.log(user.propertyIsEnumerable('username'));   // true

// --- Case 2: Checking the hidden property ---
console.log(user.hasOwnProperty('internalId'));       // true ✅ (It is a direct property)
console.log(user.propertyIsEnumerable('internalId')); // false ❌ (It is direct, but NOT enumerable)

```

---

### Comparison Table

| Feature | `hasOwnProperty` | `propertyIsEnumerable` |
| --- | --- | --- |
| **Checks prototype chain?** | No | No |
| **Returns true for normal properties?** | Yes | Yes |
| **Returns true for non-enumerable properties?** | **Yes** | **No** |
| **Would it catch keys hidden by `Object.defineProperty`?** | Yes | No |
| **Built-in properties (like `length` on arrays)?** | Returns `true` (it's a direct property) | Returns `false` (built-in properties are non-enumerable by default) |

---

### Quick Example with Arrays

Arrays have a built-in `length` property. It belongs directly to the array instance, but JavaScript hides it from loops so you don't accidentally get the length when looping over array items.

```javascript
const arr = ['a', 'b', 'c'];

console.log(arr.hasOwnProperty('length'));         // true ✅ (The array itself owns the length property)
console.log(arr.propertyIsEnumerable('length'));   // false ❌ (You can't loop over 'length' in a for...in loop)

```

### Summary Rule of Thumb

Use `hasOwnProperty` when you just want to know if data exists on an object. Use `propertyIsEnumerable` only when you specifically care whether that property will show up in standard object iterations and loops.