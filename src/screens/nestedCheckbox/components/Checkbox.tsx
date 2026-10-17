import "../nested-checkbox.css";
import { Checkbox as CheckboxType } from "../NestedCheckbox";

interface CheckboxProps {
	data: CheckboxType[];
}

export default function Checkbox({ data }: CheckboxProps) {
	return (
		<div>
			{data.map((checkbox, idx) => (
				<div className="sub-con" key={checkbox.id}>
					<div className="control-con">
						<input checked={checkbox.isChecked} type="checkbox" />
						<p>{checkbox.title}</p>
					</div>
					{checkbox.child.length > 0 && (
						<div className="checkbox-con">
							<Checkbox data={checkbox.child} />
						</div>
					)}
				</div>
			))}
		</div>
	);
}
