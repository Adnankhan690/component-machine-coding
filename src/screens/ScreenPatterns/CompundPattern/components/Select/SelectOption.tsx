import { OptionType } from "./Select";

export default function SelectOption({
	option,
	children,
}: {
	option: OptionType;
	children?: React.ReactNode;
}) {
	return (
		<option key={option.value} value={option.value}>
			{children ? children : option.label}
		</option>
	);
}
