//Data communication from Parent to Child - Example Two

export default function Child({ parentData }: { parentData: string }) {
	return (
		<div>
			<h3>Child Component</h3>
			<p>Received from Parent: {parentData}</p>
		</div>
	);
}
