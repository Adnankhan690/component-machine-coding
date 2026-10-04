import "./nested-comment.css";
import { useState } from "react";

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
		const add = (nestedCom: Comments[]) => {
			nestedCom.map((com) => {
				if (com.id === id) {
					return {};
				}
				return { com, child: com.child.length !== 0 ? add(com.child) : [] };
			});
		};

		setComments((prev) => {
			return;
		});
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

			<div className="nested-main-con">
				{comments.map((comment, idx) => (
					<div className="nested-con" key={comment.id}>
						<div className="controls">
							<p>{comment.comment}</p>
							{comment.id !== reply.id ? (
								<button
									onClick={() => {
										handleReply(comment.id);
									}}>
									reply
								</button>
							) : (
								<div>
									<input placeholder="Reply ?" onChange={handleReplyChange} />
									<button
										onClick={() => {
											handleAddReply(comment.id);
										}}>
										add
									</button>
								</div>
							)}
							{/* <button>delete</button> */}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
