// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What should a custom Array.prototype.forEach polyfill do?
// A: It should execute a callback once for each existing item in the array.
// Edge cases to remember:
// 1. Throw if the input is null or undefined.
// 2. Throw if the callback is not a function.
// 3. Skip empty slots in sparse arrays.
// 4. Pass value, index, and original array to the callback.
// 5. Support an optional thisArg for callback context.
// 6. Return undefined, not a new array.

// ==========================================
// 2. YOUR IMPLEMENTATION
// ==========================================

interface Array<T> {
	myForEach<TThis = undefined>(
		callback: (this: TThis, element: T, index: number, array: T[]) => void,
		thisArg?: TThis,
	): void;
}

function myForEach<T, TThis = undefined>(
	this: T[],
	callback: (this: TThis, element: T, index: number, array: T[]) => void,
	thisArg?: TThis,
): void {
	if (typeof callback !== "function") {
		throw new TypeError(`${callback} is not a function`);
	}

	if (this == null) {
		throw new TypeError("forEach called upon null or undefined");
	}

	const Obj = Object(this);
	const length = Obj.length >> 0;

	for (let i = 0; i < length; i++) {
		if (!(i in Obj)) {
			callback.call(thisArg, Obj[i], i, Obj);
		}
	}
}

Array.prototype.myForEach = myForEach;
if (!Array.prototype.forEach) {
	Array.prototype.forEach = myForEach;
}


// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================
const visited: number[] = [];
[1, 2, 3].myForEach((value) => {
	visited.push(value);
});
console.log("Test 1 - visits every value:", visited);
// Expected: [1, 2, 3]

const indexes: number[] = [];
[10, 20, 30].myForEach((_, index) => {
	indexes.push(index);
});
console.log("Test 2 - receives index:", indexes);
// Expected: [0, 1, 2]

const sourceCheck: number[] = [];
[5, 6].myForEach((value, index, array) => {
	sourceCheck.push(value + array[index]);
});
console.log("Test 3 - receives original array:", sourceCheck);
// Expected: [10, 12]

const context = { total: 0 };
[1, 2, 3].myForEach(function (value) {
	this.total += value;
}, context);
console.log("Test 4 - supports thisArg:", context.total);
// Expected: 6

const sparse = [1, , 3] as number[];
const sparseVisited: number[] = [];
sparse.myForEach((_, index) => {
	sparseVisited.push(index);
});
console.log("Test 5 - skips sparse holes:", sparseVisited);
// Expected: [0, 2]

const returnValue = [1, 2].myForEach(() => {});
console.log("Test 6 - returns undefined:", returnValue);
// Expected: undefined

try {
	Array.prototype.myForEach.call(null, () => {});
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log("Test 7 - invalid input:", error instanceof TypeError, message);
}
// Expected: true, "Array.prototype.myForEach called on null or undefined"

try {
	[1, 2].myForEach(null as unknown as (value: number) => void);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log(
		"Test 8 - invalid callback:",
		error instanceof TypeError,
		message,
	);
}
// Expected: true, "null is not a function"

//TODO Revise NOTES
// In JavaScript, primitive values (like strings, numbers, and booleans) are not objects. However, JavaScript allows you to call methods on them by temporarily wrapping them in an object (e.g., turning a string primitive into a String object).

// The line const O = Object(this); ensures that no matter what this is, it is safely converted into a full JavaScript object that your polyfill can inspect using the in operator (i in O).

// Here is a breakdown of exactly why this is necessary and how it handles different types of inputs.

// 1. Why Object(this) is Needed for the in Operator
// Later in the polyfill, you check for sparse array holes using the in operator:

// JavaScript
// if (i in O) { ... }
// The in operator only works on objects. If you try to use the in operator on a primitive value like a string or a number, JavaScript will throw a TypeError.

// JavaScript
// // ❌ This crashes instantly!
// 0 in "hello" // TypeError: Cannot use 'in' operator to search for '0' in hello

// //  This works perfectly!
// const O = Object("hello");
// 0 in O; // true (index 0 exists in the String object)
// 2. Handling Primitive Wrappers via .call()
// While you normally call forEach on arrays ([1, 2, 3].forEach(...)), JavaScript allows developers to borrow array methods and force them to run on other data types using .call() or .apply().

// A classic example of this is running forEach on a string:

// JavaScript
// const str = "abc";

// // Borrowing forEach to loop over a string primitive
// Array.prototype.myForEach.call(str, (char) => {
//     console.log(char);
// });
// When someone does this, this inside your polyfill becomes the primitive string "abc".

// By executing const O = Object(this);, your polyfill converts that primitive string into a String Object wrapper:

// JavaScript
// Object("abc");
// // Returns: String {'a', 'b', 'c', length: 3}
// Now, O behaves exactly like an array-like object! It has a .length property of 3, and keys "0", "1", and "2". The rest of your polyfill loop can run seamlessly without ever knowing it's not a real array.
