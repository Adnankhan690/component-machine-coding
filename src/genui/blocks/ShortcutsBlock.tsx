import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableRow,
} from "@/components/ui/table";
import { isStr, list, obj } from "@/lib/genui-guards";

interface Shortcut {
	id: string;
	keys: string[];
	action: string;
}

export default function ShortcutsBlock({ props }: { props: unknown }) {
	const { caption, shortcuts } = obj(props);
	const rows = list<Shortcut>(shortcuts, { str: ["id", "action"], strs: ["keys"] });
	if (!rows) return null;

	return (
		<Table>
			{isStr(caption) && (
				<TableCaption className="caption-top text-left font-medium text-foreground">
					{caption}
				</TableCaption>
			)}
			<TableBody>
				{rows.map((shortcut) => (
					<TableRow key={shortcut.id}>
						<TableCell className="w-44">
							<KbdGroup>
								{shortcut.keys.map((key, idx) => (
									<Kbd key={`${key}-${idx}`}>{key}</Kbd>
								))}
							</KbdGroup>
						</TableCell>
						<TableCell>{shortcut.action}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
