function myPick(obj) {
    if (obj === null || obj === undefined) {
        throw new TypeError("can not convert null or undefined to obj");
    }

    const result = [];
    let O = Object(obj);

    // if()

    for (let key in O) {
        if (Object.prototype.hasOwnProperty.call(O, key)) {
            result[key] = O[key];
        }
    }

    return O;
}