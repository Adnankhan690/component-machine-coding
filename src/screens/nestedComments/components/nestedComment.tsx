import "./nested-com.css";
import { useState } from "react";

interface Comment {
	id: string;
	title: string;
	child: Comment[] | [];
}

interface Reply {
	id: string;
	value: string;
}

export default function NestedComment() {
	const [comments, setComments] = useState<Comment[]>([]);
	const [comment, setComment] = useState("");
	const [reply, setReply] = useState<Reply>({ id: "", value: "" });

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setComment(e.target.value.trim());
	};

	const handleAddComment = () => {
		setComments((prev) => [
			...prev,
			{ id: crypto.randomUUID(), title: comment, child: [] },
		]);
	};

	const handleReply = (id: string) => {
		setReply({ id, value: "" });
	};

	const handleChangeReply = (e: React.ChangeEvent<HTMLInputElement>) => {
		setReply((prev) => ({ ...prev, value: e.target.value.trim() }));
	};

	const handleAddReply = (id: string) => {
		const add = (comments: Comment[]): Comment[] => {
			return comments.map((comment) => {
				if (comment.id === id) {
					const newComment = {
						id: crypto.randomUUID(),
						title: reply.value,
						child: [],
					};

					return { ...comment, child: [newComment, ...comment.child] };
				}

				return { ...comment, child: add(comment.child) };
			});
		};

		setComments((prev) => {
			return add(prev);
		});
		setReply({ id: "", value: "" });
	};

	return (
		<div>
			<input
				placeholder="Enter something"
				value={comment}
				onChange={handleInputChange}
			/>
			<button onClick={handleAddComment}>Add</button>
			<div className="main-con">
				{comments.map((comment, idx) => (
					<Nodes
						key={idx}
						reply={reply}
						comment={comment}
						handleReply={handleReply}
						handleChangeReply={handleChangeReply}
						handleAddReply={handleAddReply}
					/>
				))}
			</div>
		</div>
	);
}

interface Nodesprop {
	comment: Comment;
	handleReply: (id: string) => void;
	reply: Reply;
	handleChangeReply: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleAddReply: (id: string) => void;
}

function Nodes({
	comment,
	handleReply,
	reply,
	handleChangeReply,
	handleAddReply,
}: Nodesprop) {
	return (
		<div className="nested-con">
			<div className="control">
				<p>{comment.title}</p>
				{reply.id === comment.id ? (
					<>
						<input
							placeholder="reply ?"
							value={reply.value}
							onChange={handleChangeReply}
						/>
						<button onClick={() => handleAddReply(comment.id)}>add</button>
					</>
				) : (
					<button onClick={() => handleReply(comment.id)}>reply</button>
				)}
			</div>

			{comment.child.map((com) => (
				<Nodes
					comment={com}
					handleAddReply={handleAddReply}
					handleChangeReply={handleChangeReply}
					handleReply={handleReply}
					reply={reply}
				/>
			))}
		</div>
	);
}
