// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does static Object.values do?
// A: It returns an array of a given object's own enumerable string-keyed property values.
// Edge cases to remember:
// 1. Throw a TypeError if the input object is null or undefined (cannot be converted to object).
// 2. Primitives (numbers, booleans, symbols) should be coerced to objects in ES6+ behavior,
//    returning an empty array since they don't have own enumerable properties.
// 3. String primitives are coerced to String objects, which have enumerable indexed properties.
//    Thus, Object.values("foo") must return ['f', 'o', 'o'].
// 4. Inherited properties from the prototype chain (via Object.create or inheritance) must be skipped.
// 5. Symbol-keyed properties must be ignored.
// 6. Objects with no prototype (e.g. Object.create(null)) do not have hasOwnProperty on their
//    prototype chain. We must call it safely via Object.prototype.hasOwnProperty.call(obj, key).

interface ObjectConstructor {
	myValues(o: unknown): any[];
}

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================
function myValuesPolyfill(obj: unknown): any[] {
	if (obj === null || obj === undefined) {
		throw new TypeError(
			"Object.myValues: Cannot convert undefined or null to object",
		);
	}

	const result: any[] = [];
	const O = Object(obj);

	for (const key in O) {
		if (Object.prototype.hasOwnProperty.call(O, key)) {
			result.push((O as any)[key]);
		}
	}

	return result;
}

(Object as any).myValues = myValuesPolyfill;

if (!Object.values) {
	Object.values = myValuesPolyfill;
}


// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================

// Test 1: Standard object values
const testObj = { a: 1, b: 2, c: 3 };
console.log("Test 1 - standard object:", Object.myValues(testObj));
// Expected: [1, 2, 3]

// Test 2: Object with inherited properties
const proto = { inheritedProp: "yes" };
const child = Object.create(proto);
child.ownProp = "no";
console.log("Test 2 - ignores inherited properties:", Object.myValues(child));
// Expected: ['no']

// Test 3: Object.create(null) (no prototype)
const noProtoObj = Object.create(null);
noProtoObj.a = 100;
console.log("Test 3 - proto-less object:", Object.myValues(noProtoObj));
// Expected: [100]

// Test 4: String primitive input (coerced in ES6)
console.log("Test 4 - string input:", Object.myValues("abc"));
// Expected: ['a', 'b', 'c']

// Test 5: Number / Boolean primitive inputs (coerced, empty array)
console.log("Test 5a - number input:", Object.myValues(123));
// Expected: []
console.log("Test 5b - boolean input:", Object.myValues(true));
// Expected: []

// Test 6: Symbol-keyed properties (ignored)
const sym = Symbol("secret");
const symObj = { [sym]: "shh", visible: "hello" };
console.log("Test 6 - ignores symbol keys:", Object.myValues(symObj));
// Expected: ['hello']

// Test 7: Null / Undefined input (throws TypeError)
try {
	Object.myValues(null);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log(
		"Test 7 - null input throws TypeError:",
		error instanceof TypeError,
		message,
	);
}
// Expected: true, "Object.myValues: Cannot convert undefined or null to object"
