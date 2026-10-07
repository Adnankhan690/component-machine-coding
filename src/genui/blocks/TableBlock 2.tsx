import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { isStr, obj, strArr } from "./guards";

export default function TableBlock({ props }: { props: unknown }) {
	const { caption, columns, rows } = obj(props);

	if (!isStr(caption) || !strArr(columns) || columns.length === 0) return null;
	if (!Array.isArray(rows) || !rows.every(strArr)) return null;

	return (
		<Table>
			<TableCaption className="caption-top text-left font-medium text-foreground">
				{caption}
			</TableCaption>
			<TableHeader>
				<TableRow>
					{columns.map((column) => (
						<TableHead key={column}>{column}</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{(rows as string[][]).map((row, rowIdx) => (
					<TableRow key={rowIdx}>
						{/* Drive the cells off `columns`, so a short row pads instead of skewing. */}
						{columns.map((column, cellIdx) => (
							<TableCell key={column}>{row[cellIdx] ?? ""}</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
