import Parent from "./components/examplesOne/Parent";
import ParentTwo from "./components/exampleTwo/Parent";
import ParentThree from "./components/exampleThree/Parent";
import ParentFour from "./components/exampleFour/Parent";

export default function ScreenPropsDemo() {
	return (
		<div>
			<h1>Screen Props Demo</h1>
			<Parent />
			<hr />
			<ParentTwo />
			<hr />
			<ParentThree />
			<hr />
			<ParentFour />
		</div>
	);
}
