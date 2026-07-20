import { readFile } from "node:fs/promises";
import { parseCsv, type CsvRow } from "./parseCsv.ts";

export async function readCsv(fileUrl: URL): Promise<CsvRow[]> {
	const raw = await readFile(fileUrl, "utf-8");
	return parseCsv(raw);
}

const matchesCsvUrl = new URL("../data/archive/matches.csv", import.meta.url);
const deliveriesCsvUrl = new URL("../data/archive/deliveries.csv", import.meta.url);

export function readMatchesCsv(): Promise<CsvRow[]> {
	return readCsv(matchesCsvUrl);
}

export function readDeliveriesCsv(): Promise<CsvRow[]> {
	return readCsv(deliveriesCsvUrl);
}
