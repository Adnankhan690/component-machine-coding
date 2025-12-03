import { useRef, useState } from "react";

export function useDebounce<T>(value: T, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);
	let timeOutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	if (timeOutRef.current) {
		clearTimeout(timeOutRef.current);
		timeOutRef.current = null;
	}

	timeOutRef.current = setTimeout(() => {
		setDebouncedValue(value);
		clearTimeout(timeOutRef.current!);
		timeOutRef.current = null;
	}, delay);

	return debouncedValue;
}
