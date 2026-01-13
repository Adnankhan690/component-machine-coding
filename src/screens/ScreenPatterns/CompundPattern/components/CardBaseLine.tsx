import { useCard } from "../context/CardProvider";

export default function CardBaseLine() {
    const { circles } = useCard();
    
	return (
		<div className="circles">
			{circles.map((num) => {
				return <div key={num} className="circle"></div>;
			})}
		</div>
	);
}
