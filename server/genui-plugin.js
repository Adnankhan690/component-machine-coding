import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, UI_TOOLS } from "../src/genui/tools.js";

const MODEL = "claude-opus-5";

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

/**
 * Dev-only API route. The Anthropic key never reaches the browser.
 */
export default function genUiPlugin() {
	return {
		name: "genui-api",
		configureServer(server) {
			server.middlewares.use("/api/genui", async (req, res, next) => {
				if (req.method !== "POST") return next();

				if (!process.env.ANTHROPIC_API_KEY) {
					return sendJson(res, 500, {
						error: "ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the dev server.",
					});
				}

				try {
					const { messages = [] } = await readJsonBody(req);
					const client = new Anthropic();

					const response = await client.messages.create({
						model: MODEL,
						max_tokens: 16000,
						system: SYSTEM_PROMPT,
						tools: UI_TOOLS,
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

					// Every tool_use needs a matching tool_result or the NEXT turn 400s.
					// Nothing executed, so the result is just an acknowledgement.
					const history = [{ role: "assistant", content: response.content }];
					if (ui.length > 0) {
						history.push({
							role: "user",
							content: ui.map((block) => ({
								type: "tool_result",
								tool_use_id: block.id,
								content: "rendered",
							})),
						});
					}

					sendJson(res, 200, { text, ui, history });
				} catch (error) {
					console.error("[genui]", error);
					sendJson(res, error?.status ?? 500, { error: error?.message ?? "Request failed" });
				}
			});
		},
	};
}
