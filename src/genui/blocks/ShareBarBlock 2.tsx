import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { isStr, list, obj } from "./guards";

interface Segment {
	id: string;
	label: string;
	value: number;
}

// Only three steps of this theme's grayscale ramp separate far enough apart to
// carry identity (validated: adjacent normal-vision dE 28.7). Anything beyond
// three segments folds into "Other" rather than inventing a fourth step.
const SLOTS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-5)"];
const MAX = SLOTS.length;

export default function ShareBarBlock({ props }: { props: unknown }) {
	const { caption, segments } = obj(props);
	const parsed = list<Segment>(segments, { str: ["id", "label"], num: ["value"] });
	if (!parsed) return null;

	const positive = parsed.filter((segment) => segment.value > 0);
	if (positive.length === 0) return null;

	// Fold the tail, so a model that ignores the stated cap still renders correctly.
	const head = positive.slice(0, MAX - 1);
	const tail = positive.slice(MAX - 1);
	const shown =
		tail.length > 1
			? [
					...head,
					{
						id: "other",
						label: "Other",
						value: tail.reduce((sum, segment) => sum + segment.value, 0),
					},
				]
			: positive.slice(0, MAX);

	const total = shown.reduce((sum, segment) => sum + segment.value, 0);
	if (total <= 0) return null;

	const row: Record<string, number | string> = { name: "total" };
	const config: ChartConfig = {};
	shown.forEach((segment, idx) => {
		row[segment.id] = segment.value;
		config[segment.id] = { label: segment.label, color: SLOTS[idx] };
	});

	const share = (value: number) => `${Math.round((value / total) * 100)}%`;

	return (
		<figure className="space-y-2">
			{isStr(caption) && <figcaption className="text-sm font-medium">{caption}</figcaption>}
			<ChartContainer config={config} className="h-28 w-full">
				<BarChart data={[row]} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
					{/* layout="vertical" needs an explicit category axis, or recharts maps
					    the stack onto a numeric y-scale and draws nothing. */}
					<XAxis type="number" hide />
					<YAxis type="category" dataKey="name" hide />
					<ChartTooltip content={<ChartTooltipContent />} />
					{shown.map((segment, idx) => (
						<Bar
							key={segment.id}
							dataKey={segment.id}
							stackId="share"
							fill={`var(--color-${segment.id})`}
							// 2px surface gap between stacked segments.
							stroke="var(--background)"
							strokeWidth={2}
							isAnimationActive={false}
							radius={idx === 0 || idx === shown.length - 1 ? 4 : 0}>
							{/* Direct labels: the light step sits below 3:1 on white, so the
							    share is never carried by fill alone. */}
							<LabelList
								dataKey={segment.id}
								position="center"
								// The ramp runs light -> dark, so ink has to flip with it or the
								// label on the darkest segment disappears into its own fill.
								className={`text-xs ${idx === 0 ? "fill-foreground" : "fill-background"}`}
								formatter={(value) => {
									const amount = Number(value);
									return Number.isFinite(amount) ? share(amount) : "";
								}}
							/>
						</Bar>
					))}
					<ChartLegend content={<ChartLegendContent />} />
				</BarChart>
			</ChartContainer>
		</figure>
	);
}
