function promiseAnyV2<T>(promises: Promise<T>[]) {
	return new Promise((resolve, reject) => {
		if (promises.length === 0) {
			return reject(new AggregateError([], "promises is empty"));
		}

		const result = new Array(promises.length);
		let errorCount = 0;

		promises.forEach((promise, idx) => {
			Promise.resolve(promise)
				.then((val) => {
					resolve(val);
				})
				.catch((error) => {
					errorCount++;

					if (errorCount === promises.length) {
						reject(new AggregateError([], "All promises were rejected"));
					}
				});
		});
	});
}

const promi1 = new Promise((resolve) => {
	setTimeout(() => {
		resolve("resolved after 1000ms");
	}, 1000);
});

const promi2 = new Promise((_, reject) => {
	setTimeout(() => {
		reject("resolved after 1000ms");
	}, 1000);
});

const promi3 = new Promise((_, reject) => {
	setTimeout(() => {
		reject("resolved after 1000ms");
	}, 1000);
});

promiseAnyV2([promi3, promi2])
	.then((val) => {
		console.log(val);
	})
	.catch((error) => {
		console.log(error);
	});
