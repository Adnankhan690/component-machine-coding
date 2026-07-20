# Object.assign Polyfill Concepts Explanation

This document compiles the Q&A from our discussion regarding the inner workings of `Object.assign` polyfill, object properties, enumerability, prototypes, and accessor descriptors (getters/setters).

---

## Question 1: Code Explanation

Explain this code step by step, specifically these:
1. `typeof Object.getOwnPropertySymbols === 'function'`
2. `Object.getOwnPropertySymbols(from)`
3. `Object.prototype.propertyIsEnumerable.call(from, sym)`

### Code Block

```javascript
// 			if (typeof Object.getOwnPropertySymbols === 'function') {
// 				const symbols = Object.getOwnPropertySymbols(from);
// 				for (let j = 0; j < symbols.length; j++) {
// 					const sym = symbols[j];
// 					if (Object.prototype.propertyIsEnumerable.call(from, sym)) {
// 						to[sym] = from[sym];
// 					}
// 				}
// 			}
```

### Explanation

This code snippet is used to copy **Symbol-keyed properties** from a source object (`from`) to a target object (`to`), which is a key part of implementing a polyfill for [Object.assign](file:///Users/adnan/Desktop/js-practice/polyfills/solutions/objects/object-assign.ts).

#### 1. `typeof Object.getOwnPropertySymbols === 'function'`
* **What it does:** Checks if the current JavaScript environment supports ES6 Symbols.
* **Why it's needed:** `Symbol` and `Object.getOwnPropertySymbols` were introduced in ES6 (ES2015). If this code runs in an older environment (like an old browser or Node.js version), `Object.getOwnPropertySymbols` will be `undefined`. This check acts as a safety guard to prevent a runtime `TypeError` (`Object.getOwnPropertySymbols is not a function`).

#### 2. `Object.getOwnPropertySymbols(from)`
* **What it does:** Returns an array of all Symbol properties found directly on the `from` object.
* **Why it's needed:** Standard property retrieval methods like `Object.keys(from)` or a `for...in` loop only return **string-keyed** properties; they completely ignore properties keyed by Symbols (e.g., `from[Symbol('id')]`). To copy Symbol properties as well, we must explicitly fetch them using this method.

#### 3. `Object.prototype.propertyIsEnumerable.call(from, sym)`
* **What it does:** Checks if the symbol `sym` is an **enumerable** property belonging directly to the `from` object.
* **Why it's called this way (instead of `from.propertyIsEnumerable(sym)`):**
  1. **Object with no prototype:** If `from` was created using `Object.create(null)`, it does not inherit from `Object.prototype`, meaning `from.propertyIsEnumerable` would be `undefined` and throw an error.
  2. **Property Shadowing:** The `from` object might have a custom property named `propertyIsEnumerable` (e.g., `const from = { propertyIsEnumerable: true }`), which would override the built-in function.
  
  Using `.call(from, sym)` ensures we are safely calling the original, built-in method from `Object.prototype` with `from` as the context (`this`).

#### Summary of the Entire Block
If the environment supports Symbols, the code:
1. Retrieves all Symbol properties belonging directly to the source object `from`.
2. Loops through each Symbol.
3. Checks if the Symbol property is enumerable (meaning it should be copied).
4. If it is enumerable, copies the Symbol and its value to the target object `to`.

---

## Question 2: Enumerability

What is enumerable? `propertyIsEnumerable`

### 1. What does "Enumerable" mean?

In JavaScript, every property on an object isn't just a key-value pair; it also has hidden metadata configurations called **Property Descriptors**. One of these descriptors is `enumerable`, which is a boolean flag (`true` or `false`).

* **Enumerable (`enumerable: true`):** The property is "visible" to loop iterations. It will be picked up by:
  * `for...in` loops
  * `Object.keys()`
  * `Object.assign()` / spread operator (`...`)
  * `JSON.stringify()`
  
  *By default, any property you create via normal assignment (e.g., `obj.name = 'Adnan'`) is enumerable.*

* **Non-enumerable (`enumerable: false`):** The property is "hidden" from loops and copying methods, but is still fully accessible if you access it directly (e.g., `obj.hiddenProperty`).
  * *Example:* Built-in methods like `toString` or `valueOf` are defined as non-enumerable so that they don't accidentally show up when you loop over your objects.

### 2. What is `propertyIsEnumerable`?

`propertyIsEnumerable()` is a built-in method on `Object.prototype`. It is used to test whether a specific property key is both:
1. An **own property** of the object (directly on the object, not inherited from its prototype chain).
2. **Enumerable** (`enumerable: true`).

#### Code Example:

```javascript
const user = {
  name: 'Adnan' // Enumerable by default
};

// Define a non-enumerable property
Object.defineProperty(user, 'secretId', {
  value: 999,
  enumerable: false // Hidden from loops
});

// 1. Behavior with loops / keys
console.log(Object.keys(user)); // ['name'] (secretId is ignored)

// 2. Behavior with propertyIsEnumerable
console.log(user.propertyIsEnumerable('name'));     // true
console.log(user.propertyIsEnumerable('secretId')); // false (because it's non-enumerable)
console.log(user.propertyIsEnumerable('toString')); // false (inherited from Object.prototype)
```

In the polyfill in [object-assign.ts](file:///Users/adnan/Desktop/js-practice/polyfills/solutions/objects/object-assign.ts#L49), `Object.prototype.propertyIsEnumerable.call(from, sym)` is used to ensure we only copy Symbol properties that are meant to be shared (i.e. those that are **enumerable** and defined **directly** on the source object).

---

## Question 3: Prototype Properties

What are prototype properties?

### 1. The Core Difference

* **Own Properties:** Properties defined directly on the object itself.
* **Prototype Properties:** Properties that exist on the object's **Prototype** (its parent/ancestor template), which the object inherits and can access.

JavaScript uses the **Prototype Chain**. When you ask for a property on an object (e.g., `obj.name`), JavaScript:
1. First looks at the object's **own properties**.
2. If it doesn't find it there, it climbs up the **prototype chain** to check its parent prototype object.
3. It keeps climbing until it either finds the property or reaches the end (`null`).

### 2. A Real Example (From your code)

Let's look at Test 7 in your file [object-assign.ts:L128-130](file:///Users/adnan/Desktop/js-practice/polyfills/solutions/objects/object-assign.ts#L128-L130):

```typescript
const proto = { inherited: 'yes' };
const child = Object.create(proto); // Sets the prototype of `child` to `proto`
child.own = 'no';
```

Here is how the properties map:

| Property | Value | Type | Why? |
| :--- | :--- | :--- | :--- |
| `own` | `'no'` | **Own Property** | Defined directly on `child` via `child.own = 'no'`. |
| `inherited` | `'yes'` | **Prototype Property** | It is defined on `proto`, but `child` can access it because of the prototype link. |

If you inspect `child` in a console, it will look like this:
```javascript
console.log(child); 
// Output: { own: "no" } 
// (It does not show "inherited", but it can still read child.inherited by looking up)
```

### 3. Why is this important for `Object.assign`?

`Object.assign()` is designed to **only copy own properties**. It should never copy properties inherited from prototypes.

In your clean implementation, this is handled automatically:
* **String keys:** You use `Object.keys(from)`. This built-in function **only** returns the object's **own** enumerable properties (excluding any prototype properties).
* **Symbol keys:** You check `Object.prototype.propertyIsEnumerable.call(from, sym)`. The `propertyIsEnumerable` method returns `false` for any property inherited from a prototype.

---

## Question 4: Getters and Setters

What are getters and setters and explain its purpose in `Object.assign`

### 1. What are Getters and Setters?

In JavaScript, objects can have two types of properties:
* **Data Properties:** Simple properties that hold a value (e.g., `obj.age = 25`).
* **Accessor Properties (Getters and Setters):** Properties defined by functions that run when you read or write to them.
  * **Getter (`get`):** A function that runs when you **read** the property.
  * **Setter (`set`):** A function that runs when you **write** (assign) a value to the property.

```javascript
const person = {
  firstName: 'Adnan',
  lastName: 'Fyscal',
  
  // Getter: runs when you read 'fullName'
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  
  // Setter: runs when you assign to 'fullName'
  set fullName(value) {
    const parts = value.split(' ');
    this.firstName = parts[0];
    this.lastName = parts[1];
  }
};

console.log(person.fullName); // "Adnan Fyscal" (Calls the getter)
person.fullName = "John Doe"; // (Calls the setter)
```

### 2. Their Behavior and Purpose in `Object.assign`

A crucial characteristic of `Object.assign()` is that **it does not copy getter and setter functions themselves** from the source object to the target object. Instead:
1. It **invokes** the getter on the source object to get the resulting value.
2. It **assigns** that value to the target object, which triggers any setter if one exists on the target.

Here is how this behavior works in Test 6 of [object-assign.ts:L108-125](file:///Users/adnan/Desktop/js-practice/polyfills/solutions/objects/object-assign.ts#L108-L125):

```typescript
let getterCalled = false;
const getterSource = {
	get val() {
		getterCalled = true;
		return 42;
	}
};

let setterValue = null;
const setterTarget = {
	set val(v) {
		setterValue = v;
	}
};

Object.myAssign(setterTarget, getterSource);
```

#### Step-by-Step of `Object.myAssign(setterTarget, getterSource)`:

1. **Reading from the Source (`getterSource`):**
   * The polyfill runs `to[key] = from[key]`.
   * When it evaluates `from['val']` (the source), the getter function inside `getterSource` is invoked.
   * This sets `getterCalled = true` and returns the value `42`.

2. **Writing to the Target (`setterTarget`):**
   * The polyfill executes `to['val'] = 42`.
   * Since `setterTarget` has an existing setter for `val`, this assignment executes the setter function.
   * This sets `setterValue = 42`.

#### The End Result:
* The target object (`setterTarget`) **did not** get a getter function copied to it. It still just has its original setter.
* The value was computed on the fly from the source and passed into the target's setter.

> [!NOTE]
> If you actually want to copy getter and setter definitions (without invoking them), you cannot use `Object.assign`. Instead, you would use `Object.getOwnPropertyDescriptors()` and `Object.defineProperties()`.


## Why we use `propertyIsEnumerable` instead of `hasOwnProperty` for Symbol keys

In `Object.assign`, we only copy **enumerable own properties** from the source objects to the target.

Here is why we must use `propertyIsEnumerable` for symbol keys:

1. **`Object.getOwnPropertySymbols` returns ALL symbols:**
   Unlike `Object.keys(obj)` (which automatically returns only enumerable string properties), `Object.getOwnPropertySymbols(obj)` returns all own symbols—regardless of whether they are enumerable or hidden (non-enumerable).

2. **`hasOwnProperty` is not strict enough:**
   If a symbol exists directly on the source object but is hidden (non-enumerable), `hasOwnProperty` will return `true`. If we used `hasOwnProperty`, we would incorrectly copy hidden symbols to the target object.

3. **`propertyIsEnumerable` filters out the hidden symbols:**
   `propertyIsEnumerable` checks both conditions:
   * Is it an own property?
   * Is it enumerable (loopable)?
   
   Using `Object.prototype.propertyIsEnumerable.call(from, sym)` ensures that we only copy symbols that are both owned directly by the source and intended to be visible.

### Code Example to Illustrate:

```javascript
const secretSymbol = Symbol('secret');
const publicSymbol = Symbol('public');
const source = {};

// 1. Define an enumerable symbol
source[publicSymbol] = 'visible';

// 2. Define a non-enumerable (hidden) symbol
Object.defineProperty(source, secretSymbol, {
  value: 'hidden',
  enumerable: false // 👈 Hidden from iterations
});

// Object.getOwnPropertySymbols returns BOTH symbols
const symbols = Object.getOwnPropertySymbols(source); 
// -> [ Symbol(public), Symbol(secret) ]

for (const sym of symbols) {
  // If we used hasOwnProperty:
  console.log(source.hasOwnProperty(sym)); 
  // -> true for Symbol(public)
  // -> true for Symbol(secret) ❌ (We would copy this, which is wrong!)
  
  // Since we use propertyIsEnumerable:
  console.log(Object.prototype.propertyIsEnumerable.call(source, sym));
  // -> true for Symbol(public) ✅
  // -> false for Symbol(secret) ✅ (Successfully ignored)
}
```

