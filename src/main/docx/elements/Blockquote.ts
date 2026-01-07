/**
 * Blockquote Element Converter for DOCX
 * Converts markdown blockquote elements to Word document paragraphs with blockquote styling
 */

import {
  AlignmentType,
  BorderStyle,
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
 * Convert inline elements to TextRun array for docx (with italic styling for blockquotes)
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
            italics: true,
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
            italics: true,
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
            italics: true,
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
            italics: true,
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
            italics: true,
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
              italics: true,
            })
          );
        }
    }
  }

  return textRuns;
}

/**
 * Convert a blockquote markdown element to a docx Paragraph
 * Blockquotes have a left border, left indent, and italic text
 */
export function createBlockquoteElement(
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
        italics: true,
      }),
    ];
  }

  return new Paragraph({
    alignment: AlignmentType.LEFT,
    indent: {
      // Left margin (20px in PDF = ~15pt ≈ 300 DXA)
      left: pointsToDxa(15),
    },
    spacing: {
      after: pointsToDxa(12 * 0.75), // 12px margin bottom
    },
    border: {
      left: {
        style: BorderStyle.SINGLE,
        size: 24, // 3pt border (size is in eighths of a point, 3 * 8 = 24)
        color: theme.headingColor.replace('#', ''),
      },
    },
    children,
  });
}
