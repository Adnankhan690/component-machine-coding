function myPromiseRace(promises) {
	return new Promise((resolve, reject) => {
		promises.forEach((ele, idx) => {
			Promise.resolve(ele)
				.then((value) => {
					resolve(value);
				})
				.catch((error) => {
					reject(error);
				});
		});
	});
}

const timer = new Promise((_, reject) => {
	setTimeout(() => {
		reject(new Error("Request timed out!"));
	}, 2000);
});

const data = fetch("https://jsonplaceholder.typicode.com/todos/1").then((res) =>
	res.json(),
);

myPromiseRace([timer, data])
	.then((value) => {
		console.log("Data received", value);
	})
	.catch((error) => {
		console.error("Failed", error);
    });
    
