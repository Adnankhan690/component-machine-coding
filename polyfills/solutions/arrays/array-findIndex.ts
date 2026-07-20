// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does array findIndex do?
// A: It returns the index of the first element that matches a condition.
// Edge cases to remember:
// - Returns -1 if no element matches.
// - Stops as soon as a match is found.
// - Passes value, index, and source array to the callback.
// - Supports an optional thisArg for callback context.
// - Throws if the callback is not a function.
// - Sparse array holes should not produce matches.

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================
interface Array<T> {
  myFindIndex<TThis = undefined>(
    callback: (this: TThis, value: T, index: number, array: T[]) => boolean,
    thisArg?: TThis,
  ): number;
}

function myFindIndexPolyfill<T, TThis = undefined>(
  this: T[],
  callback: (this: TThis, value: T, index: number, array: T[]) => boolean,
  thisArg?: TThis,
): number {
  if (this == null) {
    throw new TypeError(
      "Array.prototype.myFindIndex called on null or undefined",
    );
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
      return index;
    }
  }

  return -1;
}

Array.prototype.myFindIndex = myFindIndexPolyfill;

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = myFindIndexPolyfill;
}


// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================
const numbers = [3, 7, 10, 14];
const firstEvenIndex = numbers.myFindIndex((value) => value % 2 === 0);
console.log("Test 1 - finds first matching index:", firstEvenIndex);
// Expected: 2

const greaterThanTenIndex = numbers.myFindIndex((value) => value > 10);
console.log("Test 2 - stops at first valid result:", greaterThanTenIndex);
// Expected: 3

const missingIndex = numbers.myFindIndex((value) => value > 20);
console.log("Test 3 - returns -1 when missing:", missingIndex);
// Expected: -1

const indexes: number[] = [];
numbers.myFindIndex((_, index) => {
	indexes.push(index);
	return false;
});
console.log("Test 4 - receives index:", indexes);
// Expected: [0, 1, 2, 3]

const context = { min: 9 };
const withThisArg = numbers.myFindIndex(function (value) {
	return value >= this.min;
}, context);
console.log("Test 5 - supports thisArg:", withThisArg);
// Expected: 2

const sparse = [1, , 5] as number[];
const sparseVisited: number[] = [];
const sparseResult = sparse.myFindIndex((value, index) => {
	sparseVisited.push(index);
	return value === 5;
});
console.log("Test 6 - skips sparse holes:", sparseResult, sparseVisited);
// Expected: 2 [0, 2]

try {
	Array.prototype.myFindIndex.call(null, () => true);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log("Test 7 - invalid input:", error instanceof TypeError, message);
}
// Expected: true, "Array.prototype.myFindIndex called on null or undefined"

try {
	[1, 2].myFindIndex(null as unknown as (value: number) => boolean);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log(
		"Test 8 - invalid callback:",
		error instanceof TypeError,
		message,
	);
}
// Expected: true, "null is not a function"
