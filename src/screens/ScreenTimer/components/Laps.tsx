import { formatTime } from "./Watch";

interface LapsProps {
	laps: number[];
}

export default function Laps({ laps = [] }: LapsProps) {
	return (
		<div>
			{laps.map((lapTime, idx) => {
				return (
					<div key={lapTime}>
						Lap {idx + 1}: {formatTime(lapTime)} ms
					</div>
				);
			})}
		</div>
	);
}
