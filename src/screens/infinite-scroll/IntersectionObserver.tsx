import "./infinite-scroll.css";
import { useState, useEffect, useRef, useCallback } from "react";

interface Post {
	id: number;
	title: string;
	body: string;
}

const PAGE_SIZE = 10;

export default function InterSectionObserver() {
	const [page, setCurrentPage] = useState(1);
	const [data, setData] = useState<Post[]>([]);
	const sentinelRef = useRef<HTMLDivElement | null>(null);
	const infiniteConRef = useRef<HTMLDivElement | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const flightReqRef = useRef(false);

	const fetchData = useCallback(async (currentPage = 1) => {
		if (flightReqRef.current) return;

		flightReqRef.current = true;
		setIsLoading(true);

		try {
			const response = await fetch(
				`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${PAGE_SIZE}`,
			);

			const responseData = await response.json();
			setData((prev) => {
				return [...prev, ...responseData];
			});
			setCurrentPage((prev) => prev + 1);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
			flightReqRef.current = false;
		}
	}, []);

	// const handleScroll = useCallback(
	// 	(event: UIEvent<HTMLDivElement>) => {
	// 		const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

	// 		const diff = scrollHeight - scrollTop - clientHeight;

	// 		if (diff <= 120) {
	// 			fetchData();
	// 		}
	// 	},
	// 	[fetchData],
	// );

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		const infiniteRoot = infiniteConRef.current;
		const sentinel = sentinelRef.current;

		if (!infiniteRoot || !sentinel) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const isIntersecting = entries[0].isIntersecting;
				if (isIntersecting) {
					fetchData(page);
				}
			},
			{ root: infiniteRoot, scrollMargin: "120px" },
		);

		observer.observe(sentinel);

		return () => {
			observer.disconnect();
		};
	}, [page]);

	return (
		<div
			className="scroll-con"
			ref={infiniteConRef}
			// onScroll={handleScroll}
		>
			<div className="content-con">
				{data.map((post) => {
					return (
						<div key={post.id}>
							<p>{post.title}</p>
							<p>{post.body}</p>
						</div>
					);
				})}
			</div>
			<div className="sentinel-con" ref={sentinelRef}>
				<p>Load more...</p>
			</div>
		</div>
	);
}
