/**
 * DOCX Generation Service
 * Handles Word document generation and export using docx library
 */

import { writeFile } from "node:fs/promises";
import type { ThemeData } from "@shared/types/ipc-contracts.js";
import { createDocxDocument } from "../docx/Document.js";

export interface CoverData {
	hasCoverPage: boolean;
	title?: string | null;
	subtitle?: string | null;
	author?: string | null;
	logoPath?: string | null;
	backgroundPath?: string | null;
}

export interface TOCConfiguration {
	enabled: boolean;
	minLevel: number;
	maxLevel: number;
}

/**
 * Generate DOCX buffer from markdown content
 */
export async function generateDocx(
	content: string,
	theme: ThemeData,
	projectDir?: string,
	mermaidDiagrams?: Record<string, string>,
	coverData?: CoverData,
	tocConfig?: TOCConfiguration,
): Promise<Buffer> {
	try {
		console.log("📄 Generating DOCX with theme:", theme.name);
		console.log(
			"📝 Content received (first 500 chars):",
			content.substring(0, 500),
		);

		if (coverData?.hasCoverPage) {
			console.log("📑 Cover page enabled:", coverData);
		}

		if (tocConfig?.enabled) {
			console.log("📑 TOC enabled (levels", tocConfig.minLevel, "-", tocConfig.maxLevel, ")");
		}

		// Create DOCX document buffer
		const buffer = await createDocxDocument(
			content,
			theme,
			projectDir,
			mermaidDiagrams,
			coverData,
			tocConfig,
		);

		console.log("✅ DOCX generated successfully");
		return buffer;
	} catch (error) {
		console.error("❌ DOCX generation failed:", error);
		throw new Error(
			`Failed to generate DOCX: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Export DOCX to file system
 */
export async function exportDocx(
	buffer: Buffer,
	filePath: string,
): Promise<void> {
	try {
		console.log("💾 Exporting DOCX to:", filePath);

		// Write buffer to file
		await writeFile(filePath, buffer);

		console.log("✅ DOCX exported successfully");
	} catch (error) {
		console.error("❌ DOCX export failed:", error);
		throw new Error(
			`Failed to export DOCX: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Generate DOCX for preview (returns base64 data URL)
 */
export async function previewDocx(
	content: string,
	theme: ThemeData,
	projectDir?: string,
	mermaidDiagrams?: Record<string, string>,
): Promise<string> {
	try {
		console.log("👁️  Generating DOCX preview with theme:", theme.name);

		// Generate DOCX buffer
		const buffer = await generateDocx(content, theme, projectDir, mermaidDiagrams);

		// Convert to base64 data URL
		const base64 = buffer.toString("base64");
		const dataUrl = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`;

		console.log("✅ DOCX preview generated successfully");
		return dataUrl;
	} catch (error) {
		console.error("❌ DOCX preview failed:", error);
		throw new Error(
			`Failed to generate DOCX preview: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}
