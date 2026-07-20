// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does array filter do?
// A: It creates a new array containing only the elements for which the callback returns a truthy value.
// Edge cases to remember:
// - Skips empty slots in sparse arrays.
// - Preserves the original order of matching elements.
// - Does not mutate the source array.
// - Passes value, index, and source array to the callback.
// - Supports an optional thisArg for callback context.
// - Throws if the callback is not a function.

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================

// interface Array<T> {
//   myFilter(
//     callback: (value: T, index: number, array: T[]) => boolean,
//     thisArg?: unknown,
//   ): T[];
// }

// function myFilterPolyfill<T>(
//   this: T[],
//   callback: (value: T, index: number, array: T[]) => boolean,
//   thisArg?: unknown,
// ): T[] {
//   if (typeof callback !== "function") {
//     throw new TypeError("callback must be a function");
//   }

//   const result: T[] = [];

//   for (let index = 0; index < this.length; index += 1) {
//     if (!(index in this)) {
//       continue;
//     }

//     const value = this[index];

//     if (callback.call(thisArg, value, index, this)) {
//       result.push(value);
//     }
//   }

//   return result;
// }

// Array.prototype.myFilter = myFilterPolyfill;
// if (!Array.prototype.filter) {
//   Array.prototype.filter = myFilterPolyfill;
// }

interface Array<T> {
	myFilter<TThis = undefined>(
		callback: (this: TThis, value: T, index: number, array: T[]) => boolean,
		thisArg?: TThis,
	): T[];
}

function myFilter<T, TThis = undefined>(
	this: T[],
	callback: (this: TThis, value: T, index: number, array: T[]) => boolean,
	thisArg: TThis,
): T[] {
	if (this == null) {
		throw new TypeError("Array.prototype.myMap called upon null or undefined");
	}

	if (typeof callback !== "function") {
		throw new TypeError(`${callback} is not a function`);
	}

	const source = Object(this);
	const length = source.length >>> 0;
	const result: T[] = [];

	for (let i = 0; i < length; i += 1) {
		if (i in source && callback.call(thisArg, source[i], i, source)) {
			result.push(source[i]);
		}
	}

	return result;
}

Array.prototype.myFilter = myFilter;

// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================
// Write a tiny, runnable log script so you can test it instantly.
const numbers = [1, 2, 3, 4, 5];
const evenNumbers = numbers.myFilter((value) => value % 2 === 0);
console.log("Even numbers:", evenNumbers); // [2, 4]

const greaterThanTwo = numbers.myFilter((value) => value > 2);
console.log("Greater than 2:", greaterThanTwo); // [3, 4, 5]

const originalArray = [10, 20, 30];
const filteredArray = originalArray.myFilter((value) => value >= 20);
console.log("Original unchanged:", originalArray); // [10, 20, 30]
console.log("Filtered result:", filteredArray); // [20, 30]

const callbackArgsCheck = numbers.myFilter((value, index, array) => {
	return value === array[index];
});
console.log("Callback receives value/index/array:", callbackArgsCheck); // [1, 2, 3, 4, 5]

const context = { min: 3 };
const withThisArg = numbers.myFilter(function (value) {
	return value >= (this as { min: number }).min;
}, context);
console.log("With thisArg:", withThisArg); // [3, 4, 5]

const sparse = [1, , 3, , 5] as number[];
const sparseVisited: number[] = [];
const sparseResult = sparse.myFilter((value, index) => {
	sparseVisited.push(index);
	return value > 1;
});
console.log("Sparse result:", sparseResult); // [3, 5]
console.log("Sparse visited indexes:", sparseVisited); // [0, 2, 4]

const noMatches = numbers.myFilter((value) => value > 10);
console.log("No matches:", noMatches); // []

try {
	numbers.myFilter(
		null as unknown as (
			value: number,
			index: number,
			array: number[],
		) => boolean,
	);
} catch (error) {
	console.log("Invalid callback error:", error instanceof TypeError); // true
}

// ==========================================
// 4. QUESTION: WHAT IS thisArg?
// ==========================================
// Q: What is thisArg in myFilter/filter if the function already has `this: T[]`?
// A: `this: T[]` and `thisArg` serve different purposes.
//
// - `this: T[]` is the array on which `myFilter` is called. It is the method receiver.
// - `thisArg` is the value used as `this` inside the callback when the callback is invoked with `callback.call(thisArg, ...)`.
//
// So there are two different contexts involved:
// - `this` of `myFilterPolyfill` -> the source array
// - `thisArg` for the callback -> the object you want the callback to use as `this`
//
// Native `Array.prototype.filter` supports `thisArg` for the same reason.
// It is mainly useful when the callback is a normal function.
// Arrow functions ignore `thisArg` because they do not bind their own `this`.
//
// Example:
const thresholdContext = { min: 4 };
const filteredWithContext = [2, 4, 6, 8].myFilter(function (value) {
	return value >= (this as { min: number }).min;
}, thresholdContext);
console.log("thisArg example:", filteredWithContext); // [4, 6, 8]
