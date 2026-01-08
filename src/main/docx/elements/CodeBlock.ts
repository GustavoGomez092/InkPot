/**
 * CodeBlock Element Converter for DOCX
 * Converts markdown code block elements to Word document paragraphs with monospace styling
 */

import {
  AlignmentType,
  Paragraph,
  ShadingType,
  TextRun,
} from 'docx';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import type { MarkdownElement } from '../../pdf/markdown-parser.js';

/**
 * Convert points to DXA units (20 DXA = 1 point)
 */
function pointsToDxa(points: number): number {
  return Math.round(points * 20);
}

/**
 * Convert points to half-points (used for font sizes in docx)
 * Font sizes in docx are specified in half-points (1 point = 2 half-points)
 */
function pointsToHalfPoints(points: number): number {
  return Math.round(points * 2);
}

/**
 * Preserve leading whitespace by converting spaces to non-breaking spaces
 * This ensures code indentation is preserved in the Word document
 */
function preserveLeadingWhitespace(line: string): string {
  return line.replace(/^ +/, (spaces) => '\u00A0'.repeat(spaces.length));
}

/**
 * Convert a code block markdown element to an array of docx Paragraphs
 * Each line of code becomes its own paragraph for proper line-by-line rendering
 */
export function createCodeBlockParagraphs(
  element: MarkdownElement,
  theme: ThemeData
): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const fontSize = theme.bodySize - 1; // Slightly smaller font for code
  const lines = element.content.split('\n');

  // Get background color (strip # prefix for docx)
  const backgroundColor = theme.codeBackground.replace('#', '');

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const isFirstLine = idx === 0;
    const isLastLine = idx === lines.length - 1;

    // Preserve leading whitespace for code indentation
    const preservedLine = preserveLeadingWhitespace(line);

    // Create TextRun for this line of code
    // Empty lines still need a space or non-breaking space to maintain height
    const textContent = preservedLine === '' ? '\u00A0' : preservedLine;

    const textRun = new TextRun({
      text: textContent,
      font: 'Courier New',
      size: pointsToHalfPoints(fontSize),
      color: theme.textColor.replace('#', ''),
    });

    // Calculate spacing - add top margin for first line, bottom margin for last line
    // Minimal spacing between lines for code blocks
    const spacingBefore = isFirstLine ? pointsToDxa(12 * 0.75) : 0;
    const spacingAfter = isLastLine ? pointsToDxa(12 * 0.75) : pointsToDxa(1);

    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        shading: {
          type: ShadingType.SOLID,
          color: backgroundColor,
          fill: backgroundColor,
        },
        // Add padding effect using indentation
        indent: {
          left: pointsToDxa(12), // 12pt padding left
          right: pointsToDxa(12), // 12pt padding right
        },
        spacing: {
          before: spacingBefore,
          after: spacingAfter,
          line: 360, // 1.5 line spacing (240 = single, 360 = 1.5)
        },
        children: [textRun],
      })
    );
  }

  return paragraphs;
}
