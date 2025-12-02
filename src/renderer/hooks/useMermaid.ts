import type { MermaidValidationResult } from "@shared/types/mermaid";
import { useCallback, useEffect, useRef, useState } from "react";

let mermaidInstance: typeof import("mermaid").default | null = null;
let mermaidLoadPromise: Promise<typeof import("mermaid").default> | null = null;

/**
 * Theme colors that can be used to customize mermaid diagrams
 */
export interface MermaidThemeColors {
	primaryColor?: string;
	primaryTextColor?: string;
	primaryBorderColor?: string;
	lineColor?: string;
	secondaryColor?: string;
	tertiaryColor?: string;
	backgroundColor?: string;
	textColor?: string;
}

/**
 * Inject mermaid theme configuration into diagram code
 * Adds frontmatter config if not already present
 */
function injectThemeConfig(
	code: string,
	themeColors?: MermaidThemeColors,
): string {
	if (!themeColors) return code;

	// Check if code already has frontmatter config
	if (code.trim().startsWith("---")) {
		return code; // Don't modify if user has custom config
	}

	// Build theme variables from provided colors
	const themeVars: string[] = [];
	if (themeColors.primaryColor)
		themeVars.push(`    primaryColor: '${themeColors.primaryColor}'`);
	if (themeColors.primaryTextColor)
		themeVars.push(`    primaryTextColor: '${themeColors.primaryTextColor}'`);
	if (themeColors.primaryBorderColor)
		themeVars.push(
			`    primaryBorderColor: '${themeColors.primaryBorderColor}'`,
		);
	if (themeColors.lineColor)
		themeVars.push(`    lineColor: '${themeColors.lineColor}'`);
	if (themeColors.secondaryColor)
		themeVars.push(`    secondaryColor: '${themeColors.secondaryColor}'`);
	if (themeColors.tertiaryColor)
		themeVars.push(`    tertiaryColor: '${themeColors.tertiaryColor}'`);
	if (themeColors.backgroundColor)
		themeVars.push(`    background: '${themeColors.backgroundColor}'`);
	if (themeColors.textColor)
		themeVars.push(`    mainBkg: '${themeColors.textColor}'`);

	if (themeVars.length === 0) return code;

	// Inject theme config as frontmatter
	const config = `---
config:
  theme: 'base'
  themeVariables:
${themeVars.join("\n")}
---\n`;

	return config + code;
}

/**
 * Lazy load Mermaid.js library with configuration
 */
async function loadMermaid() {
	if (mermaidInstance) return mermaidInstance;
	if (mermaidLoadPromise) return mermaidLoadPromise;

	mermaidLoadPromise = import("mermaid").then((module) => {
		mermaidInstance = module.default;
		mermaidInstance.initialize({
			startOnLoad: false,
			theme: "base",
			themeVariables: {
				background: "transparent",
			},
			securityLevel: "strict",
			fontFamily: "Inter, system-ui, sans-serif",
		});
		return mermaidInstance;
	});

	return mermaidLoadPromise;
}

export interface UseMermaidReturn {
	/** Render Mermaid code to SVG in a container element */
	renderDiagram: (
		code: string,
		element: HTMLElement,
		id?: string,
	) => Promise<void>;

	/** Validate Mermaid syntax */
	validateMermaid: (code: string) => Promise<MermaidValidationResult>;

	/** Whether Mermaid library is loaded */
	isLoaded: boolean;

	/** Whether an operation is in progress */
	isLoading: boolean;

	/** Last error that occurred */
	error: Error | null;

	/** Clear error state */
	clearError: () => void;
}

/**
 * Hook for Mermaid.js diagram rendering and validation
 * Lazy loads the library and provides rendering/validation functions
 */
export function useMermaid(): UseMermaidReturn {
	const [isLoaded, setIsLoaded] = useState(!!mermaidInstance);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const renderCounter = useRef(0);

	useEffect(() => {
		loadMermaid()
			.then(() => setIsLoaded(true))
			.catch((err) =>
				setError(err instanceof Error ? err : new Error(String(err))),
			);
	}, []);

	const renderDiagram = useCallback(
		async (code: string, element: HTMLElement, id?: string): Promise<void> => {
			try {
				setIsLoading(true);
				setError(null);

				const mermaid = await loadMermaid();
				// Use provided ID or generate one with counter
				const renderId = id || `mermaid-render-${++renderCounter.current}`;

				// Clear previous content
				element.innerHTML = "";

				// Render diagram
				const { svg } = await mermaid.render(renderId, code);
				element.innerHTML = svg;

				// Ensure SVG has proper attributes for responsive sizing
				const svgElement = element.querySelector("svg");
				if (svgElement) {
					svgElement.style.maxWidth = "100%";
					svgElement.style.height = "auto";
					svgElement.style.display = "block";
					// Remove fixed width/height if present to allow responsive sizing
					if (svgElement.hasAttribute("width")) {
						svgElement.removeAttribute("width");
					}
					if (svgElement.hasAttribute("height")) {
						svgElement.removeAttribute("height");
					}
				}
			} catch (err) {
				const error = err instanceof Error ? err : new Error(String(err));
				setError(error);
				throw error;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	const validateMermaid = useCallback(
		async (code: string): Promise<MermaidValidationResult> => {
			try {
				const mermaid = await loadMermaid();

				// Use parse method for validation
				await mermaid.parse(code);

				return { isValid: true, error: null };
			} catch (err: any) {
				const errorMessage = err.message || String(err);
				const lineMatch = errorMessage.match(/line (\d+)/i);
				const errorLine = lineMatch ? parseInt(lineMatch[1], 10) : undefined;

				return {
					isValid: false,
					error: errorMessage,
					errorLine,
				};
			}
		},
		[],
	);

	const clearError = useCallback(() => setError(null), []);

	return {
		renderDiagram,
		validateMermaid,
		isLoaded,
		isLoading,
		error,
		clearError,
	};
}
