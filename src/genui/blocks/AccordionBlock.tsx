import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { list, obj } from "@/lib/genui-guards";

interface Section {
	id: string;
	title: string;
	description: string;
}

export default function AccordionBlock({ props }: { props: unknown }) {
	const items = list<Section>(obj(props).items, { str: ["id", "title", "description"] });
	if (!items) return null;

	// `multiple`: the premise of this component is independent topics, so the
	// reader may well want several open at once.
	return (
		<Accordion type="multiple">
			{items.map((item) => (
				<AccordionItem key={item.id} value={item.id}>
					<AccordionTrigger>{item.title}</AccordionTrigger>
					<AccordionContent className="whitespace-pre-wrap">
						{item.description}
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}
