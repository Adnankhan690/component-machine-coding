import "../nested-checkbox.css";
import { Checkbox as CheckboxType } from "../NestedCheckbox";

interface CheckboxProps {
    data: CheckboxType[];
    onToggle: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({ data, onToggle }: CheckboxProps) {
	return (
		<div>
			{data.map((checkbox) => (
				<div className="sub-con" key={checkbox.id}>
					{/* A <label> wrapping the input associates them implicitly, so clicking
					    the title toggles the box natively — no handler, and it stays
					    keyboard- and screen-reader-correct. Only the input sits inside;
					    nested checkboxes are siblings below, so they are unaffected.
					    <span> not <p>: a label may only contain phrasing content. */}
					<label className="control-con">
						<input onChange={(e) => onToggle(checkbox.id, e)} checked={checkbox.isChecked} type="checkbox" />
						<span>{checkbox.title}</span>
					</label>
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
