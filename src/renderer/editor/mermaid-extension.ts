import type { MermaidDiagramAttributes } from "@shared/types/mermaid";
import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { MermaidNodeView } from "./MermaidNodeView";

export interface MermaidDiagramOptions {
	/** Whether to enable drag-and-drop reordering */
	draggable?: boolean;

	/** Callback when diagram is inserted */
	onInsert?: (attrs: MermaidDiagramAttributes) => void;

	/** Callback when diagram is updated */
	onUpdate?: (attrs: MermaidDiagramAttributes) => void;

	/** Callback when diagram is deleted */
	onDelete?: (id: string) => void;

	/** Callback to open modal for editing */
	onOpenModal?: (
		diagramId?: string,
		currentCode?: string,
		currentCaption?: string,
	) => void;
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		mermaidDiagram: {
			/** Insert a new Mermaid diagram at current cursor position */
			insertMermaidDiagram: (
				code: string,
				caption?: string,
				imagePath?: string,
			) => ReturnType;

			/** Update an existing diagram's code and caption */
			updateMermaidDiagram: (
				id: string,
				code: string,
				caption?: string,
				imagePath?: string,
			) => ReturnType;

			/** Delete a diagram by ID */
			deleteMermaidDiagram: (id: string) => ReturnType;
		};
	}
}

/**
 * Tiptap extension for Mermaid.js diagrams
 * Creates a custom block node that stores diagram code and renders via React NodeView
 */
export const MermaidDiagram = Node.create<MermaidDiagramOptions>({
	name: "mermaidDiagram",

	group: "block",

	atom: true,

	draggable: true,

	addOptions() {
		return {
			draggable: true,
			onInsert: undefined,
			onUpdate: undefined,
			onDelete: undefined,
			onOpenModal: undefined,
		};
	},

	addAttributes() {
		return {
			code: {
				default: "",
				parseHTML: (element) => {
					const code = element.getAttribute("data-code") || "";
					// Decode HTML entities that were escaped for the data attribute
					const textarea = document.createElement("textarea");
					textarea.innerHTML = code;
					return textarea.value;
				},
				renderHTML: (attributes) => {
					// Escape HTML entities for the data attribute
					const escapedCode = attributes.code
						.replace(/&/g, "&amp;")
						.replace(/</g, "&lt;")
						.replace(/>/g, "&gt;")
						.replace(/"/g, "&quot;");
					return {
						"data-code": escapedCode,
					};
				},
			},
			id: {
				default: "",
				parseHTML: (element) => element.getAttribute("data-id") || "",
				renderHTML: (attributes) => ({
					"data-id": attributes.id,
				}),
			},
			caption: {
				default: undefined,
				parseHTML: (element) =>
					element.getAttribute("data-caption") || undefined,
				renderHTML: (attributes) => {
					if (!attributes.caption) return {};
					return { "data-caption": attributes.caption };
				},
			},
			imagePath: {
				default: undefined,
				parseHTML: (element) =>
					element.getAttribute("data-image-path") || undefined,
				renderHTML: (attributes) => {
					if (!attributes.imagePath) return {};
					return { "data-image-path": attributes.imagePath };
				},
			},
			createdAt: {
				default: Date.now(),
				parseHTML: (element) => {
					const value = element.getAttribute("data-created-at");
					return value ? parseInt(value, 10) : Date.now();
				},
				renderHTML: (attributes) => ({
					"data-created-at": String(attributes.createdAt),
				}),
			},
			updatedAt: {
				default: Date.now(),
				parseHTML: (element) => {
					const value = element.getAttribute("data-updated-at");
					return value ? parseInt(value, 10) : Date.now();
				},
				renderHTML: (attributes) => ({
					"data-updated-at": String(attributes.updatedAt),
				}),
			},
		};
	},

	parseHTML() {
		return [
			{
				tag: 'div[data-type="mermaidDiagram"]',
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"div",
			mergeAttributes(HTMLAttributes, { "data-type": "mermaidDiagram" }),
		];
	},

	addNodeView() {
		return ReactNodeViewRenderer(MermaidNodeView);
	},

	addCommands() {
		return {
			insertMermaidDiagram:
				(code: string, caption?: string, imagePath?: string) =>
				({ commands }) => {
					const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
					console.log("➕ Extension: insertMermaidDiagram", {
						id,
						imagePath: imagePath ? "present" : "missing",
					});
					const attrs: MermaidDiagramAttributes = {
						code,
						id,
						caption,
						imagePath,
						createdAt: Date.now(),
						updatedAt: Date.now(),
					};

					const success = commands.insertContent({
						type: this.name,
						attrs,
					});

					if (success) {
						this.options.onInsert?.(attrs);
					}

					return success;
				},

			updateMermaidDiagram:
				(id: string, code: string, caption?: string, imagePath?: string) =>
				({ state, tr, dispatch }) => {
					console.log("🔄 Extension: updateMermaidDiagram", {
						id,
						imagePath: imagePath ? "present" : "missing",
					});
					let updated = false;

					state.doc.descendants((node, pos) => {
						if (node.type.name === this.name && node.attrs.id === id) {
							console.log("   - Found node, old attrs:", {
								imagePath: node.attrs.imagePath,
							});
							const updatedAttrs: MermaidDiagramAttributes = {
								...(node.attrs as MermaidDiagramAttributes),
								code,
								caption,
								imagePath,
								updatedAt: Date.now(),
							};
							console.log("   - New attrs:", {
								imagePath: updatedAttrs.imagePath,
							});

							tr.setNodeMarkup(pos, undefined, updatedAttrs);
							this.options.onUpdate?.(updatedAttrs);
							updated = true;
							return false;
						}
					});

					if (dispatch && updated) {
						dispatch(tr);
					}

					return updated;
				},

			deleteMermaidDiagram:
				(id: string) =>
				({ state, tr, dispatch }) => {
					let deleted = false;

					state.doc.descendants((node, pos) => {
						if (node.type.name === this.name && node.attrs.id === id) {
							tr.delete(pos, pos + node.nodeSize);
							this.options.onDelete?.(id);
							deleted = true;
							return false;
						}
					});

					if (dispatch && deleted) {
						dispatch(tr);
					}

					return deleted;
				},
		};
	},

	addKeyboardShortcuts() {
		return {
			"Mod-Shift-d": () => {
				this.options.onOpenModal?.();
				return true;
			},
		};
	},
});
