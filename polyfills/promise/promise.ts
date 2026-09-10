const FULFILLED = "FULFILLED";
const PENDING = "PENDING";
const REJECTED = "REJECTED";

/** `typeof PENDING` is the literal `"PENDING"` because the consts are `const`. */
type PromiseStatus = typeof PENDING | typeof FULFILLED | typeof REJECTED;

type Resolve<T> = (value: T) => void;
type Reject = (reason?: unknown) => void;
/** The function you pass to `new MyPromise(...)`. */
type Executor<T> = (resolve: Resolve<T>, reject: Reject) => void;

/** Handlers stored while the promise is still PENDING. */
type OnFulfilled<T> = (value: T) => void;
type OnRejected = (reason: unknown) => void;

class MyPromise<T> {
	private value: T | null;
	private reason: unknown;
	private status: PromiseStatus;
	private onFulfilledCb: OnFulfilled<T>[];
	private onRejectedCb: OnRejected[];

	constructor(context: Executor<T>) {
		this.value = null;
		this.reason = null;
		this.status = PENDING;
		this.onFulfilledCb = [];
		this.onRejectedCb = [];

		const resolve: Resolve<T> = (value) => {
			if (this.status === PENDING) {
				this.value = value;
				this.status = FULFILLED;
				// `as T` because TS can't see that status === FULFILLED implies
				// value is set. See the discriminated-union variant to avoid this.
				this.onFulfilledCb.forEach((cb) => cb(this.value as T));
			}
		};

		const rejected: Reject = (reason) => {
			if (this.status === PENDING) {
				this.reason = reason;
				this.status = REJECTED;
				this.onRejectedCb.forEach((cb) => cb(this.reason));
			}
		};

		try {
			context(resolve, rejected);
		} catch (error) {
			rejected(error);
		}
	}

	/**
	 * Returns `void` — this implementation doesn't chain yet. Both handlers are
	 * required because they're called unconditionally below.
	 */
	then(onFulfilled: OnFulfilled<T>, onRejected: OnRejected): void {
		if (this.status === FULFILLED) {
			try {
				onFulfilled(this.value as T);
			} catch (error) {}
		}

		if (this.status === REJECTED) {
			try {
				onRejected(this.reason);
			} catch (error) {}
		}

		if (this.status === PENDING) {
			this.onFulfilledCb.push((value) => {
				try {
					onFulfilled(value);
				} catch (error) {}
			});

			this.onRejectedCb.push((reason) => {
				try {
					onRejected(reason);
				} catch (error) {}
			});
		}
	}
}

// T is inferred as string from the resolve() call.
const myPromise1 = new MyPromise<string>((resolve, _reject) => {
	setTimeout(() => {
		resolve("custom promise is settled");
	}, 1000);
});

myPromise1.then(
	(result) => {
		console.log(result.toUpperCase()); // result: string
	},
	(error) => {
		console.log(error); // error: unknown
	},
);
