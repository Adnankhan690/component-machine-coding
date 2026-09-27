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
		<div>
			<div className="str-main-con">
				{Array.from({ length: STAR_LENGTH }, () => 0).map((ele, idx) => {
					const isRated = ratings >= idx + 1;
					const hRating = hoveredRating >= idx + 1;

                    return (
                        <div
                            className='star-con'
							key={idx}
							onClick={() => handleClick(idx + 1)}>
							<Star
								className={`star-icon ${isRated ? "rated" : ""} ${hRating ? "hRating" : ""} `}
								onMouseEnter={() => handleMouseEnter(idx + 1)}
								onMouseLeave={() => handleMouseLeave()}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}
