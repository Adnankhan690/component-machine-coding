// Component contracts, provider-neutral.
//
// These "tools" have NO implementation: a tool call means "render this", not
// "run this". Each provider adapter at the bottom reshapes the same specs into
// its own dialect, so adding a component here reaches both providers at once.
//
// Every entry is wrapped over a shadcn/ui component. The rules these schemas
// follow are written up in notes/generative-ui/04-component-design-rules.md.

export const SHOW_TABLE = "show_table";
export const SHOW_ACCORDION = "show_accordion";
export const SHOW_TABS = "show_tabs";
export const SHOW_ALERT = "show_alert";
export const SHOW_CARDS = "show_cards";
export const SHOW_CAROUSEL = "show_carousel";
export const SHOW_BAR_CHART = "show_bar_chart";
export const SHOW_LINE_CHART = "show_line_chart";
export const SHOW_SHARE_BAR = "show_share_bar";
export const SHOW_BREADCRUMB = "show_breadcrumb";
export const SHOW_PROGRESS = "show_progress";
export const SHOW_SHORTCUTS = "show_shortcuts";
export const SHOW_CHECKLIST = "show_checklist";
export const SHOW_QUIZ = "show_quiz";
export const SHOW_CONVERSATION = "show_conversation";
export const SHOW_PEOPLE = "show_people";
export const SHOW_BADGES = "show_badges";
export const SHOW_EMPTY = "show_empty";
export const SHOW_ITEM_LIST = "show_item_list";
export const SHOW_TIMELINE = "show_timeline";
export const SHOW_STATS = "show_stats";
export const SHOW_CALENDAR = "show_calendar";
export const SHOW_COLLAPSIBLE = "show_collapsible";
export const SHOW_GLOSSARY = "show_glossary";
export const SHOW_STEPS = "show_steps";
export const SHOW_TREE = "show_tree";
export const SHOW_PROS_CONS = "show_pros_cons";
export const SHOW_KEY_VALUE = "show_key_value";
export const SHOW_FILE_LIST = "show_file_list";
export const SHOW_COMMAND_LIST = "show_command_list";

// --- schema helpers -------------------------------------------------------
// Only sugar. They exist so the *descriptions* stay the readable part of each
// entry, since the descriptions are what actually decide which tool gets picked.

const str = (description) => ({ type: "string", description });
const num = (description) => ({ type: "number", description });

/** An array of flat objects. `optional` keys are the ones left out of `required`. */
const rows = ({ of, optional = [], description, min = 1, max }) => ({
	type: "array",
	description,
	minItems: min,
	maxItems: max,
	items: {
		type: "object",
		properties: of,
		required: Object.keys(of).filter((key) => !optional.includes(key)),
		additionalProperties: false,
	},
});

/** A top-level object schema. `optional` keys are the ones left out of `required`. */
const shape = (properties, optional = []) => ({
	type: "object",
	properties,
	required: Object.keys(properties).filter((key) => !optional.includes(key)),
	additionalProperties: false,
});

const ID = str("Unique slug for this entry.");

export const UI_COMPONENTS = [
	{
		name: SHOW_TABLE,
		description:
			"Render a data table. Use when the answer compares several things across the SAME set of " +
			"attributes, or is a grid of values — 'compare X and Y', 'side by side', 'what's the " +
			"difference', 'options'. Prefer show_key_value when only ONE thing is being described, and " +
			"show_pros_cons when the two columns are advantages and disadvantages of one thing. " +
			"Every row must have exactly as many cells as there are columns.",
		schema: shape({
			caption: str("Short title above the table."),
			columns: {
				type: "array",
				description: "2 to 6 column headers.",
				minItems: 2,
				maxItems: 6,
				items: { type: "string" },
			},
			rows: {
				type: "array",
				description: "One array of cell strings per row, in the same order as `columns`.",
				minItems: 1,
				maxItems: 20,
				items: { type: "array", items: { type: "string" } },
			},
		}),
	},
	{
		name: SHOW_ACCORDION,
		description:
			"Render collapsible sections, several of which can be open at once. Use when the answer is a " +
			"set of INDEPENDENT topics, questions, or concepts, each needing a paragraph, where the reader " +
			"will only care about some of them — 'explain the stages of X', an FAQ. Prefer show_tabs when " +
			"the sections are alternative versions of the same subject, and show_steps when they must be " +
			"done in order.",
		schema: shape({
			items: rows({
				description: "3 to 10 independent sections.",
				min: 3,
				max: 10,
				of: {
					id: ID,
					title: str("Short heading for the section."),
					description: str("A paragraph explaining this section."),
				},
			}),
		}),
	},
	{
		name: SHOW_TABS,
		description:
			"Render a tabbed panel showing one section at a time. Use when the answer is 2 to 5 " +
			"ALTERNATIVE views of the SAME subject that the reader compares by switching between them — " +
			"variants, versions, approaches, languages, before/after. Prefer show_accordion when the " +
			"sections are independent topics the reader may want open at once.",
		schema: shape({
			tabs: rows({
				description: "2 to 5 alternatives, shown one at a time.",
				min: 2,
				max: 5,
				of: {
					id: ID,
					title: str("Short label, 1-3 words."),
					content: str("The full text shown when this tab is selected."),
				},
			}),
		}),
	},
	{
		name: SHOW_ALERT,
		description:
			"Render a single short callout. Use when the WHOLE answer is one caution, gotcha, tip, or " +
			"correction of a sentence or two — 'is it safe to…', 'what's the catch with…'. Do not use it " +
			"to wrap a long answer, and do not pair it with another component.",
		schema: shape({
			tone: {
				type: "string",
				description: "The kind of callout this is.",
				enum: ["note", "success", "warning", "danger"],
			},
			title: str("One short line, under about 8 words."),
			description: str("One or two sentences."),
		}),
	},
	{
		name: SHOW_CARDS,
		description:
			"Render a grid of short cards. Use when the answer is a set of OPTIONS, tools, libraries, or " +
			"approaches the reader is CHOOSING BETWEEN, each with a name and a short blurb. Prefer " +
			"show_table when every option is described by the same named attributes, and show_item_list " +
			"when it is a list to read rather than a choice to make.",
		schema: shape({
			cards: rows({
				description: "2 to 6 options.",
				min: 2,
				max: 6,
				optional: ["badge"],
				of: {
					id: ID,
					title: str("The option's name."),
					description: str("One or two sentences on when to pick it."),
					badge: str("Optional 1-2 word tag, e.g. 'popular' or 'deprecated'."),
				},
			}),
		}),
	},
	{
		name: SHOW_CAROUSEL,
		description:
			"Render slides the reader steps through one at a time with prev/next. Use when the answer is " +
			"an ordered WALKTHROUGH meant to be paged through in sequence — a tour, a worked example, a " +
			"story. Prefer show_steps when the reader needs to see every step at once to actually follow " +
			"the procedure.",
		schema: shape({
			slides: rows({
				description: "3 to 8 slides, in order.",
				min: 3,
				max: 8,
				of: {
					id: ID,
					title: str("Short slide heading."),
					content: str("The slide's body text."),
				},
			}),
		}),
	},
	{
		name: SHOW_BAR_CHART,
		description:
			"Render a bar chart. Use when the answer compares a NUMERIC magnitude across named categories " +
			"— benchmark results, counts, sizes, scores. Only call this when you have real numbers; if you " +
			"would have to invent them, use show_table instead. Prefer show_line_chart when the x-axis is " +
			"time, and show_share_bar when the values are parts of one total.",
		schema: shape({
			caption: str("What is being measured."),
			valueLabel: str("Name of the quantity, e.g. 'ms' or 'downloads'."),
			data: rows({
				description: "2 to 12 categories.",
				min: 2,
				max: 12,
				of: {
					label: str("Category name, shown on the x-axis."),
					value: num("The numeric magnitude."),
				},
			}),
		}),
	},
	{
		name: SHOW_LINE_CHART,
		description:
			"Render a single-series line chart. Use when the answer is ONE numeric value changing over " +
			"TIME or an ordered sequence — a trend, growth, adoption across versions. Only call this when " +
			"you have real numbers; if you would have to invent them, use show_table. Never plot two " +
			"different measures: one series only.",
		schema: shape({
			caption: str("What is being plotted."),
			valueLabel: str("Name of the quantity being plotted."),
			data: rows({
				description: "3 to 24 points, in chronological order.",
				min: 3,
				max: 24,
				of: {
					label: str("The point on the x-axis, e.g. a year or version."),
					value: num("The value at that point."),
				},
			}),
		}),
	},
	{
		name: SHOW_SHARE_BAR,
		description:
			"Render a horizontal stacked bar showing parts of a whole. Use when the answer is how one " +
			"total SPLITS UP — market share, a budget, a breakdown that sums to 100%. At most 3 segments: " +
			"fold the rest into a final 'Other' segment yourself. Prefer show_bar_chart when the " +
			"categories are being compared rather than summed into a whole.",
		schema: shape({
			caption: str("What the whole represents."),
			segments: rows({
				description: "2 or 3 segments. Fold any remainder into a final 'Other' segment.",
				min: 2,
				max: 3,
				of: {
					id: ID,
					label: str("Segment name."),
					value: num("Its share. Any units — the bar is drawn from the proportions."),
				},
			}),
		}),
	},
	{
		name: SHOW_BREADCRUMB,
		description:
			"Render a single path from a root to a leaf. Use when the answer is ONE straight chain of " +
			"containment or ancestry — a file path, a DOM hierarchy, a class inheritance chain, where a " +
			"setting is buried in a menu. Prefer show_tree when the structure branches.",
		schema: shape({
			path: rows({
				description: "2 to 7 levels, outermost first.",
				min: 2,
				max: 7,
				of: { id: ID, label: str("This level's name.") },
			}),
		}),
	},
	{
		name: SHOW_PROGRESS,
		description:
			"Render labelled percentage bars. Use when the answer scores several named things on the SAME " +
			"0-100 scale — browser support, test coverage, completion, confidence levels. Prefer " +
			"show_bar_chart when the values are counts or sizes rather than percentages.",
		schema: shape({
			caption: str("What the percentages measure."),
			items: rows({
				description: "2 to 8 bars.",
				min: 2,
				max: 8,
				optional: ["note"],
				of: {
					id: ID,
					label: str("What is being scored."),
					value: num("A percentage from 0 to 100."),
					note: str("Optional short clarification."),
				},
			}),
		}),
	},
	{
		name: SHOW_SHORTCUTS,
		description:
			"Render keyboard shortcuts with the keys drawn as keycaps. Use when the answer is a set of KEY " +
			"COMBINATIONS — editor shortcuts, hotkeys, key bindings. Prefer show_command_list for things " +
			"typed into a terminal.",
		schema: shape({
			caption: str("Which app or context these belong to."),
			shortcuts: rows({
				description: "2 to 20 shortcuts.",
				min: 2,
				max: 20,
				of: {
					id: ID,
					keys: {
						type: "array",
						description: "One key per entry, in press order, e.g. ['Cmd', 'Shift', 'P'].",
						minItems: 1,
						maxItems: 4,
						items: { type: "string" },
					},
					action: str("What the shortcut does."),
				},
			}),
		}),
	},
	{
		name: SHOW_CHECKLIST,
		description:
			"Render an interactive checklist the reader ticks off. Use when the answer is a set of things " +
			"to DO or VERIFY that the reader will work through — a pre-launch check, a code review " +
			"checklist, setup prerequisites. Prefer show_steps when the order matters and each item needs " +
			"a real explanation.",
		schema: shape({
			title: str("What the checklist is for."),
			items: rows({
				description: "3 to 15 things to check.",
				min: 3,
				max: 15,
				optional: ["hint"],
				of: {
					id: ID,
					label: str("The thing to check, phrased as an action."),
					hint: str("Optional one-line clarification."),
				},
			}),
		}),
	},
	{
		name: SHOW_QUIZ,
		description:
			"Render multiple-choice questions that mark themselves once answered. Use ONLY when the user " +
			"asks to be tested, quizzed, or to practise — never as a way to explain something. `answer` " +
			"must be exactly one of the strings in `options`.",
		schema: shape({
			questions: rows({
				description: "1 to 8 questions.",
				min: 1,
				max: 8,
				of: {
					id: ID,
					question: str("The question."),
					options: {
						type: "array",
						description: "2 to 5 answer choices.",
						minItems: 2,
						maxItems: 5,
						items: { type: "string" },
					},
					answer: str("The correct option, copied verbatim from `options`."),
					explanation: str("Why that answer is right, shown after answering."),
				},
			}),
		}),
	},
	{
		name: SHOW_CONVERSATION,
		description:
			"Render an example dialogue as chat bubbles. Use when the answer IS an exchange between two " +
			"parties — a sample support chat, an interview exchange, a negotiation script, an example " +
			"prompt and reply. Keep each speaker consistently on one side.",
		schema: shape({
			turns: rows({
				description: "2 to 12 turns, in order.",
				min: 2,
				max: 12,
				of: {
					id: ID,
					speaker: str("Who is talking, e.g. 'Customer' or 'Agent'."),
					side: {
						type: "string",
						description: "Which side of the thread this speaker sits on.",
						enum: ["left", "right"],
					},
					text: str("What they said."),
				},
			}),
		}),
	},
	{
		name: SHOW_PEOPLE,
		description:
			"Render a list of people or roles, each with an avatar. Use when the answer is WHO — team " +
			"roles, who to contact, who is involved in a process. Prefer show_item_list when the entries " +
			"are not people.",
		schema: shape({
			people: rows({
				description: "2 to 10 people or roles.",
				min: 2,
				max: 10,
				optional: ["note"],
				of: {
					id: ID,
					name: str("Person or role name."),
					role: str("Short role label, 1-3 words."),
					note: str("Optional one line on what they do."),
				},
			}),
		}),
	},
	{
		name: SHOW_BADGES,
		description:
			"Render a flat set of short labels. Use when the answer is a bare list of keywords, tags, " +
			"technologies, or supported values with NO explanation attached to any of them. The moment " +
			"each entry needs a sentence, use show_item_list instead.",
		schema: shape({
			title: str("What this set of labels is."),
			badges: rows({
				description: "3 to 20 labels.",
				min: 3,
				max: 20,
				optional: ["tone"],
				of: {
					id: ID,
					label: str("The label text, 1-3 words."),
					tone: {
						type: "string",
						description: "Optional emphasis for this label.",
						enum: ["neutral", "strong", "danger", "muted"],
					},
				},
			}),
		}),
	},
	{
		name: SHOW_EMPTY,
		description:
			"Render an empty state. Use ONLY when the honest answer is that there is nothing to show — no " +
			"such thing exists, the list is genuinely empty, the feature was never built. Never use it as " +
			"a preamble to a real answer.",
		schema: shape({
			title: str("The short version, e.g. 'No such hook'."),
			description: str("One or two sentences on why, and what to look at instead."),
		}),
	},
	{
		name: SHOW_ITEM_LIST,
		description:
			"Render a vertical list of titled entries, each with a sentence or two and an optional short " +
			"tag. This is the general-purpose list — use it when the answer is simply a LIST of things " +
			"each needing a brief explanation: resources, rules, gotchas, concepts. Prefer show_cards when " +
			"the reader is choosing between them, show_steps when they are ordered, show_accordion when " +
			"each needs a full paragraph worth collapsing, and show_badges when they need no explanation " +
			"at all.",
		schema: shape({
			items: rows({
				description: "3 to 12 entries.",
				min: 3,
				max: 12,
				optional: ["meta"],
				of: {
					id: ID,
					title: str("The entry's name."),
					description: str("One or two sentences."),
					meta: str("Optional 1-2 word tag shown on the right."),
				},
			}),
		}),
	},
	{
		name: SHOW_TIMELINE,
		description:
			"Render dated events on a vertical timeline. Use when the answer is a CHRONOLOGY — a version " +
			"history, how something evolved, a sequence of releases. Every entry needs a real date or " +
			"period; if you do not know them, use show_steps instead.",
		schema: shape({
			caption: str("What the timeline covers."),
			events: rows({
				description: "2 to 12 events, oldest first.",
				min: 2,
				max: 12,
				of: {
					id: ID,
					date: str("A date or period as text, e.g. '2019' or 'March 2024'."),
					title: str("What happened."),
					description: str("One or two sentences of detail."),
				},
			}),
		}),
	},
	{
		name: SHOW_STATS,
		description:
			"Render a few headline numbers as stat tiles. Use when the answer is 2 to 6 key FIGURES the " +
			"reader should take away — limits, sizes, counts, benchmark headlines. Prefer show_bar_chart " +
			"when the numbers are meant to be compared against each other visually rather than just read.",
		schema: shape({
			stats: rows({
				description: "2 to 6 figures.",
				min: 2,
				max: 6,
				optional: ["note"],
				of: {
					id: ID,
					label: str("What the number measures."),
					value: str("The number WITH its unit, e.g. '16 KB' or '~45 ms'."),
					note: str("Optional short qualifier."),
				},
			}),
		}),
	},
	{
		name: SHOW_CALENDAR,
		description:
			"Render a month calendar with specific days highlighted and labelled. Use when the answer is a " +
			"small set of real DATES inside one month — deadlines, release dates, events. Dates must be " +
			"real and in YYYY-MM-DD form; never invent them to fill the schema. Prefer show_timeline when " +
			"they span more than a month.",
		schema: shape({
			caption: str("What these dates are."),
			dates: rows({
				description: "1 to 10 dates, all in the same month.",
				min: 1,
				max: 10,
				of: {
					date: str("The day, strictly as YYYY-MM-DD."),
					label: str("What happens that day."),
				},
			}),
		}),
	},
	{
		name: SHOW_COLLAPSIBLE,
		description:
			"Render one summary line with a longer block folded behind it. Use when the answer is short " +
			"but carries ONE long optional appendix — full output, a long config file, the derivation " +
			"behind a result. If there is more than one such section, use show_accordion.",
		schema: shape({
			summary: str("The one-line answer, always visible."),
			detail: str("The long block, hidden until expanded."),
		}),
	},
	{
		name: SHOW_GLOSSARY,
		description:
			"Render terms whose definitions appear on hover. Use when the answer is a set of JARGON terms " +
			"the reader needs defined so they can look up the two or three they do not know — acronyms, " +
			"domain vocabulary. Prefer show_key_value when the reader is meant to read every definition.",
		schema: shape({
			intro: str("One line framing the terms."),
			terms: rows({
				description: "3 to 15 terms.",
				min: 3,
				max: 15,
				of: {
					id: ID,
					term: str("The term or acronym."),
					definition: str("A one or two sentence definition."),
				},
			}),
		}),
	},
	{
		name: SHOW_STEPS,
		description:
			"Render a numbered procedure. Use when the answer is an ORDERED sequence the reader follows " +
			"start to finish — installation, setup, a how-to, debugging a problem. Prefer show_checklist " +
			"when the items are things to verify rather than explain, show_timeline when they are dated " +
			"events, and show_carousel when the reader should see only one at a time.",
		schema: shape({
			caption: str("What the procedure achieves."),
			steps: rows({
				description: "2 to 12 steps, in order.",
				min: 2,
				max: 12,
				of: {
					id: ID,
					title: str("What this step does."),
					detail: str("How to do it."),
				},
			}),
		}),
	},
	{
		name: SHOW_TREE,
		description:
			"Render a collapsible hierarchy. Use when the answer is a BRANCHING structure — a folder " +
			"layout, a project scaffold, a component tree, a taxonomy. Supply a FLAT list: every node " +
			"names its parent through `parentId`, and top-level nodes use an empty string. Prefer " +
			"show_breadcrumb for a single straight path, and show_file_list when the nesting does not " +
			"matter but what each file does, does.",
		schema: shape({
			caption: str("What the tree shows."),
			nodes: rows({
				description:
					"3 to 30 nodes as a FLAT list. Parents must appear in the same list. " +
					"Top-level nodes set parentId to an empty string.",
				min: 3,
				max: 30,
				of: {
					id: ID,
					parentId: str("The id of this node's parent, or an empty string for top level."),
					label: str("The node's name."),
				},
			}),
		}),
	},
	{
		name: SHOW_PROS_CONS,
		description:
			"Render pros against cons in two columns. Use when the answer weighs ONE thing — 'is X worth " +
			"it', 'should I use X', the trade-offs of a single choice. Prefer show_table when two or more " +
			"options are being compared against each other.",
		schema: shape({
			subject: str("The one thing being weighed."),
			pros: {
				type: "array",
				description: "2 to 8 advantages, one short line each.",
				minItems: 2,
				maxItems: 8,
				items: { type: "string" },
			},
			cons: {
				type: "array",
				description: "2 to 8 disadvantages, one short line each.",
				minItems: 2,
				maxItems: 8,
				items: { type: "string" },
			},
		}),
	},
	{
		name: SHOW_KEY_VALUE,
		description:
			"Render a spec sheet of field/value pairs. Use when the answer describes ONE thing across " +
			"several named fields — a config reference, an endpoint's parameters, the properties of a " +
			"single option. Prefer show_table when the same fields are filled in for several things, and " +
			"show_stats when the values are headline numbers.",
		schema: shape({
			title: str("The thing being specified."),
			pairs: rows({
				description: "2 to 15 field/value pairs.",
				min: 2,
				max: 15,
				of: {
					id: ID,
					key: str("The field name."),
					value: str("Its value, as text."),
				},
			}),
		}),
	},
	{
		name: SHOW_FILE_LIST,
		description:
			"Render a list of files or folders, each with a short note on what it is for. Use when the " +
			"answer explains WHAT A SET OF FILES DO — which file does what in a project, what a scaffold " +
			"generates. Prefer show_tree when the nesting between them is the point.",
		schema: shape({
			caption: str("Which project or scaffold these belong to."),
			files: rows({
				description: "2 to 15 files.",
				min: 2,
				max: 15,
				of: {
					id: ID,
					name: str("The file or folder name."),
					kind: {
						type: "string",
						description: "What sort of entry this is.",
						enum: ["code", "doc", "folder"],
					},
					description: str("What it is for."),
				},
			}),
		}),
	},
	{
		name: SHOW_COMMAND_LIST,
		description:
			"Render a searchable list of commands. Use when the answer is a long REFERENCE of terminal " +
			"commands, flags, or git incantations the reader will filter rather than read top to bottom. " +
			"Prefer show_shortcuts for keyboard key combinations, and show_steps when the commands have " +
			"to be run in order.",
		schema: shape({
			caption: str("What to search, e.g. 'Filter git commands'."),
			commands: rows({
				description: "4 to 30 commands.",
				min: 4,
				max: 30,
				of: {
					id: ID,
					command: str("The command exactly as typed."),
					description: str("What it does, one line."),
				},
			}),
		}),
	},
];

export const SYSTEM_PROMPT = [
	"You answer by rendering UI, not by writing long prose.",
	"Pick the ONE tool whose shape matches the shape of the answer, and call it exactly once.",
	"Read each tool's description as a decision rule about what the reader will DO with the answer, not as a description of how it looks.",
	"Alongside the tool call, write at most one short sentence of framing text.",
	"Never invent numbers, dates, or data to satisfy a schema. If you do not have real values, pick a different tool or answer in prose.",
	"If the answer is a single fact or a short explanation, or no tool genuinely fits, reply with plain text and call no tool. That is a correct outcome, not a failure.",
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
