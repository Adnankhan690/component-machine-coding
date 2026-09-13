import { useState } from "react";
import { Star } from "lucide-react";
import "./star-rating.css";

const MAX_RATING = 5;

const star = [false, false, false, false];

export default function ScreenStarRating() {
	// const [rating, setRating] = useState(0);
	// const [hoveredRating, setHoveredRating] = useState(0);
	// const displayedRating = hoveredRating || rating;

	// const ratingLabel = rating === 0 ? "No rating selected" : `${rating} out of ${MAX_RATING} stars`;

	// return (
	// <section className="star-rating-screen" aria-labelledby="star-rating-title">
	// 	<p className="star-rating-eyebrow">Interactive component</p>
	// 	<h1 id="star-rating-title">Star Rating</h1>
	// 	<p className="star-rating-description">Choose a rating from one to five stars.</p>

	// 	<div
	// 		className="star-rating-control"
	// 		aria-label="Rate this component"
	// 		onMouseLeave={() => setHoveredRating(0)}
	// 	>
	// 		{Array.from({ length: MAX_RATING }, (_, index) => {
	// 			const starNumber = index + 1;
	// 			const isFilled = starNumber <= displayedRating;

	// 			return (
	// 				<button
	// 					key={starNumber}
	// 					type="button"
	// 					className="star-rating-star"
	// 					aria-label={`${starNumber} star${starNumber === 1 ? "" : "s"}`}
	// 					aria-pressed={starNumber === rating}
	// 					onClick={() => setRating(starNumber)}
	// 					onMouseEnter={() => setHoveredRating(starNumber)}
	// 				>
	// 					<span aria-hidden="true" className={isFilled ? "is-filled" : ""}>
	// 						★
	// 					</span>
	// 				</button>
	// 			);
	// 		})}
	// 	</div>

	// 	<p className="star-rating-value" aria-live="polite">
	// 		{ratingLabel}
	// 	</p>
	// 	{rating > 0 && (
	// 		<button className="star-rating-clear" type="button" onClick={() => setRating(0)}>
	// 			Clear rating
	// 		</button>
	// 	)}
	// </section>
	// );

	const [stars, setStars] = useState(0);
	const [hoveredRating, setHoveredRating] = useState(0);

	const handleClick = (idx: number) => {
		setStars(idx);
	};

	return (
		<div>
			{Array.from({ length: 5 }, () => false).map((_, idx) => {
				const rating = hoveredRating || stars;
				const visibleRating = rating >= idx + 1;

				return (
					<button
						key={idx}
						aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
						className="btn-con"
						onMouseEnter={() => setHoveredRating(idx + 1)}
						onMouseLeave={() => setHoveredRating(0)}
						onClick={() => {
							handleClick(idx + 1);
						}}>
						<Star className={`${visibleRating ? "star-active" : ""} star`} />
					</button>
				);
			})}
		</div>
	);
}
