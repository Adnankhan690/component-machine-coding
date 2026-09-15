function objectKeys(obj: unknown) {
	if (obj === null || obj === undefined) {
		throw new TypeError("Cannot convert undefined or null to object");
	}

	const result = [];
	const o = Object(obj);

	for (let key in o) {
		if (Object.prototype.hasOwnProperty.call(o, key)) {
			result.push(key);
		}
	}

	return result;
}
