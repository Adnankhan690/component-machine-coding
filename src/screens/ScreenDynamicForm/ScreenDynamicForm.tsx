import "./form.css";
import { useState } from "react";
import TextInput, { OnChangeParamsType } from "./components/TextInput";
import { Config } from "./config";
import { cloneDeep } from "lodash";

export default function ScreenDynamicForm() {
	const [formConfig, setFormConfig] = useState(cloneDeep(Config));

	const handleInputChange = ({ fieldKey, value, error }: OnChangeParamsType) => {
		setFormConfig((prevConfig) => {
			return prevConfig.map((item) => {
				if (item.fieldKey === fieldKey) {
					return { ...item, value, error };
				}
				return item;
			});
		});
	};

	return (
		<div className="form-con">
			{formConfig.map((item) => {
				return (
					<div key={item.fieldKey}>
						<label htmlFor={item.fieldKey}>{item.label}</label>
                        <TextInput {...item} onChange={handleInputChange} />
                        {item.error && (<span className="error">{item.error}</span>)}
					</div>
				);
			})}

			<p>
				Current input:
				<code>
					{formConfig
						.map((item) => `${item.fieldKey}: ${item.value}`)
						.join(", ")}
				</code>
			</p>
		</div>
	);
}
