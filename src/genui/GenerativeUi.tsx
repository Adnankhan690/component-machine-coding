import DataTable from "@/components/DataTable/DataTable";
import AccordianV3, { type Accordian } from "@/screens/accordian/components/AccordianV3";
import { SHOW_ACCORDION, SHOW_TABLE } from "./tools";

export interface UiBlock {
	id: string;
	name: string;
	props: unknown;
}

const isStringArray = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every((item) => typeof item === "string");

function renderBlock({ name, props }: UiBlock) {
	// The model is told to produce these shapes and `strict: true` enforces the schema,
	// but we still check at the boundary: a bad block should drop out, not blank the page.
	if (name === SHOW_TABLE) {
		const { caption, columns, rows } = (props ?? {}) as Record<string, unknown>;
		if (typeof caption !== "string" || !isStringArray(columns)) return null;
		if (!Array.isArray(rows) || !rows.every(isStringArray)) return null;
		return <DataTable caption={caption} columns={columns} rows={rows} />;
	}

	if (name === SHOW_ACCORDION) {
		const { items } = (props ?? {}) as Record<string, unknown>;
		if (!Array.isArray(items)) return null;
		const isItem = (item: unknown): item is Accordian => {
			const candidate = (item ?? {}) as Record<string, unknown>;
			return (
				typeof candidate.id === "string" &&
				typeof candidate.title === "string" &&
				typeof candidate.description === "string"
			);
		};
		if (!items.every(isItem)) return null;
		return <AccordianV3 data={items} />;
	}

	// Unknown component name: skip it rather than crash.
	return null;
}

export default function GenerativeUi({ blocks }: { blocks: UiBlock[] }) {
	return (
		<>
			{blocks.map((block) => (
				<div key={block.id} className="genui-block">
					{renderBlock(block)}
				</div>
			))}
		</>
	);
}
