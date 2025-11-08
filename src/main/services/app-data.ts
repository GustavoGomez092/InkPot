import path from "node:path";
import { app } from "electron";
import * as fileSystem from "./file-system.js";

/**
 * Service for managing application data and paths
 */
let appDataPath: string;
let projectsPath: string;
let themesPath: string;
let fontsPath: string;
let cachePath: string;

/**
 * Initialize app data directories
 */
export async function initialize(): Promise<void> {
	// Set up paths
	appDataPath = app.getPath("userData");
	projectsPath = path.join(appDataPath, "projects");
	themesPath = path.join(appDataPath, "themes");
	fontsPath = path.join(appDataPath, "fonts");
	cachePath = path.join(appDataPath, "cache");

	// Create directories
	await Promise.all([
		fileSystem.createDirectory(projectsPath),
		fileSystem.createDirectory(themesPath),
		fileSystem.createDirectory(fontsPath),
		fileSystem.createDirectory(cachePath),
	]);
}

/**
 * Get the main app data directory path
 */
export function getAppDataPath(): string {
	return appDataPath;
}

/**
 * Get the projects directory path
 */
export function getProjectsPath(): string {
	return projectsPath;
}

/**
 * Get the themes directory path
 */
export function getThemesPath(): string {
	return themesPath;
}

/**
 * Get the fonts directory path
 */
export function getFontsPath(): string {
	return fontsPath;
}

/**
 * Get the cache directory path
 */
export function getCachePath(): string {
	return cachePath;
}

/**
 * Get a specific project's directory path
 */
export function getProjectPath(projectId: string): string {
	return path.join(projectsPath, projectId);
}

/**
 * Get a specific project's file path
 */
export function getProjectFilePath(
	projectId: string,
	filename: string,
): string {
	return path.join(projectsPath, projectId, filename);
}

/**
 * Get a specific theme's file path
 */
export function getThemeFilePath(themeId: string): string {
	return path.join(themesPath, `${themeId}.json`);
}

/**
 * Get a specific font's file path
 */
export function getFontFilePath(fontFamily: string, variant: string): string {
	const safeFamily = fileSystem.getSafeFilename(fontFamily);
	const safeVariant = fileSystem.getSafeFilename(variant);
	return path.join(fontsPath, safeFamily, `${safeVariant}.ttf`);
}

/**
 * Get a cache file path
 */
export function getCacheFilePath(filename: string): string {
	return path.join(cachePath, filename);
}

/**
 * Check if a path is within app data directory (security check)
 */
export function isPathInAppData(filePath: string): boolean {
	const resolved = path.resolve(filePath);
	return resolved.startsWith(appDataPath);
}

/**
 * Check if a path is within projects directory
 */
export function isPathInProjects(filePath: string): boolean {
	const resolved = path.resolve(filePath);
	return resolved.startsWith(projectsPath);
}

/**
 * Get app version
 */
export function getAppVersion(): string {
	return app.getVersion();
}

/**
 * Get app name
 */
export function getAppName(): string {
	return app.getName();
}

/**
 * Get system paths
 */
export function getSystemPaths(): {
	home: string;
	documents: string;
	downloads: string;
	desktop: string;
	temp: string;
} {
	return {
		home: app.getPath("home"),
		documents: app.getPath("documents"),
		downloads: app.getPath("downloads"),
		desktop: app.getPath("desktop"),
		temp: app.getPath("temp"),
	};
}

/**
 * Clear cache directory
 */
export async function clearCache(): Promise<void> {
	const files = await fileSystem.listDirectory(cachePath);
	await Promise.all(
		files.map((file) => fileSystem.deleteFile(path.join(cachePath, file))),
	);
}

/**
 * Get cache size in bytes
 */
export async function getCacheSize(): Promise<number> {
	try {
		const files = await fileSystem.listDirectory(cachePath);
		const sizes = await Promise.all(
			files.map(async (file) => {
				const filePath = path.join(cachePath, file);
				const stats = await fileSystem.getFileStats(filePath);
				return stats.size;
			}),
		);
		return sizes.reduce((total: number, size: number) => total + size, 0);
	} catch {
		return 0;
	}
}
