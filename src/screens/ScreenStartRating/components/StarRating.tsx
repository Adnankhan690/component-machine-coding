import "./star-rating.css";
import { Star } from "lucide-react";
import { useState } from "react";

const TOTAL_STARS = 5;

interface StarRatingProps {
	size?: number;
}

export default function StartRating({ size = TOTAL_STARS }: StarRatingProps) {
	const [ratedIndex, setRatedIndex] = useState<number>(-1);
	const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

	const handleClick = (index: number) => {
		return () => {
			setRatedIndex(index);
		};
	};

	return (
		<div className="star-rating-container">
			{[...new Array(size)].map((_, index) => {
				let ratedClassName = "star ";

				if (ratedIndex >= index && ratedIndex !== -1) {
					ratedClassName += "active ";
				}
				if (hoveredIndex >= index && hoveredIndex !== -1) {
					ratedClassName += "hover";
                }

				return (
					<button
						className={ratedClassName}
						onClick={handleClick(index)}
						onMouseEnter={() => setHoveredIndex(index)}
						onMouseLeave={() => setHoveredIndex(-1)}
						key={index}>
						<Star className="" key={index} />
					</button>
				);
			})}
		</div>
	);
}
