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
		asar: true, // Enable ASAR for better performance and smaller size
		// Exclude dev dependencies and unnecessary files from packaging
		ignore: [
			// Development files
			/^\/\.vscode/,
			/^\/\.github/,
			/^\/\.git/,
			/^\/\.eslintrc/,
			/^\/\.prettierrc/,
			/^\/\.gitignore/,
			/^\/\.DS_Store/,
			// Build and test directories
			/^\/dist/,
			/^\/tests/,
			/^\/specs/,
			/^\/scripts/,
			/^\/coverage/,
			// Documentation and markdown files (except README)
			/^\/.*\.md$/,
			/^\/test-.*\.md$/,
			/^\/RELEASE_NOTES\.md$/,
			// Config files not needed in production
			/^\/vite.*\.config\.ts$/,
			/^\/tsconfig\.json$/,
			/^\/forge\.config\.ts$/,
			/^\/postcss\.config\.js$/,
			/^\/components\.json$/,
			/^\/index\.html$/, // Used only in dev
			// Asset source files (build outputs are in .vite)
			/^\/Assets/,
			// Source files (compiled versions in .vite)
			/^\/src/,
		],
	},
	rebuildConfig: {},
	hooks: {
		packageAfterPrune: async (_config, buildPath) => {
			const fs = await import("fs/promises");
			const path = await import("path");
			const fse = await import("fs-extra");

			// Remove "type": "module" from package.json for packaged app
			// since we're outputting .cjs files which need CommonJS context
			const pkgPath = path.default.join(buildPath, "package.json");
			const pkg = JSON.parse(await fs.readFile(pkgPath, "utf-8"));
			delete pkg.type;
			await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

			console.log("🧹 Pruning unnecessary dependencies from node_modules...");
			const nodeModulesPath = path.default.join(buildPath, "node_modules");

			// List of dev dependencies and build tools to remove
			const unnecessaryPackages = [
				// Build tools
				"electron",
				"@electron-forge",
				"@electron/rebuild",
				"electron-builder",
				"app-builder-bin",
				"app-builder-lib",
				"7zip-bin",
				// Vite and bundlers
				"vite",
				"@vitejs",
				"webpack",
				"esbuild",
				"@esbuild",
				"rollup",
				// TypeScript compiler (not needed at runtime)
				"typescript",
				"@typescript-eslint",
				"tsx",
				// Linting and formatting
				"eslint",
				"prettier",
				// Testing
				"vitest",
				"@playwright",
				"playwright-core",
				"@testing-library",
				// Prisma CLI (keep only @prisma/client)
				"prisma",
				// Build utilities
				"@remotion/google-fonts",
				"google-fonts-helper",
				"vite-plugin-static-copy",
				"node-gyp",
				// Babel (if using React compiler, it's compile-time)
				"babel-plugin-react-compiler",
				"@babel",
			];

			for (const pkg of unnecessaryPackages) {
				const pkgPath = path.default.join(nodeModulesPath, pkg);
				try {
					if (await fse.default.pathExists(pkgPath)) {
						await fse.default.remove(pkgPath);
						console.log(`  ✓ Removed ${pkg}`);
					}
				} catch (error) {
					console.warn(`  ⚠ Failed to remove ${pkg}:`, error);
				}
			}

			// Remove common unnecessary files from all packages
			console.log("🧹 Removing unnecessary files from packages...");
			const removePatterns = [
				"**/*.md",
				"**/*.map",
				"**/*.ts", // Keep .d.ts but remove source .ts files where .js exists
				"**/test/**",
				"**/tests/**",
				"**/__tests__/**",
				"**/*.test.js",
				"**/*.spec.js",
				"**/example/**",
				"**/examples/**",
				"**/docs/**",
				"**/LICENSE",
				"**/CHANGELOG",
				"**/.github/**",
			];

			const glob = await import("tinyglobby");
			for (const pattern of removePatterns) {
				try {
					const files = await glob.glob([pattern], {
						cwd: nodeModulesPath,
						absolute: true,
					});
					for (const file of files) {
						await fse.default.remove(file);
					}
					if (files.length > 0) {
						console.log(
							`  ✓ Removed ${files.length} files matching ${pattern}`,
						);
					}
				} catch (error) {
					console.warn(`  ⚠ Error removing ${pattern}:`, error);
				}
			}

			console.log("✅ Pruning complete");
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
