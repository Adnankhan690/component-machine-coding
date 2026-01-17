import AccordianProvider from "../../context/AccordianProvider";
import AccordianItem, {
	AccordianContent,
	AccordianHeader,
} from "./AccordianItem";

interface AccordianProps {
	children: React.ReactNode;
}

export default function Accordian({ children }: AccordianProps) {
	return (
		<AccordianProvider>
			<div>{children}</div>
		</AccordianProvider>
	);
}

Accordian.Item = AccordianItem;
Accordian.Header = AccordianHeader;
Accordian.Content = AccordianContent;
