import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { VitePlugin } from "@electron-forge/plugin-vite";
import type { ForgeConfig } from "@electron-forge/shared-types";

const config: ForgeConfig = {
	packagerConfig: {
		name: "InkForge",
		executableName: "inkforge",
		icon: "./Assets/PNG/App-logo",
		asar: true,
	},
	rebuildConfig: {},
	makers: [
		new MakerSquirrel({
			name: "InkForge",
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
