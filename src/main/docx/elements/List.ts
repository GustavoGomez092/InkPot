/**
 * List Element Converter for DOCX
 * Converts markdown list elements (ordered and unordered) to Word document paragraphs
 */

import {
  AlignmentType,
  Paragraph,
  TextRun,
} from 'docx';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import type { InlineElement, MarkdownElement } from '../../pdf/markdown-parser.js';
import { parseInlineFormatting } from '../../pdf/markdown-parser.js';

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
 * Convert inline elements to TextRun array for docx
 */
function convertInlineElements(
  inlineElements: InlineElement[],
  theme: ThemeData,
  fontSize: number
): TextRun[] {
  const textRuns: TextRun[] = [];

  for (const element of inlineElements) {
    switch (element.type) {
      case 'text':
        textRuns.push(
          new TextRun({
            text: element.content,
            font: theme.bodyFont,
            size: pointsToHalfPoints(fontSize),
            color: theme.textColor.replace('#', ''),
          })
        );
        break;

      case 'bold':
        textRuns.push(
          new TextRun({
            text: element.content,
            font: theme.bodyFont,
            size: pointsToHalfPoints(fontSize),
            color: theme.textColor.replace('#', ''),
            bold: true,
          })
        );
        break;

      case 'italic':
        textRuns.push(
          new TextRun({
            text: element.content,
            font: theme.bodyFont,
            size: pointsToHalfPoints(fontSize),
            color: theme.textColor.replace('#', ''),
            italics: true,
          })
        );
        break;

      case 'code':
        textRuns.push(
          new TextRun({
            text: element.content,
            font: 'Courier New',
            size: pointsToHalfPoints(fontSize - 1),
            color: theme.textColor.replace('#', ''),
          })
        );
        break;

      case 'link':
        // Note: For proper hyperlinks, we would need to use ExternalHyperlink
        // For now, render as styled text
        textRuns.push(
          new TextRun({
            text: element.content,
            font: theme.bodyFont,
            size: pointsToHalfPoints(fontSize),
            color: theme.linkColor.replace('#', ''),
            underline: {},
          })
        );
        break;

      case 'strike':
        textRuns.push(
          new TextRun({
            text: element.content,
            font: theme.bodyFont,
            size: pointsToHalfPoints(fontSize),
            color: theme.textColor.replace('#', ''),
            strike: true,
          })
        );
        break;

      case 'lineBreak':
        textRuns.push(new TextRun({ break: 1 }));
        break;

      default:
        // Fallback for unknown types
        if (element.content) {
          textRuns.push(
            new TextRun({
              text: element.content,
              font: theme.bodyFont,
              size: pointsToHalfPoints(fontSize),
              color: theme.textColor.replace('#', ''),
            })
          );
        }
    }
  }

  return textRuns;
}

/**
 * Create a list item paragraph with bullet/number prefix
 */
function createListItemParagraph(
  itemText: string,
  theme: ThemeData,
  ordered: boolean,
  itemIndex: number,
  indentLevel: number,
  isLastItem: boolean
): Paragraph {
  const fontSize = theme.bodySize;

  // Parse inline formatting for the list item
  const inlineElements = parseInlineFormatting(itemText);

  // Create prefix for the list item
  const prefix = ordered ? `${itemIndex + 1}. ` : '• ';

  // Calculate left indent (20 points per indent level, converted to DXA)
  // Plus base indent for the prefix
  const baseIndent = pointsToDxa(15); // 15pt base indent for first level
  const levelIndent = pointsToDxa(20); // 20pt additional per level
  const leftIndent = baseIndent + (indentLevel * levelIndent);

  // Hanging indent for the bullet/number (so text wraps properly)
  const hangingIndent = pointsToDxa(15);

  // Build children - prefix first, then inline content
  const children: TextRun[] = [
    new TextRun({
      text: prefix,
      font: theme.bodyFont,
      size: pointsToHalfPoints(fontSize),
      color: theme.textColor.replace('#', ''),
    }),
    ...convertInlineElements(inlineElements, theme, fontSize),
  ];

  // Use more spacing after the last item in the list
  const spacingAfter = isLastItem
    ? pointsToDxa(16 * 0.75) // 16px margin after list
    : pointsToDxa(4 * 0.75); // 4px between items

  return new Paragraph({
    alignment: AlignmentType.LEFT,
    indent: {
      left: leftIndent,
      hanging: hangingIndent,
    },
    spacing: {
      after: spacingAfter,
    },
    children,
  });
}

/**
 * Convert a list markdown element to an array of docx Paragraphs
 * Each list item becomes its own paragraph
 */
export function createListParagraphs(
  element: MarkdownElement,
  theme: ThemeData
): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const items = element.items || [];
  const indentLevels = element.indentLevels || [];
  const ordered = element.ordered || false;

  for (let idx = 0; idx < items.length; idx++) {
    const item = items[idx];
    const indentLevel = indentLevels[idx] || 0;
    const isLastItem = idx === items.length - 1;

    paragraphs.push(
      createListItemParagraph(item, theme, ordered, idx, indentLevel, isLastItem)
    );
  }

  return paragraphs;
}
