function myPromiseAll(promises) {
	return new Promise((resolve, reject) => {
		if (promises.length === 0) {
			resolve([]);
			return;
		}

		let completedCount = 0;
		const result = new Array(promises.length);

		promises.forEach((value, idx) => {
			Promise.resolve(value)
				.then((val) => {
					result[idx] = val;
					completedCount++;

					if (completedCount === promises.length) {
						resolve(result);
					}
				})
				.catch((error) => {
					reject(error);
				});
		});
	});
}

const promise1 = Promise.resolve("Data from DB");
const promise2 = new Promise((resolve) =>
	setTimeout(resolve, 2000, "User settings"),
);
const promise3 = fetch("https://jsonplaceholder.typicode.com/todos/1").then(
	(res) => res.json(),
);

const promise4 = Promise.reject("failed to fetch data");

myPromiseAll([promise1, promise2, promise3])?.then((res) => {
	console.log(res[0]);
});

// Edge case: an empty input resolves immediately with an empty array.
myPromiseAll([]).then((results) => {
	console.log("Empty input:", results); // []
});

// Rejection case: the combined promise rejects as soon as one promise rejects.
myPromiseAll([promise1, promise4])
	.then((results) => {
		console.log("Unexpected success:", results);
	})
	.catch((error) => {
		console.error("Rejected as expected:", error); // failed to fetch data
	});
