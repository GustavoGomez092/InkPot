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
		// Let Electron Forge Vite plugin handle outDir
		rollupOptions: {
			input: {
				main_window: path.resolve(__dirname, "index.html"),
			},
		},
		// Ensure assets are properly inlined or copied
		assetsInlineLimit: 0, // Don't inline any assets, copy them all
	},
	server: {
		port: 5173,
		strictPort: true,
	},
	// Optimize dependencies to ensure fonts are bundled
	optimizeDeps: {
		include: [
			"@fontsource/inter",
			"@fontsource/source-serif-4",
			"@fontsource/jetbrains-mono",
		],
	},
});
