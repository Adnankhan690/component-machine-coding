import { useEffect, useState } from "react";
import useDebouncedV2 from "./hooks/useDebouncedV2";

interface Post {
	id: number;
	title: string;
	body: string;
}

type Status = "idle" | "pending" | "success" | "error";

export default function DebouncedV2() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [input, setInput] = useState("");
	const debouncedVal = useDebouncedV2(input, 1000);
	const [status, setStatus] = useState<Status>("idle");

	const fetchData = async () => {
		if (status === "pending") return;
		setStatus("pending");

		try {
			const data = await fetch(
				`https://jsonplaceholder.typicode.com/posts?q=${encodeURIComponent(debouncedVal)}`,
			);

			const post = await data.json();
			setPosts(post);
			setStatus("success");
		} catch (error) {
			setStatus("error");
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value.trim());
	};

	useEffect(() => {
		fetchData();
	}, [debouncedVal]);

	return (
		<div>
			V2 debounced
			<div>
				<input value={input} onChange={handleInputChange} />
				<div>
					{posts.map((post) => {
						return <div key={post.id}>{post.title}</div>;
					})}
				</div>
			</div>
		</div>
	);
}
