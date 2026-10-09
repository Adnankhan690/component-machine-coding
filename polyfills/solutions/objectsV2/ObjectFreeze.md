To write a polyfill for Object.freeze(), we need to account for how JavaScript engines handle object protection. True immutability requires native engine features—specifically Object.defineProperty() and Object.preventExtensions() (or Object.seal()).
If a JavaScript environment is so old that it completely lacks these capabilities (like Internet Explorer 8 or older), a true functional polyfill is technically impossible. In those legacy environments, the polyfill acts as a "graceful degradation" fallback—it returns the object unmodified without throwing an error.
Here is the robust, industry-standard polyfill for Object.freeze():

if (typeof Object.freeze !== 'function') {
  Object.freeze = function (obj) {
    // 1. Object.freeze only acts on objects. If it's a primitive, return it as-is.
    if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
      return obj;
    }

    // 2. Get all own property names of the object (excluding inherited ones)
    var props = Object.getOwnPropertyNames(obj);

    // 3. Make every individual property read-only and non-configurable
    for (var i = 0; i < props.length; i++) {
      var prop = props[i];
      
      // We use Object.defineProperty to change property descriptors
      if (Object.defineProperty) {
        Object.defineProperty(obj, prop, {
          writable: false,      // Prevents changing the value (e.g., obj.prop = newValue)
          configurable: false   // Prevents deleting or reconfiguring the property descriptor
        });
      }
    }

    // 4. Prevent new properties from ever being added to the object
    if (Object.preventExtensions) {
      Object.preventExtensions(obj);
    }

    // 5. Object.freeze always returns the frozen object
    return obj;
  };
}


## ⚙️ How this Polyfill works under the hood:

   1. Primitive Guard: Object.freeze() in modern ES6+ specs returns primitives (like strings, numbers, or booleans) directly without throwing errors. The polyfill mirrors this logic.
   2. writable: false: This is what actually stops a developer from reassigning values to existing keys (e.g., changing user.age = 25 to user.age = 26).
   3. configurable: false: This locks down the property layout. It stops developers from running delete user.age and prevents them from secretly changing the property back to writable: true later.
   4. Object.preventExtensions(): This acts as the final lock, ensuring no one can attach new keys to the object.

------------------------------
## 💡 Bonus: What about a "Deep Freeze" Polyfill?
As mentioned earlier, standard Object.freeze() is shallow. If you want a utility function that freezes an object and all of its nested objects recursively, you can write a deepFreeze utility like this:

function deepFreeze(obj) {
  // Retrieve the names of properties defined on obj
  const propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing self
  for (const name of propNames) {
    const value = obj[name];

    // If the value is an object, recursively freeze it
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }

  // Freeze the top-level object
  return Object.freeze(obj);
}
// Example usage:const employee = {
  name: "Bob",
  details: { age: 30, Role: "Developer" }
};

deepFreeze(employee);
employee.details.age = 31; // ❌ Fails silently or throws error in Strict Mode!

Would you like to explore how Object.freeze() behaves with Arrays, or should we look at how to bypass or copy a frozen object when you actually need to update data?

# Configurable Object Example
const user = {};

// Create a property with configurable: true
Object.defineProperty(user, 'score', {
  value: 100,
  writable: false,      // It's read-only
  configurable: true    // But it IS configurable!
  
});

// Since it's configurable, we can change its descriptor rules later!
// Let's change it to be writable again:
Object.defineProperty(user, 'score', {
  writable: true        
});

user.score = 200; // ✅ Works! Because we reconfigured it.
console.log(user.score); // 200