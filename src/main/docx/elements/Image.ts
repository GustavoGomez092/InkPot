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
 * Convert DXA units to points (20 DXA = 1 point)
 */
function dxaToPoints(dxa: number): number {
  return dxa / 20;
}

/**
 * Convert inches to DXA (twips) - 1 inch = 1440 DXA
 */
function inchesToDxa(inches: number): number {
  return Math.round(inches * 1440);
}

/**
 * Calculate the content width in DXA based on theme page settings
 * Content width = page width - left margin - right margin
 */
function calculateContentWidth(theme: ThemeData): number {
  const pageWidthInches = theme.pageWidth || 8.5; // Default US Letter
  const marginLeftInches = theme.marginLeft || 1;
  const marginRightInches = theme.marginRight || 1;
  const contentWidthInches = pageWidthInches - marginLeftInches - marginRightInches;
  return inchesToDxa(contentWidthInches);
}

/**
 * Calculate the content width in points based on theme page settings
 */
function calculateContentWidthPoints(theme: ThemeData): number {
  return dxaToPoints(calculateContentWidth(theme));
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
 * Default max height for images in points (approximately 9 inches)
 * This prevents images from spanning multiple pages
 */
const MAX_IMAGE_HEIGHT = 648;

/**
 * Read PNG dimensions from buffer
 * PNG header format: 8-byte signature, then IHDR chunk with width/height as 4-byte big-endian integers
 * Returns null if not a valid PNG or dimensions can't be read
 */
function getPngDimensions(buffer: Buffer): { width: number; height: number } | null {
  // Check PNG signature: 137 80 78 71 13 10 26 10
  const pngSignature = [137, 80, 78, 71, 13, 10, 26, 10];
  if (buffer.length < 24) return null;

  for (let i = 0; i < 8; i++) {
    if (buffer[i] !== pngSignature[i]) return null;
  }

  // IHDR chunk starts at byte 8
  // Bytes 8-11: chunk length
  // Bytes 12-15: chunk type (IHDR = 0x49484452)
  // Bytes 16-19: width (big-endian)
  // Bytes 20-23: height (big-endian)
  const chunkType = buffer.toString('ascii', 12, 16);
  if (chunkType !== 'IHDR') return null;

  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);

  return { width, height };
}

/**
 * Read JPEG dimensions from buffer
 * JPEG uses SOF0/SOF2 markers to store dimensions
 * Returns null if not a valid JPEG or dimensions can't be read
 */
function getJpegDimensions(buffer: Buffer): { width: number; height: number } | null {
  // Check JPEG signature: FFD8FF
  if (buffer.length < 3 || buffer[0] !== 0xFF || buffer[1] !== 0xD8 || buffer[2] !== 0xFF) {
    return null;
  }

  let offset = 2;
  while (offset < buffer.length - 8) {
    // Find marker
    if (buffer[offset] !== 0xFF) {
      offset++;
      continue;
    }

    const marker = buffer[offset + 1];

    // SOF0 (baseline) or SOF2 (progressive)
    if (marker === 0xC0 || marker === 0xC2) {
      // Skip marker and length (2 bytes each), precision (1 byte)
      // Height is at offset+5 (2 bytes big-endian)
      // Width is at offset+7 (2 bytes big-endian)
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return { width, height };
    }

    // Skip to next marker
    if (marker === 0xD8 || marker === 0xD9) {
      offset += 2;
    } else {
      const length = buffer.readUInt16BE(offset + 2);
      offset += 2 + length;
    }
  }

  return null;
}

/**
 * Get image dimensions from buffer, supporting PNG and JPEG
 */
function getImageDimensions(buffer: Buffer, imageType: 'png' | 'jpg' | 'gif' | 'bmp'): { width: number; height: number } | null {
  if (imageType === 'png') {
    return getPngDimensions(buffer);
  }
  if (imageType === 'jpg') {
    return getJpegDimensions(buffer);
  }
  // For GIF and BMP, we don't have parsers - return null to use defaults
  return null;
}

/**
 * Calculate scaled dimensions to fit within max bounds while preserving aspect ratio
 * Uses actual image dimensions if available, otherwise falls back to defaults
 * Wide images are allowed to span the full document content width
 */
function calculateDimensions(
  actualDimensions: { width: number; height: number } | null,
  theme: ThemeData,
  maxHeight: number = MAX_IMAGE_HEIGHT
): { width: number; height: number } {
  // Calculate max width from theme's page dimensions (full content width)
  const maxWidth = calculateContentWidthPoints(theme);

  // If we have actual dimensions, scale to fit within bounds while preserving aspect ratio
  if (actualDimensions && actualDimensions.width > 0 && actualDimensions.height > 0) {
    const { width: imgWidth, height: imgHeight } = actualDimensions;
    const aspectRatio = imgWidth / imgHeight;

    let width = imgWidth;
    let height = imgHeight;

    // Scale down if wider than max (full content width)
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }

    // Scale down if still taller than max
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return {
      width: Math.round(width),
      height: Math.round(height),
    };
  }

  // Default to a reasonable size that fits most documents
  // Use a more reasonable default aspect ratio (4:3)
  return {
    width: Math.round(maxWidth),
    height: Math.round(Math.min(maxWidth * 0.75, maxHeight)), // 4:3 aspect ratio
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

    // Get actual image dimensions for proper aspect ratio
    const actualDimensions = getImageDimensions(imageData, imageType);

    // Calculate scaled dimensions preserving aspect ratio
    // Wide images are allowed to span the full document content width
    const dimensions = calculateDimensions(actualDimensions, theme);

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
