import { useEffect, useState } from "react";
import "./progress-bar.css";

interface ProgressbarProps {
	onStart?: () => void;
	onComplete?: () => void;
}

export default function Progressbar({ onStart, onComplete }: ProgressbarProps) {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const id = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(id);
					return prev;
				}
				return prev + 4;
			});
		}, 1000);

		return () => {
			clearInterval(id);
		};
	}, []);

	useEffect(() => {
		if (progress <= 0 && onStart) {
			onStart();
        }
        
        if(progress >= 100 && onComplete) {
            onComplete();
        }
	}, [progress]);

	return (
		<div className="progress-container">
			<div className="progress-bar" style={{ transform: `translateX(-${100 - progress}%)` }} />
			{/* <div className="progress-bar" style={{ width: `${progress}%` }} /> */}
		</div>
	);
}
