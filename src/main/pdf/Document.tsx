/**
 * PDF Document Component
 * Main React-PDF document that renders markdown content with theme styling
 */

import { Document, Font, Page, Text, View } from '@react-pdf/renderer';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import React from 'react';
import { CoverPage } from './components/CoverPage.js';
import { MarkdownElements } from './components/MarkdownElements.js';
import { parseMarkdown } from './markdown-parser.js';

// Register emoji support for PDFs using React-PDF's built-in emoji source
// This uses Apple emoji images from a CDN for consistent emoji rendering across all platforms
Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/',
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
 * Generate PDF document element from markdown content with theme styling
 */
export function createPDFDocument(
  content: string,
  theme: ThemeData,
  projectDir?: string,
  coverData?: CoverData
) {
  // Parse markdown to structured elements
  const elements = parseMarkdown(content, projectDir);

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
