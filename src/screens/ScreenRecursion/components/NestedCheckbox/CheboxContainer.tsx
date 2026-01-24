import "./nested-checkbox-container.css";
import CheckBox from "./CheckBox";
import { Config } from "./constants";

interface CheboxContainerProps {
	config: Config[];
	onChange: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
}

export default function CheboxContainer({
	config,
	onChange,
}: CheboxContainerProps) {
	return (
		<div className="checkbox-container">
			{config.map(({ label, value, children, id }) => {
				return (
					<div>
						<CheckBox
							value={value}
							handleChange={(e) => onChange(e, id)}
							id={id}
						/>
						<label htmlFor={id}>{label}</label>
						{children && (
							<CheboxContainer config={children} onChange={onChange} />
						)}
					</div>
				);
			})}
		</div>
	);
}
