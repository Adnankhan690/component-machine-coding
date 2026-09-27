import { useState, useEffect } from "react";


export default function useDebouncedV2<T>(value: T, delay = 0) {
	const [debouncedVal, setDebouncedVal] = useState(value);

	useEffect(() => {
		const timeId = setTimeout(() => {
			setDebouncedVal(value);
		}, delay);

		return () => {
			clearTimeout(timeId);
		};
	}, [value, delay]);

	return debouncedVal;
}
