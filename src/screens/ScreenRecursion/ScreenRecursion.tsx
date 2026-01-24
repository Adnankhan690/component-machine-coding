import NestedCheckbox from "./components/NestedCheckbox/NestedCheckbox";
import NestedComments from "./components/NestedComments/NestedComments";


export default function ScreenRecursion() {
    return (
			<div>
				Recursion
				<NestedCheckbox />
				{/* <NestedComments /> */}
			</div>
		);
}