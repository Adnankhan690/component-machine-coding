# what are enumerable string and non enumerable string ?

In JavaScript, every property on an object has hidden settings called **descriptors**. One of these descriptors is a boolean flag called `enumerable`.

When we talk about "enumerable string properties" vs. "non-enumerable string properties," we are talking about **string-keyed properties** (like `"name"` or `"age"`) that are either visible or hidden during loops.

Here is the breakdown of how they work, and why they matter for the `myOmit` function we just wrote!

---

### 1. Enumerable String Properties (The Default)

These are "visible" properties. By default, almost any property you create normally by assigning a value is enumerable.

* **How they behave:** They show up in `for...in` loops, `Object.keys()`, and `JSON.stringify()`.
* **Example:**

```javascript
const user = { name: "Alice" }; // 'name' is an enumerable string property

for (let key in user) {
  console.log(key); // Prints: "name"
}

```

---

### 2. Non-Enumerable String Properties (The Hidden Ones)

These are "hidden" properties. They exist on the object, and you can access them directly if you know their name, but they hide from standard loops and serialization tools.

* **How they behave:** They are **ignored** by `for...in` loops, `Object.keys()`, and `JSON.stringify()`.
* **Example:**
We can create a non-enumerable property using `Object.defineProperty()`:

```javascript
const user = { name: "Alice" };

// We define a hidden 'id' property
Object.defineProperty(user, 'id', {
  value: 101,
  enumerable: false // <-- This makes it non-enumerable!
});

console.log(user.id); // Prints: 101 (You can still read it!)
console.log(Object.keys(user)); // Prints: ["name"] ('id' is hidden)

```

---

### The Connection to `Object(obj)` and String Primitives

Remember in your `myOmit` code when we talked about `Object(obj)` turning a string primitive like `"hi"` into a `String` object?

If you convert a string to an object (`const source = Object("hi")`), JavaScript creates an object representation of that string under the hood. It looks like this:

| Property Key (String) | Value | Enumerable? |
| --- | --- | --- |
| `"0"` | `"h"` | **Yes (Enumerable)** |
| `"1"` | `"i"` | **Yes (Enumerable)** |
| `"length"` | `2` | **No (Non-enumerable)** |

Because `"length"` is a **non-enumerable** string property, your `for...in` loop in `myOmit` will safely grab the character indices (`"0"`, `"1"`) but will automatically ignore the `"length"` property!

---

### Quick Cheat Sheet: Which JS methods see what?

| Method | Enumerable String Keys | Non-Enumerable String Keys |
| --- | --- | --- |
| `for...in` loop | **Yes** | No |
| `Object.keys(obj)` | **Yes** | No |
| `Object.values(obj)` | **Yes** | No |
| `JSON.stringify(obj)` | **Yes** | No |
| `obj.hasOwnProperty(key)` | **Yes** | **Yes** |
| `Object.getOwnPropertyNames(obj)` | **Yes** | **Yes** |