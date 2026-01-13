export type OnChangeParamsType = {
	fieldKey: string;
	value: string;
	error: string;
};

export type InputTypes = "text" | "number" | "email" | "password";
export type ValidationReturnType = string;

interface TextInputProps {
	type: InputTypes;
	value: string;
	placeholder?: string;
	onChange: ({ fieldKey, value }: OnChangeParamsType) => void;
	fieldKey: string;
	validation?: (value: string) => ValidationReturnType;
}

export default function TextInput({
	fieldKey,
	type,
	value,
	onChange,
	placeholder,
	validation,
}: TextInputProps) {
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		const fieldValidation = validation && validation(val);
		onChange({ fieldKey, value: val, error: fieldValidation ?? "" });
	};

	return (
		<div>
			<input
				id={fieldKey}
				type={type}
				value={value}
				onChange={handleInputChange}
				placeholder={placeholder}
			/>
		</div>
	);
}


type Fn = (this: any, arg: string | number) => unknown;

export default function memoize(func: Fn): Fn {
	let parameter: string | number = "";

    return function expensiveFunction(this, arg) {
        
    };
}