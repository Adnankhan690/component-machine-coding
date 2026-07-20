Edited object-deepclone.ts
Edited object-deepclone.ts
Edited object-deepclone.ts
Viewed object-deepclone.ts:55-98
Ran command: `node /Users/adnan/Desktop/js-practice/polyfills/solutions/objects/object-deepclone.ts`

### 1. What is `Object.getPrototypeOf()`?
`Object.getPrototypeOf(obj)` is a built-in JavaScript method that returns the **prototype** (i.e. the internal `[[Prototype]]` property) of the specified object.

In JavaScript, every object (except those created with `Object.create(null)`) is linked to another object called its prototype, from which it inherits properties and methods.

---

### 2. How it works (Example)
```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
  sayHello() {
    return `Hello ${this.name}`;
  }
}

const adnan = new Person("Adnan");

// Get the prototype of 'adnan'
const proto = Object.getPrototypeOf(adnan);

console.log(proto === Person.prototype); // true
console.log(proto.sayHello);             // [Function: sayHello]
```

Other common values it returns:
* For a plain object `{ name: "adnan" }`, it returns `Object.prototype`.
* For an array `[1, 2, 3]`, it returns `Array.prototype`.
* For `Object.create(null)`, it returns `null` (since it has no prototype).

---

### 3. Why it is used in `deepClone`
In the deep clone implementation, we have the line:
```typescript
const proto = Object.getPrototypeOf(source);
const clone = isArray ? new Array(source.length) : Object.create(proto);
```

By retrieving the prototype of the `source` object and passing it to `Object.create(proto)`, we create a new, empty object that **shares the exact same prototype/class inheritance** as the original object.

This is crucial for two reasons:
1. **Preserves custom classes**: If `source` is an instance of a custom class (e.g., `Person`), the `clone` will also be recognized as an instance of `Person` (`clone instanceof Person === true`).
2. **Preserves methods**: The `clone` will successfully inherit all methods defined on the parent class/prototype (like `sayHello()`) without having to copy them manually.