// import { useEffect, useRef } from "react";
// import "./animation-frame-2.css";

// export default function WithTimeout2() {
// 	const positionRef = useRef(0);
// 	const elementRef = useRef<HTMLDivElement>(null);

// 	useEffect(() => {
// 		const animate = () => {
// 			positionRef.current += 5;

// 			if (positionRef.current >= 1000) {
// 				positionRef.current = 0;
// 			}

// 			if (elementRef.current) {
// 				elementRef.current.style.left = `${positionRef.current}px`;
// 			}

// 			setTimeout(animate, 16.67);
// 		};

// 		const timer = setTimeout(animate, 16.67);
// 		return () => clearTimeout(timer);
// 	}, []);

// 	return (
// 		<div className="circle" ref={elementRef}>
// 			<p className="text">time out</p>
// 		</div>
// 	);
// }


//using plain DOM manipulation

import { useEffect } from "react";
import "./animation-frame-2.css";

export default function WithTimeout2() {
	useEffect(() => {
		let position = 0;

		const animate = () => {
			position += 5;

			if (position >= 1000) {
				position = 0;
			}

			const element = document.getElementById("timeout-circle");
			if (element) {
				element.style.left = `${position}px`;
			}

			setTimeout(animate, 10);
		};

		const timer = setTimeout(animate, 10);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="circle" id="timeout-circle">
			<p className="text">time out</p>
		</div>
	);
}
