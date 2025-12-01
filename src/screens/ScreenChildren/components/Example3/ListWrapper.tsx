//https://www.youtube.com/watch?v=QgmaHtZ26yA
//EXAMPLE 3 - Using children prop pattern to avoid re-renders, comprae this with Example 2 the difference bw them

import Card from "./Card";
import List from "./List";

export default function ListWrapper() {
	return (
		<List>
			<Card>
				<h1>Static Content</h1>
				<h1>Non Content</h1>
			</Card>
			<Card>
				<h1>Static Content</h1>
				<h1>Non Content</h1>
			</Card>
			<Card>
				<h1>Static Content</h1>
				<h1>Non Content</h1>
			</Card>
			<Card>
				<h1>Static Content</h1>
				<h1>Non Content</h1>
			</Card>
		</List>
	);
}
