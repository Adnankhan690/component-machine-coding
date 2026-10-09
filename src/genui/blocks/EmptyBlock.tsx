import { SearchX } from "lucide-react";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { isStr, obj } from "./guards";

export default function EmptyBlock({ props }: { props: unknown }) {
	const { title, description } = obj(props);
	if (!isStr(title) || !isStr(description)) return null;

	return (
		<Empty className="border border-dashed">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<SearchX />
				</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
