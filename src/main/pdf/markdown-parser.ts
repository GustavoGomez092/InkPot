/**
 * Markdown Parser for PDF Generation
 * Parses markdown content into structured elements for React-PDF rendering
 */

import fs from "node:fs";
import path from "node:path";

export interface MarkdownElement {
	type:
		| "heading"
		| "paragraph"
		| "list"
		| "checklist"
		| "codeBlock"
		| "blockquote"
		| "pageBreak"
		| "horizontalRule"
		| "image"
		| "table";
	level?: number; // For headings (1-6)
	ordered?: boolean; // For lists
	items?: string[]; // For lists
	indentLevels?: number[]; // For lists - tracks nesting level of each item (0 = top level, 1 = nested once, etc.)
	checked?: boolean[]; // For checklists - tracks checked state for each item
	language?: string; // For code blocks
	content: string;
	inline?: InlineElement[]; // For formatted text
	src?: string; // For images
	alt?: string; // For images
	title?: string; // For images
	headers?: string[]; // For tables
	rows?: string[][]; // For tables
}

export interface InlineElement {
	type: "text" | "bold" | "italic" | "code" | "link" | "strike" | "lineBreak";
	content: string;
	href?: string; // For links
}

/**
 * Strip HTML tags and convert to markdown format
 * Comprehensive conversion for all standard HTML elements
 */
function stripHTML(html: string): string {
	let text = html;

	// Remove script and style tags with their content
	text = text.replace(
		/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
		"",
	);
	text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

	// Convert headings to markdown format (h1-h6)
	text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n\n# $1\n\n");
	text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n\n## $1\n\n");
	text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n\n### $1\n\n");
	text = text.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "\n\n#### $1\n\n");
	text = text.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "\n\n##### $1\n\n");
	text = text.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "\n\n###### $1\n\n");

	// Convert code blocks (pre + code)
	text = text.replace(
		/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis,
		"\n```\n$1\n```\n\n",
	);
	text = text.replace(/<pre[^>]*>(.*?)<\/pre>/gis, "\n```\n$1\n```\n\n");

	// Convert blockquotes
	text = text.replace(
		/<blockquote[^>]*>(.*?)<\/blockquote>/gis,
		(_match, content) => {
			const lines = content.trim().split("\n");
			return (
				"\n" +
				lines.map((line: string) => `> ${line.trim()}`).join("\n") +
				"\n\n"
			);
		},
	);

	// Convert inline formatting
	text = text.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, "**$2**");
	text = text.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, "*$2*");
	text = text.replace(
		/<(del|s|strike)[^>]*>(.*?)<\/(del|s|strike)>/gi,
		"~~$2~~",
	);
	text = text.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");
	text = text.replace(/<mark[^>]*>(.*?)<\/mark>/gi, "==$1==");
	text = text.replace(/<(sub)[^>]*>(.*?)<\/(sub)>/gi, "~$2~");
	text = text.replace(/<(sup)[^>]*>(.*?)<\/(sup)>/gi, "^$2^");
	text = text.replace(/<(u)[^>]*>(.*?)<\/(u)>/gi, "__$2__");

	// Convert links
	text = text.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");

	// Convert images
	text = text.replace(
		/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi,
		"![$2]($1)",
	);
	text = text.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");

	// Convert unordered lists
	text = text.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (_match, content) => {
		const items = content.match(/<li[^>]*>(.*?)<\/li>/gi) || [];
		return (
			"\n" +
			items
				.map((item: string) => {
					const itemText = item.replace(/<\/?li[^>]*>/gi, "").trim();
					return `- ${itemText}`;
				})
				.join("\n") +
			"\n\n"
		);
	});

	// Convert ordered lists
	text = text.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (_match, content) => {
		const items = content.match(/<li[^>]*>(.*?)<\/li>/gi) || [];
		return (
			"\n" +
			items
				.map((item: string, index: number) => {
					const itemText = item.replace(/<\/?li[^>]*>/gi, "").trim();
					return `${index + 1}. ${itemText}`;
				})
				.join("\n") +
			"\n\n"
		);
	});

	// Convert definition lists
	text = text.replace(/<dl[^>]*>(.*?)<\/dl>/gis, (_match, content) => {
		let result = "\n";
		const terms = content.match(/<dt[^>]*>(.*?)<\/dt>/gi) || [];
		const definitions = content.match(/<dd[^>]*>(.*?)<\/dd>/gi) || [];
		for (let i = 0; i < Math.min(terms.length, definitions.length); i++) {
			const term = terms[i].replace(/<\/?dt[^>]*>/gi, "").trim();
			const def = definitions[i].replace(/<\/?dd[^>]*>/gi, "").trim();
			result += `**${term}**\n: ${def}\n\n`;
		}
		return result;
	});

	// Convert tables to markdown tables
	text = text.replace(/<table[^>]*>(.*?)<\/table>/gis, (_match, content) => {
		// Extract headers
		const headerMatch = content.match(/<thead[^>]*>(.*?)<\/thead>/is);
		const headers = headerMatch
			? (headerMatch[1].match(/<th[^>]*>(.*?)<\/th>/gi) || []).map(
					(h: string) => h.replace(/<\/?th[^>]*>/gi, "").trim(),
				)
			: [];

		// Extract rows
		const bodyMatch = content.match(/<tbody[^>]*>(.*?)<\/tbody>/is);
		const rowMatches = bodyMatch
			? bodyMatch[1].match(/<tr[^>]*>(.*?)<\/tr>/gis) || []
			: content.match(/<tr[^>]*>(.*?)<\/tr>/gis) || [];

		if (headers.length === 0 && rowMatches.length === 0) return "";

		let table = "\n";

		// Add headers
		if (headers.length > 0) {
			table += "| " + headers.join(" | ") + " |\n";
			table += "| " + headers.map(() => "---").join(" | ") + " |\n";
		}

		// Add rows
		for (const row of rowMatches) {
			const cells = (row.match(/<td[^>]*>(.*?)<\/td>/gi) || []).map(
				(c: string) => c.replace(/<\/?td[^>]*>/gi, "").trim(),
			);
			if (cells.length > 0) {
				table += "| " + cells.join(" | ") + " |\n";
			}
		}

		return table + "\n";
	});

	// Convert divs and spans to just their content
	text = text.replace(/<div[^>]*>(.*?)<\/div>/gis, "$1\n");
	text = text.replace(/<span[^>]*>(.*?)<\/span>/gi, "$1");

	// Convert paragraphs
	text = text.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");

	// Convert line breaks
	text = text.replace(/<br\s*\/?>/gi, "\n");

	// Convert horizontal rules
	text = text.replace(/<hr\s*\/?>/gi, "\n---\n\n");

	// Remove all remaining HTML tags
	text = text.replace(/<[^>]*>/g, "");

	// Decode HTML entities
	text = text.replace(/&nbsp;/g, " ");
	text = text.replace(/&amp;/g, "&");
	text = text.replace(/&lt;/g, "<");
	text = text.replace(/&gt;/g, ">");
	text = text.replace(/&quot;/g, '"');
	text = text.replace(/&#39;/g, "'");
	text = text.replace(/&apos;/g, "'");
	text = text.replace(/&copy;/g, "©");
	text = text.replace(/&reg;/g, "®");
	text = text.replace(/&trade;/g, "™");
	text = text.replace(/&euro;/g, "€");
	text = text.replace(/&pound;/g, "£");
	text = text.replace(/&yen;/g, "¥");
	text = text.replace(/&sect;/g, "§");
	text = text.replace(/&deg;/g, "°");
	text = text.replace(/&plusmn;/g, "±");
	text = text.replace(/&frac14;/g, "¼");
	text = text.replace(/&frac12;/g, "½");
	text = text.replace(/&frac34;/g, "¾");
	text = text.replace(/&times;/g, "×");
	text = text.replace(/&divide;/g, "÷");
	text = text.replace(/&mdash;/g, "—");
	text = text.replace(/&ndash;/g, "–");
	text = text.replace(/&hellip;/g, "…");
	text = text.replace(/&laquo;/g, "«");
	text = text.replace(/&raquo;/g, "»");
	text = text.replace(/&bull;/g, "•");

	// Decode numeric HTML entities
	text = text.replace(/&#(\d+);/g, (_match, dec) => String.fromCharCode(dec));
	text = text.replace(/&#x([0-9a-f]+);/gi, (_match, hex) =>
		String.fromCharCode(parseInt(hex, 16)),
	);

	// Clean up whitespace
	text = text.replace(/\n{3,}/g, "\n\n");
	text = text.replace(/[ \t]+/g, " ");
	text = text.trim();

	return text;
}

/**
 * Parse markdown content into structured elements
 */
export function parseMarkdown(
	markdown: string,
	projectDir?: string,
): MarkdownElement[] {
	// Detect if content is HTML and convert to markdown
	// But first, preserve code blocks by temporarily replacing them
	const codeBlockPlaceholders: string[] = [];
	let codeBlockIndex = 0;

	// Extract and protect code blocks from HTML stripping
	markdown = markdown.replace(/```[\s\S]*?```/g, (match) => {
		const placeholder = `__CODE_BLOCK_${codeBlockIndex}__`;
		codeBlockPlaceholders.push(match);
		codeBlockIndex++;
		return placeholder;
	});

	// Now strip HTML if detected
	if (markdown.trim().startsWith("<") || /<[a-z][\s\S]*>/i.test(markdown)) {
		markdown = stripHTML(markdown);
	}

	// Restore code blocks
	codeBlockPlaceholders.forEach((codeBlock, index) => {
		markdown = markdown.replace(`__CODE_BLOCK_${index}__`, codeBlock);
	});

	const lines = markdown.split("\n");
	const elements: MarkdownElement[] = [];
	let i = 0;

	while (i < lines.length) {
		const line = lines[i];

		// Page break
		if (line.trim() === "---PAGE_BREAK---") {
			elements.push({
				type: "pageBreak",
				content: "",
			});
			i++;
			continue;
		}

		// Horizontal rule
		if (/^[-*_]{3,}$/.test(line.trim())) {
			elements.push({
				type: "horizontalRule",
				content: "",
			});
			i++;
			continue;
		}

		// Image (must be on its own line) - ![alt](src "optional title")
		const imageMatch = line
			.trim()
			.match(/^!\[([^\]]*)\]\(([^)"]+)(?:\s+"([^"]+)")?\)$/);
		if (imageMatch) {
			let imageSrc = imageMatch[2].trim();

			// Skip base64 data URLs - these should have been saved to files
			if (imageSrc.startsWith("data:")) {
				console.warn(
					"⚠️ Skipping base64 image in PDF - image was not saved to file system",
				);
				// Add a placeholder paragraph instead
				elements.push({
					type: "paragraph",
					content: `[Image not saved: ${imageMatch[1] || "untitled"}]`,
					inline: undefined,
				});
				i++;
				continue;
			}

			// If projectDir is provided and path is relative, resolve it
			if (
				projectDir &&
				!imageSrc.startsWith("/") &&
				!imageSrc.startsWith("http://") &&
				!imageSrc.startsWith("https://")
			) {
				// Relative path - resolve relative to project directory
				const originalSrc = imageSrc;
				imageSrc = path.join(projectDir, imageSrc);
				console.log(
					`📸 Resolved image path: "${originalSrc}" -> "${imageSrc}"`,
				);

				// Convert to base64 data URL for React-PDF (handles file paths with spaces better)
				try {
					if (fs.existsSync(imageSrc)) {
						const imageBuffer = fs.readFileSync(imageSrc);
						const extension = path.extname(imageSrc).toLowerCase();
						const mimeTypes: Record<string, string> = {
							".png": "image/png",
							".jpg": "image/jpeg",
							".jpeg": "image/jpeg",
							".gif": "image/gif",
							".webp": "image/webp",
							".svg": "image/svg+xml",
						};
						const mimeType = mimeTypes[extension] || "image/png";
						const base64 = imageBuffer.toString("base64");
						imageSrc = `data:${mimeType};base64,${base64}`;
						console.log(
							`📸 Converted image to base64 data URL (${Math.round(base64.length / 1024)}KB)`,
						);
					} else {
						console.warn(`⚠️ Image file not found: ${imageSrc}`);
					}
				} catch (error) {
					console.error(`❌ Failed to read image file: ${imageSrc}`, error);
				}
			}

			console.log(
				`📸 Adding image to PDF: src="${imageSrc.substring(0, 100)}...", alt="${imageMatch[1] || ""}"`,
			);

			elements.push({
				type: "image",
				src: imageSrc,
				alt: imageMatch[1] || "",
				title: imageMatch[3] || undefined,
				content: "",
			});
			i++;
			continue;
		}

		// Headings
		const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
		if (headingMatch) {
			const headingText = headingMatch[2];
			console.log(`📝 Heading H${headingMatch[1].length}: "${headingText}"`);
			elements.push({
				type: "heading",
				level: headingMatch[1].length,
				content: headingText,
				inline: parseInlineFormatting(headingText),
			});
			i++;
			continue;
		} // Table - detect by pipe characters
		if (line.trim().startsWith("|")) {
			const tableLines: string[] = [line];
			i++;

			// Collect all table lines
			while (i < lines.length && lines[i].trim().startsWith("|")) {
				tableLines.push(lines[i]);
				i++;
			}

			// Parse table
			if (tableLines.length >= 2) {
				const rows = tableLines.map((l) =>
					l
						.split("|")
						.slice(1, -1) // Remove empty first and last elements
						.map((cell) => cell.trim()),
				);

				// First row is headers, second is separator, rest are data rows
				const headers = rows[0];
				const dataRows = rows.slice(2); // Skip header and separator

				elements.push({
					type: "table",
					content: "",
					headers,
					rows: dataRows,
				});
			}
			continue;
		}

		// Code block
		if (line.trim().startsWith("```")) {
			const language = line.trim().slice(3).trim() || "text";
			const codeLines: string[] = [];
			i++;

			while (i < lines.length && !lines[i].trim().startsWith("```")) {
				codeLines.push(lines[i]);
				i++;
			}
			i++; // Skip closing ```

			elements.push({
				type: "codeBlock",
				language,
				content: codeLines.join("\n"),
			});
			continue;
		}

		// Blockquote
		if (line.trim().startsWith(">")) {
			const quoteLines: string[] = [];

			while (i < lines.length && lines[i].trim().startsWith(">")) {
				quoteLines.push(lines[i].trim().slice(1).trim());
				i++;
			}

			const quoteContent = quoteLines.join(" ");
			elements.push({
				type: "blockquote",
				content: quoteContent,
				inline: parseInlineFormatting(quoteContent),
			});
			continue;
		} // Checklist (tasks) - must come BEFORE unordered list to match properly
		if (/^[-*+]\s+\[([ xX])\]\s+/.test(line.trim())) {
			console.log("📋 Found checklist starting at line:", line);
			const listItems: string[] = [];
			const checkedStates: boolean[] = [];

			while (i < lines.length) {
				const currentLine = lines[i].trim();

				// Skip blank lines within the checklist
				if (currentLine === "") {
					i++;
					continue;
				}

				// If it's a checklist item, add it
				const checklistMatch = currentLine.match(
					/^[-*+]\s+\[([ xX])\]\s+(.+)$/,
				);
				if (checklistMatch) {
					const isChecked = checklistMatch[1].toLowerCase() === "x";
					const itemText = checklistMatch[2];
					checkedStates.push(isChecked);
					listItems.push(itemText);
					i++;
					continue;
				} // If it's not a checklist item and not blank, we've reached the end
				break;
			}

			console.log(
				`✅ Created checklist with ${listItems.length} items, checked states:`,
				checkedStates,
			);
			elements.push({
				type: "checklist",
				items: listItems,
				checked: checkedStates,
				content: "",
			});
			continue;
		}

		// Unordered list (must come AFTER checklist)
		if (/^[-*+]\s+/.test(line.trim())) {
			const listItems: string[] = [];
			const indentLevels: number[] = [];

			while (i < lines.length) {
				const currentLine = lines[i];

				// Skip blank lines within the list
				if (currentLine.trim() === "") {
					i++;
					continue;
				}

				// If it's a list item, add it with indent level
				if (/^(\s*)[-*+]\s+/.test(currentLine)) {
					const match = currentLine.match(/^(\s*)[-*+]\s+(.*)$/);
					if (match) {
						const leadingSpaces = match[1].length;
						// Calculate indent level (every 2 spaces = 1 level)
						const indentLevel = Math.floor(leadingSpaces / 2);
						const itemText = match[2];
						listItems.push(itemText);
						indentLevels.push(indentLevel);
					}
					i++;
					continue;
				}

				// If it's not a list item and not blank, we've reached the end of the list
				break;
			}

			elements.push({
				type: "list",
				ordered: false,
				items: listItems,
				indentLevels,
				content: "",
			});
			continue;
		}

		if (/^\d+\.\s+/.test(line.trim())) {
			const listItems: string[] = [];
			const indentLevels: number[] = [];

			while (i < lines.length) {
				const currentLine = lines[i];

				// Skip blank lines within the list
				if (currentLine.trim() === "") {
					i++;
					continue;
				}

				// If it's a list item, add it with indent level
				if (/^(\s*)\d+\.\s+/.test(currentLine)) {
					const match = currentLine.match(/^(\s*)\d+\.\s+(.*)$/);
					if (match) {
						const leadingSpaces = match[1].length;
						// Calculate indent level (every 2 spaces = 1 level)
						const indentLevel = Math.floor(leadingSpaces / 2);
						const itemText = match[2];
						listItems.push(itemText);
						indentLevels.push(indentLevel);
					}
					i++;
					continue;
				}

				// If it's not a list item and not blank, we've reached the end of the list
				break;
			}

			elements.push({
				type: "list",
				ordered: true,
				items: listItems,
				indentLevels,
				content: "",
			});
			continue;
		}

		// Paragraph (skip empty lines)
		if (line.trim() !== "") {
			const paragraphLines: string[] = [line];
			i++;

			// Continue paragraph until empty line or special element
			while (
				i < lines.length &&
				lines[i].trim() !== "" &&
				!lines[i].trim().startsWith("#") &&
				!lines[i].trim().startsWith("```") &&
				!lines[i].trim().startsWith(">") &&
				!/^[-*+]\s+/.test(lines[i].trim()) &&
				!/^\d+\.\s+/.test(lines[i].trim()) &&
				!/^!\[/.test(lines[i].trim()) // Also stop at images
			) {
				paragraphLines.push(lines[i]);
				i++;
			}

			// Join lines - preserve hard breaks (lines ending with \)
			// but use space for normal line continuations
			let content = "";
			let previousWasHardBreak = false;

			for (let j = 0; j < paragraphLines.length; j++) {
				let currentLine = paragraphLines[j];

				// If previous line had a hard break, trim leading whitespace from current line
				if (previousWasHardBreak) {
					currentLine = currentLine.trimStart();
				}

				// Reset flag
				previousWasHardBreak = false;

				// If this line ends with backslash, it's a hard break
				if (currentLine.endsWith("\\")) {
					// Add the line with backslash + newline, no space after
					content += currentLine + "\n";
					previousWasHardBreak = true;
				} else if (j < paragraphLines.length - 1) {
					// Not the last line and no hard break - add space after
					content += currentLine + " ";
				} else {
					// Last line - no space after
					content += currentLine;
				}
			}

			elements.push({
				type: "paragraph",
				content: content,
				inline: parseInlineFormatting(content),
			});
			continue;
		}

		i++;
	}

	return elements;
}

/**
 * Parse inline formatting (bold, italic, code, links, strike)
 */
export function parseInlineFormatting(text: string): InlineElement[] {
	const elements: InlineElement[] = [];

	// This is a simplified parser - a full implementation would use a proper parser
	// For now, we'll just split by common patterns

	// First, handle hard breaks (backslash + newline or two spaces + newline)
	// Replace them with a placeholder that we'll convert back later
	const BREAK_PLACEHOLDER = "\u0000BREAK\u0000";
	text = text.replace(/\\\n/g, BREAK_PLACEHOLDER); // backslash + newline
	text = text.replace(/ {2}\n/g, BREAK_PLACEHOLDER); // two spaces + newline

	// Pattern order matters - more specific patterns first
	const patterns = [
		{ regex: /\[([^\]]+)\]\(([^)]+)\)/g, type: "link" as const }, // [text](url)
		{ regex: /`([^`]+)`/g, type: "code" as const }, // `code`
		{ regex: /~~([^~]+)~~/g, type: "strike" as const }, // ~~strike~~
		{ regex: /\*\*([^*]+)\*\*/g, type: "bold" as const }, // **bold**
		{ regex: /__([^_]+)__/g, type: "bold" as const }, // __bold__
		{ regex: /\*([^*]+)\*/g, type: "italic" as const }, // *italic*
		{ regex: /_([^_]+)_/g, type: "italic" as const }, // _italic_
	];

	// Simple approach: find all matches and their positions
	const matches: Array<{
		type: InlineElement["type"];
		start: number;
		end: number;
		content: string;
		href?: string;
	}> = [];

	for (const pattern of patterns) {
		pattern.regex.lastIndex = 0; // Reset regex state

		const allMatches = Array.from(text.matchAll(pattern.regex));
		for (const match of allMatches) {
			if (pattern.type === "link") {
				matches.push({
					type: pattern.type,
					start: match.index ?? 0,
					end: (match.index ?? 0) + match[0].length,
					content: match[1],
					href: match[2],
				});
			} else {
				matches.push({
					type: pattern.type,
					start: match.index ?? 0,
					end: (match.index ?? 0) + match[0].length,
					content: match[1],
				});
			}
		}
	}

	// Sort by position, then by length (longer matches first for same position)
	matches.sort((a, b) => {
		if (a.start !== b.start) return a.start - b.start;
		return b.end - a.end; // Longer matches first
	});

	// Filter out overlapping matches - keep the first (longest) match at each position
	const filteredMatches: typeof matches = [];
	for (const match of matches) {
		// Check if this match overlaps with any already accepted match
		const overlaps = filteredMatches.some(
			(existing) =>
				(match.start >= existing.start && match.start < existing.end) ||
				(match.end > existing.start && match.end <= existing.end) ||
				(match.start <= existing.start && match.end >= existing.end),
		);
		if (!overlaps) {
			filteredMatches.push(match);
		}
	}

	// Build elements with text segments
	let lastEnd = 0;
	for (const match of filteredMatches) {
		// Add plain text before this match (may contain line breaks)
		if (match.start > lastEnd) {
			const plainText = text.slice(lastEnd, match.start);
			if (plainText) {
				addTextWithBreaks(elements, plainText);
			}
		}

		// Add formatted element
		elements.push({
			type: match.type,
			content: match.content,
			href: match.href,
		});

		lastEnd = match.end;
	}

	// Add remaining plain text (may contain line breaks)
	if (lastEnd < text.length) {
		const plainText = text.slice(lastEnd);
		if (plainText) {
			addTextWithBreaks(elements, plainText);
		}
	}

	// If no formatting found, return plain text (may contain line breaks)
	if (elements.length === 0) {
		addTextWithBreaks(elements, text);
	}

	return elements;
}

/**
 * Helper function to add text segments, splitting on line break placeholders
 */
function addTextWithBreaks(elements: InlineElement[], text: string): void {
	const BREAK_PLACEHOLDER = "\u0000BREAK\u0000";
	const parts = text.split(BREAK_PLACEHOLDER);

	for (let i = 0; i < parts.length; i++) {
		if (parts[i]) {
			elements.push({ type: "text", content: parts[i] });
		}
		// Add line break between parts (but not after the last part)
		if (i < parts.length - 1) {
			elements.push({ type: "lineBreak", content: "" });
		}
	}
}
