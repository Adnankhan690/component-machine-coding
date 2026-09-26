function promiseAllSettledV2<T>(promises: Promise<T>[]) {
	return new Promise((resolve, reject) => {
		if (promises.length === 0) {
			resolve([]);
			return;
		}

		const result = new Array(promises.length);
		let completedCount = 0;

		promises.forEach((promise, idx) => {
			Promise.resolve(promise)
				.then((val) => {
					result[idx] = { status: "fulfilled", value: val };
					completedCount++;

					if (completedCount === promises.length) {
						resolve(result);
					}
				})
				.catch((error) => {
					result[idx] = { status: "rejected", reason: error };
					completedCount++;

					if (completedCount === promises.length) {
						resolve(result);
					}
				});
		});
	});
}

const prom1 = new Promise((resolve) => {
	setTimeout(() => {
		resolve("resolved after 1000ms");
	}, 1000);
});

const prom2 = new Promise((_, reject) => {
	setTimeout(() => {
		reject("rejected after 1000ms");
	}, 1000);
});

promiseAllSettledV2([prom1, prom2])
	.then((val) => {
		console.log(val);
	})
	.catch((error) => {
		console.log(error);
	});

function promiseAllSettledV3<T>(promises: Promise<T>[]) {
	return new Promise((resolve, reject) => {
		if (promises.length === 0) {
			resolve([]);
			return;
		}

		const result = new Array(promises.length);
		let completedCount = 0;

		promises.forEach((promise, idx) => {
			Promise.resolve(promise).then((val) => {
				result[idx] = { status: 'fullfilled', val };
				completedCount++;

				if (completedCount === promises.length) {
					resolve(result);
				}
			}).catch((error) => {
				result[idx] = { status: 'rejected', error };
				completedCount++;

				if (completedCount === promises.length) {
					resolve(result);
				}
			})
		})
	});
}
