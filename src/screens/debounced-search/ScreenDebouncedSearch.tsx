import { useEffect, useState } from "react";
import useDebounce from "./hooks/useDebounce";
import "./debounced-search.css";

interface Post {
	id: number;
	title: string;
	body: string;
}

const DEBOUNCE_DELAY = 500;

export default function ScreenDebouncedSearch() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);

	// the only place that searches — runs whenever the debounced query changes
	useEffect(() => {
		const trimmedQuery = debouncedQuery.trim();

		if (!trimmedQuery) {
			setResults([]);
			setError(null);
			return;
		}

		let cancelled = false;

		const searchPosts = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(
					`https://jsonplaceholder.typicode.com/posts?q=${encodeURIComponent(trimmedQuery)}`,
				);

				if (!response.ok) throw new Error(`search failed: ${response.status}`);

				const posts: Post[] = await response.json();

				if (cancelled) return;
				setResults(posts);
			} catch {
				if (cancelled) return;
				setError("We couldn't run that search. Please try again.");
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		};

		searchPosts();

		return () => {
			cancelled = true;
		};
	}, [debouncedQuery]);

	const isTyping = query.trim() !== debouncedQuery.trim();
	const hasNoResults =
		!isLoading && !error && debouncedQuery.trim() && results.length === 0;

	return (
		<section className="debounced-search-screen">
			<p className="debounced-search-eyebrow">Debounced input</p>
			<h1>Debounced Search</h1>
			<p className="debounced-search-description">
				Requests fire {DEBOUNCE_DELAY}ms after you stop typing, not on every
				keystroke.
			</p>

			<input
				className="debounced-search-input"
				type="search"
				value={query}
				placeholder="Search posts..."
				aria-label="Search posts"
				onChange={(event) => setQuery(event.target.value)}
			/>

			<p className="debounced-search-status" aria-live="polite">
				{isTyping && "Waiting for you to stop typing..."}
				{!isTyping && isLoading && "Searching..."}
				{!isTyping && !isLoading && error}
				{!isTyping && hasNoResults && `No posts match "${debouncedQuery.trim()}"`}
				{!isTyping && !isLoading && !error && results.length > 0 &&
					`${results.length} result${results.length === 1 ? "" : "s"}`}
			</p>

			<div className="debounced-search-results">
				{results.map((post) => (
					<article className="debounced-search-card" key={post.id}>
						<h2>{post.title}</h2>
						<p>{post.body}</p>
					</article>
				))}
			</div>
		</section>
	);
}
