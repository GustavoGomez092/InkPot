import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, "src/main/index.ts"),
			formats: ["es"],
			fileName: () => "index.js",
		},
		outDir: "dist/main",
		emptyOutDir: true,
		rollupOptions: {
			external: [
				"electron",
				"@prisma/client",
				"@libsql/client",
				"@prisma/adapter-libsql",
			],
		},
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
	},
});
