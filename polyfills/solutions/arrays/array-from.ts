// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does static Array.from do?
// A: It creates a new, shallow-copied Array instance from an iterable or array-like object.
// Edge cases to remember:
// 1. Throw a TypeError if the input object is null or undefined.
// 2. Throw a TypeError if mapFn is provided but is not a function.
// 3. Support iterables (objects implementing Symbol.iterator, like Set, Map, String, generators)
//    and array-like objects (objects with a length property).
// 4. Sparse array holes are NOT skipped; instead, they are preserved as undefined values.
// 5. Support an optional mapFn to transform elements during creation, passing (value, index) to it.
// 6. Support an optional thisArg parameter to bind the context of mapFn.

interface ArrayConstructor {
	myFrom<T, U = T>(
		arrayLike: ArrayLike<T> | Iterable<T>,
		mapFn?: (value: T, index: number) => U,
		thisArg?: any,
	): U[];
}

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================
function myFromPolyfill<T, U = T>(
	arrayLike: ArrayLike<T> | Iterable<T>,
	mapFn?: (value: T, index: number) => U,
	thisArg?: any,
): U[] {
	if (arrayLike == null) {
		throw new TypeError("Array.myFrom: arrayLike cannot be null or undefined");
	}

	const mapping = mapFn !== undefined;
	if (mapping && typeof mapFn !== "function") {
		throw new TypeError("Array.myFrom: mapFn must be a function");
	}

	const result: U[] = [];
	let index = 0;

	// Check if the object is iterable
	const isIterable =
		typeof Symbol !== "undefined" &&
		Symbol.iterator &&
		typeof (arrayLike as any)[Symbol.iterator] === "function";

	if (isIterable) {
		const iterator = (arrayLike as any)[Symbol.iterator]();
		let next = iterator.next();
		while (!next.done) {
			const value = next.value;
			const mappedValue = mapping
				? mapFn.call(thisArg, value, index)
				: (value as unknown as U);
			result.push(mappedValue);
			index += 1;
			next = iterator.next();
		}
	} else {
		// Treat as array-like
		const source = Object(arrayLike) as ArrayLike<T>;
		const length = source.length >>> 0;
		for (; index < length; index += 1) {
			const value = source[index];
			const mappedValue = mapping
				? mapFn.call(thisArg, value, index)
				: (value as unknown as U);
			result.push(mappedValue);
		}
	}

	return result;
}

(Array as any).myFrom = myFromPolyfill;

if (!Array.from) {
	Array.from = myFromPolyfill as any;
}


// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================

// Test 1: Convert an array-like object with length and indexed elements
const arrayLike = { length: 3, 0: "a", 1: "b", 2: "c" };
console.log("Test 1 - array-like conversion:", Array.myFrom(arrayLike));
// Expected: ['a', 'b', 'c']

// Test 2: Convert an iterable (Set)
const set = new Set([1, 2, 3, 2, 1]);
console.log("Test 2 - iterable Set conversion:", Array.myFrom(set));
// Expected: [1, 2, 3]

// Test 3: String mapping (iterable string with mapFn)
const stringMap = Array.myFrom("123", (x) => Number(x) * 2);
console.log("Test 3 - string mapping:", stringMap);
// Expected: [2, 4, 6]

// Test 4: Preserves sparse array holes as undefined values
const sparseSource = [1, , 3] as unknown[];
const sparseResult = Array.myFrom(sparseSource);
console.log(
	"Test 4 - sparse holes preserved:",
	sparseResult,
	1 in sparseResult,
);
// Expected: [1, undefined, 3] true

// Test 5: Supports thisArg context mapping
const contextObj = { multiplier: 3 };
const withContext = Array.myFrom(
	[1, 2, 3],
	function (x) {
		return x * this.multiplier;
	},
	contextObj,
);
console.log("Test 5 - supports thisArg context:", withContext);
// Expected: [3, 6, 9]

// Test 6: Non-iterable non-array-like input (returns empty array)
console.log(
	"Test 6a - returns empty array for number:",
	Array.myFrom(42 as any),
);
console.log(
	"Test 6b - returns empty array for boolean:",
	Array.myFrom(true as any),
);
// Expected: [] []

// Test 7: Throw TypeError for null or undefined input
try {
	Array.myFrom(null as any);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log(
		"Test 7 - null input throws TypeError:",
		error instanceof TypeError,
		message,
	);
}
// Expected: true, "Array.myFrom: arrayLike cannot be null or undefined"

// Test 8: Throw TypeError for invalid mapFn
try {
	Array.myFrom([1, 2], "not a function" as any);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log(
		"Test 8 - invalid mapFn throws TypeError:",
		error instanceof TypeError,
		message,
	);
}
// Expected: true, "Array.myFrom: mapFn must be a function"

// ==========================================
// NOTE: typeof behavior on undefined values
// ==========================================
// The `typeof` operator is completely safe and will never throw an error when checked against `undefined`.
// It simply evaluates to the string "undefined".
//
// The error was thrown because the condition `typeof mapFn !== 'function'` evaluated to `true`,
// which explicitly triggered the `throw` statement inside the `if` block.

typeof undefined; // Evaluates to the string "undefined" (does not throw)

// When mapFn is undefined:
if (typeof mapFn !== "function") {
	// "undefined" !== "function" is true
	throw new TypeError(`${mapFn} is not a function`); // <-- This line threw the error!
}
