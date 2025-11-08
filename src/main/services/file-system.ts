import type { Stats } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { dialog } from "electron";
import { getMainWindow } from "./window-manager.js";

/**
 * Service for safe file system operations
 */

/**
 * Read a file safely with error handling
 */
export async function readFile(filePath: string): Promise<string> {
	try {
		const content = await fs.readFile(filePath, "utf-8");
		return content;
	} catch (error) {
		throw new Error(`Failed to read file: ${filePath}`, { cause: error });
	}
}

/**
 * Write a file atomically (write to temp file, then rename)
 */
export async function writeFile(
	filePath: string,
	content: string,
): Promise<void> {
	const dir = path.dirname(filePath);
	const tempPath = path.join(dir, `.${path.basename(filePath)}.tmp`);

	try {
		// Ensure directory exists
		await fs.mkdir(dir, { recursive: true });

		// Write to temp file
		await fs.writeFile(tempPath, content, "utf-8");

		// Atomic rename
		await fs.rename(tempPath, filePath);
	} catch (error) {
		// Clean up temp file if it exists
		try {
			await fs.unlink(tempPath);
		} catch {
			// Ignore cleanup errors
		}
		throw new Error(`Failed to write file: ${filePath}`, { cause: error });
	}
}

/**
 * Delete a file safely
 */
export async function deleteFile(filePath: string): Promise<void> {
	try {
		await fs.unlink(filePath);
	} catch (error) {
		throw new Error(`Failed to delete file: ${filePath}`, { cause: error });
	}
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

/**
 * Check if a path is a directory
 */
export async function isDirectory(filePath: string): Promise<boolean> {
	try {
		const stats = await fs.stat(filePath);
		return stats.isDirectory();
	} catch {
		return false;
	}
}

/**
 * Create a directory recursively
 */
export async function createDirectory(dirPath: string): Promise<void> {
	try {
		await fs.mkdir(dirPath, { recursive: true });
	} catch (error) {
		throw new Error(`Failed to create directory: ${dirPath}`, { cause: error });
	}
}

/**
 * List files in a directory
 */
export async function listDirectory(dirPath: string): Promise<string[]> {
	try {
		const entries = await fs.readdir(dirPath, { withFileTypes: true });
		return entries.map((entry) => entry.name);
	} catch (error) {
		throw new Error(`Failed to list directory: ${dirPath}`, { cause: error });
	}
}

/**
 * Get file stats
 */
export async function getFileStats(filePath: string): Promise<Stats> {
	try {
		return await fs.stat(filePath);
	} catch (error) {
		throw new Error(`Failed to get stats for: ${filePath}`, { cause: error });
	}
}

/**
 * Copy a file
 */
export async function copyFile(
	source: string,
	destination: string,
): Promise<void> {
	try {
		const dir = path.dirname(destination);
		await fs.mkdir(dir, { recursive: true });
		await fs.copyFile(source, destination);
	} catch (error) {
		throw new Error(`Failed to copy file from ${source} to ${destination}`, {
			cause: error,
		});
	}
}

/**
 * Move/rename a file
 */
export async function moveFile(
	source: string,
	destination: string,
): Promise<void> {
	try {
		const dir = path.dirname(destination);
		await fs.mkdir(dir, { recursive: true });
		await fs.rename(source, destination);
	} catch (error) {
		throw new Error(`Failed to move file from ${source} to ${destination}`, {
			cause: error,
		});
	}
}

/**
 * Show open file dialog
 */
export async function showOpenDialog(options: {
	title?: string;
	defaultPath?: string;
	filters?: Array<{ name: string; extensions: string[] }>;
	properties?: Array<
		"openFile" | "openDirectory" | "multiSelections" | "showHiddenFiles"
	>;
}): Promise<string[]> {
	const mainWindow = getMainWindow();
	if (!mainWindow) {
		throw new Error("Main window not available");
	}

	const result = await dialog.showOpenDialog(mainWindow, {
		title: options.title || "Open File",
		defaultPath: options.defaultPath,
		filters: options.filters,
		properties: options.properties || ["openFile"],
	});

	return result.canceled ? [] : result.filePaths;
}

/**
 * Show save file dialog
 */
export async function showSaveDialog(options: {
	title?: string;
	defaultPath?: string;
	filters?: Array<{ name: string; extensions: string[] }>;
}): Promise<string | null> {
	const mainWindow = getMainWindow();
	if (!mainWindow) {
		throw new Error("Main window not available");
	}

	const result = await dialog.showSaveDialog(mainWindow, {
		title: options.title || "Save File",
		defaultPath: options.defaultPath,
		filters: options.filters,
	});

	return result.canceled ? null : (result.filePath ?? null);
}

/**
 * Validate file path (ensure it's within allowed directories)
 */
export function validateFilePath(
	filePath: string,
	allowedDirs: string[],
): boolean {
	const resolved = path.resolve(filePath);
	return allowedDirs.some((dir) => resolved.startsWith(path.resolve(dir)));
}

/**
 * Get a safe filename (remove invalid characters)
 */
export function getSafeFilename(filename: string): string {
	// Remove/replace invalid characters for most filesystems
	return filename
		.split("")
		.map((char) => {
			const code = char.charCodeAt(0);
			// Control characters (0-31) and invalid filename characters
			if (code < 32 || '<>:"/\\|?*'.includes(char)) {
				return "_";
			}
			return char;
		})
		.join("")
		.trim();
}

/**
 * Ensure file has correct extension
 */
export function ensureExtension(filePath: string, extension: string): string {
	const ext = extension.startsWith(".") ? extension : `.${extension}`;
	if (!filePath.endsWith(ext)) {
		return filePath + ext;
	}
	return filePath;
}
