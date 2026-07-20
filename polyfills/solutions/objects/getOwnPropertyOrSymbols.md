# why are we checking this ? and what does propertyIsEnumrable do ? -> `if (Object.prototype.propertyIsEnumerable.call(source, sym))`


`Object.getOwnPropertySymbols()` is a static method that returns an array of all **Symbol-keyed properties** found directly on a given object. 

### Why is it needed?
In JavaScript, object property keys can be either **strings** or **symbols**. Traditional methods for inspecting/iterating properties are designed to ignore symbols for backwards compatibility (or because symbols are often used to create "semi-private" or internal-like keys).

Specifically, the following mechanisms **ignore** Symbol properties:
* `Object.keys(obj)`
* `Object.getOwnPropertyNames(obj)`
* `for...in` loops
* `JSON.stringify(obj)`

To retrieve the Symbols defined directly on an object, you must use `Object.getOwnPropertySymbols(obj)`.

---

### Code Example

```javascript
const symSecret = Symbol('secretKey');
const user = {
  name: 'Alice',          // String key
  [symSecret]: 'shh-123'  // Symbol key
};

// 1. Regular keys list - ignores Symbol
console.log(Object.keys(user)); 
// Output: ['name']

// 2. Own properties list - ignores Symbol
console.log(Object.getOwnPropertyNames(user)); 
// Output: ['name']

// 3. getOwnPropertySymbols - returns ONLY Symbols
console.log(Object.getOwnPropertySymbols(user)); 
// Output: [ Symbol(secretKey) ]

console.log(user[Object.getOwnPropertySymbols(user)[0]]); 
// Output: 'shh-123'
```

---

### Property Retrieval Comparison

| Method | Enumerable Strings | Non-enumerable Strings | Enumerable Symbols | Non-enumerable Symbols | Inherited Properties? |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `Object.keys()` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `Object.getOwnPropertyNames()` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `Object.getOwnPropertySymbols()` | ❌ | ❌ | ✅ | ✅ | ❌ |
| `for...in` loop | ✅ | ❌ | ❌ | ❌ | ✅ |
| `Reflect.ownKeys()` *(All own keys)* | ✅ | ✅ | ✅ | ✅ | ❌ |

---

### Usage in Polyfills (like `myOmit`)
In your [object-omit.ts](file:///Users/adnan/Desktop/js-practice/polyfills/solutions/objects/object-omit.ts#L53-L61) implementation:

```typescript
if (typeof Object.getOwnPropertySymbols === "function") {
    const symbols = Object.getOwnPropertySymbols(source);
    for (let i = 0; i < symbols.length; i++) {
        const sym = symbols[i];
        if (Object.prototype.propertyIsEnumerable.call(source, sym)) {
            allKeys.push(sym);
        }
    }
}
```
1. We check if `Object.getOwnPropertySymbols` exists (`typeof ... === "function"`), supporting ES5 environments.
2. We extract all Symbol keys using `Object.getOwnPropertySymbols(source)`.
3. Since `getOwnPropertySymbols` returns **both enumerable and non-enumerable** symbols, we filter for only **enumerable own properties** using `Object.prototype.propertyIsEnumerable.call(source, sym)` to correctly mimic standard object iteration behaviors.