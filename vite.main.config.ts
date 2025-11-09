import path from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: "src/main/assets/fonts/*",
					dest: "assets/fonts",
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
