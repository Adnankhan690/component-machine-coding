import { useState } from "react";
import "./comment.css";
import { Heart } from "lucide-react";

interface CommentProps {
	value: string;
	id: string;
	likes: number;
	onDelete: (id: string) => void;
	onAddComment: (id: string, value: string) => void;
	onLike: (id: string, value: number) => void;
}

export default function Comment({
	id,
	value,
	likes,
	onDelete,
	onLike,
	onAddComment,
}: CommentProps) {
	const [comment, setComment] = useState("");
	const [toggleAdd, setToggleAdd] = useState(false);
	const [like, setLike] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setComment(e.target.value);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleAddComment();
		}
	};

	const handleAddComment = () => {
		if (toggleAdd && comment.trim()) {
			onAddComment(id, comment);
			setComment("");
			setToggleAdd(false);
		} else {
			setToggleAdd(!toggleAdd);
		}
	};

	const handleLike = () => {
		!like && onLike(id, likes + 1);
		like && onLike(id, likes - 1);
		setLike(!like);
	};

	return (
		<div className="comment-con">
			<strong>{value}</strong>

			<div className="comment-actions">
				{toggleAdd && (
					<input
						type="text"
						placeholder="Type your thoughts..."
						onKeyDown={handleKeyDown}
						value={comment}
						onChange={(e) => handleInputChange(e)}
						autoFocus
					/>
				)}
				<button className="add-btn-con" onClick={handleAddComment}>
					{toggleAdd ? "Post" : "Reply"}
				</button>
				{toggleAdd && (
					<button
						className="cancel-btn"
						onClick={() => {
							setToggleAdd(false);
							setComment("");
						}}>
						Cancel
					</button>
				)}
				{!toggleAdd && (
					<button className="delete-btn" onClick={() => onDelete(id)}>
						Delete
					</button>
				)}

				<button
					className={`like-btn ${like ? "active" : ""}`}
					onClick={handleLike}>
					<Heart />
					<span>{likes}</span>
				</button>
			</div>
		</div>
	);
}
