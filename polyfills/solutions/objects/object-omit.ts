// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does static Object.myOmit do?
// A: It creates a new object composed of all enumerable own properties of the source object,
//    excluding the properties specified by either a list of keys (iterable) or a predicate function.
// Edge cases to remember:
// 1. Throw a TypeError if the source object is null or undefined (cannot be converted to object).
// 2. Coerce primitive inputs (strings, numbers, booleans, symbols) to their object wrapper equivalents.
// 3. Support both an array/iterable of keys AND a predicate function.
// 4. Only own enumerable properties of the source are copied (inherited properties are not copied).
// 5. Include symbol-keyed properties (both when filtering with an iterable or when evaluating with a predicate function).
// 6. Support optional 'thisArg' context when using a predicate function.
// 7. Return a new plain object (with Object.prototype as prototype).
// 8. If the second argument is defined but not iterable and not a function, throw a TypeError.

interface ObjectConstructor {
	/**
	 * Creates a new object composed of the properties of obj not omitted.
	 * @param obj The source object.
	 * @param keys An iterable of keys to omit, or a predicate function.
	 * @param thisArg Optional context for the predicate function.
	 */
	myOmit<T, K extends keyof any>(
		obj: T,
		keys: Iterable<K>,
	): T extends object ? Omit<T, Extract<K, keyof T>> : any;

	myOmit<T>(
		obj: T,
		predicate: (value: any, key: string | symbol, object: T) => boolean,
		thisArg?: any,
	): T extends object ? Partial<T> : any;
}

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================
function myOmit(obj: any, keys: any, thisArg?: any): any {
	// 1. Handle null or undefined source objects
	if (obj === null || obj === undefined) {
		throw new TypeError("Cannot convert undefined or null to object");
	}

	// 2. Convert primitives to an object wrapper
	const source = Object(obj);
	const result: any = {};

	// 3. Get all own enumerable properties (both string keys and symbol keys)
	const allKeys: (string | symbol)[] = [];
	allKeys.push(...Object.keys(source));

	if (typeof Object.getOwnPropertySymbols === "function") {
		// read getOwnPropertyOrSymbols.md to check what it does ?
		const symbols = Object.getOwnPropertySymbols(source);
		for (let i = 0; i < symbols.length; i++) {
			const sym = symbols[i];
			// read propertyIsEnumrable.md to check what it does ?
			if (Object.prototype.propertyIsEnumerable.call(source, sym)) {
				allKeys.push(sym);
			}
		}
	}

	// 4. Determine omission logic based on keys type
	if (typeof keys === "function") {
		for (let i = 0; i < allKeys.length; i++) {
			const key = allKeys[i];
			const value = source[key];
			if (!keys.call(thisArg, value, key, source)) {
				result[key] = value;
			}
		}
		// read symbol.iterable.md to check what it does ?
	} else if (keys && typeof keys[Symbol.iterator] === "function") {
		const omitKeys = new Set<any>();
		for (const key of keys) {
			if (typeof key === "symbol") {
				omitKeys.add(key);
			} else {
				// read object-omit.md to check why its converted to string ?
				omitKeys.add(String(key));
			}
		}
		for (let i = 0; i < allKeys.length; i++) {
			const key = allKeys[i];
			if (!omitKeys.has(key)) {
				result[key] = source[key];
			}
		}
	} else {
		throw new TypeError("Second argument must be an iterable or a function");
	}

	return result;
}



// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================
// Test 1: Standard omit with array of keys
const testObj = { a: 1, b: 2, c: 3 };
console.log("Test 1 - standard omit:", Object.myOmit(testObj, ["a", "c"]));
// Expected: { b: 2 }

// Test 2: Omit with Set of keys (iterable check)
const keysSet = new Set(["b", "c", "d"]);
console.log("Test 2 - Set of keys:", Object.myOmit(testObj, keysSet));
// Expected: { a: 1 }

// Test 3: Omit with inherited properties (should not be copied to result anyway)
const protoObj = { inheritedProp: "yes" };
const childObj = Object.create(protoObj);
childObj.ownProp = "no";
childObj.otherOwn = "hello";
console.log(
	"Test 3 - omit ownProp (ignores inheritedProp):",
	Object.myOmit(childObj, ["ownProp"]),
);
// Expected: { otherOwn: 'hello' }

// Test 4: Omit with symbol keys
const sym = Symbol("secret");
const sym2 = Symbol("public");
const symObj = { [sym]: "shh", [sym2]: "hello", visible: "world" };
console.log("Test 4 - omit symbol key:", Object.myOmit(symObj, [sym]));
// Expected: { [Symbol(public)]: 'hello', visible: 'world' }

// Test 5: Omit with predicate function
const numObj = { a: 10, b: 20, c: 30 };
console.log(
	"Test 5 - predicate filter (omit values > 15):",
	Object.myOmit(numObj, (value: number) => value > 15),
);
// Expected: { a: 10 }

// Test 6: Omit with predicate function and custom thisArg
const context = { threshold: 25 };
console.log(
	"Test 6 - predicate with thisArg (omit values > threshold):",
	Object.myOmit(
		numObj,
		function (this: typeof context, value: number) {
			return value > this.threshold;
		},
		context,
	),
);
// Expected: { a: 10, b: 20 }

// Test 7: Primitive coercion (e.g. string input)
console.log("Test 7 - string input:", Object.myOmit("abc", [0, 2]));
// Expected: { '1': 'b' }

// Test 8: Null / Undefined input throws TypeError
try {
	Object.myOmit(null, ["a"]);
} catch (error) {
	console.log(
		"Test 8a - null input throws TypeError:",
		error instanceof TypeError,
	);
}
try {
	Object.myOmit(undefined, ["a"]);
} catch (error) {
	console.log(
		"Test 8b - undefined input throws TypeError:",
		error instanceof TypeError,
	);
}

// Test 9: Non-iterable non-function second argument throws TypeError
try {
	Object.myOmit(testObj, 123 as any);
} catch (error) {
	console.log(
		"Test 9 - non-iterable non-function throws TypeError:",
		error instanceof TypeError,
	);
}
