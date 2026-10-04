import { useState } from "react";

interface Comments {
	comment: string;
	id: string;
	child: Comments;
}

export default function NestedComments() {
	const [comments, setComments] = useState<Comments[]>([]);
	const [comment, setComment] = useState("");

	const handleAddComment = (title: string) => {};

	const handleChangeComment = (e: React.ChangeEvent<HTMLInputElement>) => {
		setComment(e.target.value.trim());
	};

	return (
		<section className="nested-comments-screen">
			<h1>Nested Comments</h1>

			<div>
				<input placeholder="Enter..." onChange={handleChangeComment} />
				<button
					onClick={() => {
						handleAddComment(comment);
					}}>
					add
				</button>
			</div>

			{comments.map((comment, idx) => (
				<div key={comment.id}>
					<div>
						<p>{comment.comment}</p>
						<button>reply</button>
						{/* <button>delete</button> */}
					</div>
				</div>
			))}
		</section>
	);
}
