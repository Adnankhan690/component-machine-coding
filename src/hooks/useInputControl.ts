import { FocusEvent, useEffect, useRef, useState } from "react";

interface UseInputValueReturn {
	value: string;
	touched: boolean;
	dirty: boolean;
	different: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur: (event: FocusEvent<HTMLInputElement>) => void;
	onReset: () => void;
}

export default function useInputControl(
	initialValue: string
): UseInputValueReturn {
	const [value, setValue] = useState(initialValue);
	const initialValueRef = useRef(initialValue);
	const [isDirty, setIsDirty] = useState(false);
	const [touched, setIsTouched] = useState(false);

	useEffect(() => {
		setValue(initialValue);
		initialValueRef.current = initialValue;
	}, [initialValue]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
		setIsDirty(true);
	};

	const onBlur = (e: FocusEvent<HTMLInputElement>) => {
		setIsTouched(true);
	};

	const onReset = () => {
		setValue(initialValue);
		setIsDirty(false);
		setIsTouched(false);
	};

	return {
		value,
		touched,
		dirty: isDirty,
		different: value !== initialValueRef.current,
		onChange: handleChange,
		onBlur,
		onReset,
	} as UseInputValueReturn;
}
