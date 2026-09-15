function myObjectValues(obj: unknown) {
    if (obj === null || obj === undefined) {
        throw new TypeError('Can not convert null or undfined to object');
    }

    const result = [];
    const o = Object(obj);

    for (let key in o) {
        if (Object.prototype.hasOwnProperty.call(o, key)) {
            result.push(o[key]);
        }
    }

    return result;
}

(Object as any).myValues = myObjectValues;

if (!Object.values) {
    Object.values = myObjectValues;
}