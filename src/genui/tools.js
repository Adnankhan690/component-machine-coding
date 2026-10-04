// Tool definitions = component contracts.
// Plain .js so both the Vite server middleware (node) and the browser can import it.
// These tools have NO implementation: a tool_use block means "render this", not "run this".

export const SHOW_TABLE = "show_table";
export const SHOW_ACCORDION = "show_accordion";

export const UI_TOOLS = [
	{
		name: SHOW_TABLE,
		description:
			"Render a data table. Use when the answer compares things across the same set of attributes, or is a grid of values. Every row must have exactly as many cells as there are columns.",
		input_schema: {
			type: "object",
			properties: {
				caption: { type: "string", description: "Short title above the table." },
				columns: { type: "array", items: { type: "string" } },
				rows: {
					type: "array",
					items: { type: "array", items: { type: "string" } },
				},
			},
			required: ["caption", "columns", "rows"],
			additionalProperties: false,
		},
		strict: true,
	},
	{
		name: SHOW_ACCORDION,
		description:
			"Render a list of collapsible sections. Use when the answer is a set of independent topics, steps, or questions where each needs a paragraph of explanation and the reader will only care about some of them.",
		input_schema: {
			type: "object",
			properties: {
				items: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: { type: "string", description: "Unique slug for this section." },
							title: { type: "string" },
							description: { type: "string" },
						},
						required: ["id", "title", "description"],
						additionalProperties: false,
					},
				},
			},
			required: ["items"],
			additionalProperties: false,
		},
		strict: true,
	},
];

export const SYSTEM_PROMPT = [
	"You answer by rendering UI, not by writing long prose.",
	"Pick the one tool whose shape matches the shape of the answer, and call it.",
	"Alongside the tool call, write at most one short sentence of framing text.",
	"If neither tool fits the answer, just reply with plain text and call no tool.",
].join(" ");
