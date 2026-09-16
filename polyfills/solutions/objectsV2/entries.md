## 1. Thought Process & Conceptual Breakdown

The built-in JavaScript method `Object.entries(obj)` takes an object and returns an array of its own enumerable string-keyed property `[key, value]` pairs.

To build this from scratch, we need to consider several rules that the native implementation follows:

* **Null/Undefined Check:** If you pass `null` or `undefined` to `Object.entries()`, JavaScript throws a `TypeError`. We must replicate this behavior.
* **"Own" Properties Only:** We only want properties directly defined on the object itself, *not* properties inherited from its prototype chain.
* **Enumerable Properties Only:** Hidden or non-enumerable properties should be ignored.
* **String Keys Only:** Symbol keys are ignored by standard `Object.entries`.

A `for...in` loop is a natural fit here because it automatically iterates over **enumerable** string-keyed properties (both own and inherited). By combining it with a check for **own** properties (`hasOwnProperty`), we can precisely capture what we need.

---

## 2. Pseudo-Code & Edge Cases

```text
Function customObjectEntries(obj):
    // Edge Case 1: Check if input is null or undefined
    IF obj is null OR obj is undefined:
        THROW TypeError("Cannot convert undefined or null to object")

    resultArray = []

    // A for...in loop naturally traverses enumerable properties
    FOR each key IN obj:
        // Edge Case 2: Filter out inherited prototype properties
        IF obj has own property key:
            value = obj[key]
            ADD [key, value] TO resultArray

    RETURN resultArray

```

### Key Edge Cases Handled:

1. **TypeError on Null/Undefined:** Prevents runtime crashes when invalid objects are passed.
2. **Prototype Pollution / Inheritance:** Using `hasOwnProperty` ensures we don't accidentally pull properties from `Object.prototype`.

---

## 3. Actual JavaScript Implementation

Here is the functional implementation matching native behavior:

```javascript
function customObjectEntries(obj) {
    // 1. Throw a TypeError if the object is null or undefined
    if (obj === null || obj === undefined) {
        throw new TypeError("Cannot convert undefined or null to object");
    }

    const entries = [];

    // 2. Iterate through the object's enumerable keys
    for (const key in obj) {
        // 3. Ensure it's an "own" property (not inherited from prototype)
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            entries.push([key, obj[key]]);
        }
    }

    return entries;
}

// --- Example Usage ---
const user = {
    name: "Alice",
    age: 28,
    isDeveloper: true
};

console.log(customObjectEntries(user));
// Output: [ ['name', 'Alice'], ['age', 28], ['isDeveloper', true] ]

// Testing the error edge case:
// customObjectEntries(null); 
// Throws: TypeError: Cannot convert undefined or null to object

```