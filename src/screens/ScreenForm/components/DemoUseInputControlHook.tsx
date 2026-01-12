import useInputControl from "@/hooks/useInputControl";
import "./input-txt.css";

export default function DemoUseInputControlHook({
	defaultValye = "John",
}: {
	defaultValye?: string;
}) {
	const { value, touched, dirty, different, onChange, onBlur, onReset } =
        useInputControl(defaultValye);
    
    console.log(defaultValye);
    

	return (
		<div className="demo-con">
			<input
				className="input-txt"
				type="text"
				value={value}
				onChange={onChange}
				onBlur={onBlur}
			/>
			<code>
				Hook Values:{" "}
				{JSON.stringify({ value, touched, dirty, different }, null, 2)}
			</code>
		</div>
	);
}
