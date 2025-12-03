import { useDebounce } from "@/hooks/useDebounce";
import { useState } from "react";

export default function ScreenUseDebounce() {
	const [value, setValue] = useState("");
	const debouncedValue = useDebounce(value, 2000);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	return (
		<div>
			<h2>Screen Use Debounce</h2>
			<p>This is the Screen Use Debounce Demo</p>

			<input type="text" value={value} onChange={handleInputChange} />

			<div>
				<strong>This is debounced value: {debouncedValue}</strong>
			</div>
		</div>
	);
}


// const fn = debounce(myFn, 100000); -> t-0
//4 const fn = debounce(myFn, 100000); -> 10min