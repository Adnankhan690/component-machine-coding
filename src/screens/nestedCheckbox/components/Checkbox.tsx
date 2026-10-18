import "../nested-checkbox.css";
import { Checkbox as CheckboxType } from "../NestedCheckbox";

interface CheckboxProps {
    data: CheckboxType[];
    onToggle: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({ data, onToggle }: CheckboxProps) {
	return (
		<div>
			{data.map((checkbox, idx) => (
				<div className="sub-con" key={checkbox.id}>
					<div className="control-con">
						<input onChange={(e) => onToggle(checkbox.id, e)} checked={checkbox.isChecked} type="checkbox" />
						<p>{checkbox.title}</p>
					</div>
					{checkbox.child.length > 0 && (
						<div className="checkbox-con">
							<Checkbox data={checkbox.child} onToggle={onToggle} />
						</div>
					)}
				</div>
			))}
		</div>
	);
}
