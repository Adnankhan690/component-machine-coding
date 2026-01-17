import { createContext, useContext } from "react";
import { useAccordian } from "../../context/AccordianProvider";

interface AccordianItemProps {
	children: React.ReactNode;
	value: string;
}

const ItemContext = createContext<{ value: string } | null>(null);

function useItem() {
	const context = useContext(ItemContext);
	if (!context) {
		throw new Error(
			"Accordian sub-components must be used within AccordianItem",
		);
	}
	return context;
}

export default function AccordianItem({ children, value }: AccordianItemProps) {
	return (
		<ItemContext.Provider value={{ value }}>
			<div className="accordian-item">{children}</div>
		</ItemContext.Provider>
	);
}

export function AccordianHeader({ children }: { children: React.ReactNode }) {
	const { value } = useItem();
	const { activeAccordian, setActiveAccordian } = useAccordian();

	const handleToggle = () => {
		setActiveAccordian(activeAccordian === value ? "" : value);
	};

	return (
		<div
			className={`accordian-header ${activeAccordian === value ? "active" : ""}`}
			onClick={handleToggle}>
			{children}
			<span className="icon">{activeAccordian === value ? "−" : "+"}</span>
		</div>
	);
}

export function AccordianContent({ children }: { children: React.ReactNode }) {
	const { value } = useItem();
	const { activeAccordian } = useAccordian();

	if (activeAccordian !== value) return null;

	return <div className="accordian-content">{children}</div>;
}
