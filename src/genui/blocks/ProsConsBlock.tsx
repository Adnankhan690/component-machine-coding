import { Minus, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isStr, obj, strArr } from "@/lib/genui-guards";

export default function ProsConsBlock({ props }: { props: unknown }) {
	const { subject, pros, cons } = obj(props);
	if (!isStr(subject) || !strArr(pros) || !strArr(cons)) return null;
	if (pros.length === 0 && cons.length === 0) return null;

	const columns = [
		{ key: "pros", title: "Pros", icon: Plus, entries: pros },
		{ key: "cons", title: "Cons", icon: Minus, entries: cons },
	];

	return (
		<section className="space-y-2">
			<p className="text-sm font-medium">{subject}</p>
			<div className="grid gap-3 sm:grid-cols-2">
				{columns.map(({ key, title, icon: Icon, entries }) => (
					<Card key={key}>
						<CardHeader>
							<CardTitle className="flex items-center gap-1.5 text-sm">
								<Icon className="size-3.5" />
								{title}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-1.5 text-sm text-muted-foreground">
								{entries.map((entry, idx) => (
									<li key={`${key}-${idx}`}>{entry}</li>
								))}
							</ul>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
