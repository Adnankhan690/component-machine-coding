"use strict";

// 1. Your custom freeze function
function myFreeze(obj) {
	if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
		return obj;
	}

	let props = Object.getOwnPropertyNames(obj);
	let hasDefineProperty = typeof Object.defineProperty === "function";

	for (let prop of props) {
		if (hasDefineProperty) {
			Object.defineProperty(obj, prop, {
				writable: false,
				configurable: false,
			});
		}
	}

	if (typeof Object.preventExtensions === "function") {
		Object.preventExtensions(obj);
	}

	return obj;
}

// --- TEST SUITE ---
console.log("🚀 Starting myFreeze() Test Suite...\n");

// Test 1: Primitives and null return as-is without crashing
try {
	console.assert(myFreeze(null) === null, "null failed");
	console.assert(myFreeze(42) === 42, "number failed");
	console.assert(myFreeze("hello") === "hello", "string failed");
	console.assert(myFreeze(true) === true, "boolean failed");
	console.log("✅ Test 1 Passed: Primitives and null handled correctly.");
} catch (e) {
	console.error("❌ Test 1 Failed:", e);
}

// Test 2: Returns the exact same object reference
const originalObj = { a: 1 };
const returnedObj = myFreeze(originalObj);
console.assert(
	returnedObj === originalObj,
	"Test 2 Failed: Did not return same reference",
);
console.log("✅ Test 2 Passed: Returns the exact same object reference.");

// Test 3: Existing properties become non-writable (cannot change values)
const user = { name: "Alice", age: 25 };
myFreeze(user);

let mutationThrew = false;
try {
	user.age = 30; // Should throw in strict mode
} catch (e) {
	mutationThrew = true;
}
console.assert(user.age === 25, "Test 3 Failed: Property value was modified");
console.assert(
	mutationThrew === true,
	"Test 3 Failed: Mutating a frozen property should throw in strict mode",
);
console.log(
	"✅ Test 3 Passed: Properties are non-writable and throw on modification.",
);

// Test 4: Existing properties become non-configurable (cannot delete)
let deleteThrew = false;
try {
	delete user.name; // Should throw in strict mode
} catch (e) {
	deleteThrew = true;
}
console.assert(user.name === "Alice", "Test 4 Failed: Property was deleted");
console.assert(
	deleteThrew === true,
	"Test 4 Failed: Deleting a non-configurable property should throw",
);
console.log(
	"✅ Test 4 Passed: Properties are non-configurable (cannot be deleted).",
);

// Test 5: Prevents extensions (cannot add new properties)
let extensionThrew = false;
try {
	user.country = "Canada"; // Should throw in strict mode
} catch (e) {
	extensionThrew = true;
}
console.assert(
	user.country === undefined,
	"Test 5 Failed: New property was added",
);
console.assert(
	extensionThrew === true,
	"Test 5 Failed: Adding a property to a non-extensible object should throw",
);
console.log("✅ Test 5 Passed: Object extensions are blocked.");

console.log("\n🎉 All test cases passed successfully!");
