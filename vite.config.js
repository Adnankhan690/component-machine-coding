import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";
import genUiPlugin from "./server/genui-plugin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// Load model keys for the server middleware only.
	// No VITE_ prefix, so they are never bundled into the client.
	// A real shell env var wins over .env.local, so you can override per-run.
	const fileEnv = loadEnv(mode, __dirname, "");
	for (const [key, value] of Object.entries(fileEnv)) {
		if (!process.env[key]) process.env[key] = value;
	}

	return {
		plugins: [react(), genUiPlugin()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
	};
});
