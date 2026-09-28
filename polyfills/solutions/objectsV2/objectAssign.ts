// if (typeof Object.assign !== "function") {
// 	Object.defineProperty(Object, "assign", {
// 		value: function (target, ...sources) {
// 			// 1. Throw TypeError if target is null or undefined
// 			if (target === null || target === undefined) {
// 				throw new TypeError("Cannot convert undefined or null to object");
// 			}

// 			// 2. Convert target to an Object (handles primitive wrappers like strings/numbers)
// 			const toObject = Object(target);

// 			// 3. Loop through each source object
// 			for (let i = 0; i < sources.length; i++) {
// 				const nextSource = sources[i];

// 				// 4. Ignore null and undefined sources
// 				if (nextSource !== null && nextSource !== undefined) {
// 					// 5. Copy string-keyed enumerable properties
// 					for (const nextKey in nextSource) {
// 						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
// 							toObject[nextKey] = nextSource[nextKey];
// 						}
// 					}

// 					// 6. Copy symbol-keyed properties (to match native behavior)
// 					if (typeof Object.getOwnPropertySymbols === "function") {
// 						const symbols = Object.getOwnPropertySymbols(nextSource);
// 						for (let j = 0; j < symbols.length; j++) {
// 							const symbolKey = symbols[j];
// 							// Check if the symbol property is enumerable
// 							if (
// 								Object.prototype.propertyIsEnumerable.call(
// 									nextSource,
// 									symbolKey,
// 								)
// 							) {
// 								toObject[symbolKey] = nextSource[symbolKey];
// 							}
// 						}
// 					}
// 				}
// 			}

// 			// 7. Return the mutated target object
// 			return toObject;
// 		},
// 		writable: true,
// 		configurable: true,
// 	});
// }

function myCustomAssign(target, ...sources) {
	// if (target === null || target === undefined) {
	// 	throw new TypeError("can not convert null or undefined to object");
	// }

	// const result = Object(target);

	// for (let i = 0; i < source.length; i++) {
	//     const nextSource = source[i];

	// 		for (let key in nextSource) {
	// 			if (Object.prototype.hasOwnProperty.call(nextSource, key)) {
	// 				result[key] = nextSource[key];
	// 			}
	// 		}

	// 		if (typeof Object.getOwnPropertySymbols === "function") {
	// 			const symbols = Object.getOwnPropertySymbols(nextSource);

	// 			for (let i = 0; i < symbols.length; i++) {
	// 				const key = symbols[i];
	// 				if (Object.prototype.propertyIsEnumerable.call(nextSource, key)) {
	// 					result[key] = nextSource[key];
	// 				}
	// 			}
	// 		}
	// 	}

	// return result;

	if (target === null || target === undefined) {
		throw new TypeError("Cannot convert undefined or null to object");
	}

	// 2. Convert target to an Object (handles primitive wrappers like strings/numbers)
	const toObject = Object(target);

	// 3. Loop through each source object
	for (let i = 0; i < sources.length; i++) {
		const nextSource = sources[i];

		// 4. Ignore null and undefined sources
		if (nextSource !== null && nextSource !== undefined) {
			// 5. Copy string-keyed enumerable properties
			for (const nextKey in nextSource) {
				if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
					toObject[nextKey] = nextSource[nextKey];
				}
			}

			// 6. Copy symbol-keyed properties (to match native behavior)
			if (typeof Object.getOwnPropertySymbols === "function") {
				const symbols = Object.getOwnPropertySymbols(nextSource);
				for (let j = 0; j < symbols.length; j++) {
					const symbolKey = symbols[j];
					// Check if the symbol property is enumerable
					if (
						Object.prototype.propertyIsEnumerable.call(nextSource, symbolKey)
					) {
						toObject[symbolKey] = nextSource[symbolKey];
					}
				}
			}
		}
	}

	// 7. Return the mutated target object
	return toObject;
}

const src = { name: "adnan" };
const src2 = {he: "sds"}
const trg = { age: 23 };

const res = myCustomAssign(trg, src, src2);
console.log(res);

// test-case 2
const str1 = { view: "yes" };
Object.defineProperty(str1, "secret", {
    value: "123",
    enumerable: false,
})
const trg2 = {target2: "target2"}

const res2 = myCustomAssign(trg2, str1)
console.log(res2);


