/**
 * HorizontalRule Element Converter for DOCX
 * Converts markdown horizontal rule elements to Word document paragraphs with a bottom border
 */

import {
  BorderStyle,
  Paragraph,
} from 'docx';
import type { ThemeData } from '@shared/types/ipc-contracts.js';

/**
 * Convert points to DXA units (20 DXA = 1 point)
 */
function pointsToDxa(points: number): number {
  return Math.round(points * 20);
}

/**
 * Convert a horizontal rule markdown element to a docx Paragraph
 * Horizontal rules are rendered as an empty paragraph with a bottom border
 */
export function createHorizontalRuleElement(
  theme: ThemeData
): Paragraph {
  // Create an empty paragraph with a bottom border to simulate a horizontal rule
  // Similar to PDF styling: marginTop: 12, marginBottom: 12, borderBottom with 0.3 opacity
  return new Paragraph({
    spacing: {
      before: pointsToDxa(12 * 0.75), // 12px margin top (converted to points then DXA)
      after: pointsToDxa(12 * 0.75), // 12px margin bottom
    },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 8, // 1pt border (size is in eighths of a point, 1 * 8 = 8)
        color: theme.textColor.replace('#', ''),
      },
    },
    children: [],
  });
}
