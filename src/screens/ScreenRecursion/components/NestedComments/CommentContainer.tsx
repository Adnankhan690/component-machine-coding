import "./comment-container.css";
import Comment from "./Comment";
import { CommentsConfig } from "./constants";

interface CommentContainerProps {
	config: CommentsConfig[];
	onDelete: (id: string) => void;
	onAddComment: (id: string, value: string) => void;
	onLike: (id: string, value: number) => void;
}

export default function CommentContainer({
	config,
	onDelete,
    onAddComment,
    onLike
}: CommentContainerProps) {
	return (
		<div className="comment-container">
			{config?.map((comment) => {
				return (
					<div key={comment.id}>
                        <Comment
                            onLike={onLike}
							onAddComment={onAddComment}
							onDelete={onDelete}
							{...comment}
						/>
						{comment.children ? (
							<CommentContainer
								onLike={onLike}
								onAddComment={onAddComment}
								onDelete={onDelete}
								config={comment.children}
							/>
						) : null}
					</div>
				);
			})}
		</div>
	);
}
