import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { isStr, list, obj } from "@/lib/genui-guards";

interface Entry {
	id: string;
	command: string;
	description: string;
}

export default function CommandListBlock({ props }: { props: unknown }) {
	const { caption, commands } = obj(props);
	const entries = list<Entry>(commands, { str: ["id", "command", "description"] });
	if (!entries) return null;

	// The filter box is the reason this is not just a table: long reference lists
	// are searched, not read. The query is interaction state, owned internally.
	return (
		<Command className="rounded-lg border">
			<CommandInput placeholder={isStr(caption) ? caption : "Filter..."} />
			<CommandList>
				<CommandEmpty>No match.</CommandEmpty>
				<CommandGroup>
					{entries.map((entry) => (
						<CommandItem key={entry.id} value={`${entry.command} ${entry.description}`}>
							<div className="grid gap-0.5">
								<code className="font-mono text-xs">{entry.command}</code>
								<span className="text-xs text-muted-foreground">{entry.description}</span>
							</div>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}
