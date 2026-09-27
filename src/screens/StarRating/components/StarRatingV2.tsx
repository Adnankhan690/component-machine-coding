import "./star-v2.css";
import { useState } from "react";
import { Star } from "lucide-react";

const STAR_LENGTH = 5;

export default function StarRatingV2() {
	const [ratings, setRatings] = useState(0);
	const [hoveredRating, setHoveredRating] = useState(0);

	const handleClick = (idx: number) => {
		console.log(idx);
		setRatings(idx);
	};

	const handleMouseEnter = (idx: number) => {
		setHoveredRating(idx);
	};

	const handleMouseLeave = () => {
		setHoveredRating(0);
	};

	return (
		<div className="str-main-con" role="radiogroup" aria-label="Product Rating">
			{Array.from({ length: STAR_LENGTH }, () => 0).map((ele, idx) => {
				const starValue = idx + 1;
				const isRated = ratings >= starValue;
				const hRating = hoveredRating >= starValue;

				return (
					<button
						className="star-con"
						key={idx}
						role="radio"
						aria-check={ratings === starValue}
						aria-label={`${starValue} star of ${STAR_LENGTH} stars`}
						onClick={() => handleClick(starValue)}>
						<Star
							className={`star-icon ${isRated ? "rated" : ""} ${hRating ? "hRating" : ""} `}
							onMouseEnter={() => handleMouseEnter(starValue)}
							onMouseLeave={() => handleMouseLeave()}
							aria-hidden="true"
						/>
					</button>
				);
			})}
		</div>
	);
}
