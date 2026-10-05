import { Badge } from "@/components/ui/badge";
import { isStr, list, obj } from "./guards";

interface Tag {
	id: string;
	label: string;
	tone?: string;
}

// Closed token set -> real variant, decided here rather than by the model.
const TONES: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
	neutral: "secondary",
	strong: "default",
	danger: "destructive",
	muted: "outline",
};

export default function BadgesBlock({ props }: { props: unknown }) {
	const { title, badges } = obj(props);
	const tags = list<Tag>(badges, { str: ["id", "label"], optStr: ["tone"] });
	if (!tags) return null;

	return (
		<section className="space-y-2">
			{isStr(title) && <p className="text-sm font-medium">{title}</p>}
			<div className="flex flex-wrap gap-1.5">
				{tags.map((tag) => (
					<Badge key={tag.id} variant={TONES[tag.tone ?? ""] ?? "secondary"}>
						{tag.label}
					</Badge>
				))}
			</div>
		</section>
	);
}
