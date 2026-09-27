import "./star-v2.css";
import { useState } from "react";
import { Star } from "lucide-react";

const STAR_LENGTH = 5;

export default function StarRatingV2() {
	const [ratings, setRatings] = useState(0);

	const handleClick = (idx: number) => {
		console.log(idx);
        setRatings(idx);
	};

	return (
		<div>
			<div>
				{Array.from({ length: STAR_LENGTH }, () => 0).map((ele, idx) => {
                    const isRated = ratings >= idx + 1;
                    
					return (
						<div key={idx} onClick={() => handleClick(idx + 1)}>
                            <Star className={`${isRated ? 'rated' : ''} `} />
						</div>
					);
				})}
			</div>
		</div>
	);
}
