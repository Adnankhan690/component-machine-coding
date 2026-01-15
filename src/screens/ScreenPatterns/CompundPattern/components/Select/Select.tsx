import { useState } from "react";

export type OptionType = {
	value: string;
	label: string;
};

interface SelectProps {
	label: string;
	children: React.ReactNode;
	handleOnChange: (value: string) => void;
}

export default function Select({
	label,
	children,
	handleOnChange,
}: SelectProps) {
	// const [car, setCar] = useState("");

	const handleCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		// setCar(e.target.value);
		handleOnChange(e.target.value);
	};

	return (
		<div>
			<label htmlFor="select">{label}</label>
			<select onChange={handleCarChange} name="select" id="select" multiple={true}>
				{children}
			</select>

			{/* <p>Your car: {car}</p> */}
		</div>
	);
}
