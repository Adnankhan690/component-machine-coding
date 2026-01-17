import AccordianItem, {
	AccordianContent,
	AccordianHeader,
} from "./AccordianItem";

import { createContext, SetStateAction, useContext, useState } from "react";

type AccordianVariant = "single" | "multiple";

interface AccordianContext {
	activeAccordian: string[] | string;
	setActiveAccordian: React.Dispatch<SetStateAction<string[] | string>>;
	variant: AccordianVariant;
}

const AccordianContext = createContext<AccordianContext | null>(null);

export function useAccordian() {
	const context = useContext(AccordianContext);

	if (!context) {
		throw new Error("useAccordian must be used within a AccordianProvider");
	}

	return context;
}

interface AccordianProps {
	children: React.ReactNode;
	variant?: AccordianVariant;
}

const VariantMapper = {
	single: "",
	multiple: [],
};

export default function Accordian({
	children,
	variant = "multiple",
}: AccordianProps) {
	const [activeAccordian, setActiveAccordian] = useState<string[] | string>(
		VariantMapper[variant],
	);

	return (
		<AccordianContext.Provider
			value={{ activeAccordian, setActiveAccordian, variant }}>
			<div>{children}</div>
		</AccordianContext.Provider>
	);
}

Accordian.Item = AccordianItem;
Accordian.Header = AccordianHeader;
Accordian.Content = AccordianContent;
