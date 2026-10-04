import "./nested-comment.css";
import { useState } from "react";
import NestedComment from "./components/nestedComment";

interface Comments {
	comment: string;
	id: string;
	child: Comments[] | [];
}

export default function NestedComments() {
	const [comments, setComments] = useState<Comments[]>([]);
	const [comment, setComment] = useState("");
	const [reply, setReply] = useState({ id: "", value: "" });

	const handleAddComment = (title: string) => {
		setComments((prev) => {
			return [{ comment: title, id: String(new Date()), child: [] }, ...prev];
		});
	};

	const handleChangeComment = (e: React.ChangeEvent<HTMLInputElement>) => {
		setComment(e.target.value.trim());
	};

	const handleReply = (id: string) => {
		setReply({ id: id, value: "" });
	};

	const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setReply((prev) => ({
			id: prev.id,
			value: e.target.value.trim(),
		}));
	};

    const handleAddReply = (id: string) => {
			const add = (nestedCom: Comments[]): Comments[] =>
				nestedCom.map((com) => {
					if (com.id === id) {
						const newReply: Comments = {
							id: crypto.randomUUID(),
							comment: reply.value,
							child: [],
						};
						return { ...com, child: [...com.child, newReply] };
					}
					return { ...com, child: add(com.child) };
				});

			setComments((prev) => add(prev));
			setReply({ id: "", value: "" });
		};
    

	return (
		<section className="nested-comments-screen">
			<h1>Nested Comments</h1>

			{/* <div>
				<input placeholder="Enter..." onChange={handleChangeComment} />
				<button
					onClick={() => {
						handleAddComment(comment);
					}}>
					add
				</button>
			</div>

			<div className="nested-main-con">
				{comments.map((comment, idx) => (
					<CommentNode
						key={comment.id}
						com={comment}
						reply={reply}
						onReply={handleReply}
						onReplyChange={handleReplyChange}
						onAddReply={handleAddReply}
					/>
				))}
			</div> */}

            <NestedComment />
		</section>
	);
}


function CommentNode({ com, reply, onReply, onReplyChange, onAddReply }) {
	return (
		<div className="nested-con">
			<div className="controls">
				<p>{com.comment}</p>
				{com.id !== reply.id ? (
					<button onClick={() => onReply(com.id)}>reply</button>
				) : (
					<div>
						<input placeholder="Reply ?" onChange={onReplyChange} />
						<button onClick={() => onAddReply(com.id)}>add</button>
					</div>
				)}
			</div>

			{com.child.map((childCom) => (
				<CommentNode
					key={childCom.id}
					com={childCom}
					reply={reply}
					onReply={onReply}
					onReplyChange={onReplyChange}
					onAddReply={onAddReply}
				/>
			))}
		</div>
	);
}
