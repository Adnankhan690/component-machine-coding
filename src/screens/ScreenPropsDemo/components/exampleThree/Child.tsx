//Data communication from Child to Parent - Example Three

export default function Child({
	extractDataFromChild,
}: {
	extractDataFromChild: (data: string) => void;
}) {
	const childData = "Data from Child Component";

	const handleClick = () => {
		extractDataFromChild(childData);
	};

	return (
		<div>
			<h3>Child Component</h3>
			<button onClick={handleClick}>pass data to parent</button>
		</div>
	);
}
