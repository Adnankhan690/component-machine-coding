import { AspectRatio } from "@/components/ui/aspect-ratio";
import { isStr, list, obj } from "./guards";

interface Shape {
	id: string;
	label: string;
	width: number;
	height: number;
	note?: string;
}

/**
 * AspectRatio normally frames an image, which rules it out for genui: a model
 * cannot know a real image URL. What it CAN do is answer "what does 21:9 look
 * like next to 4:3" — so the shape itself is the content, and the model only
 * supplies the two integers it genuinely knows.
 */
export default function AspectRatioBlock({ props }: { props: unknown }) {
	const { caption, items } = obj(props);
	const parsed = list<Shape>(items, {
		str: ["id", "label"],
		num: ["width", "height"],
		optStr: ["note"],
	});
	if (!parsed) return null;

	// A zero or negative side would divide to Infinity or collapse the box, so
	// those entries drop out rather than taking the layout down with them.
	const shown = parsed.filter((item) => item.width > 0 && item.height > 0);
	if (shown.length === 0) return null;

	return (
		<section className="space-y-2">
			{isStr(caption) && <p className="text-sm font-medium">{caption}</p>}
			<div className="flex flex-wrap items-start gap-4">
				{shown.map((item) => (
					<figure key={item.id} className="w-40 space-y-1.5">
						<AspectRatio
							ratio={item.width / item.height}
							className="flex items-center justify-center rounded-lg border bg-muted">
							<span className="text-xs text-muted-foreground tabular-nums">
								{item.width}:{item.height}
							</span>
						</AspectRatio>
						<figcaption className="text-sm">{item.label}</figcaption>
						{isStr(item.note) && item.note !== "" && (
							<p className="text-xs text-muted-foreground">{item.note}</p>
						)}
					</figure>
				))}
			</div>
		</section>
	);
}
