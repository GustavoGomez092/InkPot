import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { VitePlugin } from "@electron-forge/plugin-vite";
import type { ForgeConfig } from "@electron-forge/shared-types";

const config: ForgeConfig = {
	packagerConfig: {
		name: "InkPot",
		executableName: "inkpot",
		icon: "./Assets/icon/app-icon", // Extension auto-completed: .icns for macOS, .ico for Windows
		asar: false, // Disable asar to troubleshoot renderer loading
	},
	rebuildConfig: {},
	hooks: {
		packageAfterPrune: async (_config, buildPath) => {
			const fs = await import("fs/promises");
			const path = await import("path");
			
			// Remove "type": "module" from package.json for packaged app
			// since we're outputting .cjs files which need CommonJS context
			const pkgPath = path.default.join(buildPath, "package.json");
			const pkg = JSON.parse(await fs.readFile(pkgPath, "utf-8"));
			delete pkg.type;
			await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

			// Copy entire node_modules to ensure all dependencies are available
			// This is the simplest approach for Electron apps with complex dependencies
			const fse = await import("fs-extra");
			const sourceNodeModules = path.default.join(
				process.cwd(),
				"node_modules",
			);
			const targetNodeModules = path.default.join(buildPath, "node_modules");

			console.log("📦 Copying node_modules...");
			await fse.default.copy(sourceNodeModules, targetNodeModules, {
				filter: (src) => {
					// Skip dev dependencies and unnecessary files
					const relativePath = path.default.relative(sourceNodeModules, src);
					// Skip electron and build tools
					if (relativePath.startsWith("electron") ||
						relativePath.startsWith("@electron-forge") ||
						relativePath.startsWith("vite") ||
						relativePath.startsWith("@vitejs")) {
						return false;
					}
					return true;
				},
			});
			console.log("✅ node_modules copied");
		},
	},
	makers: [
		new MakerSquirrel({
			name: "InkPot",
		}),
		new MakerZIP({}, ["darwin"]),
		new MakerRpm({}),
		new MakerDeb({}),
	],
	plugins: [
		new VitePlugin({
			build: [
				{
					entry: "src/main/index.ts",
					config: "vite.main.config.ts",
				},
				{
					entry: "src/main/preload.ts",
					config: "vite.preload.config.ts",
				},
			],
			renderer: [
				{
					name: "main_window",
					config: "vite.config.ts",
				},
			],
		}),
	],
};

export default config;
