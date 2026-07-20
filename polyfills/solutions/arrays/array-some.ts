// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does array some do?
// A: It checks whether at least one element matches a condition.
// Edge cases to remember:
// - Returns true as soon as one element matches.
// - Returns false if no element matches.
// - Stops early after the first successful match.
// - Passes value, index, and source array to the callback.
// - Supports an optional thisArg for callback context.
// - Throws if the callback is not a function.
// - Sparse array holes should be skipped.

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================
interface Array<T> {
	mySome<TThis = undefined>(
		callback: (this: TThis, value: T, index: number, array: T[]) => boolean,
		thisArg?: TThis,
	): boolean;
}

function mySomePolyfill<T, TThis = undefined>(
	this: T[],
	callback: (this: TThis, value: T, index: number, array: T[]) => boolean,
	thisArg?: TThis,
): boolean {
	if (this == null) {
		throw new TypeError("Array.prototype.mySome called on null or undefined");
	}

	if (typeof callback !== "function") {
		throw new TypeError(`${callback} is not a function`);
	}

	const source = Object(this) as T[];
	const length = source.length >>> 0;

	for (let index = 0; index < length; index += 1) {
		if (!(index in source)) {
			continue;
		}

		if (callback.call(thisArg as TThis, source[index], index, source)) {
			return true;
		}
	}

	return false;
}

Array.prototype.mySome = mySomePolyfill;

if (!Array.prototype.some) {
	Array.prototype.some = mySomePolyfill;
}


// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================
const numbers = [3, 7, 10, 14];
const hasEven = numbers.mySome((value) => value % 2 === 0);
console.log("Test 1 - returns true when match exists:", hasEven);
// Expected: true

const hasNegative = numbers.mySome((value) => value < 0);
console.log("Test 2 - returns false when no match exists:", hasNegative);
// Expected: false

const visitedUntilMatch: number[] = [];
const stopsEarly = numbers.mySome((value, index) => {
	visitedUntilMatch.push(index);
	return value > 8;
});
console.log(
	"Test 3 - stops early after first match:",
	stopsEarly,
	visitedUntilMatch,
);
// Expected: true [0, 1, 2]

const indexes: number[] = [];
numbers.mySome((_, index) => {
	indexes.push(index);
	return false;
});
console.log("Test 4 - receives index:", indexes);
// Expected: [0, 1, 2, 3]

const context = { min: 12 };
const withThisArg = numbers.mySome(function (value) {
	return value >= this.min;
}, context);
console.log("Test 5 - supports thisArg:", withThisArg);
// Expected: true

const sparse = [1, , 5] as number[];
const sparseVisited: number[] = [];
const sparseResult = sparse.mySome((value, index) => {
	sparseVisited.push(index);
	return value === 5;
});
console.log("Test 6 - skips sparse holes:", sparseResult, sparseVisited);
// Expected: true [0, 2]

try {
	Array.prototype.mySome.call(null, () => true);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log("Test 7 - invalid input:", error instanceof TypeError, message);
}
// Expected: true, "Array.prototype.mySome called on null or undefined"

try {
	[1, 2].mySome(null as unknown as (value: number) => boolean);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log(
		"Test 8 - invalid callback:",
		error instanceof TypeError,
		message,
	);
}
// Expected: true, "null is not a function"
