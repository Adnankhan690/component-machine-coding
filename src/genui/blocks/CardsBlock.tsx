import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { isStr, list, obj } from "@/lib/genui-guards";

interface CardItem {
	id: string;
	title: string;
	description: string;
	badge?: string;
}

export default function CardsBlock({ props }: { props: unknown }) {
	const cards = list<CardItem>(obj(props).cards, {
		str: ["id", "title", "description"],
		optStr: ["badge"],
	});
	if (!cards) return null;

	return (
		<div className="grid gap-3 sm:grid-cols-2">
			{cards.map((card) => (
				<Card key={card.id}>
					<CardHeader>
						<CardTitle>{card.title}</CardTitle>
						{isStr(card.badge) && card.badge !== "" && (
							<Badge variant="secondary">{card.badge}</Badge>
						)}
					</CardHeader>
					<CardContent>
						<CardDescription className="whitespace-pre-wrap">
							{card.description}
						</CardDescription>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
