/**
 * PDF Generation Service
 * Handles PDF generation, export, and preview using React-PDF
 */

import { writeFile } from "node:fs/promises";
import { renderToBuffer } from "@react-pdf/renderer";
import type { ThemeData } from "@shared/types/ipc-contracts.js";
import { createPDFDocument } from "../pdf/Document.js";

export interface CoverData {
	hasCoverPage: boolean;
	title?: string | null;
	subtitle?: string | null;
	author?: string | null;
	logoPath?: string | null;
	backgroundPath?: string | null;
}

/**
 * Generate PDF buffer from markdown content
 */
export async function generatePDF(
	content: string,
	theme: ThemeData,
	projectDir?: string,
	coverData?: CoverData,
): Promise<Buffer> {
	try {
		console.log("📄 Generating PDF with theme:", theme.name);
		console.log(
			"📝 Content received (first 500 chars):",
			content.substring(0, 500),
		);

		if (coverData?.hasCoverPage) {
			console.log("📑 Cover page enabled:", coverData);
		}

		// Create PDF document element
		const document = createPDFDocument(content, theme, projectDir, coverData);

		// Render to buffer
		const buffer = await renderToBuffer(document);

		console.log("✅ PDF generated successfully");
		return Buffer.from(buffer);
	} catch (error) {
		console.error("❌ PDF generation failed:", error);
		throw new Error(
			`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Export PDF to file system
 */
export async function exportPDF(
	buffer: Buffer,
	filePath: string,
): Promise<void> {
	try {
		console.log("💾 Exporting PDF to:", filePath);

		// Write buffer to file
		await writeFile(filePath, buffer);

		console.log("✅ PDF exported successfully");
	} catch (error) {
		console.error("❌ PDF export failed:", error);
		throw new Error(
			`Failed to export PDF: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Generate PDF for preview (returns base64 data URL)
 */
export async function previewPDF(
	content: string,
	theme: ThemeData,
	projectDir?: string,
	coverData?: CoverData,
): Promise<string> {
	try {
		console.log("👁️  Generating PDF preview with theme:", theme.name);

		// Generate PDF buffer
		const buffer = await generatePDF(content, theme, projectDir, coverData);

		// Convert to base64 data URL
		const base64 = buffer.toString("base64");
		const dataUrl = `data:application/pdf;base64,${base64}`;

		console.log("✅ PDF preview generated successfully");
		return dataUrl;
	} catch (error) {
		console.error("❌ PDF preview failed:", error);
		throw new Error(
			`Failed to generate PDF preview: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Calculate approximate page breaks based on theme and content
 * This is a simplified estimation - actual page breaks depend on rendering
 */
export function calculatePageBreaks(
	content: string,
	theme: ThemeData,
): number[] {
	const pageBreaks: number[] = [];

	// Look for explicit page break markers
	const lines = content.split("\n");
	let lineNumber = 0;

	for (let i = 0; i < lines.length; i++) {
		lineNumber++;

		if (lines[i].trim() === "---PAGE_BREAK---") {
			pageBreaks.push(lineNumber);
		}
	}

	// Simple heuristic: estimate page capacity based on theme
	const linesPerPage = Math.floor(
		((theme.pageHeight - theme.marginTop - theme.marginBottom) * 72) /
			(theme.bodySize * theme.leading),
	);

	console.log(
		`📏 Estimated ${linesPerPage} lines per page with theme ${theme.name}`,
	);

	// Add automatic page breaks every N lines (if no explicit breaks)
	if (pageBreaks.length === 0) {
		const totalLines = lines.length;
		let currentLine = linesPerPage;

		while (currentLine < totalLines) {
			pageBreaks.push(currentLine);
			currentLine += linesPerPage;
		}
	}

	return pageBreaks;
}
