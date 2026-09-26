// function myPromiseAllV2<T>(promises: Promise<T>[]) {
// 	return new Promise((resolve, reject) => {
// 		if (promises.length === 0) {
// 			resolve([]);
// 			return;
// 		}

// 		const result = new Array(promises.length);
// 		let completedCount = 0;

// 		promises.forEach((promise, idx) => {
// 			Promise.resolve(promise)
// 				.then((val) => {
// 					result[idx] = val;
// 					completedCount++;

// 					if (completedCount === promises.length) {
// 						resolve(result);
// 					}
// 				})
// 				.catch((error) => {
// 					reject(error);
// 				});
// 		});
// 	});
// }

// const pro1 = new Promise((resolve) => {
// 	setTimeout(() => {
// 		resolve("Resolved after 1000ms");
// 	}, 1000);
// });

// const pro2 = Promise.reject("Rejected immediately");

// myPromiseAllV2([pro1, pro2])
// 	.then((val) => {
// 		console.log(val);
// 	})
// 	.catch((error) => {
// 		console.log(error);
// 	});

function promiseAllV3<T>(promises: Promise<T>[]) {
	return new Promise((resolve, reject) => {
		if (promises.length === 0) {
			resolve([]);
			return;
		}

		const result = new Array(promises.length);
		let count = 0;

		promises.forEach((promise, idx) => {
			Promise.resolve(promise)
				.then((val) => {
					result[idx] = val;
					count++;

					if (count === promises.length) {
						resolve(result);
					}
				})
				.catch((error) => {
					reject(error);
				});
		});
	});
}

const prr1 = new Promise((resolve) => {
	setTimeout(() => {
		resolve("completed");
	}, 1000);
});

const prr2 = Promise.reject("unable to fetch");

promiseAllV3([prr1, prr2])
	.then((val) => {
		console.log(val);
	})
	.catch((error) => {
		console.log(error);
	});
