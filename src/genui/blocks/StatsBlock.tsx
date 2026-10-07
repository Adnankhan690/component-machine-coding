import { Card, CardContent } from "@/components/ui/card";
import { isStr, list, obj } from "@/lib/genui-guards";

interface Stat {
	id: string;
	label: string;
	value: string;
	note?: string;
}

export default function StatsBlock({ props }: { props: unknown }) {
	const stats = list<Stat>(obj(props).stats, {
		str: ["id", "label", "value"],
		optStr: ["note"],
	});
	if (!stats) return null;

	// A handful of headline numbers is a KPI row, not a one-bar bar chart.
	// `value` is a string so the model can keep its own units and formatting.
	return (
		<div className="grid gap-3 sm:grid-cols-3">
			{stats.map((stat) => (
				<Card key={stat.id}>
					<CardContent className="space-y-1">
						<p className="text-xs text-muted-foreground">{stat.label}</p>
						<p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
						{isStr(stat.note) && stat.note !== "" && (
							<p className="text-xs text-muted-foreground">{stat.note}</p>
						)}
					</CardContent>
				</Card>
			))}
		</div>
	);
}
