function myFreeze(obj) {
    if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
        return obj;
    }

    let props = Object.getOwnPropertyNames(obj);

    for (let prop of props) {
        if (typeof Object.defineProperty === 'function') {
            Object.defineProperty(obj, prop, {
                writable: false,
                configurable: false,
            })
        }
    }

    if (Object.preventExtensions) {
        Object.preventExtensions(obj);
    }

    return obj;
}