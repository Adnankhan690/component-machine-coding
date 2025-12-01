import { useEffect, useRef, useState } from "react";

interface CustomOtpProps {
	inputLength?: number;
	renderInput?: (props: RenderInputProps) => React.ReactNode;
	renderContainer?: (props: RenderContainerProps) => React.ReactNode;
	onComplete?: (otp: string) => void;
}

interface RenderInputProps {
	value: string;
	index: number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
	disabled: boolean;
	ref: (instance: HTMLInputElement | null) => void;
	isLast: boolean;
	isFirst: boolean;
}

interface RenderContainerProps {
	children: React.ReactNode;
	inputLength: number;
	currentValues: string[];
	isComplete: boolean;
}

export default function CustomOtp({
	inputLength = 6,
	renderInput,
	renderContainer,
	onComplete,
}: CustomOtpProps) {
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
		const value = e.target.value;

		if (!value) return;
		console.log(value);

		const trimmedValue = value.slice(-1);
		const newValues = [...inputValues];
		newValues[idx] = trimmedValue;
		setInputValues(newValues);

		if (idx < inputLength - 1) {
			setDisabledInputs((prev) => {
				const newDisabled = [...prev];
				newDisabled[idx + 1] = false;
				return newDisabled;
			});

			setTimeout(() => {
				inputRefs.current[idx + 1]?.focus();
			}, 0);
		} else {
			console.log("OTP Complete:", newValues.join(""));
			onComplete?.(newValues.join(""));
			inputRefs.current[idx]?.blur();
		}
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		idx: number
	) => {
		const newValues = [...inputValues];

		if (e.key === "Backspace") {
			if (newValues[idx] !== "") {
				newValues[idx] = "";
				setInputValues(newValues);
			} else if (idx > 0) {
				newValues[idx - 1] = "";
				setInputValues(newValues);
				inputRefs.current[idx - 1]?.focus();

				setDisabledInputs((prev) => {
					const newDisabled = [...prev];
					newDisabled[idx] = true;
					return newDisabled;
				});
			}
		}
	};

	const handlePasteOtp =
		(startIdx: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
			const pasteData = e.clipboardData.getData("Text").slice(0, inputLength);
			e.preventDefault();
			if (!pasteData) return;

			const pasteChars = pasteData.split("");
			const newValues = [...inputValues];
			const newDisabledInputs = [...disabledInputs];

			// Fill inputs starting from the paste position
			pasteChars.forEach((char, index) => {
				const targetIdx = startIdx + index;
				if (targetIdx < inputLength) {
					newValues[targetIdx] = char;
					newDisabledInputs[targetIdx] = false;
				}
			});

			// Enable the next input after pasted content (if it exists)
			const nextInputIdx = startIdx + pasteChars.length;
			if (nextInputIdx < inputLength) {
				newDisabledInputs[nextInputIdx] = false;
			}

			setInputValues(newValues);
			setDisabledInputs(newDisabledInputs);

			setTimeout(() => {
				// Focus on the next empty input after pasted content
				if (nextInputIdx < inputLength) {
					inputRefs.current[nextInputIdx]?.focus();
				} else {
					// If pasted content fills to the end, complete the OTP
					console.log("OTP Complete:", newValues.join(""));
					onComplete?.(newValues.join(""));
					inputRefs.current[inputLength - 1]?.blur();
				}
			}, 0);
		};

	useEffect(() => {
		setDisabledInputs((prev) => {
			const newDisabled = [...prev];
			newDisabled[0] = false;
			return newDisabled;
		});
	}, []);

	// Default input renderer
	const defaultRenderInput = (props: RenderInputProps) => (
		<input
			type="text"
			value={props.value}
			onChange={props.onChange}
			onKeyDown={props.onKeyDown}
			onPaste={props.onPaste}
			disabled={props.disabled}
			ref={props.ref}
			style={{
				width: "3rem",
				height: "3rem",
				textAlign: "center",
				fontSize: "1.5rem",
				borderRadius: "6px",
				border: "2px solid #ddd",
				margin: "0 4px",
				outline: "none",
				...(props.disabled ? { backgroundColor: "#f5f5f5" } : {}),
			}}
		/>
	);

	// Default container renderer
	const defaultRenderContainer = (props: RenderContainerProps) => (
		<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
			{props.children}
		</div>
	);

	const isComplete =
		inputValues.every((value) => value !== "") &&
		inputValues.join("").length === inputLength;

	const renderInputs = () => {
		return [...Array(inputLength).keys()].map((idx) => {
			const inputProps: RenderInputProps = {
				value: inputValues[idx],
				index: idx,
				onChange: (event) => handleInputChange(event, idx),
				onKeyDown: (event) => handleKeyDown(event, idx),
				onPaste: handlePasteOtp(idx),
				disabled: disabledInputs[idx],
				ref: (ele) => void (inputRefs.current[idx] = ele),
				isFirst: idx === 0,
				isLast: idx === inputLength - 1,
			};

			return (
				<div key={idx}>
					{renderInput
						? renderInput(inputProps)
						: defaultRenderInput(inputProps)}
				</div>
			);
		});
	};

	const containerProps: RenderContainerProps = {
		children: renderInputs(),
		inputLength,
		currentValues: inputValues,
		isComplete,
	};

	return renderContainer
		? renderContainer(containerProps)
		: defaultRenderContainer(containerProps);
}
