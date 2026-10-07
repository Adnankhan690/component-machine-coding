import { Calendar } from "@/components/ui/calendar";
import { isStr, list, obj } from "@/lib/genui-guards";

interface Marked {
	date: string;
	label: string;
}

/** `YYYY-MM-DD` -> Date, or null. Parsed here because JSON carries no Date. */
const parseDay = (value: string) => {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	if (!match) return null;
	const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
	return Number.isNaN(date.getTime()) ? null : date;
};

export default function CalendarBlock({ props }: { props: unknown }) {
	const { caption, dates } = obj(props);
	const marked = list<Marked>(dates, { str: ["date", "label"] });
	if (!marked) return null;

	const days = marked
		.map((entry) => ({ ...entry, parsed: parseDay(entry.date) }))
		.filter((entry): entry is Marked & { parsed: Date } => entry.parsed !== null);
	if (days.length === 0) return null;

	return (
		<section className="space-y-3">
			{isStr(caption) && <p className="text-sm font-medium">{caption}</p>}
			<div className="flex flex-wrap gap-4">
				<Calendar
					mode="multiple"
					className="rounded-md border"
					defaultMonth={days[0].parsed}
					selected={days.map((day) => day.parsed)}
					// Display only: the highlighted days come from the answer, not the reader.
					onSelect={() => undefined}
				/>
				{/* The legend is what makes the highlight mean something. */}
				<ul className="space-y-1 text-sm">
					{days.map((day) => (
						<li key={day.date}>
							<span className="text-muted-foreground tabular-nums">{day.date}</span>{" "}
							{day.label}
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
