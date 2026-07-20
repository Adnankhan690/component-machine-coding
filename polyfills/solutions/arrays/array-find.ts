// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does array find do?
// A: It returns the first element that matches a condition.
// Edge cases to remember:
// - Returns undefined if no element matches.
// - Stops as soon as a match is found.
// - Passes value, index, and source array to the callback.
// - Supports an optional thisArg for callback context.
// - Throws if the callback is not a function.
// - Sparse array holes should not produce matches.

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================
interface Array<T> {
  myFind<TThis = undefined>(
    callback: (this: TThis, value: T, index: number, array: T[]) => boolean,
    thisArg?: TThis,
  ): T | undefined;
}

function myFindPolyfill<T, TThis = undefined>(
  this: T[],
  callback: (this: TThis, value: T, index: number, array: T[]) => boolean,
  thisArg?: TThis,
): T | undefined {
  if (this == null) {
    throw new TypeError("Array.prototype.myFind called on null or undefined");
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

    const value = source[index];

    if (callback.call(thisArg as TThis, value, index, source)) {
      return value;
    }
  }

  return undefined;
}

Array.prototype.myFind = myFindPolyfill;

if (!Array.prototype.find) {
  Array.prototype.find = myFindPolyfill;
}


// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================
const numbers = [3, 7, 10, 14];
const firstEven = numbers.myFind((value) => value % 2 === 0);
console.log("Test 1 - finds first match:", firstEven);
// Expected: 10

const greaterThanTen = numbers.myFind((value) => value > 10);
console.log("Test 2 - stops at first valid result:", greaterThanTen);
// Expected: 14

const missingValue = numbers.myFind((value) => value > 20);
console.log("Test 3 - returns undefined when missing:", missingValue);
// Expected: undefined

const indexes: number[] = [];
numbers.myFind((_, index) => {
	indexes.push(index);
	return false;
});
console.log("Test 4 - receives index:", indexes);
// Expected: [0, 1, 2, 3]

const context = { min: 9 };
const withThisArg = numbers.myFind(function (value) {
	return value >= this.min;
}, context);
console.log("Test 5 - supports thisArg:", withThisArg);
// Expected: 10

const sparse = [1, , 5] as number[];
const sparseVisited: number[] = [];
const sparseResult = sparse.myFind((value, index) => {
	sparseVisited.push(index);
	return value === 5;
});
console.log("Test 6 - skips sparse holes:", sparseResult, sparseVisited);
// Expected: 5 [0, 2]

try {
	Array.prototype.myFind.call(null, () => true);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log("Test 7 - invalid input:", error instanceof TypeError, message);
}
// Expected: true, "Array.prototype.myFind called on null or undefined"

try {
	[1, 2].myFind(null as unknown as (value: number) => boolean);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log(
		"Test 8 - invalid callback:",
		error instanceof TypeError,
		message,
	);
}
// Expected: true, "null is not a function"
