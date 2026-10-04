import { useState } from "react";

interface Comment {
	id: string;
	title: string;
	child: Comment | [];
}

export default function NestedComment() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [comment, setComment] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) {
        setComment(e.target.value.trim());
    }

	return (
		<div>
            <input placeholder="Enter something" value={comment}
                onChange={handleInputChange} />
			<button>Add</button>

			<div>
				{comments.map((comment, idx) => (
					<Nodes key={idx} comment={comment} />
				))}
			</div>
		</div>
	);
}

interface Nodesprop {
	comment: Comment;
}

function Nodes({ comment }: Nodesprop) {
	return (
		<div>
			<p>{comment.title}</p>
		</div>
	);
}
