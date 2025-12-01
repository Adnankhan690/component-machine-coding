import { useState } from "react";
import Card from "./Card";

const cards = Array.from({ length: 5 }, (_, i) => i + 1);

export default function List() {
	const [toggled, setToggled] = useState(false);


	return (
		<>
			<button onClick={() => setToggled(!toggled)}>
				{toggled ? "Hide" : "Show"}
			</button>
			{cards.map((card) => (
				<Card key={card}>
					<p>This is the content of card {card}.</p>
				</Card>
			))}

			<Card>
				<h1>Static Content</h1>
				<h1>Non Content</h1>
			</Card>
		</>
	);
}
