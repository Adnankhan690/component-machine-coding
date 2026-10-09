import { FileCode, FileText, Folder } from "lucide-react";
import {
	Attachment,
	AttachmentContent,
	AttachmentDescription,
	AttachmentGroup,
	AttachmentMedia,
	AttachmentTitle,
} from "@/components/ui/attachment";
import { isStr, list, obj } from "./guards";

interface Entry {
	id: string;
	name: string;
	kind: string;
	description: string;
}

// Closed token set: the model names a kind, this map decides what it looks like.
const KINDS = { code: FileCode, doc: FileText, folder: Folder } as const;

/**
 * No URL, no size, no upload state: the model is describing what files are FOR,
 * not handing over real uploads.
 */
export default function AttachmentBlock({ props }: { props: unknown }) {
	const { caption, files } = obj(props);
	const entries = list<Entry>(files, { str: ["id", "name", "kind", "description"] });
	if (!entries) return null;

	return (
		<section className="space-y-2">
			{isStr(caption) && <p className="text-sm font-medium">{caption}</p>}
			<AttachmentGroup>
				{entries.map((entry) => {
					const Icon = KINDS[entry.kind as keyof typeof KINDS] ?? FileText;
					return (
						<Attachment key={entry.id}>
							<AttachmentMedia variant="icon">
								<Icon />
							</AttachmentMedia>
							<AttachmentContent>
								<AttachmentTitle>{entry.name}</AttachmentTitle>
								<AttachmentDescription>{entry.description}</AttachmentDescription>
							</AttachmentContent>
						</Attachment>
					);
				})}
			</AttachmentGroup>
		</section>
	);
}
