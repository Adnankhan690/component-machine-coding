import { createContext, useContext, useEffect } from "react";
import { useAccordian } from "./Accordian";

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
	const { activeAccordian, setActiveAccordian, variant } = useAccordian();

	useEffect(() => {
		console.log(activeAccordian);
	}, [activeAccordian]);

	const handleToggle = () => {
		setActiveAccordian((prev) => {
			if (variant === "single" && typeof prev === "string") return value;
			if (Array.isArray(prev) && prev.includes(value))
				return prev.filter((item) => item !== value);
			return [...prev, value];
		});
	};

	return (
		<div
			className={`accordian-header ${activeAccordian.includes(value) ? "active" : ""}`}
			onClick={handleToggle}>
			{children}
			<span className="icon">
				{activeAccordian.includes(value) ? "−" : "+"}
			</span>
		</div>
	);
}

export function AccordianContent({ children }: { children: React.ReactNode }) {
	const { value } = useItem();
	const { activeAccordian, variant } = useAccordian();

	if (variant === "single" && typeof activeAccordian === "string" && activeAccordian !== value) return null;
	if (
		variant === "multiple" &&
		Array.isArray(activeAccordian) &&
		!activeAccordian.includes(value)
	)
		return null;

	return <div className="accordian-content">{children}</div>;
}
