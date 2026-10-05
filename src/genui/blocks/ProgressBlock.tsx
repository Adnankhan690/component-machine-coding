import { Progress } from "@/components/ui/progress";
import { isStr, list, obj, pct } from "./guards";

interface Meter {
	id: string;
	label: string;
	value: number;
	note?: string;
}

export default function ProgressBlock({ props }: { props: unknown }) {
	const { caption, items } = obj(props);
	const meters = list<Meter>(items, {
		str: ["id", "label"],
		num: ["value"],
		optStr: ["note"],
	});
	if (!meters) return null;

	return (
		<section className="space-y-3">
			{isStr(caption) && <p className="text-sm font-medium">{caption}</p>}
			{meters.map((meter) => (
				<div key={meter.id} className="space-y-1.5">
					<div className="flex items-baseline justify-between gap-4 text-sm">
						<span>{meter.label}</span>
						{/* The number is always visible, so the track is never the only cue. */}
						<span className="text-muted-foreground tabular-nums">
							{Math.round(pct(meter.value))}%
						</span>
					</div>
					<Progress value={pct(meter.value)} />
					{isStr(meter.note) && meter.note !== "" && (
						<p className="text-xs text-muted-foreground">{meter.note}</p>
					)}
				</div>
			))}
		</section>
	);
}
