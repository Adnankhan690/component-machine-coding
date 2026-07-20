// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does array every do?
// A: It checks whether all elements match a condition.
// Edge cases to remember:
// - Returns false as soon as one element fails the condition.
// - Returns true if every existing element passes.
// - Returns true for an empty array.
// - Stops early after the first failed check.
// - Passes value, index, and source array to the callback.
// - Supports an optional thisArg for callback context.
// - Throws if the callback is not a function.
// - Sparse array holes should be skipped.

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================
interface Array<T> {
  myEvery<TThis = undefined>(
    callback: (this: TThis, value: T, index: number, array: T[]) => boolean,
    thisArg?: TThis,
  ): boolean;
}

function myEveryPolyfill<T, TThis = undefined>(
  this: T[],
  callback: (this: TThis, value: T, index: number, array: T[]) => boolean,
  thisArg?: TThis,
): boolean {
  if (this == null) {
    throw new TypeError("Array.prototype.myEvery called on null or undefined");
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

    if (!callback.call(thisArg as TThis, source[index], index, source)) {
      return false;
    }
  }

  return true;
}

Array.prototype.myEvery = myEveryPolyfill;

if (!Array.prototype.every) {
  Array.prototype.every = myEveryPolyfill;
}


// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================
const numbers = [3, 7, 10, 14];
const allPositive = numbers.myEvery((value) => value > 0);
console.log("Test 1 - returns true when all match:", allPositive);
// Expected: true

const allEven = numbers.myEvery((value) => value % 2 === 0);
console.log("Test 2 - returns false when one fails:", allEven);
// Expected: false

const visitedUntilFailure: number[] = [];
const stopsEarly = numbers.myEvery((value, index) => {
	visitedUntilFailure.push(index);
	return value < 10;
});
console.log(
	"Test 3 - stops early after first failure:",
	stopsEarly,
	visitedUntilFailure,
);
// Expected: false [0, 1, 2]

const indexes: number[] = [];
numbers.myEvery((_, index) => {
	indexes.push(index);
	return true;
});
console.log("Test 4 - receives index:", indexes);
// Expected: [0, 1, 2, 3]

const context = { min: 3 };
const withThisArg = numbers.myEvery(function (value) {
	return value >= this.min;
}, context);
console.log("Test 5 - supports thisArg:", withThisArg);
// Expected: true

const empty: number[] = [];
const emptyResult = empty.myEvery(() => false);
console.log("Test 6 - empty array returns true:", emptyResult);
// Expected: true

const sparse = [1, , 5] as number[];
const sparseVisited: number[] = [];
const sparseResult = sparse.myEvery((value, index) => {
	sparseVisited.push(index);
	return value > 0;
});
console.log("Test 7 - skips sparse holes:", sparseResult, sparseVisited);
// Expected: true [0, 2]

try {
	Array.prototype.myEvery.call(null, () => true);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log("Test 8 - invalid input:", error instanceof TypeError, message);
}
// Expected: true, "Array.prototype.myEvery called on null or undefined"

try {
	[1, 2].myEvery(null as unknown as (value: number) => boolean);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log(
		"Test 9 - invalid callback:",
		error instanceof TypeError,
		message,
	);
}
// Expected: true, "null is not a function"