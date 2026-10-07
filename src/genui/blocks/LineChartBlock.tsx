import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart";
import { isStr, list, obj } from "@/lib/genui-guards";

interface Point {
	label: string;
	value: number;
}

export default function LineChartBlock({ props }: { props: unknown }) {
	const { caption, valueLabel, data } = obj(props);
	const points = list<Point>(data, { str: ["label"], num: ["value"] });
	if (!points) return null;

	// One series, so no legend box — the caption names what is being plotted.
	const config = {
		value: { label: isStr(valueLabel) ? valueLabel : "Value", color: "var(--chart-3)" },
	} satisfies ChartConfig;

	return (
		<figure className="space-y-2">
			{isStr(caption) && <figcaption className="text-sm font-medium">{caption}</figcaption>}
			<ChartContainer config={config} className="h-64 w-full">
				<LineChart data={points} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
					<CartesianGrid vertical={false} />
					<XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
					<YAxis tickLine={false} axisLine={false} width={40} />
					<ChartTooltip content={<ChartTooltipContent />} />
					{/* 2px line, 8px markers. */}
					<Line
						dataKey="value"
						type="monotone"
						stroke="var(--color-value)"
						strokeWidth={2}
						dot={{ r: 4 }}
						activeDot={{ r: 5 }}
						isAnimationActive={false}
					/>
				</LineChart>
			</ChartContainer>
		</figure>
	);
}
