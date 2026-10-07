import { isStr, list, obj } from "@/lib/genui-guards";

interface Event {
	id: string;
	date: string;
	title: string;
	description: string;
}

export default function TimelineBlock({ props }: { props: unknown }) {
	const { caption, events } = obj(props);
	const entries = list<Event>(events, { str: ["id", "date", "title", "description"] });
	if (!entries) return null;

	return (
		<section className="space-y-3">
			{isStr(caption) && <p className="text-sm font-medium">{caption}</p>}
			<ol className="relative space-y-5 border-l pl-6">
				{entries.map((event) => (
					<li key={event.id} className="relative">
						<span
							aria-hidden
							className="absolute top-1.5 -left-[25px] size-2.5 rounded-full border-2 border-background bg-foreground"
						/>
						{/* The date stays a string: it is a label, not a value to compute with,
						    and a real Date would not survive the trip as JSON anyway. */}
						<p className="text-xs text-muted-foreground tabular-nums">{event.date}</p>
						<p className="text-sm font-medium">{event.title}</p>
						<p className="text-sm text-muted-foreground">{event.description}</p>
					</li>
				))}
			</ol>
		</section>
	);
}
