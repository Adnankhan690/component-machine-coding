// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does structuredClone do?
// A: It creates a deep copy of a given value using the HTML structured clone algorithm.
//
// Q: How is it different from JSON.parse(JSON.stringify(x))?
// A: 
//   - JSON discard values like undefined, functions, and Symbols; structuredClone supports undefined, 
//     but explicitly throws a DataCloneError on functions and Symbol values.
//   - JSON throws on circular references; structuredClone handles circular references natively.
//   - JSON loses type information (e.g., Dates become ISO strings; Map/Set/RegExp become empty objects). 
//     structuredClone preserves these types and clones them correctly.
//
// Q: How is it different from a custom deepClone (like Object.myDeepClone)?
// A:
//   - Prototype preservation: deepClone preserves class instances and prototype chains. structuredClone 
//     discards prototype chains (cloned custom class instances become plain Object instances).
//   - Property descriptors & Metadata: deepClone copies Symbol keys, non-enumerable properties, and 
//     preserves descriptors (getters/setters). structuredClone ignores Symbol keys, ignores non-enumerable 
//     properties, and ignores custom metadata on collections (like custom properties on Arrays or Maps).
//   - Functions: deepClone passes functions by reference. structuredClone throws a DataCloneError.
//
// Edge cases to remember:
//   - Handling sparse arrays (holes must remain holes, and non-integer properties must be ignored).
//   - Circular/shared references must be resolved using a tracking map (e.g., Map or WeakMap).
//   - Throwing a DataCloneError (via DOMException if available, or Error fallback).
//   - Sharing ArrayBuffers: Shared views on the same ArrayBuffer should point to the same cloned buffer.

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================

function createDataCloneError(message: string): Error {
	if (typeof DOMException === 'function') {
		return new DOMException(message, "DataCloneError");
	}
	const err = new Error(message);
	err.name = "DataCloneError";
	return err;
}

export function myStructuredClone<T>(value: T, options?: { transfer?: any[] }): T {
	// 1. Validate options.transfer if present
	if (options && options.transfer !== undefined) {
		if (!Array.isArray(options.transfer)) {
			throw new TypeError("options.transfer must be an Array");
		}
		for (const item of options.transfer) {
			if (
				!(item instanceof ArrayBuffer) &&
				!(typeof MessagePort !== 'undefined' && item instanceof MessagePort) &&
				!(typeof ReadableStream !== 'undefined' && item instanceof ReadableStream) &&
				!(typeof WritableStream !== 'undefined' && item instanceof WritableStream) &&
				!(typeof TransformStream !== 'undefined' && item instanceof TransformStream) &&
				!(typeof AudioData !== 'undefined' && item instanceof AudioData) &&
				!(typeof VideoFrame !== 'undefined' && item instanceof VideoFrame) &&
				!(typeof ImageBitmap !== 'undefined' && item instanceof ImageBitmap) &&
				!(typeof OffscreenCanvas !== 'undefined' && item instanceof OffscreenCanvas)
			) {
				throw new TypeError("Value is not a transferable object");
			}
		}
	}

	const visited = new Map<any, any>();
	return cloneInternal(value, visited);
}

function cloneInternal(value: any, visited: Map<any, any>): any {
	// 1. Handle Primitives (excluding Symbol) and Null/Undefined
	if (value === null) return null;
	if (typeof value !== 'object' && typeof value !== 'function') {
		if (typeof value === 'symbol') {
			throw createDataCloneError("Symbols are not structured-cloneable.");
		}
		return value;
	}

	// 2. Handle Functions
	if (typeof value === 'function') {
		throw createDataCloneError("Functions are not structured-cloneable.");
	}

	// 3. Handle DOM Nodes (in browser environment)
	if (typeof Node !== 'undefined' && value instanceof Node) {
		throw createDataCloneError("DOM nodes are not structured-cloneable.");
	}

	// 4. Handle Circular & Shared References
	if (visited.has(value)) {
		return visited.get(value);
	}

	// 5. Handle Wrapper Objects (Boolean, Number, String)
	if (value instanceof Boolean) {
		const clone = new Boolean(value.valueOf());
		visited.set(value, clone);
		return clone;
	}
	if (value instanceof Number) {
		const clone = new Number(value.valueOf());
		visited.set(value, clone);
		return clone;
	}
	if (value instanceof String) {
		const clone = new String(value.valueOf());
		visited.set(value, clone);
		return clone;
	}

	// 6. Handle Date
	if (value instanceof Date) {
		const clone = new Date(value.getTime());
		visited.set(value, clone);
		return clone;
	}

	// 7. Handle RegExp
	if (value instanceof RegExp) {
		const clone = new RegExp(value.source, value.flags);
		clone.lastIndex = value.lastIndex;
		visited.set(value, clone);
		return clone;
	}

	// 8. Handle ArrayBuffer & SharedArrayBuffer
	if (value instanceof ArrayBuffer) {
		const clone = value.slice(0);
		visited.set(value, clone);
		return clone;
	}
	if (typeof SharedArrayBuffer !== 'undefined' && value instanceof SharedArrayBuffer) {
		// SharedArrayBuffer shares the backing memory by design
		visited.set(value, value);
		return value;
	}

	// 9. Handle DataView
	if (value instanceof DataView) {
		const bufferClone = cloneInternal(value.buffer, visited);
		const clone = new DataView(bufferClone, value.byteOffset, value.byteLength);
		visited.set(value, clone);
		return clone;
	}

	// 10. Handle TypedArrays
	if (ArrayBuffer.isView(value)) {
		const bufferClone = cloneInternal((value as any).buffer, visited);
		const clone = new (value.constructor as any)(
			bufferClone,
			(value as any).byteOffset,
			(value as any).length
		);
		visited.set(value, clone);
		return clone;
	}

	// 11. Handle Map
	if (value instanceof Map) {
		const clone = new Map();
		visited.set(value, clone);
		value.forEach((v, k) => {
			clone.set(cloneInternal(k, visited), cloneInternal(v, visited));
		});
		return clone;
	}

	// 12. Handle Set
	if (value instanceof Set) {
		const clone = new Set();
		visited.set(value, clone);
		value.forEach(v => {
			clone.add(cloneInternal(v, visited));
		});
		return clone;
	}

	// 13. Handle Errors
	const ErrorConstructors = [Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError];
	if (ErrorConstructors.some(constructor => value instanceof constructor)) {
		const clone = new (value.constructor as any)(value.message);
		if (value.stack !== undefined) {
			clone.stack = value.stack;
		}
		if ('cause' in value) {
			clone.cause = cloneInternal(value.cause, visited);
		}
		visited.set(value, clone);
		return clone;
	}

	// 14. Handle Arrays (Sparse array structure must be preserved, custom metadata ignored)
	if (Array.isArray(value)) {
		const clone = new Array(value.length);
		visited.set(value, clone);

		const keys = Object.keys(value);
		for (const key of keys) {
			const index = Number(key);
			if (!isNaN(index) && Number.isInteger(index) && index >= 0) {
				clone[index] = cloneInternal(value[index], visited);
			}
		}
		return clone;
	}

	// 15. Handle Plain Objects & Custom Class Instances (lose prototype chain)
	const proto = Object.getPrototypeOf(value);
	const clone = proto === null ? Object.create(null) : {};
	visited.set(value, clone);

	const keys = Object.keys(value);
	for (const key of keys) {
		clone[key] = cloneInternal(value[key], visited);
	}

	return clone;
}

// Polyfill attachment
(globalThis as any).myStructuredClone = myStructuredClone;
if (!(globalThis as any).structuredClone) {
	(globalThis as any).structuredClone = myStructuredClone;
}

// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================

function runTests() {
	console.log("--- Starting structuredClone Polyfill Tests ---");

	// Test 1: Primitives
	console.log("Test 1 (Number):", myStructuredClone(42) === 42);
	console.log("Test 1 (String):", myStructuredClone("test") === "test");
	console.log("Test 1 (Boolean):", myStructuredClone(false) === false);
	console.log("Test 1 (Null):", myStructuredClone(null) === null);
	console.log("Test 1 (Undefined):", myStructuredClone(undefined) === undefined);

	// Test 2: Standard Objects & Array (Deep Cloning check)
	const obj = { a: 1, b: { c: [2, 3] } };
	const clonedObj = myStructuredClone(obj);
	console.log("Test 2a (Deep Object equal):", JSON.stringify(clonedObj) === JSON.stringify(obj));
	console.log("Test 2b (Different reference):", clonedObj !== obj && clonedObj.b !== obj.b && clonedObj.b.c !== obj.b.c);

	// Test 3: Sparse Arrays
	const sparse = [1, , 3];
	const clonedSparse = myStructuredClone(sparse);
	console.log("Test 3a (Sparse length):", clonedSparse.length === sparse.length);
	console.log("Test 3b (Sparse index empty):", !(1 in clonedSparse));
	
	// Test 3c: Custom property on array ignored
	const arrayWithProp = [10];
	(arrayWithProp as any).foo = "bar";
	const clonedArrayWithProp = myStructuredClone(arrayWithProp);
	console.log("Test 3c (Custom property ignored):", (clonedArrayWithProp as any).foo === undefined);

	// Test 4: Circular References
	const circular: any = { name: "circ" };
	circular.self = circular;
	const clonedCircular = myStructuredClone(circular);
	console.log("Test 4a (Circular reference intact):", clonedCircular.self === clonedCircular);
	console.log("Test 4b (Distinct from source):", clonedCircular !== circular);

	// Test 5: Date & RegExp
	const date = new Date(1710000000000);
	const regex = /abc/gi;
	regex.lastIndex = 2;
	const clonedDate = myStructuredClone(date);
	const clonedRegex = myStructuredClone(regex);
	console.log("Test 5a (Date cloned):", clonedDate instanceof Date && clonedDate.getTime() === date.getTime() && clonedDate !== date);
	console.log("Test 5b (RegExp cloned):", clonedRegex instanceof RegExp && clonedRegex.source === "abc" && clonedRegex.flags === "gi" && clonedRegex !== regex);
	console.log("Test 5c (RegExp lastIndex preserved):", clonedRegex.lastIndex === 2);

	// Test 6: Map & Set
	const map = new Map([['x', { y: 1 }]]);
	const clonedMap = myStructuredClone(map);
	console.log("Test 6a (Map cloned):", clonedMap instanceof Map && clonedMap.size === 1);
	console.log("Test 6b (Map nested object deep cloned):", clonedMap.get('x') !== map.get('x') && clonedMap.get('x').y === 1);

	const set = new Set([{ z: 2 }]);
	const clonedSet = myStructuredClone(set);
	console.log("Test 6c (Set cloned):", clonedSet instanceof Set && clonedSet.size === 1);
	const setVal = Array.from(set)[0];
	const clonedSetVal = Array.from(clonedSet)[0];
	console.log("Test 6d (Set nested object deep cloned):", clonedSetVal !== setVal && clonedSetVal.z === 2);

	// Test 7: Error Cloning
	const error = new TypeError("invalid type");
	(error as any).cause = new Error("underlying cause");
	const clonedError = myStructuredClone(error);
	console.log("Test 7a (Error type preserved):", clonedError instanceof TypeError);
	console.log("Test 7b (Error message copied):", clonedError.message === "invalid type");
	console.log("Test 7c (Error cause cloned):", clonedError.cause instanceof Error && clonedError.cause.message === "underlying cause" && clonedError.cause !== error.cause);

	// Test 8: Class Prototype Discarding
	class Person {
		name: string;
		constructor(name: string) {
			this.name = name;
		}
		greet() { return `Hello ${this.name}`; }
	}
	const person = new Person("Adnan");
	const clonedPerson = myStructuredClone(person);
	console.log("Test 8a (Prototype discarded to plain object):", !(clonedPerson instanceof Person) && Object.getPrototypeOf(clonedPerson) === Object.prototype);
	console.log("Test 8b (Properties copied):", clonedPerson.name === "Adnan");

	// Test 9: Symbol value throws DataCloneError
	let symbolThrew = false;
	try {
		myStructuredClone(Symbol("id"));
	} catch (e: any) {
		if (e.name === "DataCloneError") symbolThrew = true;
	}
	console.log("Test 9 (Symbol value throws DataCloneError):", symbolThrew);

	// Test 10: Function throws DataCloneError
	let functionThrew = false;
	try {
		myStructuredClone(() => {});
	} catch (e: any) {
		if (e.name === "DataCloneError") functionThrew = true;
	}
	console.log("Test 10 (Function throws DataCloneError):", functionThrew);

	// Test 11: Symbol keys in objects are ignored
	const symKey = Symbol("meta");
	const objWithSym = { [symKey]: "secret", normal: "public" };
	const clonedObjWithSym = myStructuredClone(objWithSym);
	console.log("Test 11 (Symbol property ignored):", !(symKey in clonedObjWithSym) && clonedObjWithSym.normal === "public");

	console.log("--- All Tests Completed ---");
}

runTests();
