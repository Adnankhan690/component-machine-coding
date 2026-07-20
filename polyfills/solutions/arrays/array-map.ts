// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What should a custom Array.prototype.map polyfill do?
// A: It should return a new array with each existing item transformed by a callback.
// Edge cases to remember:
// 1. Throw if the input is null or undefined.
// 2. Throw if the callback is not a function.
// 3. Preserve sparse array holes instead of filling them accidentally.
// 4. Pass value, index, and original array to the callback.
// 5. Support an optional thisArg for callback context.

interface Array<T> {
	myMap<U, TThis = undefined>(
		callback: (this: TThis, value: T, index: number, array: T[]) => U,
		thisArg?: TThis,
	): U[];
}

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================
function myMapPolyfill<T, U, TThis = undefined>(
  this: T[],
  callback: (this: TThis, value: T, index: number, array: T[]) => U,
  thisArg: TThis,
): U[] {
  if (this == null) {
    throw new TypeError("Array.prototype.myMap called on null or undefined");
  }

  if (typeof callback !== "function") {
    throw new TypeError(`${callback} is not a function`);
  }

  const source = Object(this) as T[];
  const length = source.length >>> 0;
  const result = new Array<U>(length);

  for (let index = 0; index < length; index += 1) {
    if (index in source) {
      result[index] = callback.call(thisArg, source[index], index, source);
    }
  }

  return result;
}

Array.prototype.myMap = myMapPolyfill;

if (!Array.prototype.map) {
  Array.prototype.map = myMapPolyfill;
}


// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================
const ctx = { multiplier: 2 };

[1, 2, 3].myMap(function (value) {
	return value * this.multiplier;
}, ctx);

const numbers = [1, 2, 3];
console.log(
	"Test 1 - doubles values:",
	numbers.myMap((value) => value * 2),
);
// Expected: [2, 4, 6]

console.log(
	"Test 2 - uses index:",
	numbers.myMap((_, index) => index),
);
// Expected: [0, 1, 2]

console.log(
	"Test 3 - can access original array:",
	numbers.myMap((value, index, array) => value + array[index]),
);
// Expected: [2, 4, 6]

const words = ["ontology", "panel"];
console.log(
	"Test 4 - maps strings:",
	words.myMap((word) => word.toUpperCase()),
);
// Expected: ["ONTOLOGY", "PANEL"]

const empty: number[] = [];
console.log(
	"Test 5 - empty array:",
	empty.myMap((value) => value),
);
// Expected: []

const sparse = [1, , 3];
const sparseResult = sparse.myMap((value) => value * 2);
console.log(
	"Test 6 - preserves sparse holes:",
	sparseResult,
	1 in sparseResult,
);
// Expected: [2, <empty>, 6] false

const context = { multiplier: 3 };
console.log(
	"Test 7 - supports thisArg:",
	[2, 4].myMap(function (value) {
		return value * this.multiplier;
	}, context),
);
// Expected: [6, 12]

try {
	console.log(
		"Test 8 - invalid input:",
		Array.prototype.myMap.call(null, (value) => value),
	);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log("Test 8 - invalid input:", error instanceof TypeError, message);
}
// Expected: true, "Array.prototype.myMap called on null or undefined"

try {
	console.log("Test 9 - invalid callback:", [1, 2].myMap(null));
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log(
		"Test 9 - invalid callback:",
		error instanceof TypeError,
		message,
	);
}
// Expected: true, "null is not a function"
