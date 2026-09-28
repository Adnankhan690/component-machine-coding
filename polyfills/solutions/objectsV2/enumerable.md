## example of non-enumerable symbols keys

In JavaScript, when you add a symbol key to an object using normal assignment (`obj[sym] = value`), it is **enumerable by default**.

To create a **non-enumerable symbol key**, you must explicitly use `Object.defineProperty()` and set `enumerable: false`.

---

### Code Example

```javascript
const secretSymbol = Symbol("secret");
const obj = {};

// Define a non-enumerable symbol property
Object.defineProperty(obj, secretSymbol, {
    value: "hidden data",
    enumerable: false, // Explicitly made non-enumerable
    writable: true,
    configurable: true,
});

// 1. Object.getOwnPropertySymbols still finds it (because it's an own property)
console.log(Object.getOwnPropertySymbols(obj)); 
// Output: [ Symbol(secret) ]

// 2. But propertyIsEnumerable returns false
console.log(Object.prototype.propertyIsEnumerable.call(obj, secretSymbol)); 
// Output: false

// 3. Object.assign() will skip it because it's non-enumerable
const target = {};
Object.assign(target, obj);
console.log(Object.getOwnPropertySymbols(target)); 
// Output: [] (Nothing was copied!)

```

### Why would you use non-enumerable symbols?

Libraries and frameworks (like Vue, React, or state management tools) often use non-enumerable symbol keys to attach **internal metadata, state flags, or cached values** to objects. Because they are symbols, they won't collide with user property keys, and because they are non-enumerable, they won't show up in loops, console logs (in some environments), or `Object.assign` operations.


## similarly for string keyed keys also we can create a non-enumerable key right ?
**Yes, absolutely!** Just like symbols, string-keyed properties can also be made non-enumerable using `Object.defineProperty()`.

In fact, JavaScript itself uses non-enumerable string properties everywhere. For example, the `length` property on arrays and strings, or methods on prototypes like `toString` and `hasOwnProperty`, are all non-enumerable string keys so they don't show up when you loop over an object.

---

### Code Example

```javascript
const obj = {};

// 1. Create a normal string-keyed property (enumerable by default)
obj.publicName = "Alice";

// 2. Create a non-enumerable string-keyed property
Object.defineProperty(obj, "internalId", {
    value: 9999,
    enumerable: false, // Hidden!
    writable: true,
    configurable: true,
});

// Test 1: for...in loops and Object.keys() ignore non-enumerable string keys
console.log(Object.keys(obj)); // [ 'publicName' ]

// Test 2: propertyIsEnumerable returns false for the string key
console.log(Object.prototype.propertyIsEnumerable.call(obj, "internalId")); // false

// Test 3: Object.assign() skips it because it's non-enumerable
const target = {};
Object.assign(target, obj);
console.log(target); // { publicName: 'Alice' } (internalId is left behind!)

```

This is why in our `Object.assign` polyfill, we had to check `hasOwnProperty` for strings, but for symbols we had to explicitly check `propertyIsEnumerable` because `Object.getOwnPropertySymbols()` grabs all symbols regardless of their enumerability flag.