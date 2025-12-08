import path from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	plugins: [
		viteStaticCopy({
			targets: [
				{
					// Only copy TTF fonts (exclude WOFF2, ZIP, and emoji font)
					src: "src/main/assets/fonts/*.ttf",
					dest: "assets/fonts",
					rename: (name) => {
						// Exclude the large emoji font
						if (name === "NotoColorEmoji.ttf") return false;
						// Exclude variable font (using specific weights instead)
						if (name === "Inter-Variable.ttf") return false;
						return name;
					},
				},
				{
					// Copy sharp-loader.cjs without processing it
					src: "src/main/services/sharp-loader.cjs",
					dest: ".",
				},
			],
		}),
	],
	build: {
		rollupOptions: {
			external: [
				"electron",
				"@prisma/client",
				"@libsql/client",
				"@prisma/adapter-libsql",
				".prisma/client/index-browser",
				"sharp", // Native module for image processing
				"electron-store",
				"better-sqlite3",
				"sql.js",
				"fs-extra",
				"image-size",
			],
			output: {
				format: "cjs",
				entryFileNames: "[name].cjs",
			},
		},
		// Target Node.js environment for Electron main process
		target: "node18",
		// Don't minify to make debugging easier
		minify: false,
	},
	resolve: {
		alias: {
			"@main": path.resolve(__dirname, "./src/main"),
			"@shared": path.resolve(__dirname, "./src/shared"),
			"@prisma-client": path.resolve(
				__dirname,
				"./src/main/database/generated/client",
			),
		},
		// Ensure Vite can resolve .js imports from .ts files
		extensions: [".ts", ".js", ".json"],
	},
});
