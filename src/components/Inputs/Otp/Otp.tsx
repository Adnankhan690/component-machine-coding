// //REQUIREMENTS
// //configurable input length
// //auto focus on next input
// //handle paste event
// //custom styling options

import { useEffect, useRef, useState } from "react";

interface OtpProps {
	inputLength?: number;
	className?: string;
	inputClassName?: string;
	disabled?: boolean;
}

export default function Otp({
	inputLength = 6,
	className = "",
	inputClassName = "",
	disabled = false,
}: OtpProps) {
	const [inputValues, setInputValues] = useState<string[]>(
		Array.from({ length: inputLength }, () => "")
	);
	const [disabledInputs, setDisabledInputs] = useState<boolean[]>(
		Array.from({ length: inputLength }, () => true)
	);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		idx: number
	) => {
		if (disabled) return;
		const value = e.target.value;

		if (!value) return;

		const trimmedValue = value.slice(-1);
		const newInputValue = [...inputValues];
		newInputValue[idx] = trimmedValue;
		setInputValues(newInputValue);

		if (idx < inputLength - 1) {
			const newDisabledInput = [...disabledInputs];
			newDisabledInput[idx + 1] = false;
			setDisabledInputs(newDisabledInput);
		}

		setTimeout(() => {
			inputRefs.current[idx + 1]?.focus();
		}, 0);
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		idx: number
	) => {
		const newInputValues = [...inputValues];
		if (e.key === "Backspace") {
			if (inputValues[idx] !== "") {
				newInputValues[idx] = "";
				setInputValues(newInputValues);
			} else {
				newInputValues[idx - 1] = "";
				setInputValues(newInputValues);
				inputRefs.current[idx - 1]?.focus();
				const newDisabledInputs = [...disabledInputs];
				for (let i = idx; i < inputLength; i++) {
					newDisabledInputs[i] = true;
					setDisabledInputs(newDisabledInputs);
				}
			}
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const pasteData = e.clipboardData.getData("Text").slice(0, inputLength);
		e.preventDefault();

		const pasteValues = pasteData.split("");
		const newInputValues = [...inputValues];
		pasteValues.forEach((char, idx) => {
			newInputValues[idx] = char;
		});

		const newDisabledInputs = [...disabledInputs];
		for (let i = 0; i < pasteValues.length; i++) {
			newDisabledInputs[i] = false;
		}
		if (pasteValues.length < inputLength) {
			newDisabledInputs[pasteValues.length] = false;
		}
		setDisabledInputs(newDisabledInputs);
		setInputValues(newInputValues);
		setTimeout(() => {
			if (pasteValues.length === inputLength) {
				inputRefs.current[inputLength - 1]?.focus();
			} else {
				inputRefs.current[pasteValues.length]?.focus();
			}
		}, 0);
	};

	useEffect(() => {
		if (inputLength > 0) {
			const newDisabledInput = [...disabledInputs];
			newDisabledInput[0] = false;
			setDisabledInputs(newDisabledInput);
			inputRefs.current[0]?.focus();
		}
	}, [inputLength]);

	return (
		<div className={className} style={{ display: "flex", gap: "8px" }}>
			{inputValues.map((val, idx) => (
				<input
					key={idx}
					type="text"
					maxLength={1}
					className={inputClassName}
					disabled={disabled || disabledInputs[idx]}
					value={val}
					ref={(el) => void (inputRefs.current[idx] = el)}
					onChange={(e) => handleInputChange(e, idx)}
					onKeyDown={(e) => handleKeyDown(e, idx)}
					onPaste={handlePaste}
					inputMode="numeric"
					style={{
						width: "3rem",
						height: "3rem",
						textAlign: "center",
						fontSize: "1.5rem",
						borderRadius: "6px",
						border: "1px solid #ccc",
						outline: "none",
						...(disabledInputs[idx] || disabled
							? { backgroundColor: "#f0f0f0", cursor: "not-allowed" }
							: {}),
					}}
					autoComplete="one-time-code"
				/>
			))}
		</div>
	);
}
