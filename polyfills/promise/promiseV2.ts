const FULFILLEDV2 = "FULFILLED";
const PENDINGV2 = "PENDING";
const REJECTEDV2 = "REJECTED";

type Status = typeof FULFILLEDV2 | typeof PENDINGV2 | typeof REJECTEDV2;

type onFullfilled<T> = (value: T) => void;
type onRejected = (reason?: unknown) => void;

type ResolveV2<T> = (value: T) => void;
type Rejected = (reason: unknown) => void;

type Context<T> = (resolve: ResolveV2<T>, rejected: Rejected) => void;

class CustomPromise<T> {
	private value: T | null;
	private reason: unknown;
	private status: Status;
	private onFullfilledCb: onFullfilled<T>[];
	private onRejectedCb: onRejected[];

	constructor(context: Context<T>) {
		this.value = null;
		this.reason = null;
		this.status = PENDINGV2;
		this.onFullfilledCb = [];
		this.onRejectedCb = [];

		const resolve: ResolveV2<T> = (value) => {
			if (this.status === PENDINGV2) {
				this.value = value;
				this.status = FULFILLEDV2;
				this.onFullfilledCb.forEach((cb) => cb(value));
			}
		};

		const reject: Rejected = (reason) => {
			if (this.status === PENDINGV2) {
				this.reason = reason;
				this.status = REJECTEDV2;
				this.onRejectedCb.forEach((cb) => cb(reason));
			}
		};

		try {
			context(resolve, reject);
		} catch (error) {
			reject(error);
		}
	}

	then<T>(onFulfilled: onFullfilled<T>, onRejected: onRejected) {
		if (this.status === FULFILLEDV2) {
			onFulfilled(this.value as T);
        }
        
        if (this.status === REJECTEDV2) {
            onRejected(this.reason);
        }

        if (this.status === PENDINGV2) {
            this.onFullfilledCb.push((value) => {
                onFulfilled(value);
            });

            this.onRejectedCb.push((reason) => {
                onRejected(reason);
            })
        }
	}
}
