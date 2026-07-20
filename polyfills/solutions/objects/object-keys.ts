// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does static Object.keys do?
// A: It returns an array of a given object's own enumerable string-keyed property names.
// Edge cases to remember:
// 1. Throw a TypeError if the input object is null or undefined (cannot be converted to object).
// 2. Primitives (numbers, booleans, symbols) should be coerced to objects in ES6+ behavior,
//    returning an empty array since they don't have own enumerable properties.
// 3. String primitives are coerced to String objects, which have enumerable indexed properties.
//    Thus, Object.keys("foo") must return ['0', '1', '2'].
// 4. Inherited properties from the prototype chain (via Object.create or inheritance) must be skipped.
// 5. Symbol-keyed properties must be ignored.
// 6. Objects with no prototype (e.g. Object.create(null)) do not have hasOwnProperty on their
//    prototype chain. We must call it safely via Object.prototype.hasOwnProperty.call(obj, key).

interface ObjectConstructor {
	myKeys(o: unknown): string[];
}

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================
function myKeysPolyfill(obj: unknown): string[] {
	if (obj === null || obj === undefined) {
		throw new TypeError(
			"Object.myKeys: Cannot convert undefined or null to object",
		);
	}

	const result: string[] = [];
	const O = Object(obj);

	for (const key in O) {
		if (Object.prototype.hasOwnProperty.call(O, key)) {
			result.push(key);
		}
	}

	return result;
}

(Object as any).myKeys = myKeysPolyfill;

if (!Object.keys) {
	Object.keys = myKeysPolyfill;
}

// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================

// Test 1: Standard object keys
const testObj = { a: 1, b: 2, c: 3 };
console.log("Test 1 - standard object:", Object.myKeys(testObj));
// Expected: ['a', 'b', 'c']

// Test 2: Object with inherited properties
const proto = { inheritedProp: "yes" };
const child = Object.create(proto);
child.ownProp = "no";
console.log("Test 2 - ignores inherited properties:", Object.myKeys(child));
// Expected: ['ownProp']

// Test 3: Object.create(null) (no prototype)
const noProtoObj = Object.create(null);
noProtoObj.a = 100;
console.log("Test 3 - proto-less object:", Object.myKeys(noProtoObj));
// Expected: ['a']

// Test 4: String primitive input (coerced in ES6)
console.log("Test 4 - string input:", Object.myKeys("abc"));
// Expected: ['0', '1', '2']

// Test 5: Number / Boolean primitive inputs (coerced, empty array)
console.log("Test 5a - number input:", Object.myKeys(123));
// Expected: []
console.log("Test 5b - boolean input:", Object.myKeys(true));
// Expected: []

// Test 6: Symbol-keyed properties (ignored)
const sym = Symbol("secret");
const symObj = { [sym]: "shh", visible: "hello" };
console.log("Test 6 - ignores symbol keys:", Object.myKeys(symObj));
// Expected: ['visible']

// Test 7: Null / Undefined input (throws TypeError)
try {
	Object.myKeys(null);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log(
		"Test 7 - null input throws TypeError:",
		error instanceof TypeError,
		message,
	);
}
// Expected: true, "Object.myKeys: Cannot convert undefined or null to object"
