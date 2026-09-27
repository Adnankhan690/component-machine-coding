import { Star } from "lucide-react";

export default function StarRatingV2() {
    return <div>
        <div>
            {Array.from({ length: 5 }, () => 0).map((ele, idx) => (
                <div key={idx}>
                    <Star />
                </div>
            ))}
        </div>
    </div>;
}
