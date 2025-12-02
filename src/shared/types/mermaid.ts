/**
 * Type definitions for Mermaid.js diagram support
 * Feature: 002-mermaid-diagrams
 */

/**
 * Attributes for Mermaid diagram node in Tiptap editor
 */
export interface MermaidDiagramAttributes {
	/** Mermaid.js code defining the diagram */
	code: string;

	/** Unique identifier for this diagram instance */
	id: string;

	/** Optional caption displayed below the diagram */
	caption?: string;

	/** File path to pre-rendered PNG image (for editor preview and PDF) */
	imagePath?: string;

	/** Creation timestamp (Unix milliseconds) */
	createdAt: number;

	/** Last modified timestamp (Unix milliseconds) */
	updatedAt: number;
}

/**
 * Validation result from Mermaid parser
 */
export interface MermaidValidationResult {
	/** Whether the Mermaid code is valid */
	isValid: boolean;

	/** Error message if validation failed */
	error: string | null;

	/** Line number where error occurred (if available) */
	errorLine?: number;
}

/**
 * Props for MermaidModal component
 */
export interface MermaidModalProps {
	/** Whether the modal is open */
	open: boolean;

	/** Callback when modal closes */
	onClose: () => void;

	/** Initial code to populate editor (empty for new diagram) */
	initialCode?: string;

	/** Initial caption to populate caption field (for edit mode) */
	initialCaption?: string;

	/** Callback when user saves diagram */
	onSave: (code: string, caption?: string) => void;

	/** Optional diagram ID for edit mode */
	diagramId?: string;
}

/**
 * Internal state for MermaidModal component
 */
export interface MermaidModalState {
	/** Current Mermaid code in editor */
	code: string;

	/** Optional caption text */
	caption: string;

	/** Validation result for current code */
	validation: MermaidValidationResult;

	/** Whether validation is in progress */
	isValidating: boolean;

	/** Key to force preview re-render */
	previewKey: number;
}

/**
 * PDF element type for parsed Mermaid blocks
 */
export interface PdfMermaidElement {
	/** Element type identifier */
	type: "mermaid";

	/** Mermaid code to render */
	code: string;

	/** Optional caption */
	caption?: string;

	/** Rendered SVG string (populated during PDF generation) */
	svg?: string;

	/** Error message if rendering failed */
	error?: string;
}
