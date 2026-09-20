import { useState, useEffect } from "react";
import useDebounceV1 from "./hooks/useDebounceV1";

interface Post {
	id: number;
	title: string;
	body: string;
}

type Status = "idle" | "pending" | "success" | "error";

export default function DebouncedV1() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState<Status>("idle");
	const [error, setError] = useState<string | null>(null);
	const debouncedVal = useDebounceV1({ value: query, delay: 2000 });

	const fetchData = async () => {
		setStatus("pending");
		try {
			const response = await fetch(
				`https://jsonplaceholder.typicode.com/posts?q=${encodeURIComponent(debouncedVal)}`,
			);
			if (!response.ok) {
				throw new Error("failed to fetch posts");
			}
			const data = await response.json();
			setPosts(data);
			setStatus("success");
		} catch (error) {
			console.log(error);
			setStatus("error");
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setQuery(value);
	};

	useEffect(() => {
		fetchData();
	}, [debouncedVal]);

	return (
		<div>
			<label htmlFor="debounced-search">Search: </label>
			<input
				id="debounced-search"
				placeholder="Enter value to search..."
				value={query}
				onChange={(e) => handleInputChange(e)}
			/>
			<p>result: {posts.length}</p>
			<div>
				{posts.map((post) => (
					<div key={post.id}>
						<p>
							<section>{post.title}</section>
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
