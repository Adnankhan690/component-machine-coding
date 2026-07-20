// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does Array.prototype.sort do?
// A: It sorts the elements of an array in place and returns the reference to the same array.
// Edge cases to remember:
// 1. Throw a TypeError if called on null or undefined.
// 2. Throw a TypeError if compareFn is provided but is not a function.
// 3. Default comparison converts elements to strings and compares their UTF-16 code unit values.
// 4. Stable sorting: Elements that compare equal must retain their relative order (ES2019+).
// 5. 'undefined' elements are sorted to the end of the array (compareFn is not called on them).
// 6. Sparse array holes are sorted to the very end, after any explicit 'undefined' elements.

// interface Array<T> {
// 	mySort(compareFn?: (a: T, b: T) => number): this;
// }

// // ==========================================
// // 2. THE CLEAN IMPLEMENTATION
// // ==========================================
// function mySortPolyfill<T>(this: T[], compareFn?: (a: T, b: T) => number): T[] {
// 	if (this == null) {
// 		throw new TypeError("Array.prototype.mySort called on null or undefined");
// 	}

// 	if (compareFn !== undefined && typeof compareFn !== "function") {
// 		throw new TypeError("The comparison function must be either a function or undefined");
// 	}

// 	const source = Object(this);
// 	const length = source.length >>> 0;

// 	const definedElements: T[] = [];
// 	let undefinedCount = 0;
// 	let holesCount = 0;

// 	// Extract non-undefined values, explicit undefineds, and track holes
// 	for (let i = 0; i < length; i += 1) {
// 		if (i in source) {
// 			const val = source[i];
// 			if (val === undefined) {
// 				undefinedCount += 1;
// 			} else {
// 				definedElements.push(val);
// 			}
// 		} else {
// 			holesCount += 1;
// 		}
// 	}

// 	// Default comparator compares string representations of elements
// 	const defaultCompare = (a: any, b: any): number => {
// 		const aStr = String(a);
// 		const bStr = String(b);
// 		if (aStr < bStr) return -1;
// 		if (aStr > bStr) return 1;
// 		return 0;
// 	};

// 	const compare = compareFn || defaultCompare;

// 	// Perform stable Insertion Sort on the defined elements
// 	for (let i = 1; i < definedElements.length; i += 1) {
// 		const key = definedElements[i];
// 		let j = i - 1;
// 		while (j >= 0 && compare(definedElements[j], key) > 0) {
// 			definedElements[j + 1] = definedElements[j];
// 			j -= 1;
// 		}
// 		definedElements[j + 1] = key;
// 	}

// 	let index = 0;

// 	// 1. Place sorted defined elements back into the array
// 	for (let i = 0; i < definedElements.length; i += 1) {
// 		source[index] = definedElements[i];
// 		index += 1;
// 	}

// 	// 2. Place explicit undefined elements
// 	for (let i = 0; i < undefinedCount; i += 1) {
// 		source[index] = undefined;
// 		index += 1;
// 	}

// 	// 3. Delete properties to re-create sparse array holes at the end
// 	for (let i = 0; i < holesCount; i += 1) {
// 		delete source[index];
// 		index += 1;
// 	}

// 	return this;
// }

// Array.prototype.mySort = mySortPolyfill;

// if (!Array.prototype.sort) {
// 	Array.prototype.sort = mySortPolyfill;
// }


interface Array<T> {
	mySort(compareFn?: (a: T, b: T) => number): this;
}

function mySortPolyfill<T>(this: T[], callback?: (a: T, b: T) => number) {
	if (this == null) {
		throw new TypeError("Array.prototype.mySort called upon null or undefined");
	}

	const cb = callback !== undefined;

	if (cb && typeof callback !== "function") {
		throw new TypeError(`${callback} is not a function`);
	}

	function defaultFn(a: T, b: T) {
		const aStr = String(a);
		const bStr = String(b);

		if (aStr < bStr) return -1;
		if (aStr > bStr) return 1;
		return 0;
	}

	const result = [] as T[];
	for (let i = 0; i < this.length - 1; i++) {
		if (i in this) {
			const val = callback
				? callback(this[i], this[i + 1])
				: defaultFn(this[i], this[i + 1]);
			if (val > 0) {
				this[i] = this[i + 1];
				result.push(this[i]);
			} else {
				result.push(this[i]);
			}
		}
	}
	result.push(this[this.length - 1]);
	return result;
}

Array.prototype.mySort = mySortPolyfill;

if (!Array.prototype.sort) {
	Array.prototype.sort = mySortPolyfill;
}

// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================

// Test 1: Sorting numbers with a custom compare function
const numbers = [10, 2, 30, 1, 5];
numbers.mySort((a, b) => a - b);
console.log("Test 1 - sorting numbers ascending:", numbers);
// Expected: [1, 2, 5, 10, 30]

// Test 2: Default alphabetical sorting of numbers/strings
const mixedStrings = [10, 2, "1", "02"];
mixedStrings.mySort();
console.log("Test 2 - default string-based sorting:", mixedStrings);
// Expected: ['02', '1', 10, 2]

// Test 3: Stable sorting check (retaining original order of equal comparison items)
const items = [
	{ name: "item1", value: 40 },
	{ name: "item2", value: 10 },
	{ name: "item3", value: 40 },
	{ name: "item4", value: 10 },
];
items.mySort((a, b) => a.value - b.value);
console.log("Test 3 - stable sorting behavior:", items);
// Expected items order: item2, item4, item1, item3

// Test 4: Handles explicit undefined elements
const withUndefined = [3, undefined, 1, undefined, 2];
withUndefined.mySort((a, b) => a - b);
console.log("Test 4 - sorts explicit undefined to end:", withUndefined);
// Expected: [1, 2, 3, undefined, undefined]

// Test 5: Handles sparse arrays (holes)
const sparse = [3, , 1, , 2];
sparse.mySort((a, b) => a - b);
console.log("Test 5 - sorts sparse holes to the end:", sparse, 3 in sparse, 4 in sparse);
// Expected: [1, 2, 3, <2 empty items>] true in index 2, false in index 3/4

// Test 6: Handles a mix of defined values, undefined, and holes
const mixedSparse = [3, undefined, , 1, undefined, , 2];
mixedSparse.mySort((a, b) => a - b);
console.log("Test 6 - mixed defined, undefined, and holes:", mixedSparse, 2 in mixedSparse, 3 in mixedSparse, 5 in mixedSparse);
// Expected: [1, 2, 3, undefined, undefined, <2 empty items>]

// Test 7: Throw TypeError for null or undefined input
try {
	Array.prototype.mySort.call(null);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log("Test 7 - null input throws TypeError:", error instanceof TypeError, message);
}
// Expected: true, "Array.prototype.mySort called on null or undefined"

// Test 8: Throw TypeError for invalid compareFn
try {
	[1, 2].mySort("not a function" as any);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log("Test 8 - invalid compareFn throws TypeError:", error instanceof TypeError, message);
}
// Expected: true, "The comparison function must be either a function or undefined"
