import { InputTypes, ValidationReturnType } from "./components/TextInput";

type ConfigItem = {
	label: string;
	placeholder?: string;
	type: InputTypes;
	value: string;
	fieldKey: string;
    validation?: (value: string) => ValidationReturnType;
    error?: string;
};

export const Config: ConfigItem[] = [
	{
		label: "First Name",
		type: "text",
		value: "",
		placeholder: "Enter your first name",
		fieldKey: "firstName",
		validation: (value) => {
			if (value.length < 2) {
				return "First name must be at least 2 characters long";
			}
			return "";
		},
		error: "",
	},
	{
		label: "Last Name",
		type: "text",
		value: "",
		placeholder: "Enter your last name",
		fieldKey: "lastName",
		error: "",
	},
	{
		label: "email",
		type: "email",
		value: "",
		placeholder: "Enter your email",
		fieldKey: "email",
		error: "",
	},
	{
		label: "Password",
		type: "password",
		value: "",
		placeholder: "Enter your password",
		fieldKey: "password",
        validation: (value) => {
            if (value.length < 6) { 
                return "Password must be at least 6 characters long";
            }
            return "";
        },
		error: "",
	},
];
