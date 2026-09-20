// https://share.gemini.google/Gp0FqnApXCMK
import "./infinite-scroll.css";
import { useState, useEffect, useRef, useCallback } from "react";

interface Post {
	id: number;
	title: string;
	body: string;
}

const PAGE_SIZE = 10;

export default function InterSectionObserver() {
	const [data, setData] = useState<Post[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	// 1. Track page and lock via refs so they don't trigger re-renders or effect re-runs
	const pageRef = useRef(1);
	const flightReqRef = useRef(false);
	const hasMoreRef = useRef(true);

	const sentinelRef = useRef<HTMLDivElement | null>(null);
	const infiniteConRef = useRef<HTMLDivElement | null>(null);

	// 2. Accept page as an argument (your preferred pattern)
	const fetchData = useCallback(async (targetPage: number) => {
		if (flightReqRef.current || !hasMoreRef.current) return;

		flightReqRef.current = true;
		setIsLoading(true);

		try {
			const response = await fetch(
				`https://jsonplaceholder.typicode.com/posts?_page=${targetPage}&_limit=${PAGE_SIZE}`,
			);
			const responseData: Post[] = await response.json();

			if (responseData.length === 0) {
				hasMoreRef.current = false;
			} else {
				setData((prev) => [...prev, ...responseData]);
				pageRef.current += 1; // Safely increment the ref for the next fetch
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
			flightReqRef.current = false;
		}
	}, []);

	// 3. Initial fetch on mount
	useEffect(() => {
		fetchData(pageRef.current);
	}, [fetchData]);

	// 4. Observer is setup ONCE and never destroyed/rebuilt mid-scroll
	useEffect(() => {
		const infiniteRoot = infiniteConRef.current;
		const sentinel = sentinelRef.current;

		if (!sentinel) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					// Pass the current page ref value as an argument!
					fetchData(pageRef.current);
				}
			},
			{ root: infiniteRoot, rootMargin: "120px" },
		);

		observer.observe(sentinel);

		return () => {
			observer.disconnect();
		};
	}, [fetchData]); // Only depends on fetchData, which is stable via useCallback

	return (
		<div className="scroll-con" ref={infiniteConRef}>
			<div className="content-con">
				{data.map((post) => (
					<div key={post.id}>
						<p>{post.title}</p>
						<p>{post.body}</p>
					</div>
				))}
			</div>
			<div className="sentinel-con" ref={sentinelRef}>
				{isLoading && <p>Loading more...</p>}
				{!hasMoreRef.current && <p>No more posts.</p>}
			</div>
		</div>
	);
}
