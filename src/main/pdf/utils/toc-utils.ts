/**
 * Table of Contents Utilities for PDF Generation
 * Utilities for extracting and building table of contents from markdown elements
 */

import type { MarkdownElement } from '../markdown-parser';

/**
 * Represents a single entry in the table of contents
 */
export interface TOCEntry {
	/** The heading text */
	text: string;
	/** The heading level (1-6, where 1 is h1, 2 is h2, etc.) */
	level: number;
	/** The unique anchor ID for internal linking */
	anchorId: string;
}

/**
 * Extract all headings from parsed markdown elements to build a TOC structure
 *
 * Iterates through the parsed markdown elements and extracts all headings
 * with their text, level, and anchor ID. Returns them in document order,
 * preserving the heading hierarchy.
 *
 * @param elements - Array of parsed markdown elements
 * @returns Array of TOC entries in document order
 *
 * @example
 * const elements = parseMarkdown('# Introduction\n\n## Getting Started\n\n# Conclusion');
 * const toc = extractTableOfContents(elements);
 * // Returns:
 * // [
 * //   { text: 'Introduction', level: 1, anchorId: 'introduction' },
 * //   { text: 'Getting Started', level: 2, anchorId: 'getting-started' },
 * //   { text: 'Conclusion', level: 1, anchorId: 'conclusion' }
 * // ]
 */
export function extractTableOfContents(elements: MarkdownElement[]): TOCEntry[] {
	const tocEntries: TOCEntry[] = [];

	for (const element of elements) {
		// Only process heading elements
		if (element.type === 'heading') {
			// Skip headings without anchor IDs or level information
			// These should not happen in properly parsed content, but we handle it defensively
			if (element.anchorId && element.level) {
				tocEntries.push({
					text: element.content,
					level: element.level,
					anchorId: element.anchorId,
				});
			}
		}
	}

	return tocEntries;
}

/**
 * Filter TOC entries to include only specific heading levels
 *
 * Useful for generating a TOC that only includes certain heading levels
 * (e.g., only h1 and h2, excluding h3-h6).
 *
 * @param entries - Array of TOC entries
 * @param minLevel - Minimum heading level to include (1-6, default: 1)
 * @param maxLevel - Maximum heading level to include (1-6, default: 6)
 * @returns Filtered array of TOC entries
 *
 * @example
 * const toc = extractTableOfContents(elements);
 * const filteredToc = filterTOCByLevel(toc, 1, 3); // Include only h1, h2, h3
 */
export function filterTOCByLevel(
	entries: TOCEntry[],
	minLevel: number = 1,
	maxLevel: number = 6,
): TOCEntry[] {
	return entries.filter(
		(entry) => entry.level >= minLevel && entry.level <= maxLevel,
	);
}
