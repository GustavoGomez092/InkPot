/**
 * PDF Document Component
 * Main React-PDF document that renders markdown content with theme styling
 */

import { Document, Font, Page, Text, View } from '@react-pdf/renderer';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import React from 'react';
import { CoverPage } from './components/CoverPage.js';
import { MarkdownElements } from './components/MarkdownElements.js';
import { type MarkdownElement, parseMarkdown } from './markdown-parser.js';

// Register emoji support for PDFs using React-PDF's built-in emoji source
// This uses Apple emoji images from a CDN for consistent emoji rendering across all platforms
//
// CONFIGURATION NOTES:
// - format: 'png' is the only supported format (SVG not supported by PDF spec)
// - withVariationSelectors: true enables proper handling of emoji variation selectors (U+FE0F)
//   This is critical for Apple emoji source to correctly resolve emoji like ❤️, ✅, ⭐
// - cdn.jsdelivr.net is used for reliability and performance (cdnjs.cloudflare.com is also viable)
// - 64x64 resolution provides good quality while keeping file sizes reasonable
//
// PLATFORM CONSIDERATIONS:
// - Requires internet connection during PDF generation to fetch emoji images
// - Emoji appearance is consistent across macOS, Windows, and Linux (using Apple emoji set)
// - Works in both development and production builds
// - Compatible with Electron's PDF generation in sandboxed environments
//
// LICENSING NOTE:
// - Apple emoji images are NOT licensed for commercial redistribution
// - For commercial applications, consider switching to:
//   * Twemoji: https://cdn.jsdelivr.net/npm/@twemoji/api@latest/dist/72x72/ (CC-BY 4.0)
//   * Noto Emoji: https://cdn.jsdelivr.net/gh/googlefonts/noto-emoji@main/png/128/ (Apache 2.0)
// - Current configuration is acceptable for open-source/personal use
//
// FALLBACK OPTIONS:
// - No built-in fallback mechanism if CDN is unavailable
// - Emojis will fail to render if network is offline during PDF generation
// - For offline support, consider bundling emoji images locally (~50-100MB)
Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/',
  withVariationSelectors: true, // Critical for proper emoji rendering with Apple emoji source
});

// Register font fallbacks for PDF generation
// React-PDF has built-in support for these standard font families
// We map custom font names to these standard families to avoid fetch errors

// Map all custom fonts to built-in Helvetica (sans-serif)
const fontFamilyMap: Record<string, string> = {
  'Open Sans': 'Helvetica',
  Roboto: 'Helvetica',
  Montserrat: 'Helvetica',
  Merriweather: 'Times-Roman',
  'Playfair Display': 'Times-Roman',
  Lora: 'Times-Roman',
  Georgia: 'Times-Roman',
  'PT Serif': 'Times-Roman',
  'Source Code Pro': 'Courier',
  'Courier New': 'Courier',
};

/**
 * Get a safe font family name for PDF rendering
 * Maps custom font names to React-PDF built-in fonts
 */
function getSafeFontFamily(fontFamily: string): string {
  return fontFamilyMap[fontFamily] || 'Helvetica';
}

export interface CoverData {
  hasCoverPage: boolean;
  title?: string | null;
  subtitle?: string | null;
  author?: string | null;
  logoPath?: string | null;
  backgroundPath?: string | null;
}

/**
 * Simple hash function for diagram codes (matches renderer implementation)
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
 * Apply pre-rendered diagram file paths to mermaid diagram elements
 * Converts file paths to data URLs to avoid path encoding issues
 * @param elements Parsed markdown elements
 * @param mermaidDiagrams Map of diagram hash -> file path to PNG image
 */
async function applyMermaidSVGs(
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

          processedElements.push({
            ...element,
            diagram: dataUrl,
          });
          console.log('📊 Pushed mermaid element with PNG data URL');
        } catch (error) {
          console.error('❌ Failed to read diagram file:', error);
          // Push error placeholder
          processedElements.push({
            ...element,
            diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="100">
              <text x="10" y="50" fill="red">Failed to load diagram</text>
            </svg>`,
          });
        }
      } else {
        console.warn('⚠️ No pre-rendered image found for mermaid diagram');
        console.warn(`🔍 Available keys: ${Object.keys(mermaidDiagrams).length} total`);
        if (Object.keys(mermaidDiagrams).length > 0) {
          console.warn(
            '🔍 First available key (length ' + Object.keys(mermaidDiagrams)[0].length + '):',
            Object.keys(mermaidDiagrams)[0].substring(0, 50)
          );
        }
        // Keep original element
        processedElements.push({
          ...element,
          diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="100">
            <text x="10" y="50" fill="red">Failed to render diagram</text>
          </svg>`,
        });
      }
    } else {
      processedElements.push(element);
    }
  }

  return processedElements;
}

/**
 * Generate PDF document element from markdown content with theme styling
 */
export async function createPDFDocument(
  content: string,
  theme: ThemeData,
  projectDir?: string,
  coverData?: CoverData,
  mermaidDiagrams?: Record<string, string>
) {
  console.log('📄 PDF Document - Content contains mermaid:', content.includes('```mermaid'));
  console.log('📄 PDF Document - Content (first 500 chars):', content.substring(0, 500));

  // Parse markdown to structured elements
  let elements = parseMarkdown(content, projectDir);
  console.log('📄 PDF Document - Parsed elements:', elements.length, 'total');
  console.log(
    '📄 PDF Document - Mermaid elements found:',
    elements.filter((e) => e.type === 'mermaidDiagram').length
  );

  // Apply pre-rendered Mermaid SVGs (converts file paths to data URLs)
  elements = await applyMermaidSVGs(elements, mermaidDiagrams);

  // Split elements by page breaks
  const pages: (typeof elements)[] = [];
  let currentPage: typeof elements = [];

  for (const element of elements) {
    if (element.type === 'pageBreak') {
      // Start new page
      if (currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
      }
    } else {
      currentPage.push(element);
    }
  }

  // Add remaining content as last page
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  // If no content, add empty page
  if (pages.length === 0) {
    pages.push([]);
  }

  // Create a safe theme with built-in fonts to avoid fetch errors
  const safeTheme: ThemeData = {
    ...theme,
    bodyFont: getSafeFontFamily(theme.bodyFont),
    headingFont: getSafeFontFamily(theme.headingFont),
  };

  // Prepare pages array with cover page if enabled
  const allPages: React.ReactElement[] = [];

  // Add cover page if enabled
  if (coverData?.hasCoverPage) {
    allPages.push(
      React.createElement(CoverPage, {
        key: 'cover-page',
        title: coverData.title,
        subtitle: coverData.subtitle,
        author: coverData.author,
        logoPath: coverData.logoPath,
        backgroundPath: coverData.backgroundPath,
        theme: safeTheme,
      })
    );
  }

  // Add content pages
  allPages.push(
    ...pages.map((pageElements, idx) => {
      const pageKey = `page-${idx}-${pageElements.length}`;

      return React.createElement(
        Page,
        {
          key: pageKey,
          size: {
            width: safeTheme.pageWidth * 72, // Convert inches to points
            height: safeTheme.pageHeight * 72,
          },
          style: {
            backgroundColor: safeTheme.backgroundColor,
            paddingTop: safeTheme.marginTop * 72,
            paddingBottom: safeTheme.marginBottom * 72,
            paddingLeft: safeTheme.marginLeft * 72,
            paddingRight: safeTheme.marginRight * 72,
            fontFamily: safeTheme.bodyFont,
            fontSize: safeTheme.bodySize,
            color: safeTheme.textColor,
          },
        },
        pageElements.length > 0
          ? React.createElement(MarkdownElements, {
              elements: pageElements,
              theme: safeTheme,
            })
          : React.createElement(EmptyPage)
      );
    })
  );

  return React.createElement(
    Document,
    {
      title: 'InkPot Export',
      author: 'InkPot',
      subject: 'Markdown to PDF',
      creator: 'InkPot',
    },
    allPages
  );
}

/**
 * Empty page placeholder
 */
const EmptyPage: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 12, color: '#999999' }}>Empty page</Text>
    </View>
  );
};
