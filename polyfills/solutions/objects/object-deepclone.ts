// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does static Object.myDeepClone do?
// A: It creates a fully independent deep copy of a given value. All nested structures
//    (objects, arrays, maps, sets, dates, regexes, primitive wrappers) are recursively
//    cloned rather than copied by reference.
// Edge cases to remember:
// 1. Return primitives and functions as-is (by reference or value).
// 2. Handle circular references using a WeakMap to prevent infinite loops/stack overflow.
// 3. Special Object Types:
//    - Date: Clone using new Date(obj.getTime())
//    - RegExp: Clone using new RegExp(obj.source, obj.flags) and preserve lastIndex.
//    - Set: Clone recursively by iterating over values.
//    - Map: Clone keys and values recursively.
//    - Primitive wrappers (String, Number, Boolean): Clone by invoking constructor with valueOf().
// 4. Arrays: Clone recursively while maintaining length and sparse indices, as well as any custom properties.
// 5. Objects (including custom class instances): Clone using Object.create(Object.getPrototypeOf(obj)) to preserve prototypes without invoking constructor side effects.
// 6. Own properties: Copy enumerable own string-keyed and symbol-keyed properties. Inherited properties should be ignored.

interface ObjectConstructor {
	myDeepClone<T>(val: T): T;
}

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================
function myDeep(source: any, visited = new WeakMap<any, any>()): any {
	// 1. Primitives, functions, null, undefined
	if (source === null || typeof source !== 'object') {
		return source;
	}

	// 2. Check for circular references
	if (visited.has(source)) {
		return visited.get(source);
	}

	// 3. Handle Special Object Types (Date, RegExp, Map, Set, primitive wrappers)
	if (source instanceof Date) {
		const clone = new Date(source.getTime());
		visited.set(source, clone);
		return clone;
	}

	if (source instanceof RegExp) {
		const clone = new RegExp(source.source, source.flags);
		clone.lastIndex = source.lastIndex;
		visited.set(source, clone);
		return clone;
	}

	if (source instanceof Set) {
		const clone = new Set();
		visited.set(source, clone);
		source.forEach(item => {
			clone.add(myDeep(item, visited));
		});
		return clone;
	}

	if (source instanceof Map) {
		const clone = new Map();
		visited.set(source, clone);
		source.forEach((v, k) => {
			clone.set(myDeep(k, visited), myDeep(v, visited));
		});
		return clone;
	}

	if (source instanceof Number || source instanceof String || source instanceof Boolean) {
		const clone = new (source.constructor as any)(source.valueOf());
		visited.set(source, clone);
		copyProperties(source, clone, visited);
		return clone;
	}

	// 4. Handle Arrays and Plain/Prototype Objects
	const isArray = Array.isArray(source);
	const proto = Object.getPrototypeOf(source);
	const clone = isArray ? new Array(source.length) : Object.create(proto);
	visited.set(source, clone);

	copyProperties(source, clone, visited);
	return clone;
}

function copyProperties(source: any, target: any, visited: WeakMap<any, any>) {
	// Copy own enumerable string keys
	const keys = Object.keys(source);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		target[key] = myDeep(source[key], visited);
	}

	// Copy own enumerable Symbol keys
	if (typeof Object.getOwnPropertySymbols === 'function') {
		const symbols = Object.getOwnPropertySymbols(source);
		for (let i = 0; i < symbols.length; i++) {
			const sym = symbols[i];
			if (Object.prototype.propertyIsEnumerable.call(source, sym)) {
				target[sym] = myDeep(source[sym], visited);
			}
		}
	}
}

// Polyfill attachment
(Object as any).myDeepClone = myDeep;

if (!(Object as any).deepClone) {
	(Object as any).deepClone = myDeep;
}


function isPlainObject(value) {
	return (
		value !== null &&
		typeof value === 'object' &&
		!Array.isArray(value) &&
		!(value instanceof Date) &&
		!(value instanceof RegExp)
	)
}

function BullterProofPlaiObject(value) {
	return Object.prototype.toString.call(value) === '[object Object]';
}

// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================

// Test 1: Primitives and Functions
const fn = () => {};
console.log("Test 1a (Number):", Object.myDeepClone(42) === 42);
console.log("Test 1b (String):", Object.myDeepClone("hello") === "hello");
console.log("Test 1c (Boolean):", Object.myDeepClone(true) === true);
console.log("Test 1d (Null):", Object.myDeepClone(null) === null);
console.log("Test 1e (Undefined):", Object.myDeepClone(undefined) === undefined);
console.log("Test 1f (Function):", Object.myDeepClone(fn) === fn);

// Test 2: Nested Objects
const nestedObj = { a: 1, b: { c: 2, d: [3, 4] } };
const clonedObj = Object.myDeepClone(nestedObj);
console.log("Test 2a (Deep equal):", JSON.stringify(clonedObj) === JSON.stringify(nestedObj));
console.log("Test 2b (Nested reference check):", clonedObj.b !== nestedObj.b);
console.log("Test 2c (Nested array reference check):", clonedObj.b.d !== nestedObj.b.d);

// Test 3: Arrays (sparse arrays & custom properties)
const sparseArr = [1, , 3];
(sparseArr as any).foo = "bar";
const clonedArr = Object.myDeepClone(sparseArr);
console.log("Test 3a (Array length):", clonedArr.length === sparseArr.length);
console.log("Test 3b (Sparse index):", clonedArr[1] === undefined && !(1 in clonedArr));
console.log("Test 3c (Custom property):", (clonedArr as any).foo === "bar");

// Test 4: Date & RegExp
const date = new Date(1600000000000);
const regex = /abc/gi;
regex.lastIndex = 2;
const clonedDate = Object.myDeepClone(date);
const clonedRegex = Object.myDeepClone(regex);
console.log("Test 4a (Date clone):", clonedDate.getTime() === date.getTime() && clonedDate !== date);
console.log("Test 4b (RegExp source/flags):", clonedRegex.source === regex.source && clonedRegex.flags === regex.flags && clonedRegex !== regex);
console.log("Test 4c (RegExp lastIndex):", clonedRegex.lastIndex === 2);

// Test 5: Map & Set
const map = new Map<any, any>();
const keyObj = { id: 1 };
const valObj = { name: "Alice" };
map.set(keyObj, valObj);
const clonedMap = Object.myDeepClone(map);
const clonedKeys = Array.from(clonedMap.keys());
const clonedValues = Array.from(clonedMap.values());
console.log("Test 5a (Map clone structure):", clonedMap.size === 1);
console.log("Test 5b (Map key cloned):", clonedKeys[0] !== keyObj && clonedKeys[0].id === 1);
console.log("Test 5c (Map value cloned):", clonedValues[0] !== valObj && clonedValues[0].name === "Alice");

const set = new Set<any>([keyObj]);
const clonedSet = Object.myDeepClone(set);
const clonedSetItems = Array.from(clonedSet);
console.log("Test 6a (Set clone structure):", clonedSet.size === 1);
console.log("Test 6b (Set item cloned):", clonedSetItems[0] !== keyObj && clonedSetItems[0].id === 1);

// Test 6: Circular References
const circular: any = { name: "loop" };
circular.self = circular;
const clonedCircular = Object.myDeepClone(circular);
console.log("Test 7a (Circular reference intact):", clonedCircular.self === clonedCircular);
console.log("Test 7b (Circular copy is distinct):", clonedCircular !== circular);

// Test 7: Symbol Keys
const symKey = Symbol("id");
const objWithSymbol = { [symKey]: "123", ordinary: "abc" };
const clonedSym = Object.myDeepClone(objWithSymbol);
console.log("Test 8a (Symbol key copied):", clonedSym[symKey] === "123");

// Test 8: Custom class instances / prototypes
class Person {
	name: string;
	constructor(name: string) {
		this.name = name;
	}
	sayHello() {
		return `Hello, ${this.name}`;
	}
}
const person = new Person("Bob");
const clonedPerson = Object.myDeepClone(person);
console.log("Test 9a (Prototype preserved):", clonedPerson instanceof Person);
console.log("Test 9b (Method works):", clonedPerson.sayHello() === "Hello, Bob");
console.log("Test 9c (Reference distinct):", clonedPerson !== person);

const input = {
	name: "adnan",
	nestedName: {
		surName: "khan",
		agr: 12,
		deep2: {
			deep3: "deep3",
			deep4: {
				arr: [1, 2, 3, 4, { test: '' }]
			}
		}
	}
}
const test2 = { nested: input }
// console.log("test 1 ", JSON.stringify(myDeep(test2), null, 2));
console.dir(myDeep(test2), { depth: null })