import { useState } from "react";

interface CardProps {
	children?: (props: ChildrenProps) => React.ReactNode;
}

interface ChildrenProps {
    toggled: boolean;
    setToggled: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Card({ children }: CardProps) {
	const [toggled, setToggled] = useState(false);

	return (
		<div
			style={{
				border: "1px solid #ccc",
				padding: "16px",
				borderRadius: "8px",
			}}>
			<h2>Card Title</h2>
			<button onClick={() => setToggled(!toggled)}>
				{toggled ? "Hide" : "Show"}
			</button>
			{   children && children({toggled, setToggled})  }
		</div>
	);
}
