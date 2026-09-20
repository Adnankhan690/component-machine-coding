import { useState, useEffect } from "react";

interface DebouncedProps<T> {
	value: T;
	delay?: number;
}

export default function useDebounceV1<T>({
	value,
	delay = 0,
}: DebouncedProps<T>) {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	//useEffect is required bcs we have to cancel the old values setter
	useEffect(() => {
		const timerId = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(timerId);
		};
	}, [delay, value]);

	return debouncedValue;
}
