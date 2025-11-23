import React, { useImperativeHandle, useRef, useState } from "react";

interface ChildProps {
	onClick: () => void;
}

const Child = React.forwardRef(({ onClick }: ChildProps, ref) => {
	const [mode, setMode] = useState<boolean>(false);
	const insideRef = useRef<HTMLDivElement | null>(null);

	useImperativeHandle(ref, () => ({
		fnMode: toggleMode,
		getMode: () => mode,
	}));

	const handleClick = (number: Number) => {
		return () => {
			console.log(number);

			onClick();
		};
	};

	const toggleMode = () => {
		setMode(!mode);
		console.log(insideRef.current);
	};

	return (
		<div ref={insideRef}>
			<h2>Child Component</h2>
			<input type="radio" checked={mode} readOnly />
			<span>Mode: {mode ? "ON" : "OFF"}</span>
			<div>
				{[...Array(5).keys()].map((item) => {
					return (
						<button key={item} onClick={handleClick(item)}>
							Click Me {item + 1}
						</button>
					);
				})}
			</div>
		</div>
	);
});

export default Child;