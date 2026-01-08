/**
 * Table of Contents Component for PDF
 * Renders a clickable table of contents with hierarchical indentation
 *
 * Link Styling:
 * - TOC links use theme.linkColor
 * - Link underline controlled by theme.linkUnderline (defaults to true for accessibility)
 * - Links navigate to heading anchors using react-pdf's internal link syntax
 * - Maintains WCAG AA/AAA contrast standards with background colors
 */

import { Link, Text, View } from '@react-pdf/renderer';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import type React from 'react';
import type { TOCEntry } from '../utils/toc-utils.js';

// biome-ignore lint/suspicious/noExplicitAny: React-PDF Style type
type PDFStyle = any;

export interface TableOfContentsProps {
	/** Array of TOC entries to render */
	entries: TOCEntry[];
	/** Theme data for styling */
	theme: ThemeData;
	/** Optional custom title (defaults to "Table of Contents") */
	title?: string;
}

/**
 * Get the bold variant of a font family for the TOC title
 */
function getBoldFont(fontFamily: string): string {
	if (fontFamily === 'Helvetica') return 'Helvetica-Bold';
	if (fontFamily === 'Times-Roman') return 'Times-Bold';
	if (fontFamily === 'Courier') return 'Courier-Bold';
	return fontFamily;
}

/**
 * Table of Contents component for PDF documents
 * Renders a hierarchical TOC with clickable links to document sections
 */
export const TableOfContents: React.FC<TableOfContentsProps> = ({
	entries,
	theme,
	title = 'Table of Contents',
}) => {
	// Don't render TOC if there are no entries
	if (!entries || entries.length === 0) {
		return null;
	}

	// Title style
	const titleStyle: PDFStyle = {
		fontSize: theme.h2Size,
		fontFamily: getBoldFont(theme.headingFont),
		color: theme.headingColor,
		marginBottom: 16,
		letterSpacing: theme.kerning,
		lineHeight: theme.leading,
	};

	// Container style
	const containerStyle: PDFStyle = {
		marginBottom: 24,
	};

	return (
		<View style={containerStyle}>
			{/* TOC Title */}
			<Text style={titleStyle}>{title}</Text>

			{/* TOC Entries */}
			{entries.map((entry, idx) => {
				// Calculate indentation based on heading level
				// Level 1 (h1): 0px, Level 2 (h2): 12px, Level 3 (h3): 24px, etc.
				const indentLevel = Math.max(0, entry.level - 1);
				const marginLeft = indentLevel * 12;

				// Entry style - varies slightly by level
				const entryStyle: PDFStyle = {
					fontSize: theme.bodySize - (entry.level > 2 ? 1 : 0), // Smaller font for h3+
					fontFamily: theme.bodyFont,
					marginBottom: entry.level === 1 ? 8 : 4, // More spacing for h1
					marginLeft: marginLeft,
					letterSpacing: theme.kerning,
					lineHeight: theme.leading,
				};

				// Link style
				const linkStyle: PDFStyle = {
					color: theme.linkColor,
					textDecoration: theme.linkUnderline ? 'underline' : 'none',
				};

				return (
					<View key={`toc-${idx}-${entry.anchorId}`} style={entryStyle}>
						<Link src={`#${entry.anchorId}`} style={linkStyle}>
							{entry.text}
						</Link>
					</View>
				);
			})}
		</View>
	);
};
