import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { isStr, list, obj } from "./guards";

interface Point {
	label: string;
	value: number;
}

export default function BarChartBlock({ props }: { props: unknown }) {
	const { caption, valueLabel, data } = obj(props);
	const points = list<Point>(data, { str: ["label"], num: ["value"] });
	if (!points) return null;

	// Magnitude is a sequential job, not an identity one: every bar wears the same
	// hue, and the category is read off the axis. Cycling colors here would imply
	// a distinction between bars that does not exist.
	const config = {
		value: { label: isStr(valueLabel) ? valueLabel : "Value", color: "var(--chart-3)" },
	} satisfies ChartConfig;

	return (
		<figure className="space-y-2">
			{isStr(caption) && <figcaption className="text-sm font-medium">{caption}</figcaption>}
			<ChartContainer config={config} className="h-64 w-full">
				<BarChart data={points} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
					<CartesianGrid vertical={false} />
					<XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
					<YAxis tickLine={false} axisLine={false} width={40} />
					<ChartTooltip content={<ChartTooltipContent />} />
					{/* 4px rounded data-end, square against the baseline. */}
					<Bar
						dataKey="value"
						fill="var(--color-value)"
						radius={[4, 4, 0, 0]}
						// The block is rendered into a transcript that may already be
						// scrolled past; a grow-in animation would be missed anyway.
						isAnimationActive={false}>
						<LabelList dataKey="value" position="top" className="fill-foreground text-xs" />
					</Bar>
				</BarChart>
			</ChartContainer>
		</figure>
	);
}
