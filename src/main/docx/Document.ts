/**
 * DOCX Document Builder
 * Main module that converts markdown content to Word document using docx library
 * Following the pattern from src/main/pdf/Document.tsx
 */

import {
  Document,
  Packer,
  PageBreak,
  Paragraph,
  Table,
  TextRun,
} from 'docx';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import { type MarkdownElement, parseMarkdown, parseInlineFormatting } from '../pdf/markdown-parser.js';
import {
  createHeadingParagraph,
  createParagraphElement,
  createListParagraphs,
  createCodeBlockParagraphs,
  createTableElement,
  createImageParagraph,
  createBlockquoteElement,
  createHorizontalRuleElement,
} from './elements/index.js';

/**
 * Map custom font names to standard Word-compatible fonts
 * Similar to PDF font mapping but using fonts commonly available in Word
 *
 * Sans-serif fonts map to Arial (universal) or Aptos (modern)
 * Serif fonts map to Times New Roman (universal) or Cambria (modern)
 * Monospace fonts map to Courier New
 */
const fontFamilyMap: Record<string, string> = {
  // Sans-serif fonts → Arial (universally available in Word)
  'Open Sans': 'Arial',
  'Roboto': 'Arial',
  'Montserrat': 'Arial',
  'Inter': 'Arial',
  'Lato': 'Arial',
  'Source Sans Pro': 'Arial',
  'Nunito': 'Arial',
  'Poppins': 'Arial',
  'Raleway': 'Arial',
  'Work Sans': 'Arial',
  'IBM Plex Sans': 'Arial',
  'DM Sans': 'Arial',
  'Helvetica': 'Arial',
  // Serif fonts → Times New Roman (universally available in Word)
  'Merriweather': 'Times New Roman',
  'Playfair Display': 'Times New Roman',
  'Lora': 'Times New Roman',
  'Georgia': 'Georgia', // Georgia is available in Word
  'PT Serif': 'Times New Roman',
  'Libre Baskerville': 'Times New Roman',
  'EB Garamond': 'Times New Roman',
  'Crimson Text': 'Times New Roman',
  'Noto Serif': 'Times New Roman',
  'Source Serif Pro': 'Times New Roman',
  'Times-Roman': 'Times New Roman',
  // Monospace fonts → Courier New (universally available)
  'Source Code Pro': 'Courier New',
  'JetBrains Mono': 'Courier New',
  'Fira Code': 'Courier New',
  'IBM Plex Mono': 'Courier New',
  'Courier': 'Courier New',
};

/**
 * Get a safe font family name for Word rendering
 * Maps custom font names to fonts commonly available in Microsoft Word
 * Defaults to Arial (sans-serif) if font is not in the mapping
 */
function getSafeFontFamily(fontFamily: string): string {
  return fontFamilyMap[fontFamily] || 'Arial';
}

/**
 * Simple hash function for diagram codes (matches PDF Document implementation)
 */
function hashDiagramCode(code: string): string {
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    const char = code.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `diagram-${Math.abs(hash).toString(36)}`;
}

/**
 * Convert points to half-points (used for font sizes in docx)
 */
function pointsToHalfPoints(points: number): number {
  return Math.round(points * 2);
}

/**
 * Convert points to DXA units (20 DXA = 1 point)
 */
function pointsToDxa(points: number): number {
  return Math.round(points * 20);
}

/**
 * Apply pre-rendered diagram file paths to mermaid diagram elements
 * Converts file paths to data URLs for embedding in Word document
 * @param elements Parsed markdown elements
 * @param mermaidDiagrams Map of diagram hash -> file path to PNG image
 */
async function applyMermaidImages(
  elements: MarkdownElement[],
  mermaidDiagrams?: Record<string, string>
): Promise<MarkdownElement[]> {
  if (!mermaidDiagrams) {
    console.warn('⚠️ No pre-rendered mermaid diagrams provided');
    return elements;
  }

  console.log('📊 Available diagram hashes:', Object.keys(mermaidDiagrams));

  const processedElements: MarkdownElement[] = [];

  for (const element of elements) {
    if (element.type === 'mermaidDiagram' && element.diagram) {
      // Hash the diagram code to match the key from renderer
      const diagramHash = hashDiagramCode(element.diagram);
      console.log(
        `🔍 Looking up diagram with hash: ${diagramHash} (code length ${element.diagram.length})`
      );
      const imagePath = mermaidDiagrams[diagramHash];
      if (imagePath) {
        console.log('✅ Using pre-rendered diagram from file:', imagePath);

        // Read PNG and embed as data URL
        try {
          const fs = await import('fs/promises');
          const pngBuffer = await fs.readFile(imagePath);
          const base64 = pngBuffer.toString('base64');
          const dataUrl = `data:image/png;base64,${base64}`;

          console.log(`📊 Converted diagram to PNG data URL (${dataUrl.length} bytes)`);

          // Convert mermaid diagram to image element for rendering
          processedElements.push({
            type: 'image',
            src: dataUrl,
            alt: element.caption || 'Mermaid diagram',
            content: '',
          });
          console.log('📊 Pushed mermaid element as image with PNG data URL');
        } catch (error) {
          console.error('❌ Failed to read diagram file:', error);
          // Push error placeholder as paragraph
          processedElements.push({
            type: 'paragraph',
            content: '[Failed to load diagram]',
            inline: [{ type: 'text', content: '[Failed to load diagram]' }],
          });
        }
      } else {
        console.warn('⚠️ No pre-rendered image found for mermaid diagram');
        console.warn(`🔍 Available keys: ${Object.keys(mermaidDiagrams).length} total`);
        // Push placeholder paragraph
        processedElements.push({
          type: 'paragraph',
          content: '[Diagram could not be rendered]',
          inline: [{ type: 'text', content: '[Diagram could not be rendered]' }],
        });
      }
    } else {
      processedElements.push(element);
    }
  }

  return processedElements;
}

/**
 * Create a checklist item paragraph for DOCX
 * Handles checkbox rendering with emojis like the PDF version
 */
function createChecklistParagraphs(
  element: MarkdownElement,
  theme: ThemeData
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  if (!element.items) {
    return paragraphs;
  }

  for (let idx = 0; idx < element.items.length; idx++) {
    const item = element.items[idx];
    const isChecked = element.checked?.[idx] || false;
    // Use emojis for checkbox (matches PDF implementation)
    const checkbox = isChecked ? '✅ ' : '⬜ ';

    const inlineElements = parseInlineFormatting(item);
    const textRuns: TextRun[] = [];

    // Add checkbox
    textRuns.push(
      new TextRun({
        text: checkbox,
        font: theme.bodyFont,
        size: pointsToHalfPoints(theme.bodySize),
      })
    );

    // Add inline elements
    for (const inlineEl of inlineElements) {
      switch (inlineEl.type) {
        case 'text':
          textRuns.push(
            new TextRun({
              text: inlineEl.content,
              font: theme.bodyFont,
              size: pointsToHalfPoints(theme.bodySize),
              color: theme.textColor.replace('#', ''),
            })
          );
          break;

        case 'bold':
          textRuns.push(
            new TextRun({
              text: inlineEl.content,
              font: theme.bodyFont,
              size: pointsToHalfPoints(theme.bodySize),
              color: theme.textColor.replace('#', ''),
              bold: true,
            })
          );
          break;

        case 'italic':
          textRuns.push(
            new TextRun({
              text: inlineEl.content,
              font: theme.bodyFont,
              size: pointsToHalfPoints(theme.bodySize),
              color: theme.textColor.replace('#', ''),
              italics: true,
            })
          );
          break;

        case 'code':
          textRuns.push(
            new TextRun({
              text: inlineEl.content,
              font: 'Courier New',
              size: pointsToHalfPoints(theme.bodySize - 1),
              color: theme.textColor.replace('#', ''),
            })
          );
          break;

        case 'link':
          textRuns.push(
            new TextRun({
              text: inlineEl.content,
              font: theme.bodyFont,
              size: pointsToHalfPoints(theme.bodySize),
              color: theme.linkColor.replace('#', ''),
              underline: {},
            })
          );
          break;

        case 'strike':
          textRuns.push(
            new TextRun({
              text: inlineEl.content,
              font: theme.bodyFont,
              size: pointsToHalfPoints(theme.bodySize),
              color: theme.textColor.replace('#', ''),
              strike: true,
            })
          );
          break;

        case 'lineBreak':
          textRuns.push(new TextRun({ break: 1 }));
          break;

        default:
          if (inlineEl.content) {
            textRuns.push(
              new TextRun({
                text: inlineEl.content,
                font: theme.bodyFont,
                size: pointsToHalfPoints(theme.bodySize),
                color: theme.textColor.replace('#', ''),
              })
            );
          }
      }
    }

    paragraphs.push(
      new Paragraph({
        spacing: {
          before: pointsToDxa(2),
          after: pointsToDxa(2),
        },
        indent: {
          left: pointsToDxa(15),
        },
        children: textRuns,
      })
    );
  }

  return paragraphs;
}

/**
 * Convert a single markdown element to docx document elements
 * Returns an array since some elements (like lists, code blocks) produce multiple paragraphs
 */
function convertElement(
  element: MarkdownElement,
  theme: ThemeData
): (Paragraph | Table)[] {
  switch (element.type) {
    case 'heading':
      return [createHeadingParagraph(element, theme)];

    case 'paragraph':
      return [createParagraphElement(element, theme)];

    case 'list':
      return createListParagraphs(element, theme);

    case 'checklist':
      return createChecklistParagraphs(element, theme);

    case 'codeBlock':
      return createCodeBlockParagraphs(element, theme);

    case 'blockquote':
      return [createBlockquoteElement(element, theme)];

    case 'horizontalRule':
      return [createHorizontalRuleElement(theme)];

    case 'image':
      return [createImageParagraph(element, theme)];

    case 'table':
      return [createTableElement(element, theme)];

    case 'pageBreak':
      // Use PageBreak run inside a paragraph for proper page break
      // This ensures the break is rendered correctly in Word
      return [
        new Paragraph({
          children: [new PageBreak()],
        }),
      ];

    case 'mermaidDiagram':
      // This should be handled by applyMermaidImages before reaching here
      // But if it gets here without being converted, show a placeholder
      return [
        new Paragraph({
          children: [
            new TextRun({
              text: '[Diagram could not be rendered]',
              font: theme.bodyFont,
              size: pointsToHalfPoints(theme.bodySize),
              color: theme.textColor.replace('#', ''),
              italics: true,
            }),
          ],
          spacing: {
            before: pointsToDxa(8),
            after: pointsToDxa(8),
          },
        }),
      ];

    default:
      // Unknown element type - render as paragraph if it has content
      if (element.content) {
        return [
          new Paragraph({
            children: [
              new TextRun({
                text: element.content,
                font: theme.bodyFont,
                size: pointsToHalfPoints(theme.bodySize),
                color: theme.textColor.replace('#', ''),
              }),
            ],
          }),
        ];
      }
      return [];
  }
}

/**
 * Convert inches to twips (Word's unit of measurement)
 * 1 inch = 1440 twips
 */
function inchesToTwips(inches: number): number {
  return Math.round(inches * 1440);
}

/**
 * Generate Word document from markdown content with theme styling
 * @param content Markdown content to convert
 * @param theme Theme data for styling
 * @param projectDir Optional project directory for resolving relative image paths
 * @param mermaidDiagrams Optional map of diagram hash -> file path for pre-rendered diagrams
 * @returns Promise that resolves to a Buffer containing the .docx file
 */
export async function createDocxDocument(
  content: string,
  theme: ThemeData,
  projectDir?: string,
  mermaidDiagrams?: Record<string, string>
): Promise<Buffer> {
  console.log('📄 DOCX Document - Content contains mermaid:', content.includes('```mermaid'));
  console.log('📄 DOCX Document - Content (first 500 chars):', content.substring(0, 500));

  // Create a safe theme with Word-compatible fonts
  // This ensures consistent rendering across different systems
  const safeTheme: ThemeData = {
    ...theme,
    bodyFont: getSafeFontFamily(theme.bodyFont),
    headingFont: getSafeFontFamily(theme.headingFont),
  };

  console.log('📄 DOCX Document - Font mapping:', {
    originalBody: theme.bodyFont,
    safeBody: safeTheme.bodyFont,
    originalHeading: theme.headingFont,
    safeHeading: safeTheme.headingFont,
  });

  // Parse markdown to structured elements
  let elements = parseMarkdown(content, projectDir);
  console.log('📄 DOCX Document - Parsed elements:', elements.length, 'total');
  console.log(
    '📄 DOCX Document - Mermaid elements found:',
    elements.filter((e) => e.type === 'mermaidDiagram').length
  );

  // Apply pre-rendered Mermaid images
  elements = await applyMermaidImages(elements, mermaidDiagrams);

  // Convert all elements to docx paragraphs/tables using safe theme
  const documentChildren: (Paragraph | Table)[] = [];

  for (const element of elements) {
    const converted = convertElement(element, safeTheme);
    documentChildren.push(...converted);
  }

  // If no content, add an empty paragraph placeholder
  if (documentChildren.length === 0) {
    documentChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Empty document',
            font: safeTheme.bodyFont,
            size: pointsToHalfPoints(safeTheme.bodySize),
            color: '999999',
            italics: true,
          }),
        ],
      })
    );
  }

  // Create the document with theme-based page settings
  const doc = new Document({
    title: 'InkPot Export',
    creator: 'InkPot',
    description: 'Markdown to Word document',
    sections: [
      {
        properties: {
          page: {
            size: {
              width: inchesToTwips(theme.pageWidth),
              height: inchesToTwips(theme.pageHeight),
            },
            margin: {
              top: inchesToTwips(theme.marginTop),
              bottom: inchesToTwips(theme.marginBottom),
              left: inchesToTwips(theme.marginLeft),
              right: inchesToTwips(theme.marginRight),
            },
          },
        },
        children: documentChildren,
      },
    ],
  });

  // Generate the document buffer
  const buffer = await Packer.toBuffer(doc);
  console.log('✅ DOCX document generated successfully');

  return Buffer.from(buffer);
}

/**
 * Export types for use by other modules
 */
export type { MarkdownElement };
