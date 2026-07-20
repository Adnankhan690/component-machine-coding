// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does static Object.pick do?
// A: It creates a new object containing a subset of properties from the source object.
//    The subset is determined either by a list of keys to pick (iterable), or by a predicate function
//    that decides whether each property should be included.
// Edge cases to remember:
// 1. Throw a TypeError if the source object is null or undefined (cannot be converted to object).
// 2. Coerce primitive inputs (strings, numbers, booleans, symbols) to their object wrapper equivalents (e.g. Object("abc")).
// 3. Support both an array/iterable of keys AND a predicate function.
// 4. Access inherited properties (from the prototype chain) when picking by a key list or running a predicate function.
// 5. Include symbol-keyed properties when matching key list or predicate function.
// 6. Support optional 'thisArg' context when using a predicate function.
// 7. Return a new plain object (with Object.prototype as prototype).
// 8. If the second argument is defined but not iterable and not a function, throw a TypeError.

interface ObjectConstructor {
	/**
	 * Creates a new object composed of the picked object properties.
	 * @param obj The source object.
	 * @param keys The keys to pick from the source object.
	 */
	myPick<T extends object, K extends keyof T>(
		obj: T,
		keys: Iterable<K>,
	): Pick<T, K>;
}

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================
function myPick(obj, keys) {
	// 1. Handle null or undefined source objects (matches native Object methods)
	if (obj === null || obj === undefined) {
		throw new TypeError(`Cannot convert undefined or null to object`);
	}

	// 2. Ensure keys is an iterable array/object
	if (typeof keys[Symbol.iterator] !== "function") {
		throw new TypeError(`${keys} is not iterable`);
	}

	// 3. Convert primitives (like strings or numbers) to an object wrapper
	const source = Object(obj);
	const result = {};

	// 4. Iterate through the requested keys
	for (const key of keys) {
		// Object.prototype.hasOwnProperty safely checks if the key exists directly on the object
		if (Object.prototype.hasOwnProperty.call(keys, key)) {
			result[key] = source[key];
		}
	}

	return result;
}

Object.myPick = myPick;



function mPick(obj, keys) {
	if (obj == null) {
		throw new TypeError('Can not convert undefined or null to object');
	}

	if (typeof keys[Symbol.iterator] !== 'function') {
		throw new TypeError(keys + ' is not iterable');
	}

	const source = Object(obj);
	const result = {};

	for (const key in source) {
		if (Object.prototype.hasOwnProperty.call(source, key)) {
			result[key] = source[key];
		}
	}
	return result;

}

// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================
// Test 1: Standard pick with array of keys
const testObj = { a: 1, b: 2, c: 3 };
console.log("Test 1 - standard pick:", Object.myPick(testObj, ["a", "c"]));
// Expected: { a: 1, c: 3 }

// Test 2: Pick with Set of keys (iterable check)
const keysSet = new Set(["b", "c", "d"]);
console.log("Test 2 - Set of keys:", Object.myPick(testObj, keysSet));
// Expected: { b: 2, c: 3 }

// Test 3: Pick with inherited properties
const protoObj = { inheritedProp: "yes" };
const childObj = Object.create(protoObj);
childObj.ownProp = "no";
console.log(
	"Test 3 - pick inherited property:",
	Object.myPick(childObj, ["inheritedProp", "ownProp"]),
);
// Expected: { inheritedProp: 'yes', ownProp: 'no' }

// Test 4: Pick with symbol keys
const sym = Symbol("secret");
const symObj = { [sym]: "shh", visible: "hello" };
console.log("Test 4 - pick symbol key:", Object.myPick(symObj, [sym]));
// Expected: { [Symbol(secret)]: 'shh' }

// Test 5: Pick with predicate function
const numObj = { a: 10, b: 20, c: 30 };
console.log(
	"Test 5 - predicate filter (values > 15):",
	Object.myPick(numObj, (value: number) => value > 15),
);
// Expected: { b: 20, c: 30 }

// Test 6: Pick with predicate function and custom thisArg
const context = { threshold: 25 };
console.log(
	"Test 6 - predicate with thisArg:",
	Object.myPick(
		numObj,
		function (this: typeof context, value: number) {
			return value > this.threshold;
		},
		context,
	),
);
// Expected: { c: 30 }

// Test 7: Primitive coercion (e.g. string input)
console.log("Test 7 - string input:", Object.myPick("abc", [0, 2]));
// Expected: { '0': 'a', '2': 'c' }

// Test 8: Null / Undefined input throws TypeError
try {
	Object.myPick(null, ["a"]);
} catch (error) {
	console.log(
		"Test 8a - null input throws TypeError:",
		error instanceof TypeError,
	);
}
try {
	Object.myPick(undefined, ["a"]);
} catch (error) {
	console.log(
		"Test 8b - undefined input throws TypeError:",
		error instanceof TypeError,
	);
}

// Test 9: Non-iterable non-function second argument throws TypeError
try {
	Object.myPick(testObj, 123 as any);
} catch (error) {
	console.log(
		"Test 9 - non-iterable non-function throws TypeError:",
		error instanceof TypeError,
	);
}

// Create a prototype object
const animal = {
	legs: 4,
};

// Create a new object that inherits from animal
const dog = Object.create(animal);
dog.name = "Buddy"; // Direct property

// --- 1. Checking the direct property ---
console.log(dog.hasOwnProperty("name")); // true
console.log("name" in dog); // true

// --- 2. Checking the inherited property ---
console.log(dog.hasOwnProperty("legs")); // false ❌ (It's on the prototype, not the dog)
console.log("legs" in dog); // true  (The 'in' operator climbs the chain)

// 1. Objects created with no prototype
// If an object is created using Object.create(null), it does not inherit from the base Object.prototype. Therefore, it doesn't even have the hasOwnProperty method on it. Calling it directly throws an error:

const cleanObj = Object.create(null);
cleanObj.username = "adnan";

// cleanObj.hasOwnProperty('username');
// ❌ TypeError: cleanObj.hasOwnProperty is not a function

Object.prototype.hasOwnProperty.call(cleanObj, "username");
//  true (Perfectly safe)

// 2. Property Overriding
// If an object happens to have a property actually named "hasOwnProperty", it overrides the native method:

const maliciousObj = {
	hasOwnProperty: function () {
		return false;
	},
	secret: "hidden",
};

console.log(maliciousObj.hasOwnProperty("secret")); // false ❌ (Fooled by the overridden method)

console.log(Object.prototype.hasOwnProperty.call(maliciousObj, "secret")); // true (Always accurate)
