import { useCallback, useEffect, useRef, useState } from "react";
import "./infinite-scroll.css";

interface Post {
    id: number;
    title: string;
    body: string;
}

const PAGE_SIZE = 10;
const TOTAL_POSTS = 100;

export default function ScreenInfiniteScroll() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const feedRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const hasLoadedInitialPage = useRef(false);
    const requestInFlight = useRef(false);

    const hasMore = posts.length < TOTAL_POSTS;

    const loadMore = useCallback(async () => {
        if (requestInFlight.current || isLoading || !hasMore) return;

        requestInFlight.current = true;
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${PAGE_SIZE}`,
            );

            if (!response.ok) throw new Error("Unable to load posts.");

            const nextPosts: Post[] = await response.json();
            setPosts((currentPosts) => [...currentPosts, ...nextPosts]);
            setPage((currentPage) => currentPage + 1);
        } catch {
            setError("We couldn't load more posts. Please try again.");
        } finally {
            requestInFlight.current = false;
            setIsLoading(false);
        }
    }, [hasMore, isLoading, page]);

    useEffect(() => {
        if (hasLoadedInitialPage.current) return;

        hasLoadedInitialPage.current = true;
        loadMore();
    }, [loadMore]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        const feed = feedRef.current;

        if (!sentinel || !feed || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadMore();
            },
            { root: feed, rootMargin: "120px" },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, loadMore]);

    return (
        <section className="infinite-scroll-screen" aria-labelledby="infinite-scroll-title">
            <div className="infinite-scroll-heading">
                <div>
                    <p className="infinite-scroll-eyebrow">Intersection Observer</p>
                    <h1 id="infinite-scroll-title">Infinite Scroll</h1>
                    <p className="infinite-scroll-description">
                        Scroll the feed to load the next set of posts automatically.
                    </p>
                </div>
                <span className="infinite-scroll-count" aria-live="polite">
                    {posts.length} of {TOTAL_POSTS} posts
                </span>
            </div>

            <div className="infinite-scroll-feed" ref={feedRef}>
                {posts.map((post) => (
                    <article className="infinite-scroll-card" key={post.id}>
                        <span className="infinite-scroll-post-number">Post {post.id}</span>
                        <h2>{post.title}</h2>
                        <p>{post.body}</p>
                    </article>
                ))}

                <div className="infinite-scroll-status" ref={sentinelRef} aria-live="polite">
                    {isLoading && "Loading more posts..."}
                    {error && (
                        <>
                            <span>{error}</span>
                            <button type="button" onClick={loadMore}>Try again</button>
                        </>
                    )}
                    {!isLoading && !error && !hasMore && "You've reached the end of the feed."}
                </div>
            </div>
        </section>
    );
}
