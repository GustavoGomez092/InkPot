/**
 * Paragraph Element Converter for DOCX
 * Converts markdown paragraph elements to Word document paragraphs
 */

import {
  AlignmentType,
  Paragraph,
  TextRun,
} from 'docx';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import type { InlineElement, MarkdownElement } from '../../pdf/markdown-parser.js';

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
 * Map text alignment to docx AlignmentType
 */
function getAlignment(textAlign?: 'left' | 'center' | 'right'): AlignmentType {
  switch (textAlign) {
    case 'center':
      return AlignmentType.CENTER;
    case 'right':
      return AlignmentType.RIGHT;
    case 'left':
    default:
      return AlignmentType.LEFT;
  }
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
 * Convert a paragraph markdown element to a docx Paragraph
 */
export function createParagraphElement(
  element: MarkdownElement,
  theme: ThemeData
): Paragraph {
  const fontSize = theme.bodySize;

  // Build children (TextRuns) from inline elements or plain content
  let children: TextRun[];

  if (element.inline && element.inline.length > 0) {
    children = convertInlineElements(element.inline, theme, fontSize);
  } else {
    // Plain text content
    children = [
      new TextRun({
        text: element.content,
        font: theme.bodyFont,
        size: pointsToHalfPoints(fontSize),
        color: theme.textColor.replace('#', ''),
      }),
    ];
  }

  return new Paragraph({
    alignment: getAlignment(element.textAlign),
    spacing: {
      after: pointsToDxa(12 * 0.75), // 12px margin bottom (converted to points then DXA)
    },
    children,
  });
}
