function myPromiseRaceV2<T>(promises: Promise<T>[]) {
	return new Promise((resolve, reject) => {
		promises.forEach((promise, idx) => {
			Promise.resolve(promise).then(
				(val) => {
					resolve(val);
				},
				(error) => {
					reject(error);
				},
			);
		});
	});
}

const timer = new Promise((_, reject) => {
	setTimeout(() => {
		reject("rejected after 2second");
	}, 1000);
});

const data = fetch("https://jsonplaceholder.typicode.com/todos/1").then((res) =>
	res.json(),
);

myPromiseRaceV2([timer, data])
	.then((val) => {
		console.log(val);
	})
	.catch((error) => console.log(error));
