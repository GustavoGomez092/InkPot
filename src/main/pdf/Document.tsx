/**
 * PDF Document Component
 * Main React-PDF document that renders markdown content with theme styling
 */

import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import React from 'react';
import { MarkdownElements } from './components/MarkdownElements.js';
import { parseMarkdown } from './markdown-parser.js';

/**
 * Generate PDF document element from markdown content with theme styling
 */
export function createPDFDocument(content: string, theme: ThemeData) {
  // Parse markdown to structured elements
  const elements = parseMarkdown(content);

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

  return React.createElement(
    Document,
    {
      title: 'InkForge Export',
      author: 'InkForge',
      subject: 'Markdown to PDF',
      creator: 'InkForge',
    },
    pages.map((pageElements, idx) => {
      const pageKey = `page-${idx}-${pageElements.length}`;

      return React.createElement(
        Page,
        {
          key: pageKey,
          size: {
            width: theme.pageWidth * 72, // Convert inches to points
            height: theme.pageHeight * 72,
          },
          style: {
            backgroundColor: theme.backgroundColor,
            paddingTop: theme.marginTop * 72,
            paddingBottom: theme.marginBottom * 72,
            paddingLeft: theme.marginLeft * 72,
            paddingRight: theme.marginRight * 72,
            fontFamily: theme.bodyFont,
            fontSize: theme.bodySize,
            color: theme.textColor,
          },
        },
        pageElements.length > 0
          ? React.createElement(MarkdownElements, {
              elements: pageElements,
              theme,
            })
          : React.createElement(EmptyPage)
      );
    })
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
