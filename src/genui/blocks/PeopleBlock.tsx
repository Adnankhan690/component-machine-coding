import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Item,
	ItemContent,
	ItemDescription,
	ItemGroup,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { initials, isStr, list, obj } from "./guards";

interface Person {
	id: string;
	name: string;
	role: string;
	note?: string;
}

export default function PeopleBlock({ props }: { props: unknown }) {
	const people = list<Person>(obj(props).people, {
		str: ["id", "name", "role"],
		optStr: ["note"],
	});
	if (!people) return null;

	return (
		<ItemGroup className="gap-1">
			{people.map((person) => (
				<Item key={person.id} variant="outline">
					<ItemMedia>
						<Avatar>
							<AvatarFallback>{initials(person.name)}</AvatarFallback>
						</Avatar>
					</ItemMedia>
					<ItemContent>
						<ItemTitle>{person.name}</ItemTitle>
						{isStr(person.note) && person.note !== "" && (
							<ItemDescription>{person.note}</ItemDescription>
						)}
					</ItemContent>
					<Badge variant="secondary">{person.role}</Badge>
				</Item>
			))}
		</ItemGroup>
	);
}
