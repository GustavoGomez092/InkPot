import type { Editor } from "@tiptap/react";
import {
	defaultMarkdownSerializer,
	MarkdownSerializer,
} from "prosemirror-markdown";

/**
 * Custom markdown serializer for Tiptap editor
 * Converts ProseMirror document to markdown format
 */
export const markdownSerializer = new MarkdownSerializer(
	{
		// Document nodes
		doc: defaultMarkdownSerializer.nodes.doc,
		document: defaultMarkdownSerializer.nodes.doc, // Alias for Tiptap's Document node

		// Block nodes
		blockquote: defaultMarkdownSerializer.nodes.blockquote,
		// Custom code block serializer that preserves all whitespace and indentation
		code_block: (state, node) => {
			const language = node.attrs.language || "";
			state.write("```" + language + "\n");
			// Write content exactly as stored, preserving all whitespace
			state.text(node.textContent, false);
			state.ensureNewLine();
			state.write("```");
			state.closeBlock(node);
		},
		codeBlock: (state, node) => {
			// Same as code_block for Tiptap alias
			const language = node.attrs.language || "";
			state.write("```" + language + "\n");
			state.text(node.textContent, false);
			state.ensureNewLine();
			state.write("```");
			state.closeBlock(node);
		},
		heading: (state, node) => {
			// Custom serializer to preserve textAlign attribute
			const textAlign = node.attrs.textAlign;
			if (textAlign && textAlign !== "left") {
				// Use HTML with inline style for non-left alignment
				const level = node.attrs.level;
				state.write(`<h${level} style="text-align: ${textAlign}">`);
				state.renderInline(node);
				state.write(`</h${level}>`);
				state.closeBlock(node);
			} else {
				// Use default markdown for left-aligned or unspecified
				defaultMarkdownSerializer.nodes.heading(state, node, node, 0);
			}
		},
		horizontal_rule: defaultMarkdownSerializer.nodes.horizontal_rule,
		horizontalRule: defaultMarkdownSerializer.nodes.horizontal_rule, // Alias for Tiptap
		bullet_list: defaultMarkdownSerializer.nodes.bullet_list,
		bulletList: defaultMarkdownSerializer.nodes.bullet_list, // Alias for Tiptap
		ordered_list: defaultMarkdownSerializer.nodes.ordered_list,
		orderedList: defaultMarkdownSerializer.nodes.ordered_list, // Alias for Tiptap
		list_item: defaultMarkdownSerializer.nodes.list_item,
		listItem: defaultMarkdownSerializer.nodes.list_item, // Alias for Tiptap

		// Task list nodes
		taskList: (state, node) => {
			console.log("📋 Serializing taskList with", node.childCount, "items");
			// Render each task item
			node.forEach((child, _, index) => {
				if (index > 0) state.ensureNewLine();
				state.render(child, node, index);
			});
			state.closeBlock(node);
		},
		taskItem: (state, node) => {
			// Get the checked attribute
			const checked = node.attrs.checked;
			const checkbox = checked ? "[x]" : "[ ]";
			console.log(
				"☐ Serializing taskItem, checked:",
				checked,
				"checkbox:",
				checkbox,
			);
			// Write the list marker with checkbox
			state.write(`- ${checkbox} `);
			// Render the content inline (without wrapping in paragraph markers)
			state.renderInline(node);
		},

		paragraph: (state, node) => {
			// Custom serializer to preserve textAlign attribute
			const textAlign = node.attrs.textAlign;
			if (textAlign && textAlign !== "left") {
				// Use HTML with inline style for non-left alignment
				state.write(`<p style="text-align: ${textAlign}">`);
				state.renderInline(node);
				state.write("</p>");
			state.closeBlock(node);
		} else {
			// Use default markdown for left-aligned or unspecified
			defaultMarkdownSerializer.nodes.paragraph(state, node, node, 0);
		}
	},		// Inline nodes
		text: defaultMarkdownSerializer.nodes.text,
		// Hard break (Shift+Enter) - use backslash + newline for clarity
		hard_break: (state) => {
			state.write("\\\n");
		},
		hardBreak: (state) => {
			state.write("\\\n");
		},

		// Custom page break serializer
		pageBreak: (state) => {
			state.write("\n\n---PAGE_BREAK---\n\n");
		},

		// Mermaid diagram serializer - output as fenced code block with caption
		mermaidDiagram: (state, node) => {
			const { code, caption } = node.attrs;
			console.log('💾 Serializing mermaid diagram:', { code: code?.substring(0, 50), caption });
			// Write opening fence with mermaid language tag
			state.write("```mermaid\n");
			// Write diagram code exactly as stored
			state.text(code || "", false);
			state.ensureNewLine();
			state.write("```");
			// Add caption as italic text on next line if present
			if (caption) {
				state.ensureNewLine();
				state.write(`*${caption}*`);
			}
			state.closeBlock(node);
		},

		// Image serializer - ensure each image is on its own line
		image: (state, node) => {
			const { src, alt, title } = node.attrs;
			const altText = alt || "";
			const titleText = title ? ` "${title}"` : "";
			state.write(`![${altText}](${src}${titleText})`);
			state.closeBlock(node); // Add newline after image
		},

		// Table serialization
		table: (state, node) => {
			// Process table - collect all rows and cells
			const rows: string[][] = [];
			let isFirstRow = true;

			node.forEach((row) => {
				const cells: string[] = [];
				row.forEach((cell) => {
					// Get cell content as plain text
					let cellText = "";
					cell.forEach((contentNode) => {
						if (contentNode.text) {
							cellText += contentNode.text;
						} else if (contentNode.type.name === "paragraph") {
							contentNode.forEach((textNode) => {
								if (textNode.text) cellText += textNode.text;
							});
						}
					});
					cells.push(cellText.trim() || " ");
				});
				rows.push(cells);

				// After first row, add separator
				if (isFirstRow && rows.length === 1) {
					const separator = cells.map(() => "---");
					rows.push(separator);
					isFirstRow = false;
				}
			});

			// Write table in markdown format
			state.write("\n");
			for (const row of rows) {
				state.write("| " + row.join(" | ") + " |\n");
			}
			state.write("\n");
		},

		tableRow: (state, node) => {
			// Handled by table serializer
			node.forEach((cell, _, index) => {
				if (index > 0) state.write(" | ");
				state.render(cell, node, index);
			});
		},

		tableCell: (state, node) => {
			// Render cell content inline
			state.renderInline(node);
		},

		tableHeader: (state, node) => {
			// Render header content inline (same as cell)
			state.renderInline(node);
		},
	},
	{
		// Marks - prosemirror-markdown names
		em: defaultMarkdownSerializer.marks.em,
		strong: defaultMarkdownSerializer.marks.strong,
		link: defaultMarkdownSerializer.marks.link,
		code: defaultMarkdownSerializer.marks.code,

		// Tiptap mark aliases
		italic: defaultMarkdownSerializer.marks.em, // Tiptap uses 'italic' instead of 'em'
		bold: defaultMarkdownSerializer.marks.strong, // Tiptap uses 'bold' instead of 'strong'
		underline: {
			open: "__",
			close: "__",
			mixable: true,
			expelEnclosingWhitespace: true,
		},
		strike: {
			open: "~~",
			close: "~~",
			mixable: true,
			expelEnclosingWhitespace: true,
		},
	},
);

/**
 * Convert Tiptap editor content to markdown
 */
export function editorToMarkdown(editor: Editor): string {
	const doc = editor.state.doc;
	return markdownSerializer.serialize(doc);
}

/**
 * Get markdown content from editor with fallback
 */
export function getMarkdownContent(editor: Editor | null): string {
	if (!editor) {
		return "";
	}

	try {
		const markdown = editorToMarkdown(editor);
		return markdown;
	} catch (error) {
		console.error("❌ Failed to serialize to markdown:", error);
		console.log("Falling back to HTML");
		// Fallback to HTML if markdown serialization fails
		return editor.getHTML();
	}
}
