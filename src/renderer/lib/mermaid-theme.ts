/**
 * Utility functions for converting InkPot theme data to Mermaid theme colors
 */

import isDarkColor from "is-dark-color";
import type { MermaidThemeColors } from "@/hooks/useMermaid";

export interface ThemeColors {
	textColor?: string;
	headingColor?: string;
	linkColor?: string;
	backgroundColor?: string;
}

/**
 * Convert InkPot theme colors to Mermaid theme variables
 * Maps semantic theme properties to mermaid's theme system
 * Automatically determines text color contrast based on background colors
 */
export function themeToMermaidColors(theme: ThemeColors): MermaidThemeColors {
	const primaryColor = theme.headingColor || "#3B82F6";
	const bgColor = theme.backgroundColor || "#FFFFFF";

	// Determine text colors based on background darkness
	const primaryTextColor = isDarkColor(primaryColor) ? "#FFFFFF" : "#000000";
	const mainTextColor = theme.textColor || "#1F2937";

	return {
		// Primary color from heading color (for main nodes/elements)
		primaryColor,

		// Primary text - use white or black based on primary color darkness
		primaryTextColor,

		// Border color - slightly darker version of primary
		primaryBorderColor: darkenColor(primaryColor, 20),

		// Line color from link color (for connectors)
		lineColor: theme.linkColor || "#6366F1",

		// Secondary color - lighter version of heading color
		secondaryColor: lightenColor(primaryColor, 30),

		// Tertiary color from background
		tertiaryColor: bgColor,

		// Background
		backgroundColor: bgColor,

		// Text color
		textColor: mainTextColor,
	};
}

/**
 * Darken a hex color by a percentage
 */
function darkenColor(hex: string, percent: number): string {
	const num = parseInt(hex.replace("#", ""), 16);
	const amt = Math.round(2.55 * percent);
	const R = (num >> 16) - amt;
	const G = ((num >> 8) & 0x00ff) - amt;
	const B = (num & 0x0000ff) - amt;
	return (
		"#" +
		(
			0x1000000 +
			(R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
			(G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
			(B < 255 ? (B < 1 ? 0 : B) : 255)
		)
			.toString(16)
			.slice(1)
	);
}

/**
 * Lighten a hex color by a percentage
 */
function lightenColor(hex: string, percent: number): string {
	const num = parseInt(hex.replace("#", ""), 16);
	const amt = Math.round(2.55 * percent);
	const R = (num >> 16) + amt;
	const G = ((num >> 8) & 0x00ff) + amt;
	const B = (num & 0x0000ff) + amt;
	return (
		"#" +
		(
			0x1000000 +
			(R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
			(G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
			(B < 255 ? (B < 1 ? 0 : B) : 255)
		)
			.toString(16)
			.slice(1)
	);
}

/**
 * Fetch active theme colors from electron API
 * Requires theme id from the project
 */
export async function getThemeColors(id: string): Promise<ThemeColors> {
	try {
		const result = await window.electronAPI.themes.get({ id });
		if (result.success && result.data) {
			return {
				textColor: result.data.textColor,
				headingColor: result.data.headingColor,
				linkColor: result.data.linkColor,
				backgroundColor: result.data.backgroundColor,
			};
		}
	} catch (error) {
		console.warn("Failed to fetch theme colors for mermaid:", error);
	}

	// Return defaults if fetch fails
	return {
		textColor: "#1F2937",
		headingColor: "#3B82F6",
		linkColor: "#6366F1",
		backgroundColor: "#FFFFFF",
	};
}
