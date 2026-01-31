import NestedCheckbox from "./components/NestedCheckbox/NestedCheckbox";
import NestedComments from "./components/NestedComments/NestedComments";
import ScreenNestedFolder from "./components/NestedFolder/ScreenNestedFolder";


export default function ScreenRecursion() {
    return (
			<div>
				Recursion
				{/* <NestedCheckbox />
				<NestedComments /> */}
			<ScreenNestedFolder />
			</div>
		);
}