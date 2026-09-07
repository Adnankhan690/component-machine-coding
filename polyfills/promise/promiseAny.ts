function myPromiseAny(promises) {
	return new Promise((resolve, reject) => {
		// const promiseArray =
		if (promises.length === 0) {
			return reject(new AggregateError([], "All promises were rejected"));
		}

		const errors = new Array(promises.length);
		let errorCount = 0;

		promises.forEach((promise, idx) => {
			Promise.resolve(promise)
				.then((ele) => {
					resolve(ele);
				})
				.catch((error) => {
					errorCount++;
					errors[idx] = error;

					if (errorCount === promises.length) {
						reject(new AggregateError([], "All promises were rejected"));
					}
				});
		});
	});
}

const promiseOneReject = Promise.reject("Rjected promise 1");
const promiseThreeReject = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("resolved in a timeout after 1sec");
    }, 1000)
})
const promiseTwoSucc1 = Promise.reject("Resolved 1");
const promiseTwoSucc2 = Promise.reject("Resolved 2");

myPromiseAny([
	promiseOneReject,
	promiseTwoSucc1,
	promiseTwoSucc2,
	promiseThreeReject,
])
	.then((res) => {
		console.log(res);
	})
	.catch((error) => {
		console.log(error);
	});
