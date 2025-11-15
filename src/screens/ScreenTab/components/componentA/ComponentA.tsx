import { fetchData } from "@/app/api/ApiMethods";
import { ApiRoutes } from "@/app/api/ApiRoutes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Comment {
	id: number;
	name: string;
	email?: string;
	body?: string;
}

export default function ComponentA() {
	const navigate = useNavigate();
	const [comments, setComments] = useState<Comment[]>([]);

	useEffect(() => {
		const commentsData = async () => {
			const resultData = await fetchData(
				ApiRoutes.JSON_PLACEHOLDER_COMMENTS,
				navigate
			);
			setComments(resultData);
		};

		commentsData();
	}, []);

	return (
		<div>
			{comments.map((comment) => (
				<div key={comment.id}>
					<li>{comment.name}</li>
				</div>
			))}
		</div>
	);
}
