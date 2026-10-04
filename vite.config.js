import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";
import genUiPlugin from "./server/genui-plugin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// Load ANTHROPIC_API_KEY for the server middleware only.
	// No VITE_ prefix, so it is never bundled into the client.
	Object.assign(process.env, loadEnv(mode, __dirname, ""));

	return {
		plugins: [react(), genUiPlugin()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
	};
});
