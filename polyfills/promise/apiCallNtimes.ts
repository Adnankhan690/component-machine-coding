async function retryApiNTimes(n: number) {
	if (n === maxAttempts) return;
	try {
		const response = await fetch(
			"https://jsonplaceholder.typicode.com/todos/10000",
		);

		if (!response.ok) {
			retryApiNTimes(n + 1);
			throw new Error("failed to fetch api");
		}

		const data = await response.json();
		console.log(data, "res");
	} catch (error) {
		console.log(error, "EError");
	}
}

const maxAttempts = 5;


function callNTimes() {
	let count = 0;

	retryApiNTimes(count);
}

callNTimes();
