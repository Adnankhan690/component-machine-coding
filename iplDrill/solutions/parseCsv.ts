export type CsvRow = Record<string, string>;

export function parseCsvLine(line: string): string[] {
	const values: string[] = [];
	let current = "";
	let inQuotes = false;

	for (let index = 0; index < line.length; index += 1) {
		const char = line[index];
		const nextChar = line[index + 1];

		if (char === '"') {
			if (inQuotes && nextChar === '"') {
				current += '"';
				index += 1;
				continue;
			}

			inQuotes = !inQuotes;
			continue;
		}

		if (char === "," && !inQuotes) {
			values.push(current);
			current = "";
			continue;
		}

		current += char;
	}

	values.push(current);
	return values;
}

export function parseCsv(raw: string): CsvRow[] {
	const [headerLine, ...lines] = raw.trim().split(/\r?\n/);
	const headers = parseCsvLine(headerLine);

	return lines.map((line) => {
		const values = parseCsvLine(line);

		return headers.reduce((row, header, index) => {
			row[header] = values[index] ?? "";
			return row;
		}, {} as CsvRow);
	});
}
