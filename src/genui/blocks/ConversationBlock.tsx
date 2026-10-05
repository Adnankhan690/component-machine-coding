import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble";
import { initials, list, obj } from "./guards";

interface Turn {
	id: string;
	speaker: string;
	side: string;
	text: string;
}

export default function ConversationBlock({ props }: { props: unknown }) {
	const turns = list<Turn>(obj(props).turns, { str: ["id", "speaker", "side", "text"] });
	if (!turns) return null;

	return (
		<BubbleGroup className="flex flex-col gap-3">
			{turns.map((turn) => {
				// A closed token set, mapped here. Anything unexpected reads as "left".
				const end = turn.side === "right";

				return (
					<div
						key={turn.id}
						className={`flex items-end gap-2 ${end ? "flex-row-reverse" : ""}`}>
						<Avatar className="size-7">
							{/* Derived, not asked of the model — it cannot know a real image URL. */}
							<AvatarFallback className="text-xs">{initials(turn.speaker)}</AvatarFallback>
						</Avatar>
						{/* The fill is driven by Bubble's `variant`, which styles the content
						    slot from the parent — a class on BubbleContent cannot reach it. */}
						<Bubble align={end ? "end" : "start"} variant={end ? "default" : "muted"}>
							<p className="px-1 text-xs text-muted-foreground">{turn.speaker}</p>
							<BubbleContent>{turn.text}</BubbleContent>
						</Bubble>
					</div>
				);
			})}
		</BubbleGroup>
	);
}

