// ==========================================
// 1. THE PROBLEM DEEP-DIVE (Mental Model)
// ==========================================
// Q: What does static Object.assign do?
// A: It copies all enumerable own properties (including Symbol keys) from one or more source objects
//    to a target object, and returns the modified target object.
// Edge cases to remember:
// 1. Throw a TypeError if target is null or undefined (cannot be converted to object).
// 2. Primitives as targets are coerced to their object wrappers (e.g. 123 -> Number object).
// 3. Null or undefined sources are silently ignored.
// 4. Source primitives are wrapped, and only enumerable own properties are copied (e.g. "abc" yields index properties '0', '1', '2').
// 5. Symbol properties MUST be copied if they are own and enumerable on the source.
// 6. Getters on source objects are evaluated during copying (only values are assigned, not the getter itself).
// 7. Setters on the target object are triggered rather than overridden.
// 8. Inherited properties on sources are ignored.

interface ObjectConstructor {
	myAssign(target: any, ...sources: any[]): any;
}

// ==========================================
// 2. THE CLEAN IMPLEMENTATION
// ==========================================
function myAssignPolyfill(target: any, ...sources: any[]): any {
	if (target === null || target === undefined) {
		throw new TypeError('Cannot convert undefined or null to object');
	}

	const to = Object(target);

	for (let i = 0; i < sources.length; i++) {
		const nextSource = sources[i];

		if (nextSource !== null && nextSource !== undefined) {
			const from = Object(nextSource);

			// Copy string-keyed enumerable own properties
			const keys = Object.keys(from);
			for (let j = 0; j < keys.length; j++) {
				const key = keys[j];
				to[key] = from[key];
			}

			// Copy symbol-keyed enumerable own properties
			if (typeof Object.getOwnPropertySymbols === 'function') {
				const symbols = Object.getOwnPropertySymbols(from);
				for (let j = 0; j < symbols.length; j++) {
					const sym = symbols[j];
					if (Object.prototype.propertyIsEnumerable.call(from, sym)) {
						to[sym] = from[sym];
					}
				}
			}
		}
	}

	return to;
}

(Object as any).myAssign = myAssignPolyfill;

if (!Object.assign) {
	Object.assign = myAssignPolyfill;
}



// ==========================================
// 3. THE "QUICK-CHECK" TEST SUITE
// ==========================================

// Test 1: Standard assign with multiple sources
const target = { a: 1 };
const source1 = { b: 2, c: 3 };
const source2 = { c: 4, d: 5 };
console.log('Test 1 - standard assign:', Object.myAssign(target, source1, source2));
// Expected: { a: 1, b: 2, c: 4, d: 5 }

// Test 2: Primitive target coercion
const numTarget = Object.myAssign(123, { a: 1 });
console.log('Test 2 - primitive target:', typeof numTarget, (numTarget as any).a);
// Expected: object 1

// Test 3: Null / Undefined target throws TypeError
try {
	Object.myAssign(null, { a: 1 });
} catch (error) {
	console.log('Test 3a - null target throws:', error instanceof TypeError);
}
try {
	Object.myAssign(undefined, { a: 1 });
} catch (error) {
	console.log('Test 3b - undefined target throws:', error instanceof TypeError);
}

// Test 4: Null / Undefined sources are ignored
const target4 = { a: 1 };
console.log('Test 4 - null/undefined sources ignored:', Object.myAssign(target4, null, undefined, { b: 2 }));
// Expected: { a: 1, b: 2 }

// Test 5: Symbol-keyed properties are copied
const sym = Symbol('secret');
const symSource = { [sym]: 'shh' };
const target5 = {};
Object.myAssign(target5, symSource);
console.log('Test 5 - symbols copied:', (target5 as any)[sym]);
// Expected: "shh"

// Test 6: Getters and setters behavior
let getterCalled = false;
const getterSource = {
	get val() {
		getterCalled = true;
		return 42;
	}
};
let setterValue = null;
const setterTarget = {
	set val(v) {
		setterValue = v;
	}
};
Object.myAssign(setterTarget, getterSource);
console.log('Test 6a - getter called:', getterCalled);
console.log('Test 6b - setter called with value:', setterValue);
// Expected: true, 42

// Test 7: Prototype properties are ignored
const proto = { inherited: 'yes' };
const child = Object.create(proto);
child.own = 'no';
const target7 = {};
Object.myAssign(target7, child);
console.log('Test 7 - ignores inherited properties:', (target7 as any).inherited, (target7 as any).own);
// Expected: undefined "no"
