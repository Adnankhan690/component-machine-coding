function myPick(source, keys) {
	if (source === null || source === undefined) {
		throw new TypeError("can not convert null or undefined to obj");
	}

	// if (typeof source[Symbol.iterator] !== "function") {
	// 	throw new TypeError(`${source} does not have an iterator`);
	// }

	const result = {};
	let O = Object(source);

	for (let key of keys) {
		if (Object.prototype.hasOwnProperty.call(O, key)) {
			result[key] = O[key];
		}
	}

	return result;
}

Object.myPick = myPick;

const sourceObj = { a: 1, b: 2, c: 3 };

console.log(
    Object.myPick(sourceObj, ['a', 'b'])
)

const set = new Set(['a', 'c']);
console.log(Object.myPick(sourceObj, set));

const parentObject = { inheritedInfo: "dna" };
const childObject = Object.create(parentObject);
childObject.name = "adnan";

console.log(
    Object.myPick(childObject, ['inheritedInfo', 'name'])
)

const symKey = Symbol("name");
const secrectObj = { [symKey]: "ssh", hidden: "yes" };
console.log(
    Object.myPick(secrectObj, [symKey])
)