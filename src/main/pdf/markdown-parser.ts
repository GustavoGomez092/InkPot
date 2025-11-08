/**
 * Markdown Parser for PDF Generation
 * Parses markdown content into structured elements for React-PDF rendering
 */

export interface MarkdownElement {
	type:
		| "heading"
		| "paragraph"
		| "list"
		| "codeBlock"
		| "blockquote"
		| "pageBreak"
		| "horizontalRule";
	level?: number; // For headings (1-6)
	ordered?: boolean; // For lists
	items?: string[]; // For lists
	language?: string; // For code blocks
	content: string;
	inline?: InlineElement[]; // For formatted text
}

export interface InlineElement {
	type: "text" | "bold" | "italic" | "code" | "link" | "strike";
	content: string;
	href?: string; // For links
}

/**
 * Parse markdown content into structured elements
 */
export function parseMarkdown(markdown: string): MarkdownElement[] {
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

		// Headings
		const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
		if (headingMatch) {
			elements.push({
				type: "heading",
				level: headingMatch[1].length,
				content: headingMatch[2],
				inline: parseInlineFormatting(headingMatch[2]),
			});
			i++;
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

			elements.push({
				type: "blockquote",
				content: quoteLines.join(" "),
				inline: parseInlineFormatting(quoteLines.join(" ")),
			});
			continue;
		}

		// Unordered list
		if (/^[-*+]\s+/.test(line.trim())) {
			const listItems: string[] = [];

			while (i < lines.length && /^[-*+]\s+/.test(lines[i].trim())) {
				listItems.push(lines[i].trim().replace(/^[-*+]\s+/, ""));
				i++;
			}

			elements.push({
				type: "list",
				ordered: false,
				items: listItems,
				content: "",
			});
			continue;
		}

		// Ordered list
		if (/^\d+\.\s+/.test(line.trim())) {
			const listItems: string[] = [];

			while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
				listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
				i++;
			}

			elements.push({
				type: "list",
				ordered: true,
				items: listItems,
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
				!/^\d+\.\s+/.test(lines[i].trim())
			) {
				paragraphLines.push(lines[i]);
				i++;
			}

			const content = paragraphLines.join(" ");
			elements.push({
				type: "paragraph",
				content,
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
function parseInlineFormatting(text: string): InlineElement[] {
	const elements: InlineElement[] = [];

	// This is a simplified parser - a full implementation would use a proper parser
	// For now, we'll just split by common patterns

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

	// Sort by position
	matches.sort((a, b) => a.start - b.start);

	// Build elements with text segments
	let lastEnd = 0;
	for (const match of matches) {
		// Add plain text before this match
		if (match.start > lastEnd) {
			const plainText = text.slice(lastEnd, match.start);
			if (plainText) {
				elements.push({ type: "text", content: plainText });
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

	// Add remaining plain text
	if (lastEnd < text.length) {
		const plainText = text.slice(lastEnd);
		if (plainText) {
			elements.push({ type: "text", content: plainText });
		}
	}

	// If no formatting found, return plain text
	if (elements.length === 0) {
		elements.push({ type: "text", content: text });
	}

	return elements;
}
