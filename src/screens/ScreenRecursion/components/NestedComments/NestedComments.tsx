import { useState } from "react";
import { COMMENTS_CONFIG, CommentsConfig } from "./constants";
import CommentContainer from "./CommentContainer";

export default function NestedComments() {
	const [comments, setComments] = useState(COMMENTS_CONFIG);

	const handleDeleteComment = (id: string) => {
		setComments((prev) => {
			function updateTree(comments: CommentsConfig[]): CommentsConfig[] {
				return comments
					.filter((comment) => comment.id !== id)
					.map((node) => {
						return {
							...node,
							children: node.children ? updateTree(node.children) : undefined,
						};
					});
			}
			return updateTree(prev);
		});
	};

	const handleAddComment = function addComment(id: string, value: string) {
		console.log(id);
		setComments((prev) => {
			function updateTree(comments: CommentsConfig[]): CommentsConfig[] {
				return comments.map((node) => {
					if (node.id === id) {
						const newComment: CommentsConfig = {
							id: new Date().getTime().toString(),
							value: value,
							likes: 0,
						};

						return {
							...node,
							children: node.children
								? [...node.children, newComment]
								: [newComment],
						};
					}

					return {
						...node,
						children: node.children ? updateTree(node.children) : undefined,
					};
				});
			}
			return updateTree(prev);
		});
	};

	const updateTree = function update(
		nodes: CommentsConfig[],
		value: number,
		targetId: string,
	): CommentsConfig[] {
		return nodes.map((node) => {
			if (node.id === targetId) {
				return {
					...node,
					likes: value,
				};
			}

			return {
				...node,
				children: node.children
					? updateTree(node.children, value, targetId)
					: undefined,
			};
		});
	};

	const addLike = function like(id: string, value: number) {
		setComments((prev) => {
			return updateTree(prev, value, id);
		});
	};

	return (
		<div>
			comments
			<CommentContainer
				onAddComment={handleAddComment}
				onDelete={handleDeleteComment}
				onLike={addLike}
				config={comments}
			/>
		</div>
	);
}

function filterTree(nodes: CommentsConfig[], targetId: string) {
	return nodes.filter((node) => node.id === targetId);
}
