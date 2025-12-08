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

				// Clean up ALL mermaid divs from document body before rendering
				// Mermaid creates these temporary containers and they accumulate
				const allMermaidDivs = document.querySelectorAll(
					'[id^="dmermaid-"], [id^="mermaid-"]',
				);
				allMermaidDivs.forEach((div) => {
					if (div.parentNode === document.body) {
						div.remove();
					}
				});

				// Clear previous content
				element.innerHTML = "";

				// Render diagram
				const { svg } = await mermaid.render(renderId, code);
				element.innerHTML = svg;

				// Clean up ALL mermaid divs again after rendering
				// (Mermaid creates new ones during the render process)
				const newMermaidDivs = document.querySelectorAll(
					'[id^="dmermaid-"], [id^="mermaid-"]',
				);
				newMermaidDivs.forEach((div) => {
					if (div.parentNode === document.body) {
						div.remove();
					}
				});

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
				// Clean up mermaid divs even when error occurs
				const mermaidDivs = document.querySelectorAll(
					'[id^="dmermaid-"], [id^="mermaid-"]',
				);
				mermaidDivs.forEach((div) => {
					if (div.parentNode === document.body) {
						div.remove();
					}
				});

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
