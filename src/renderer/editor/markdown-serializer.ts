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
		// Nodes
		blockquote: defaultMarkdownSerializer.nodes.blockquote,
		code_block: defaultMarkdownSerializer.nodes.code_block,
		heading: defaultMarkdownSerializer.nodes.heading,
		horizontal_rule: defaultMarkdownSerializer.nodes.horizontal_rule,
		bullet_list: defaultMarkdownSerializer.nodes.bullet_list,
		ordered_list: defaultMarkdownSerializer.nodes.ordered_list,
		list_item: defaultMarkdownSerializer.nodes.list_item,
		paragraph: defaultMarkdownSerializer.nodes.paragraph,
		text: defaultMarkdownSerializer.nodes.text,
		hard_break: defaultMarkdownSerializer.nodes.hard_break,

		// Custom page break serializer
		pageBreak: (state) => {
			state.write("\n\n---PAGE_BREAK---\n\n");
		},
	},
	{
		// Marks
		em: defaultMarkdownSerializer.marks.em,
		strong: defaultMarkdownSerializer.marks.strong,
		link: defaultMarkdownSerializer.marks.link,
		code: defaultMarkdownSerializer.marks.code,
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
		return editorToMarkdown(editor);
	} catch (error) {
		console.error("Failed to serialize to markdown:", error);
		// Fallback to HTML if markdown serialization fails
		return editor.getHTML();
	}
}
