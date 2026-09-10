const FULFILLED = 'FULFILLED';
const PENDING = 'PENDING';
const REJECTED = 'REJECTED';

class MyPromise {
    constructor(context) {
        this.value = null;
        this.reason = null;
        this.status = PENDING;
    }

    const resolve = (value) => {
        if (this.status === PENDING) {
            this.value = value;
            this.status = FULFILLED;
        }
    }

    const rejected = (reason) => {
        if (this.status === PENDING) {
            this.reason = reason;
            this.status = REJECTED;
        }
    }

    try {
        context(resolve, rejected);
    } catch(error) {
        rejected(error);
    }
}

then