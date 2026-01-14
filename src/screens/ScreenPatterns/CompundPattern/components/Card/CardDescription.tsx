import { useCard } from "../../context/CardProvider";

export default function CardDescription() {
	const { strength } = useCard();

	return (
		<div className="strength">
			<p>
				<strong>Strength:</strong>
				<div className="strength-content">
					<ul>
						{strength.map((item, idx) => {
							return <li key={idx}>{item}</li>;
						})}
					</ul>
				</div>
			</p>
		</div>
	);
}
