import React, { useState } from "react";

interface CardProps {
	children?: React.ReactNode;
}

export default function Card({ children }: CardProps) {
	const [toggled, setToggled] = useState(false);

	const childrenArray = React.Children.toArray(children);

	return (
		<div
			style={{
				border: "1px solid #ccc",
				padding: "16px",
				borderRadius: "8px",
			}}>
			{childrenArray.length > 0 && (
				<>
					{childrenArray[0]}
				</>
			)}
			<button onClick={() => setToggled(!toggled)}>
				{toggled ? "Hide" : "Show"}
			</button>
			{childrenArray[1]}
		</div>
	);
}
