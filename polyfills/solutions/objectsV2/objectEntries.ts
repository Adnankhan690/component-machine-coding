function myEntries(obj: unknown) {
    if (obj === null || obj === undefined) {
        throw new TypeError('can not convert null or undefined to obj');
    }

    const result = [];
    const o = Object(obj);

    for (let key in o) {
        if (Object.prototype.hasOwnProperty.call(o, key)) {
            const entry = [key, o[key]];
            result.push(entry);
        }
    }

    return result;
}

(Object as any).myEntries = myEntries;


const testObj1: Record<string, string | number> = {
    name: 'adnan',
    age: 24,
}

const objOne = {};

Object.defineProperty(objOne, 'hidden', {
    value: "khan",
    enumerable: true,
})

objOne["age"] = 12;

console.log(myEntries(objOne));