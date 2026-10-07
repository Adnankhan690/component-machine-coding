function myFreeze(obj) {
	if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
		return obj;
	}

	let props = Object.getOwnPropertyNames(obj);

	// Check once outside the loop
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

const obj1 = { name: "adnan", age: 23 };
myFreeze(obj1);

obj1['name'] = "khan";
console.log(obj1);
