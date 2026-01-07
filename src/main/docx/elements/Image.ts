/**
 * Image Element Converter for DOCX
 * Converts markdown image elements to Word document paragraphs with images
 */

import fs from 'node:fs';
import {
  AlignmentType,
  ImageRun,
  Paragraph,
  TextRun,
} from 'docx';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import type { MarkdownElement } from '../../pdf/markdown-parser.js';

/**
 * Convert points to half-points (used for font sizes in docx)
 * Font sizes in docx are specified in half-points (1 point = 2 half-points)
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
 * Extract base64 data from a data URL
 * Returns the buffer and detected image type
 */
function parseDataUrl(dataUrl: string): { buffer: Buffer; type: 'png' | 'jpg' | 'gif' | 'bmp' } | null {
  const match = dataUrl.match(/^data:image\/([^;]+);base64,(.+)$/);
  if (!match) {
    return null;
  }

  const mimeType = match[1].toLowerCase();
  const base64Data = match[2];

  // Map MIME type to docx image type
  let type: 'png' | 'jpg' | 'gif' | 'bmp';
  switch (mimeType) {
    case 'png':
      type = 'png';
      break;
    case 'jpeg':
    case 'jpg':
      type = 'jpg';
      break;
    case 'gif':
      type = 'gif';
      break;
    case 'bmp':
      type = 'bmp';
      break;
    default:
      // Default to png for unknown types
      type = 'png';
  }

  try {
    const buffer = Buffer.from(base64Data, 'base64');
    return { buffer, type };
  } catch {
    return null;
  }
}

/**
 * Get image type from file extension
 */
function getImageTypeFromPath(filePath: string): 'png' | 'jpg' | 'gif' | 'bmp' {
  const ext = filePath.toLowerCase().split('.').pop();
  switch (ext) {
    case 'png':
      return 'png';
    case 'jpg':
    case 'jpeg':
      return 'jpg';
    case 'gif':
      return 'gif';
    case 'bmp':
      return 'bmp';
    default:
      return 'png';
  }
}

/**
 * Default max width for images in points (approximately 6 inches at 72 DPI)
 * This keeps images within typical document margins
 */
const MAX_IMAGE_WIDTH = 432;

/**
 * Default max height for images in points
 */
const MAX_IMAGE_HEIGHT = 600;

/**
 * Calculate scaled dimensions to fit within max bounds while preserving aspect ratio
 * For now, we use sensible defaults since we can't easily get image dimensions
 * without additional dependencies
 */
function calculateDimensions(
  maxWidth: number = MAX_IMAGE_WIDTH,
  maxHeight: number = MAX_IMAGE_HEIGHT
): { width: number; height: number } {
  // Default to a reasonable size that fits most documents
  // Images will be scaled proportionally by Word if needed
  return {
    width: Math.min(maxWidth, MAX_IMAGE_WIDTH),
    height: Math.min(maxHeight, MAX_IMAGE_HEIGHT),
  };
}

/**
 * Convert an image markdown element to a docx Paragraph containing an ImageRun
 * Returns a Paragraph with the image, or a fallback text paragraph if the image cannot be loaded
 */
export function createImageParagraph(
  element: MarkdownElement,
  theme: ThemeData
): Paragraph {
  const imageSrc = element.src;

  // If no source, return a placeholder paragraph
  if (!imageSrc) {
    return createFallbackParagraph('[Image: no source provided]', element.alt, theme);
  }

  try {
    let imageData: Buffer;
    let imageType: 'png' | 'jpg' | 'gif' | 'bmp';

    // Handle different image source types
    if (imageSrc.startsWith('data:')) {
      // Base64 data URL
      const parsed = parseDataUrl(imageSrc);
      if (!parsed) {
        return createFallbackParagraph('[Image: invalid data URL]', element.alt, theme);
      }
      imageData = parsed.buffer;
      imageType = parsed.type;
    } else if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      // Remote URL - we can't load these synchronously in docx generation
      // Return a placeholder with the URL
      return createFallbackParagraph(`[Image: ${element.alt || 'external image'}]`, imageSrc, theme);
    } else {
      // Local file path
      const filePath = imageSrc.startsWith('file://') ? imageSrc.slice(7) : imageSrc;

      if (!fs.existsSync(filePath)) {
        return createFallbackParagraph('[Image not found]', element.alt || filePath, theme);
      }

      imageData = fs.readFileSync(filePath);
      imageType = getImageTypeFromPath(filePath);
    }

    // Calculate dimensions
    const dimensions = calculateDimensions();

    // Create the ImageRun
    const imageRun = new ImageRun({
      type: imageType,
      data: imageData,
      transformation: {
        width: dimensions.width,
        height: dimensions.height,
      },
    });

    // Build paragraph children
    const children: (ImageRun | TextRun)[] = [imageRun];

    // Add alt text as caption below the image if provided
    if (element.alt) {
      // Add line break and caption text
      children.push(
        new TextRun({ break: 1 }),
        new TextRun({
          text: element.alt,
          font: theme.bodyFont,
          size: pointsToHalfPoints(theme.bodySize - 2),
          color: theme.textColor.replace('#', ''),
          italics: true,
        })
      );
    }

    return new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: {
        before: pointsToDxa(12 * 0.75),
        after: pointsToDxa(12 * 0.75),
      },
      children,
    });
  } catch (error) {
    // If anything fails, return a fallback paragraph
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return createFallbackParagraph(`[Image failed to load: ${errorMessage}]`, element.alt, theme);
  }
}

/**
 * Create a fallback paragraph when an image cannot be loaded
 */
function createFallbackParagraph(
  message: string,
  altText: string | undefined,
  theme: ThemeData
): Paragraph {
  const children: TextRun[] = [
    new TextRun({
      text: message,
      font: theme.bodyFont,
      size: pointsToHalfPoints(theme.bodySize),
      color: theme.textColor.replace('#', ''),
      italics: true,
    }),
  ];

  // Add alt text if different from message
  if (altText && altText !== message) {
    children.push(
      new TextRun({ break: 1 }),
      new TextRun({
        text: altText,
        font: theme.bodyFont,
        size: pointsToHalfPoints(theme.bodySize - 2),
        color: theme.textColor.replace('#', ''),
        italics: true,
      })
    );
  }

  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: {
      before: pointsToDxa(12 * 0.75),
      after: pointsToDxa(12 * 0.75),
    },
    children,
  });
}
