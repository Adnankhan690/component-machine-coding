Viewed object-deepclone.ts:50-120

Here is the explanation of the code snippet from [object-deepclone.ts](file:///Users/adnan/Desktop/js-practice/polyfills/solutions/objects/object-deepclone.ts#L71-L76):

### 1. `new (source.constructor as any)`
In JavaScript, every object instance has a `constructor` property on its prototype that references the constructor function that created it. 

* When `source` is a wrapper object (such as `new String("abc")`, `new Number(123)`, or `new Boolean(true)`), `source.constructor` references the corresponding class constructor (`String`, `Number`, or `Boolean`).
* Using `new (source.constructor as any)(...)` dynamically invokes the correct constructor based on the type of `source`. This allows us to clone any of the three wrapper types using a single unified line of code, rather than writing separate `if` branches for `new String(...)`, `new Number(...)`, and `new Boolean(...)`.
* The `as any` type assertion is necessary in TypeScript because the compiler cannot statically guarantee that `source.constructor` is constructible with the argument passed.

---

### 2. `source.valueOf()`
Wrapper objects are actual objects (`typeof source === "object"`), not raw primitives. 

* The `valueOf()` method is built into primitive wrapper objects and returns the underlying primitive value (e.g. the string `"abc"`, the number `123`, or the boolean `true`).
* By calling `source.valueOf()`, we extract that raw primitive and pass it to the constructor to initialize the clone with the exact same primitive value.

---

### 3. Why call `copyProperties(...)` instead of returning directly?
In JavaScript, objects created via constructors like `new String()`, `new Number()`, or `new Boolean()` can have arbitrary custom properties and Symbols attached to them. For example:

```typescript
const original = new String("hello");
original.customMetadata = "some-metadata";
original[Symbol("id")] = 12345;
```

If we only did:
```typescript
return new String(original.valueOf());
```
The returned clone would only contain the primitive value `"hello"`, and all custom properties (`customMetadata` and Symbols) would be lost. 

Calling [copyProperties](file:///Users/adnan/Desktop/js-practice/polyfills/solutions/objects/object-deepclone.ts#L88-L106) ensures that these additional user-defined properties and Symbols are deeply cloned and assigned to the new wrapper object.