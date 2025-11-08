import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@renderer": path.resolve(__dirname, "./src/renderer"),
			"@shared": path.resolve(__dirname, "./src/shared"),
		},
	},
	base: "./",
	build: {
		outDir: "dist/renderer",
		emptyOutDir: true,
		rollupOptions: {
			input: {
				index: path.resolve(__dirname, "index.html"),
			},
		},
	},
	server: {
		port: 5173,
		strictPort: true,
	},
});
