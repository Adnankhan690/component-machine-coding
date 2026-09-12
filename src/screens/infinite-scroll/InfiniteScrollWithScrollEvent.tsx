import { useCallback, useEffect, useRef, useState, type UIEvent } from "react";

interface Post {
	id: number;
	title: string;
	body: string;
}

const PAGE_SIZE = 10;
const TOTAL_POSTS = 100;
const LOAD_AHEAD_DISTANCE = 120;

export default function InfiniteScrollWithScrollEvent() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasMore, setHasMore] = useState(true);
	const nextPageRef = useRef(1);
	const requestInFlightRef = useRef(false);
	const hasLoadedInitialPageRef = useRef(false);

	const loadMore = useCallback(async () => {
		if (requestInFlightRef.current || !hasMore) return;

		requestInFlightRef.current = true;
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(
				`https://jsonplaceholder.typicode.com/posts?_page=${nextPageRef.current}&_limit=${PAGE_SIZE}`,
			);

			if (!response.ok) throw new Error("Unable to load posts.");

			const nextPosts: Post[] = await response.json();
			setPosts((currentPosts) => [...currentPosts, ...nextPosts]);
			nextPageRef.current += 1;

			if (nextPosts.length < PAGE_SIZE || nextPageRef.current > TOTAL_POSTS / PAGE_SIZE) {
				setHasMore(false);
			}
		} catch {
			setError("We couldn't load more posts. Please try again.");
		} finally {
			requestInFlightRef.current = false;
			setIsLoading(false);
		}
	}, [hasMore]);

	useEffect(() => {
		if (hasLoadedInitialPageRef.current) return;

		hasLoadedInitialPageRef.current = true;
		void loadMore();
	}, [loadMore]);

	const handleScroll = useCallback(
		(event: UIEvent<HTMLDivElement>) => {
			const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
			const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

			if (distanceFromBottom <= LOAD_AHEAD_DISTANCE) void loadMore();
		},
		[loadMore],
	);

	return (
		<section className="infinite-scroll-screen" aria-labelledby="infinite-scroll-title">
			<div className="infinite-scroll-heading">
				<div>
					<p className="infinite-scroll-eyebrow">Scroll event</p>
					<h1 id="infinite-scroll-title">Infinite Scroll</h1>
					<p className="infinite-scroll-description">
						Scroll near the bottom of the feed to load more posts.
					</p>
				</div>
				<span className="infinite-scroll-count" aria-live="polite">
					{posts.length} of {TOTAL_POSTS} posts
				</span>
			</div>

			<div className="infinite-scroll-feed" onScroll={handleScroll}>
				{posts.map((post) => (
					<article className="infinite-scroll-card" key={post.id}>
						<span className="infinite-scroll-post-number">Post {post.id}</span>
						<h2>{post.title}</h2>
						<p>{post.body}</p>
					</article>
				))}

				<div className="infinite-scroll-status" aria-live="polite">
					{isLoading && "Loading more posts..."}
					{error && (
						<>
							<span>{error}</span>
							<button type="button" onClick={() => void loadMore()}>
								Try again
							</button>
						</>
					)}
					{!isLoading && !error && !hasMore && "You've reached the end of the feed."}
				</div>
			</div>
		</section>
	);
}
