function myAllSettled(promises) {
	return new Promise((resolve, reject) => {
		if (promises.length === 0) {
			resolve([]);
			return;
		}

		const result = new Array(promises.length);
		let completedCount = 0;

		promises.forEach((ele, idx) => {
			Promise.resolve(ele)
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

const promiseOne = Promise.resolve("Users from DB");
const promiseTwo = Promise.reject("unable to send an email");
const promiseThree = Promise.resolve("fetched new data");

myAllSettled([promiseOne, promiseTwo, promiseThree])
	.then((val) => {
		console.log(val);
	})
	.catch((error) => {
		console.log(error);
	});
