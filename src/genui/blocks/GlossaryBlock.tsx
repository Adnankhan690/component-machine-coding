import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { isStr, list, obj } from "@/lib/genui-guards";

interface Term {
	id: string;
	term: string;
	definition: string;
}

export default function GlossaryBlock({ props }: { props: unknown }) {
	const { intro, terms } = obj(props);
	const entries = list<Term>(terms, { str: ["id", "term", "definition"] });
	if (!entries) return null;

	return (
		<section className="space-y-2">
			{isStr(intro) && <p className="text-sm text-muted-foreground">{intro}</p>}
			<div className="flex flex-wrap gap-2">
				{entries.map((entry) => (
					<HoverCard key={entry.id}>
						<HoverCardTrigger className="cursor-help rounded-md border border-dashed px-2 py-1 text-sm underline decoration-dotted underline-offset-4">
							{entry.term}
						</HoverCardTrigger>
						<HoverCardContent className="text-sm">{entry.definition}</HoverCardContent>
					</HoverCard>
				))}
			</div>
			{/* Hover is an enhancement, not the only route to the content. */}
			<dl className="sr-only">
				{entries.map((entry) => (
					<div key={entry.id}>
						<dt>{entry.term}</dt>
						<dd>{entry.definition}</dd>
					</div>
				))}
			</dl>
		</section>
	);
}
