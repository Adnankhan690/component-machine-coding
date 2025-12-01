import { useState } from "react";
import "./button.css";

interface ButtonProps {
	render?: (props: RenderButtonProps) => React.ReactNode;
}

interface RenderButtonProps {
	onClick: () => void;
}

export default function Button(props: ButtonProps) {
	const { render } = props;
	const [toggle, setToggle] = useState(false);

	const handleClick = () => {
		setToggle(!toggle);
	};

	const defaultButton = () => {
		return (
			<button className="btn" onClick={handleClick}>
				Click me
			</button>
		);
	};

	const shouldRenderCustom =
		render !== undefined && typeof render === "function";

	return (
		<>
			{toggle ? "Button Toggled!" : "Button not toggled"}
			{shouldRenderCustom ? render({ onClick: handleClick }) : defaultButton()}
		</>
	);
}
