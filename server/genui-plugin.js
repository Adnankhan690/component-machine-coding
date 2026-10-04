import { SYSTEM_PROMPT, toAnthropicTools, toGeminiTools } from "../src/genui/tools.js";

const ANTHROPIC_MODEL = "claude-opus-5";
const GEMINI_MODEL = "gemini-3.8-flash";

const readJsonBody = (req) =>
	new Promise((resolve, reject) => {
		let raw = "";
		req.on("data", (chunk) => (raw += chunk));
		req.on("end", () => {
			try {
				resolve(JSON.parse(raw || "{}"));
			} catch (error) {
				reject(error);
			}
		});
		req.on("error", reject);
	});

const sendJson = (res, status, payload) => {
	res.statusCode = status;
	res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify(payload));
};

/** Both providers return the same { text, ui } shape, so the client never knows which ran. */

async function askAnthropic(messages) {
	const { default: Anthropic } = await import("@anthropic-ai/sdk");
	const client = new Anthropic();

	const response = await client.messages.create({
		model: ANTHROPIC_MODEL,
		max_tokens: 16000,
		system: SYSTEM_PROMPT,
		tools: toAnthropicTools(),
		messages,
	});

	const text = response.content
		.filter((block) => block.type === "text")
		.map((block) => block.text)
		.join("\n")
		.trim();

	const ui = response.content
		.filter((block) => block.type === "tool_use")
		.map((block) => ({ id: block.id, name: block.name, props: block.input }));

	return { text, ui, model: ANTHROPIC_MODEL };
}

async function askGemini(messages) {
	const { GoogleGenAI } = await import("@google/genai");
	const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

	const response = await ai.models.generateContent({
		model: GEMINI_MODEL,
		contents: messages.map((message) => ({
			role: message.role === "assistant" ? "model" : "user",
			parts: [{ text: message.content }],
		})),
		config: {
			systemInstruction: SYSTEM_PROMPT,
			tools: toGeminiTools(),
		},
	});

	const calls = response.functionCalls ?? [];
	const ui = calls.map((call, idx) => ({
		id: call.id ?? `${call.name}-${idx}`,
		name: call.name,
		props: call.args,
	}));

	// Gemini omits `.text` when the turn is only a function call.
	let text = "";
	try {
		text = (response.text ?? "").trim();
	} catch {
		text = "";
	}

	return { text, ui, model: GEMINI_MODEL };
}

/**
 * Dev-only API route. Picks whichever provider has a key configured;
 * ANTHROPIC_API_KEY wins if both are set. Keys never reach the browser.
 */
export default function genUiPlugin() {
	return {
		name: "genui-api",
		configureServer(server) {
			server.middlewares.use("/api/genui", async (req, res, next) => {
				if (req.method !== "POST") return next();

				const hasKey = (name) => Boolean(process.env[name]?.trim());
				const ask = hasKey("ANTHROPIC_API_KEY")
					? askAnthropic
					: hasKey("GEMINI_API_KEY")
						? askGemini
						: null;

				if (!ask) {
					return sendJson(res, 500, {
						error:
							"No model key found. Set ANTHROPIC_API_KEY or GEMINI_API_KEY in .env.local and restart the dev server.",
					});
				}

				try {
					const { messages = [] } = await readJsonBody(req);
					sendJson(res, 200, await ask(messages));
				} catch (error) {
					console.error("[genui]", error);
					sendJson(res, error?.status ?? 500, { error: error?.message ?? "Request failed" });
				}
			});
		},
	};
}
