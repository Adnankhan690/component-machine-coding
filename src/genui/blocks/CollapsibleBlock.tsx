import { ChevronDown } from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { isStr, obj } from "@/lib/genui-guards";

export default function CollapsibleBlock({ props }: { props: unknown }) {
	const { summary, detail } = obj(props);
	if (!isStr(summary) || !isStr(detail)) return null;

	return (
		<Collapsible className="rounded-lg border">
			<CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 p-3 text-left text-sm font-medium">
				{summary}
				<ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
			</CollapsibleTrigger>
			<CollapsibleContent className="border-t p-3 text-sm leading-relaxed whitespace-pre-wrap">
				{detail}
			</CollapsibleContent>
		</Collapsible>
	);
}
