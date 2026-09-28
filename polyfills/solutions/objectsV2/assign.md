### What is `Object.assign()`?

`Object.assign()` is a built-in JavaScript method used to **copy the values of all enumerable own properties** from one or more source objects to a target object. It then returns the modified target object.

#### Key Characteristics:

1. **Shallow Copy:** It copies property values. If the property value is a reference to an object (like an array or nested object), it copies only the reference, not the nested object itself.
2. **Target Mutation:** It modifies and returns the `target` object directly. If you want to keep the target immutable, you typically pass an empty object `{}` as the first argument.
3. **Handling of `null` and `undefined`:** If the target is `null` or `undefined`, it immediately throws a `TypeError`. However, if a *source* argument is `null` or `undefined`, it is simply ignored without throwing an error.
4. **Symbol Properties:** Native `Object.assign()` copies both string-keyed and symbol-keyed enumerable own properties.

---

### Polyfill for `Object.assign`

Here is a robust, production-ready polyfill for `Object.assign`:

```javascript
if (typeof Object.assign !== 'function') {
    Object.defineProperty(Object, 'assign', {
        value: function(target, ...sources) {
            // 1. Throw TypeError if target is null or undefined
            if (target === null || target === undefined) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            // 2. Convert target to an Object (handles primitive wrappers like strings/numbers)
            const toObject = Object(target);

            // 3. Loop through each source object
            for (let i = 0; i < sources.length; i++) {
                const nextSource = sources[i];

                // 4. Ignore null and undefined sources
                if (nextSource !== null && nextSource !== undefined) {
                    
                    // 5. Copy string-keyed enumerable properties
                    for (const nextKey in nextSource) {
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            toObject[nextKey] = nextSource[nextKey];
                        }
                    }

                    // 6. Copy symbol-keyed properties (to match native behavior)
                    if (typeof Object.getOwnPropertySymbols === 'function') {
                        const symbols = Object.getOwnPropertySymbols(nextSource);
                        for (let j = 0; j < symbols.length; j++) {
                            const symbolKey = symbols[j];
                            // Check if the symbol property is enumerable
                            if (Object.prototype.propertyIsEnumerable.call(nextSource, symbolKey)) {
                                toObject[symbolKey] = nextSource[symbolKey];
                            }
                        }
                    }
                }
            }

            // 7. Return the mutated target object
            return toObject;
        },
        writable: true,
        configurable: true
    });
}

```

---

### How the Polyfill Works

* **`Object(target)`**: If you pass a primitive like a string (`"abc"`) as the target, `Object()` wraps it into a boxed object so properties can be assigned to it.
* **`hasOwnProperty.call(...)`**: Ensures that we only copy **own properties** belonging directly to the source object, and avoids copying inherited properties from its prototype chain.
* **`Object.getOwnPropertySymbols(...)`**: Because standard `for...in` loops do not iterate over `Symbol` keys, this extra check ensures that symbol properties are also copied, aligning the polyfill with the full ECMAScript specification for `Object.assign`.