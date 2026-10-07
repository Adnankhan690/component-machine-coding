import {
	Item,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemTitle,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { isStr, list, obj } from "./guards";

interface Entry {
	id: string;
	title: string;
	description: string;
	meta?: string;
}

export default function ItemListBlock({ props }: { props: unknown }) {
	const items = list<Entry>(obj(props).items, {
		str: ["id", "title", "description"],
		optStr: ["meta"],
	});
	if (!items) return null;

	return (
		<ItemGroup className="gap-1">
			{items.map((item) => (
				<Item key={item.id} variant="outline">
					<ItemContent>
						<ItemTitle>{item.title}</ItemTitle>
						<ItemDescription>{item.description}</ItemDescription>
					</ItemContent>
					{isStr(item.meta) && item.meta !== "" && (
						<Badge variant="outline">{item.meta}</Badge>
					)}
				</Item>
			))}
		</ItemGroup>
	);
}
