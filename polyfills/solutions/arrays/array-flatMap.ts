// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does Array.prototype.flatMap do?
// A: It maps each element using a mapping function, then flattens the result by one level (depth 1).
// Edge cases to remember:
// 1. Throw a TypeError if called on null or undefined.
// 2. Throw a TypeError if callback is not a function.
// 3. Skip sparse holes in the original source array (do not call callback).
// 4. Skip sparse holes in the mapped arrays returned by the callback (no undefined in result).
// 5. Keep non-array values returned by the callback as-is.
// 6. Pass value, index, and original array to the callback, and support thisArg.

interface Array<T> {
	myFlatMap<U, TThis = undefined>(
		callback: (this: TThis, value: T, index: number, array: T[]) => U | readonly U[],
		thisArg?: TThis,
	): U[];
}

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================
function myFlatMapPolyfill<T, U, TThis = undefined>(
	this: T[],
	callback: (this: TThis, value: T, index: number, array: T[]) => U | readonly U[],
	thisArg?: TThis,
): U[] {
	if (this == null) {
		throw new TypeError("Array.prototype.myFlatMap called on null or undefined");
	}

	if (typeof callback !== "function") {
		throw new TypeError(`${callback} is not a function`);
	}

	const source = Object(this) as T[];
	const length = source.length >>> 0;
	const result: U[] = [];

	for (let index = 0; index < length; index += 1) {
		if (index in source) {
			const mappedValue = callback.call(thisArg, source[index], index, source);

			if (Array.isArray(mappedValue)) {
				// Flatten by one level. Skip sparse holes in the mapped array.
				for (let j = 0; j < mappedValue.length; j += 1) {
					if (j in mappedValue) {
						result.push(mappedValue[j]);
					}
				}
			} else {
				result.push(mappedValue as U);
			}
		}
	}

	return result;
}

Array.prototype.myFlatMap = myFlatMapPolyfill;

if (!Array.prototype.flatMap) {
	Array.prototype.flatMap = myFlatMapPolyfill as any;
}


// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================

// Test 1: Standard mapping and flattening
const doubled = [1, 2, 3].myFlatMap((x) => [x, x * 2]);
console.log("Test 1 - maps and flattens standard array:", doubled);
// Expected: [1, 2, 2, 4, 3, 6]

// Test 2: Non-array mapped values
const asIs = [1, 2, 3].myFlatMap((x) => x);
console.log("Test 2 - non-array mapped values:", asIs);
// Expected: [1, 2, 3]

// Test 3: Mix of array and non-array values
const mixed = [1, 2, 3].myFlatMap((x) => (x === 2 ? [20, 200] : x));
console.log("Test 3 - mix of array and non-array values:", mixed);
// Expected: [1, 20, 200, 3]

// Test 4: Skipping sparse holes in the source array
const sparseSource = [1, , 3] as unknown[];
const sparseSourceResult = sparseSource.myFlatMap((x) => [x, x]);
console.log("Test 4 - skips sparse holes in source:", sparseSourceResult);
// Expected: [1, 1, 3, 3]

// Test 5: Skipping sparse holes in the mapped arrays
const sparseMapped = [1, 2].myFlatMap((x) => [x, , x * 10]);
console.log("Test 5 - skips sparse holes in mapped arrays:", sparseMapped);
// Expected: [1, 10, 2, 20]

// Test 6: Supports thisArg context
const contextObj = { multiplier: 5 };
const withContext = [1, 2].myFlatMap(function (x) {
	return [x * this.multiplier];
}, contextObj);
console.log("Test 6 - supports thisArg context:", withContext);
// Expected: [5, 10]

// Test 7: Throw TypeError on null/undefined call
try {
	Array.prototype.myFlatMap.call(null, (x) => x);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log("Test 7 - invalid input:", error instanceof TypeError, message);
}
// Expected: true, "Array.prototype.myFlatMap called on null or undefined"

// Test 8: Throw TypeError on invalid callback
try {
	[1, 2].myFlatMap(null as any);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log(
		"Test 8 - invalid callback:",
		error instanceof TypeError,
		message,
	);
}
// Expected: true, "null is not a function"
