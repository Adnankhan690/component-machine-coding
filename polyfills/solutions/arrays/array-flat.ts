// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does array flat do?
// A: It creates a new array with nested arrays flattened up to a given depth.
// Edge cases to remember:
// - Default depth is 1.
// - Depth 0 should return a shallow copy.
// - Infinity should flatten all nested levels.
// - Sparse array holes should be skipped.
// - It should not mutate the source array.
// - Non-array values should be copied as-is.

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================
// interface Array<T> {
//   myFlat<U = T>(depth?: number): U[];
// }

// function myFlatPolyfill<T>(this: T[], depth = 1): unknown[] {
//   if (this == null) {
//     throw new TypeError("Array.prototype.myFlat called on null or undefined");
//   }

//   const source = Object(this) as unknown[];
//   const normalizedDepth =
//     depth === Number.POSITIVE_INFINITY
//       ? Number.POSITIVE_INFINITY
//       : Math.max(0, Math.floor(Number(depth) || 0));

//   const flatten = (input: unknown[], currentDepth: number): unknown[] => {
//     const result: unknown[] = [];

//     for (let index = 0; index < input.length; index += 1) {
//       if (!(index in input)) {
//         continue;
//       }

//       const value = input[index];

//       if (Array.isArray(value) && currentDepth > 0) {
//         result.push(...flatten(value, currentDepth - 1));
//         continue;
//       }

//       result.push(value);
//     }

//     return result;
//   };

//   return flatten(source, normalizedDepth);
// }

// Array.prototype.myFlat = myFlatPolyfill;

// if (!Array.prototype.flat) {
//   Array.prototype.flat = myFlatPolyfill;
// }

interface Array<T> {
	myFlat<U = T>(this: T[], depth?: number): U[];
}

function myFlat<T>(this: T[], depth = 1) {
	if (this === undefined || this === null) {
		throw new TypeError("Invalid input");
	}

	const normalizedDepth = Math.max(0, Math.floor(Number(depth) || 0));

	if (normalizedDepth === 0) {
		return this.slice();
	}

	const source = Object(this);
	let result = [] as T[];

	for (let i = 0; i < source.length; i++) {
		if (!(i in source)) {
			continue;
		}
		const value = source[i];
		// if (Array.isArray(value) && normalizedDepth > 0) {
		// 	result = [...result, ...myFlat.call(value, normalizedDepth - 1)] as T[];
		// } else {
		// 	result.push(value);
		// }
		if (Array.isArray(value) && normalizedDepth > 0) {
			const flatValue = myFlat.call(value, normalizedDepth - 1);
			//handles TEST-5
			flatValue.forEach((item) => {
				result.push(item as T);
			});
		} else {
			result.push(value);
		}

	}

	return result;
}

Array.prototype.myFlat = myFlat;

// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================
const oneLevel = [1, [2, 3], 4].myFlat();
console.log("Test 1 - default depth 1:", oneLevel);
// Expected: [1, 2, 3, 4]

const twoLevels = [1, [2, [3, 4]], 5].myFlat(2);
console.log("Test 2 - flattens to custom depth:", twoLevels);
// Expected: [1, 2, 3, 4, 5]

const zeroDepth = [1, [2, 3], 4].myFlat(0);
console.log("Test 3 - depth 0 returns shallow copy:", zeroDepth);
// Expected: [1, [2, 3], 4]

const deeplyNested = [1, [2, [3, [4]]]].myFlat(Infinity);
console.log("Test 4 - Infinity flattens all levels:", deeplyNested);
// Expected: [1, 2, 3, 4]

const sparse = [1, , [3, , 5]] as unknown[];
const sparseResult = sparse.myFlat();
console.log("Test 5 - skips sparse holes:", sparseResult);
// Expected: [1, 3, 5]

const mixedValues = [1, ["a"], { id: 1 }, [[true]]].myFlat(2);
console.log("Test 6 - keeps non-array values:", mixedValues);
// Expected: [1, "a", { id: 1 }, true]

const original = [1, [2, 3]];
const flattened = original.myFlat();
console.log("Test 7 - does not mutate source:", original, flattened);
// Expected: [1, [2, 3]] [1, 2, 3]

try {
	Array.prototype.myFlat.call(null);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log("Test 8 - invalid input:", error instanceof TypeError, message);
}
// Expected: true, "Array.prototype.myFlat called on null or undefined"
