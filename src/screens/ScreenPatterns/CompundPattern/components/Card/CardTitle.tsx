import { useCard } from "../../context/CardProvider";

export default function CardTitle() {
	const { title, image } = useCard();

	return (
		<div className="card-data">
			<img src={image} alt="stone hashira" />
			<p>{title}</p>
		</div>
	);
}
