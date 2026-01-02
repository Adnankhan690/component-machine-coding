import { useEffect, useState } from "react";
import { Config } from "./constant";
import "./traffic.css";

export default function ScreenTrafficLight() {
	const [traffic, setTraffic] = useState(Config);
	const [activeLight, setActiveLight] = useState("red");

	useEffect(() => {
		setTraffic((prev) => {
			const newTraffic = [...prev];
			const sortedTraffic = newTraffic.sort((a, b) => a.order - b.order);

			return sortedTraffic;
		});
	}, []);

	useEffect(() => {
		const activeCell = traffic.find((item) => item.color === activeLight);
 
        if (!activeCell) return;
        
		const timer = setTimeout(() => {
			setActiveLight((prev) => {
				const currentExecuteSequence = activeCell?.executeSequence || 1;
				const nextCell = traffic.find(
					(item) =>
						item.executeSequence ===
						(currentExecuteSequence % Config.length) + 1
				);
				return nextCell?.color ?? '';
			});
		}, activeCell?.duration || 0);

		return () => clearInterval(timer);
	}, [activeLight]);

	return (
		<div className="traffic-con">
			{traffic.map((light) => (
                <div
                    key={light.id}
					className="traffic"
					style={{
						backgroundColor: light.color,
						opacity: activeLight === light.color ? 1 : 0.3,
					}}></div>
			))}
		</div>
	);
}
