import { useEffect, useState } from "react";
import "./grid-lights.css";

const grid = [
	[1, 0, 1],
	[0, 1, 0],
	[1, 0, 1],
];

export default function GridLights() {
	const [selectedCell, setSelectedCell] = useState(new Map());

	const handleClick = (cellKey: string) => {
		const newSelectedCell = new Map(selectedCell);
		if (!newSelectedCell.has(cellKey)) {
			newSelectedCell.set(cellKey, true);
			setSelectedCell(newSelectedCell);
		}

		const actualActiveCellCount = grid
			.flat()
			.filter((cell) => cell === 1).length;

		if (actualActiveCellCount === newSelectedCell.size) {
			const keysArray = Array.from(newSelectedCell.keys());
			keysArray.forEach((key, index) => {
				setTimeout(() => {
					setSelectedCell((prev) => {
						const updated = new Map(prev);
						updated.delete(key);
						return updated;
					});
				}, index * 700);
			});
		}
	};

	useEffect(() => {
		console.log(selectedCell);
	}, [selectedCell]);

	return (
		<div className="grid-container">
			{grid.map((row, index) => {
				return (
					<div key={index} className="grid-col">
						{row.map((col, colIndex) => {
							const isOn = col === 1;
							const cellKey = `${index}-${colIndex}`;
							let activeCell = "";

							if (selectedCell.has(cellKey) && isOn) {
								activeCell = "active-cell";
							}
							return (
								<div
									key={`${index}-${colIndex}`}
									onClick={() => handleClick(cellKey)}
									data-on={isOn}
									className={`grid-cell ${activeCell}`}></div>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}
