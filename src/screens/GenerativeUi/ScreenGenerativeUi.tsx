import { useState } from "react";
import GenerativeUi, { type UiBlock } from "@/genui/GenerativeUi";
import "./generative-ui.css";

interface Turn {
	question: string;
	text: string;
	ui: UiBlock[];
	model: string;
}

const EXAMPLES = [
	"Compare useMemo, useCallback and useRef",
	"Explain the main stages of the React rendering lifecycle",
	"Show the HTTP status codes in the 4xx range",
];

export default function ScreenGenerativeUi() {
	const [question, setQuestion] = useState("");
	const [turns, setTurns] = useState<Turn[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const ask = async (prompt: string) => {
		const trimmed = prompt.trim();
		if (!trimmed || loading) return;

		setLoading(true);
		setError("");

		try {
			const response = await fetch("/api/genui", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: [{ role: "user", content: trimmed }] }),
			});
			const data = await response.json();

			if (!response.ok) throw new Error(data.error ?? "Request failed");

			setTurns((prev) => [
				...prev,
				{ question: trimmed, text: data.text, ui: data.ui, model: data.model },
			]);
			setQuestion("");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="genui-screen">
			<h1>Generative UI</h1>
			<p className="genui-sub">
				The model picks a component and fills in its props. Table questions render a table,
				topic questions render an accordion.
			</p>

			<form
				className="genui-form"
				onSubmit={(event) => {
					event.preventDefault();
					ask(question);
				}}>
				<input
					className="genui-input"
					value={question}
					placeholder="Ask something..."
					onChange={(event) => setQuestion(event.target.value)}
				/>
				<button className="genui-submit" type="submit" disabled={loading}>
					{loading ? "Thinking..." : "Ask"}
				</button>
			</form>

			<div className="genui-examples">
				{EXAMPLES.map((example) => (
					<button
						key={example}
						type="button"
						className="genui-example"
						disabled={loading}
						onClick={() => ask(example)}>
						{example}
					</button>
				))}
			</div>

			{error && <p className="genui-error">{error}</p>}

			<div className="genui-turns">
				{turns.map((turn, idx) => (
					<article key={idx} className="genui-turn">
						<p className="genui-question">{turn.question}</p>
						{turn.text && <p className="genui-text">{turn.text}</p>}
						<GenerativeUi blocks={turn.ui} />
						<p className="genui-meta">
							{turn.model} &rarr;{" "}
							{turn.ui.length > 0
								? turn.ui.map((block) => block.name).join(", ")
								: "plain text (no component matched)"}
						</p>
					</article>
				))}
			</div>
		</section>
	);
}
