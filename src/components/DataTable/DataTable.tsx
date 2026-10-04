import "./data-table.css";

export interface DataTableProps {
	caption: string;
	columns: string[];
	rows: string[][];
}

export default function DataTable({ caption, columns, rows }: DataTableProps) {
	return (
		<div className="data-table-con">
			<table className="data-table">
				<caption className="data-table-caption">{caption}</caption>
				<thead>
					<tr>
						{columns.map((column) => (
							<th key={column} scope="col">
								{column}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, rowIdx) => (
						<tr key={rowIdx}>
							{columns.map((column, cellIdx) => (
								<td key={column}>{row[cellIdx] ?? ""}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
