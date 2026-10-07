import { createRoot } from "react-dom/client";
import "./index.css";
import GenerativeUi, { type UiBlock } from "./genui/GenerativeUi";
import { UI_COMPONENTS } from "./genui/tools";

const F: Record<string, unknown> = {
	show_table: {
		caption: "Hook comparison",
		columns: ["Hook", "Returns", "Re-runs on"],
		rows: [
			["useMemo", "value", "dep change"],
			["useCallback", "function", "dep change"],
			["useRef", "mutable box", "never"],
		],
	},
	show_accordion: {
		items: [
			{ id: "a", title: "Trigger", description: "State change schedules a render." },
			{ id: "b", title: "Render", description: "React calls your component." },
			{ id: "c", title: "Commit", description: "The DOM is mutated." },
		],
	},
	show_tabs: {
		tabs: [
			{ id: "fetch", title: "fetch", content: "await fetch(url)" },
			{ id: "axios", title: "axios", content: "await axios.get(url)" },
		],
	},
	show_alert: {
		tone: "warning",
		title: "useEffect runs twice in StrictMode",
		description: "Only in development, and only to surface missing cleanup.",
	},
	show_cards: {
		cards: [
			{ id: "v", title: "Vite", description: "Fast dev server.", badge: "popular" },
			{ id: "w", title: "Webpack", description: "Mature, configurable." },
		],
	},
	show_carousel: {
		slides: [
			{ id: "1", title: "Install", content: "npm create vite@latest" },
			{ id: "2", title: "Run", content: "npm run dev" },
			{ id: "3", title: "Build", content: "npm run build" },
		],
	},
	show_bar_chart: {
		caption: "Bundle size by framework",
		valueLabel: "KB",
		data: [
			{ label: "Preact", value: 4 },
			{ label: "Vue", value: 34 },
			{ label: "React", value: 45 },
			{ label: "Angular", value: 130 },
		],
	},
	show_line_chart: {
		caption: "Weekly downloads",
		valueLabel: "millions",
		data: [
			{ label: "2021", value: 12 },
			{ label: "2022", value: 17 },
			{ label: "2023", value: 21 },
			{ label: "2024", value: 26 },
		],
	},
	show_share_bar: {
		caption: "Browser share",
		segments: [
			{ id: "chrome", label: "Chrome", value: 65 },
			{ id: "safari", label: "Safari", value: 19 },
			{ id: "other", label: "Other", value: 16 },
		],
	},
	show_breadcrumb: {
		path: [
			{ id: "1", label: "src" },
			{ id: "2", label: "genui" },
			{ id: "3", label: "tools.js" },
		],
	},
	show_progress: {
		caption: "Browser support",
		items: [
			{ id: "a", label: "Chrome", value: 100 },
			{ id: "b", label: "Safari", value: 72, note: "16.4+" },
		],
	},
	show_shortcuts: {
		caption: "VS Code",
		shortcuts: [
			{ id: "1", keys: ["Cmd", "Shift", "P"], action: "Command palette" },
			{ id: "2", keys: ["Cmd", "P"], action: "Go to file" },
		],
	},
	show_checklist: {
		title: "Pre-deploy",
		items: [
			{ id: "1", label: "Run the test suite", hint: "npm test" },
			{ id: "2", label: "Check bundle size" },
			{ id: "3", label: "Tag the release" },
		],
	},
	show_quiz: {
		questions: [
			{
				id: "q1",
				question: "What does useRef return?",
				options: ["A state value", "A mutable box", "A memoised callback"],
				answer: "A mutable box",
				explanation: "It returns a stable object whose .current you can mutate.",
			},
		],
	},
	show_conversation: {
		turns: [
			{ id: "1", speaker: "Customer", side: "left", text: "My build is failing." },
			{ id: "2", speaker: "Agent", side: "right", text: "Which Node version?" },
		],
	},
	show_people: {
		people: [
			{ id: "1", name: "Ada Lovelace", role: "Lead", note: "Owns the roadmap." },
			{ id: "2", name: "Grace Hopper", role: "Compiler" },
		],
	},
	show_badges: {
		title: "Supported runtimes",
		badges: [
			{ id: "1", label: "Node", tone: "strong" },
			{ id: "2", label: "Deno" },
			{ id: "3", label: "Rhino", tone: "danger" },
		],
	},
	show_empty: {
		title: "No such hook",
		description: "React has no useFetch built in. Write one, or use TanStack Query.",
	},
	show_item_list: {
		items: [
			{ id: "1", title: "Stale closure", description: "Captured a value too early.", meta: "common" },
			{ id: "2", title: "Missing dep", description: "Effect does not re-run." },
			{ id: "3", title: "Key by index", description: "Breaks on reorder." },
		],
	},
	show_timeline: {
		caption: "React releases",
		events: [
			{ id: "1", date: "2019", title: "Hooks", description: "16.8 ships hooks." },
			{ id: "2", date: "2022", title: "Concurrent", description: "18 ships concurrency." },
		],
	},
	show_stats: {
		stats: [
			{ id: "1", label: "Gzipped", value: "45 KB" },
			{ id: "2", label: "First paint", value: "~120 ms", note: "on 4G" },
		],
	},
	show_calendar: {
		caption: "Release dates",
		dates: [
			{ date: "2026-03-10", label: "Beta cut" },
			{ date: "2026-03-24", label: "GA" },
		],
	},
	show_collapsible: {
		summary: "The build failed on a peer dependency conflict.",
		detail: "npm ERR! ERESOLVE could not resolve\nnpm ERR! while resolving react@19",
	},
	show_glossary: {
		intro: "Terms used above.",
		terms: [
			{ id: "1", term: "Hydration", definition: "Attaching listeners to server HTML." },
			{ id: "2", term: "SSR", definition: "Rendering on the server." },
			{ id: "3", term: "RSC", definition: "Components that run only on the server." },
		],
	},
	show_steps: {
		caption: "Add a genui component",
		steps: [
			{ id: "1", title: "Build the block", detail: "Props in, markup out." },
			{ id: "2", title: "Add the contract", detail: "Describe when to use it." },
			{ id: "3", title: "Register it", detail: "Add it to the BLOCKS map." },
		],
	},
	show_tree: {
		caption: "Project layout",
		nodes: [
			{ id: "src", parentId: "", label: "src" },
			{ id: "genui", parentId: "src", label: "genui" },
			{ id: "tools", parentId: "genui", label: "tools.js" },
			{ id: "blocks", parentId: "genui", label: "blocks/" },
		],
	},
	show_pros_cons: {
		subject: "Adopting a monorepo",
		pros: ["One version of everything", "Atomic cross-package changes"],
		cons: ["Slower CI", "Tooling complexity"],
	},
	show_key_value: {
		title: "POST /api/genui",
		pairs: [
			{ id: "1", key: "Method", value: "POST" },
			{ id: "2", key: "Body", value: "{ messages: Message[] }" },
		],
	},
	show_file_list: {
		caption: "What vite scaffolds",
		files: [
			{ id: "1", name: "index.html", kind: "doc", description: "The entry document." },
			{ id: "2", name: "src/", kind: "folder", description: "Your source." },
			{ id: "3", name: "vite.config.js", kind: "code", description: "Build config." },
		],
	},
	show_command_list: {
		caption: "Filter git commands",
		commands: [
			{ id: "1", command: "git switch -c feat/x", description: "Create a branch." },
			{ id: "2", command: "git restore --staged .", description: "Unstage everything." },
			{ id: "3", command: "git log --oneline -20", description: "Recent history." },
			{ id: "4", command: "git rebase -i HEAD~3", description: "Rewrite last 3 commits." },
		],
	},
};

const only = new URLSearchParams(location.search).get("only");
const blocks: UiBlock[] = UI_COMPONENTS.filter(
	(component) => !only || only.split(",").includes(component.name),
).map((component) => ({
	id: component.name,
	name: component.name,
	props: F[component.name],
}));

const missing = UI_COMPONENTS.filter((component) => !F[component.name]).map((c) => c.name);

createRoot(document.getElementById("root")!).render(
	<main style={{ maxWidth: 820, margin: "0 auto", padding: 24 }}>
		<h1>genui block preview ({blocks.length})</h1>
		{missing.length > 0 && <p style={{ color: "red" }}>no fixture: {missing.join(", ")}</p>}
		{blocks.map((block) => (
			<section key={block.id} style={{ margin: "28px 0", paddingTop: 12, borderTop: "1px solid #ddd" }}>
				<p style={{ font: "12px monospace", color: "#888" }}>{block.name}</p>
				<GenerativeUi blocks={[block]} />
			</section>
		))}
	</main>,
);
