import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, "src/main/preload.ts"),
			formats: ["cjs"],
			fileName: () => "preload.js",
		},
		outDir: "dist/main",
		emptyOutDir: false,
		rollupOptions: {
			external: ["electron"],
		},
	},
	resolve: {
		alias: {
			"@shared": path.resolve(__dirname, "./src/shared"),
		},
	},
});
