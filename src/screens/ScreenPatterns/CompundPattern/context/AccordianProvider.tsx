import { createContext, SetStateAction, useContext, useState } from "react";

interface AccordianContext {
	activeAccordian: string;
	setActiveAccordian: (value: string) => void;
}

const AccordianContext = createContext<AccordianContext | null>(null);

export default function AccordianProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [activeAccordian, setActiveAccordian] = useState("faq1");

	return (
		<AccordianContext.Provider value={{ activeAccordian, setActiveAccordian }}>
			{children}
		</AccordianContext.Provider>
	);
}

export function useAccordian() {
	const context = useContext(AccordianContext);

	if (!context) {
		throw new Error("useAccordian must be used within a AccordianProvider");
	}

	return context;
}
