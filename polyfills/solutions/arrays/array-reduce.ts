// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does array reduce do?
// A: It walks through an array and combines its elements into a single final value.
// Edge cases to remember:
// - It can return any type: number, string, object, array, map, etc.
// - The callback receives accumulator, currentValue, index, and source array.
// - If `initialValue` is provided, reduction starts from index 0.
// - If `initialValue` is not provided, the first existing array element becomes the initial accumulator.
// - Sparse array holes are skipped.
// - Calling reduce on an empty array without `initialValue` throws a TypeError.
// - `reduce` does not mutate the source array by itself, but your callback still can.

// ==========================================
// 2. THE FUNCTION SHAPE
// ==========================================
// This file intentionally does NOT implement the polyfill.
// The goal here is to understand the contract before writing logic.

interface Array<T> {
	myReduce<T, U>(
		this: T[],
		callbackFn: (
			accumulator: T | U,
			currentElement: T,
			index: number,
			array: T[],
		) => T | U,
		intialValye: T | U,
	): T | U;
}

function myReducePloyfill<T, U>(
	this: T[],
	callbackFn: (
		accumulator: T | U,
		currentElement: T,
		index: number,
		array: T[],
	) => T | U,
	initialValue: T | U,
): T | U {
	if (typeof callbackFn !== "function") {
		throw new TypeError(`${callbackFn} is not a function`);
	}

	const length = this.length;

	// Check if initialValue argument was actually passed (ignores if it is 0, false, null, etc.)
	const isAccumulatorInitialized = arguments.length > 1;

	//These 2 cases are handled by the else case

	// if (length === 0 && initialValue == null) {
	// 	throw new TypeError("Reduce of empty array with no initial value");
	// }

	// if (length === 1 && initialValue == null) {
	// 	return this[0];
	// }

	let i = 0;
	let accumulator: T | U;

	if (isAccumulatorInitialized) {
		accumulator = initialValue;
	} else {
		// 2. If no initial value, find the FIRST non-empty slot in the array
		while (i < length && !(i in this)) {
			i++;
		}

		// 3. If we reached the end and found no elements, throw TypeError
		if (i >= length) {
			throw new TypeError("Reduce of empty array with no initial value");
		}

		// Initialize accumulator to the first real element found, then move to next index
		accumulator = this[i];
		i++;
	}

	// 4. Run the loop, skipping empty slots (sparse arrays)
	for (; i < length; i++) {
		if (!(i in this)) {
			continue; // Skip holes
		}
		accumulator = callbackFn(accumulator, this[i], i, this);
	}

	return accumulator;
}

Array.prototype.myReduce = myReducePloyfill;
if (!Array.prototype.reduce) {
	Array.prototype.myReduce = myReducePloyfill;
}


// ==========================================
// 3. HOW TO THINK ABOUT IT
// ==========================================
// Q: What is the accumulator?
// A: It is the running result that gets carried from one callback call to the next.
//
// Example mental model:
// - Start with some accumulator value.
// - Visit each element one by one.
// - Return the next accumulator from the callback.
// - The final accumulator becomes the result of reduce.
//
// Example progression:
// [1, 2, 3, 4] with sum and initialValue 0
// - Step 1: acc = 0, current = 1 -> return 1
// - Step 2: acc = 1, current = 2 -> return 3
// - Step 3: acc = 3, current = 3 -> return 6
// - Step 4: acc = 6, current = 4 -> return 10
// Final result: 10

// ==========================================
// 4. QUESTION: WHY DOES initialValue MATTER?
// ==========================================
// Q: Why is `initialValue` so important in reduce?
// A: Because it decides both the starting accumulator and the return type behavior.
//
// Without `initialValue`:
// - The first existing array element becomes the accumulator.
// - Iteration begins from the next existing element.
// - Empty arrays throw.
//
// With `initialValue`:
// - The accumulator starts from your provided value.
// - Iteration begins at index 0.
// - Empty arrays are valid, because the initial value can be returned directly.
//
// This is also why `reduce` often needs overloads in TypeScript:
// - no initialValue -> accumulator usually matches array item type
// - with initialValue -> accumulator can be a completely different type

// ==========================================
// 5. EXAMPLES TO READ, NOT RUN
// ==========================================
// Sum numbers
// const total = [1, 2, 3, 4].myReduce((acc, value) => acc + value, 0);
// total -> 10
//
// Build an object
// const grouped = ["a", "bb", "c"].myReduce<Record<string, number>>((acc, value) => {
//   acc[value] = value.length;
//   return acc;
// }, {});
// grouped -> { a: 1, bb: 2, c: 1 }
//
// Flatten arrays
// const flat = [[1, 2], [3], [4, 5]].myReduce<number[]>((acc, value) => {
//   acc.push(...value);
//   return acc;
// }, []);
// flat -> [1, 2, 3, 4, 5]

// ==========================================
// 6. THE "QUICK-CHECK" TEST SUITE
// ==========================================
// Write a tiny, runnable log script so you can test it instantly.
const numbers = [1, 2, 3, 4];

const total = myReducePloyfill.call(
	numbers,
	(acc, value) => {
		return Number(acc) + value;
	},
	0,
);
console.log("Sum with initialValue:", total); // 10

const multiplied = myReducePloyfill.call(
	numbers,
	(acc, value) => {
		return Number(acc) * value;
	},
	1,
);
console.log("Product with initialValue:", multiplied); // 24

const concatenated = myReducePloyfill.call(
	["a", "b", "c"],
	(acc, value) => {
		return String(acc) + value;
	},
	"",
);
console.log("String concatenation:", concatenated); // "abc"

const groupedByLength = myReducePloyfill.call(
	["hi", "a", "to"],
	(acc, value) => {
		const result = acc as Record<number, string[]>;
		const key = value.length;
		result[key] ??= [];
		result[key].push(value);
		return result;
	},
	{} as Record<number, string[]>,
);
console.log("Grouped by length:", groupedByLength); // { 1: ["a"], 2: ["hi", "to"] }

const flattened = myReducePloyfill.call(
	[[1, 2], [3], [4, 5]],
	(acc, value) => {
		const result = acc as number[];
		result.push(...value);
		return result;
	},
	[] as number[],
);
console.log("Flattened arrays:", flattened); // [1, 2, 3, 4, 5]

const callbackArgsCheck = myReducePloyfill.call(
	numbers,
	(acc, value, index, array) => {
		return index === array.indexOf(value) ? Number(acc) + value : Number(acc);
	},
	0,
);
console.log(
	"Callback receives accumulator/value/index/array:",
	callbackArgsCheck,
); // 10

const sparse = [1, , 3, , 5] as number[];
const sparseVisited: number[] = [];
const sparseTotal = myReducePloyfill.call(
	sparse,
	(acc, value, index) => {
		sparseVisited.push(index);
		return Number(acc) + value;
	},
	0,
);
console.log("Sparse sum:", sparseTotal); // 9
console.log("Sparse visited indexes:", sparseVisited); // [0, 2, 4]

const withoutInitialValue = myReducePloyfill.call(
	numbers,
	(acc, value) => Number(acc) + value,
) as number;
console.log("Without initialValue:", withoutInitialValue); // 10

const singleValue = myReducePloyfill.call(
	[42],
	(acc, value) => Number(acc) + value,
) as number;
console.log("Single item without initialValue:", singleValue); // 42

const emptyWithInitialValue = myReducePloyfill.call([], (acc) => acc, 100);
console.log("Empty array with initialValue:", emptyWithInitialValue); // 100

try {
	myReducePloyfill.call([], (acc, value) => Number(acc) + value);
} catch (error) {
	console.log(
		"Empty array without initialValue throws:",
		error instanceof TypeError,
	); // true
}

try {
	myReducePloyfill.call(numbers, null as unknown as typeof myReducePloyfill, 0);
} catch (error) {
	console.log("Invalid callback throws:", error instanceof TypeError); // true
}

// NOTE:

// The return type includes T | U because of how reduce() behaves when no initialValue is provided.

// When you don't pass an initialValue, reduce() is forced to look at the array itself to seed its accumulator. It grabs the first valid element it finds inside the array (which is of type T) and uses that as the starting point.

// Because of this mechanism, the accumulator's value could end up being either the type of the array elements (T) or the type returned by your callback function (U).
