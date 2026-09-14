const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function withRetry<T>(
	fn: () => Promise<T>,
	retries = 3,
	delay = 500,
): Promise<T> {
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			if (attempt === retries) throw error;
			await sleep(delay);
		}
	}

	throw new Error("unreachable");
}

async function fetchTodo(id: number) {
	const response = await fetch(
		`https://jsonplaceholder.typicode.com/todos/${id}`,
	);

	if (!response.ok) throw new Error(`failed to fetch api: ${response.status}`);

	return response.json();
}

withRetry(() => fetchTodo(1))
	.then((data) => console.log(data, "res"))
	.catch((error) => console.log(error, "all attempts failed"));
