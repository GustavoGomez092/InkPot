/**
 * Heading Element Converter for DOCX
 * Converts markdown heading elements to Word document paragraphs with heading styles
 */

import {
  AlignmentType,
  HeadingLevel,
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
 * Map heading levels to docx HeadingLevel enum
 */
function getHeadingLevel(level: number): HeadingLevel {
  const headingLevels: Record<number, HeadingLevel> = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
    4: HeadingLevel.HEADING_4,
    5: HeadingLevel.HEADING_5,
    6: HeadingLevel.HEADING_6,
  };
  return headingLevels[level] || HeadingLevel.HEADING_1;
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
 * Get the font size for a heading level from theme
 */
function getHeadingSize(level: number, theme: ThemeData): number {
  const sizes: Record<number, number> = {
    1: theme.h1Size,
    2: theme.h2Size,
    3: theme.h3Size,
    4: theme.h4Size,
    5: theme.h5Size,
    6: theme.h6Size,
  };
  return sizes[level] || theme.h1Size;
}

/**
 * Get margin top in DXA for heading level (converts from pixels)
 * Approximate conversion: 1px ≈ 15 DXA (at 96 DPI)
 */
function getMarginTop(level: number): number {
  const marginTop: Record<number, number> = {
    1: 24,
    2: 20,
    3: 16,
    4: 12,
    5: 10,
    6: 8,
  };
  // Convert px to DXA (approximately 15 DXA per px)
  return pointsToDxa((marginTop[level] || 24) * 0.75);
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
            font: theme.headingFont,
            size: pointsToHalfPoints(fontSize),
            color: theme.headingColor.replace('#', ''),
            bold: true,
          })
        );
        break;

      case 'bold':
        textRuns.push(
          new TextRun({
            text: element.content,
            font: theme.headingFont,
            size: pointsToHalfPoints(fontSize),
            color: theme.headingColor.replace('#', ''),
            bold: true,
          })
        );
        break;

      case 'italic':
        textRuns.push(
          new TextRun({
            text: element.content,
            font: theme.headingFont,
            size: pointsToHalfPoints(fontSize),
            color: theme.headingColor.replace('#', ''),
            bold: true,
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
            bold: true,
          })
        );
        break;

      case 'link':
        // Note: For proper hyperlinks, we would need to use ExternalHyperlink
        // For now, render as styled text
        textRuns.push(
          new TextRun({
            text: element.content,
            font: theme.headingFont,
            size: pointsToHalfPoints(fontSize),
            color: theme.linkColor.replace('#', ''),
            bold: true,
            underline: {},
          })
        );
        break;

      case 'strike':
        textRuns.push(
          new TextRun({
            text: element.content,
            font: theme.headingFont,
            size: pointsToHalfPoints(fontSize),
            color: theme.headingColor.replace('#', ''),
            bold: true,
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
              font: theme.headingFont,
              size: pointsToHalfPoints(fontSize),
              color: theme.headingColor.replace('#', ''),
              bold: true,
            })
          );
        }
    }
  }

  return textRuns;
}

/**
 * Convert a heading markdown element to a docx Paragraph
 */
export function createHeadingParagraph(
  element: MarkdownElement,
  theme: ThemeData
): Paragraph {
  const level = element.level || 1;
  const fontSize = getHeadingSize(level, theme);

  // Build children (TextRuns) from inline elements or plain content
  let children: TextRun[];

  if (element.inline && element.inline.length > 0) {
    children = convertInlineElements(element.inline, theme, fontSize);
  } else {
    // Plain text content
    children = [
      new TextRun({
        text: element.content,
        font: theme.headingFont,
        size: pointsToHalfPoints(fontSize),
        color: theme.headingColor.replace('#', ''),
        bold: true,
      }),
    ];
  }

  return new Paragraph({
    heading: getHeadingLevel(level),
    alignment: getAlignment(element.textAlign),
    spacing: {
      before: getMarginTop(level),
      after: pointsToDxa(8 * 0.75), // 8px margin bottom
    },
    children,
  });
}
