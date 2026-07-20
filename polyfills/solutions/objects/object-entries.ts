// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does static Object.entries do?
// A: It returns an array of a given object's own enumerable string-keyed property [key, value] pairs.
// Edge cases to remember:
// 1. Throw a TypeError if the input object is null or undefined (cannot be converted to object).
// 2. Primitives (numbers, booleans, symbols) should be coerced to objects in ES6+ behavior,
//    returning an empty array since they don't have own enumerable properties.
// 3. String primitives are coerced to String objects, which have enumerable indexed properties.
//    Thus, Object.entries("foo") must return [['0', 'f'], ['1', 'o'], ['2', 'o']].
// 4. Inherited properties from the prototype chain (via Object.create or inheritance) must be skipped.
// 5. Symbol-keyed properties must be ignored.
// 6. Objects with no prototype (e.g. Object.create(null)) do not have hasOwnProperty on their
//    prototype chain. We must call it safely via Object.prototype.hasOwnProperty.call(obj, key).

interface ObjectConstructor {
	myEntries(o: unknown): [string, any][];
}

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================
function myEntriesPolyfill(obj: unknown): [string, any][] {
	if (obj === null || obj === undefined) {
		throw new TypeError(
			"Object.myEntries: Cannot convert undefined or null to object",
		);
	}

	const result: [string, any][] = [];
	const O = Object(obj);

	for (const key in O) {
		if (Object.prototype.hasOwnProperty.call(O, key)) {
			result.push([key, (O as any)[key]]);
		}
	}

	return result;
}

(Object as any).myEntries = myEntriesPolyfill;

if (!Object.entries) {
	Object.entries = myEntriesPolyfill;
}


// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================

// Test 1: Standard object entries
const testObj = { a: 1, b: 2, c: 3 };
console.log("Test 1 - standard object:", Object.myEntries(testObj));
// Expected: [['a', 1], ['b', 2], ['c', 3]]

// Test 2: Object with inherited properties
const proto = { inheritedProp: "yes" };
const child = Object.create(proto);
child.ownProp = "no";
console.log("Test 2 - ignores inherited properties:", Object.myEntries(child));
// Expected: [['ownProp', 'no']]

// Test 3: Object.create(null) (no prototype)
const noProtoObj = Object.create(null);
noProtoObj.a = 100;
console.log("Test 3 - proto-less object:", Object.myEntries(noProtoObj));
// Expected: [['a', 100]]

// Test 4: String primitive input (coerced in ES6)
console.log("Test 4 - string input:", Object.myEntries("abc"));
// Expected: [['0', 'a'], ['1', 'b'], ['2', 'c']]

// Test 5: Number / Boolean primitive inputs (coerced, empty array)
console.log("Test 5a - number input:", Object.myEntries(123));
// Expected: []
console.log("Test 5b - boolean input:", Object.myEntries(true));
// Expected: []

// Test 6: Symbol-keyed properties (ignored)
const sym = Symbol("secret");
const symObj = { [sym]: "shh", visible: "hello" };
console.log("Test 6 - ignores symbol keys:", Object.myEntries(symObj));
// Expected: [['visible', 'hello']]

// Test 7: Null / Undefined input (throws TypeError)
try {
	Object.myEntries(null);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log(
		"Test 7 - null input throws TypeError:",
		error instanceof TypeError,
		message,
	);
}
// Expected: true, "Object.myEntries: Cannot convert undefined or null to object"
