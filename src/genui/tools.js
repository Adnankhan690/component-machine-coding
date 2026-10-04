// Component contracts, provider-neutral.
// These "tools" have NO implementation: a tool call means "render this", not "run this".
// Each provider adapter below reshapes the same specs into its own dialect.

export const SHOW_TABLE = "show_table";
export const SHOW_ACCORDION = "show_accordion";

export const UI_COMPONENTS = [
	{
		name: SHOW_TABLE,
		description:
			"Render a data table. Use when the answer compares things across the same set of attributes, or is a grid of values. Every row must have exactly as many cells as there are columns.",
		schema: {
			type: "object",
			properties: {
				caption: { type: "string", description: "Short title above the table." },
				columns: { type: "array", items: { type: "string" } },
				rows: {
					type: "array",
					description: "One array of cell strings per row.",
					items: { type: "array", items: { type: "string" } },
				},
			},
			required: ["caption", "columns", "rows"],
			additionalProperties: false,
		},
	},
	{
		name: SHOW_ACCORDION,
		description:
			"Render a list of collapsible sections. Use when the answer is a set of independent topics, steps, or questions where each needs a paragraph of explanation and the reader will only care about some of them.",
		schema: {
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
	},
];

export const SYSTEM_PROMPT = [
	"You answer by rendering UI, not by writing long prose.",
	"Pick the one tool whose shape matches the shape of the answer, and call it.",
	"Alongside the tool call, write at most one short sentence of framing text.",
	"If neither tool fits the answer, just reply with plain text and call no tool.",
].join(" ");

/** Anthropic: `input_schema`, plus strict mode for guaranteed-valid props. */
export const toAnthropicTools = () =>
	UI_COMPONENTS.map(({ name, description, schema }) => ({
		name,
		description,
		input_schema: schema,
		strict: true,
	}));

/** Gemini's schema dialect is an OpenAPI subset that rejects `additionalProperties`. */
const stripUnsupported = (node) => {
	if (Array.isArray(node)) return node.map(stripUnsupported);
	if (node === null || typeof node !== "object") return node;

	return Object.fromEntries(
		Object.entries(node)
			.filter(([key]) => key !== "additionalProperties")
			.map(([key, value]) => [key, stripUnsupported(value)]),
	);
};

/** Gemini: `parameters`, wrapped in a single functionDeclarations block. */
export const toGeminiTools = () => [
	{
		functionDeclarations: UI_COMPONENTS.map(({ name, description, schema }) => ({
			name,
			description,
			parameters: stripUnsupported(schema),
		})),
	},
];
