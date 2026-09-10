const FULFILLED = "FULFILLED";
const PENDING = "PENDING";
const REJECTED = "REJECTED";

class MyPromise {
	constructor(context) {
		this.value = null;
		this.reason = null;
		this.status = PENDING;
		this.onFulfilled = [];
		this.onRejected = [];

		const resolve = (value) => {
			if (this.status === PENDING) {
				this.value = value;
				this.status = FULFILLED;
				this.onFullfilled.forEach((cb) => cb(this.value));
			}
		};

		const rejected = (reason) => {
			if (this.status === PENDING) {
				this.reason = reason;
				this.status = REJECTED;
				this.onRejected.forEach((cb) => cb(this.reason));
			}
		};

		try {
			context(resolve, rejected);
		} catch (error) {
			rejected(error);
		}
	}

	then(onFullfilled, onRejected) {
		if (this.status === FULFILLED) {
			try {
				onFullfilled(this.value);
			} catch (error) {}
		}

		if (this.status === REJECTED) {
			try {
				onRejected(this.reason);
			} catch (error) {}
		}

		if (this.status === PENDING) {
			try {
				this.onFullfilled.push(onFullfilled);
			} catch (error) {}

			this.onFullfilled.push((value) => {
				try {
					onFullfilled(value);
				} catch (error) {}
			});

			this.onRejected.push((reason) => {
				try {
					onRejected(reason);
				} catch (error) {}
			});
		}
	}
}
