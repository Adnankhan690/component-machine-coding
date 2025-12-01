import List from "./components/List";
import List2 from "./components/Example2/List";
import List3 from "./components/Example3/ListWrapper";

export default function ScreenChildrenPattern() {
	return (
		<div>
			<h1>Screen Children Pattern</h1>
			<p>This screen demonstrates the Children Pattern in React.</p>

			<List3 />
			<List />

			<hr />
			{/* <List2 /> */}
		</div>
	);
}
