//EXAMPLE 2 : Prop as a function to pass data from child to parent
import React, { useState } from "react";
import Card from "./Card";

const cards = Array.from({ length: 5 }, (_, i) => i + 1);

export default function List() {
	const [toggled, setToggled] = useState(false);

	console.log(React.Children);

	return (
		<>
			<button onClick={() => setToggled(!toggled)}>
				{toggled ? "Hide" : "Show"}
			</button>
			{cards.map((card) => (
				<Card key={card}>
					{(props) => {
						return (
							<>
								<p>This is the content of card {card}.</p>
								<p>Toggled state: {props.toggled ? "On" : "Off"}</p>
							</>
						);
					}}
				</Card>
			))}
		</>
	);
}
