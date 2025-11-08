import { mergeAttributes, Node } from "@tiptap/core";

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		pageBreak: {
			/**
			 * Insert a page break
			 */
			setPageBreak: () => ReturnType;
		};
	}
}

/**
 * Page Break Extension for Tiptap
 *
 * Inserts a visual page break marker that will be used during PDF generation
 * to control pagination.
 */
export const PageBreak = Node.create({
	name: "pageBreak",

	group: "block",

	parseHTML() {
		return [
			{
				tag: 'div[data-type="page-break"]',
			},
			{
				tag: "hr[data-page-break]",
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"div",
			mergeAttributes(HTMLAttributes, {
				"data-type": "page-break",
				class: "page-break",
			}),
			["hr", { "data-page-break": "true" }],
		];
	},

	addCommands() {
		return {
			setPageBreak:
				() =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
					});
				},
		};
	},

	addKeyboardShortcuts() {
		return {
			"Mod-Enter": () => this.editor.commands.setPageBreak(),
		};
	},
});

/**
 * Serialize page break to markdown
 * Returns a special marker that PDF generator can recognize
 */
export function serializePageBreak(): string {
	return "\n\n---PAGE_BREAK---\n\n";
}
