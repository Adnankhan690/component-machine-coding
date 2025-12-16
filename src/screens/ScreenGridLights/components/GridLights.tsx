import { useEffect, useState } from "react";
import "./grid-lights.css";

const grid = [
	[1, 0, 1],
	[0, 1, 0],
	[1, 0, 1],
];

export default function GridLights() {
	const [selectedCell, setSelectedCell] = useState(new Map());
	const [disabledGrid, setDisabledGrid] = useState(false);

	const handleClick = (cellKey: string, isOn: boolean) => {
		if (!isOn || disabledGrid) return;
		const newSelectedCell = new Map(selectedCell);
		if (!newSelectedCell.has(cellKey)) {
			newSelectedCell.set(cellKey, true);
			setSelectedCell(newSelectedCell);
		}

		const actualActiveCellCount = grid
			.flat()
			.filter((cell) => cell === 1).length;

		if (actualActiveCellCount === newSelectedCell.size) {
			setDisabledGrid(true);
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
		if (selectedCell.size === 0) {
			setDisabledGrid(false);
		}
	}, [selectedCell.size]);

	return (
        <div className={`grid-container ${disabledGrid ? "disabled-grid" : ""}`}>
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
									onClick={() => handleClick(cellKey, isOn)}
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
