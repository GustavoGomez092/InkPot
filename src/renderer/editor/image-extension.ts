/**
 * Custom Image Extension for Tiptap
 * Handles image uploads with local file storage in project directory
 */

import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageNodeView } from "./ImageNodeView";

export interface ImageOptions {
	inline: boolean;
	allowBase64: boolean;
	HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		image: {
			/**
			 * Add an image
			 */
			setImage: (options: {
				src: string;
				alt?: string;
				title?: string;
			}) => ReturnType;
		};
	}
}

export const Image = Node.create<ImageOptions>({
	name: "image",

	addOptions() {
		return {
			inline: false,
			allowBase64: false,
			HTMLAttributes: {},
		};
	},

	inline() {
		return this.options.inline;
	},

	group() {
		return this.options.inline ? "inline" : "block";
	},

	draggable: true,

	addAttributes() {
		return {
			src: {
				default: null,
				parseHTML: (element) => element.getAttribute("src"),
				renderHTML: (attributes) => {
					if (!attributes.src) {
						return {};
					}
					return {
						src: attributes.src,
					};
				},
			},
			alt: {
				default: null,
				parseHTML: (element) => element.getAttribute("alt"),
				renderHTML: (attributes) => {
					if (!attributes.alt) {
						return {};
					}
					return {
						alt: attributes.alt,
					};
				},
			},
			title: {
				default: null,
				parseHTML: (element) => element.getAttribute("title"),
				renderHTML: (attributes) => {
					if (!attributes.title) {
						return {};
					}
					return {
						title: attributes.title,
					};
				},
			},
			width: {
				default: null,
				parseHTML: (element) => element.getAttribute("width"),
				renderHTML: (attributes) => {
					if (!attributes.width) {
						return {};
					}
					return {
						width: attributes.width,
					};
				},
			},
			height: {
				default: null,
				parseHTML: (element) => element.getAttribute("height"),
				renderHTML: (attributes) => {
					if (!attributes.height) {
						return {};
					}
					return {
						height: attributes.height,
					};
				},
			},
		};
	},

	parseHTML() {
		return [
			{
				tag: this.options.allowBase64
					? "img[src]"
					: 'img[src]:not([src^="data:"])',
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"img",
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
		];
	},

	addCommands() {
		return {
			setImage:
				(options) =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
						attrs: options,
					});
				},
		};
	},

	addNodeView() {
		return ReactNodeViewRenderer(ImageNodeView);
	},

	addProseMirrorPlugins() {
		// Note: Drag-and-drop and paste handlers are disabled because they would
		// insert base64 data URLs that don't get saved to the file system.
		// Users should use the image upload button instead, which properly saves
		// images to the project's assets folder.
		return [];
	},
});
