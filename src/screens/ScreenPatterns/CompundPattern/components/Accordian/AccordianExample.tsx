import Accordian from "./Accordian";
import "./Accordian.css";

export default function AccordianExample() {
	return (
		<div className="accordian-container">
			<Accordian variant="multiple">
				<Accordian.Item value="faq1">
					<Accordian.Header>What is the Compound Pattern?</Accordian.Header>
					<Accordian.Content>
						The compound component pattern is a pattern where several components
						work together to form a larger, more complex component. It allows
						for a more intuitive and flexible API where the internal state is
						shared implicitly.
					</Accordian.Content>
				</Accordian.Item>

				<Accordian.Item value="faq2">
					<Accordian.Header>How does it help re-usability?</Accordian.Header>
					<Accordian.Content>
						By separating the logic of state management from the rendering of
						sub-components, you can rearrange or omit components without
						breaking the overall functionality.
					</Accordian.Content>
				</Accordian.Item>

				<Accordian.Item value="faq3">
					<Accordian.Header>Is it hard to implement?</Accordian.Header>
					<Accordian.Content>
						Once you understand React Context or the children-cloning approach,
						it becomes a powerful tool in your design system toolkit.
					</Accordian.Content>
				</Accordian.Item>
			</Accordian>
		</div>
	);
}
