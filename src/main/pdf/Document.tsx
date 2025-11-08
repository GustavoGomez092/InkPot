/**
 * PDF Document Component
 * Main React-PDF document that renders markdown content with theme styling
 */

import { Document, Font, Page, Text, View } from '@react-pdf/renderer';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import React from 'react';
import { MarkdownElements } from './components/MarkdownElements.js';
import { parseMarkdown } from './markdown-parser.js';

// Register fonts for PDF generation
// Using system fonts that are commonly available
Font.register({
  family: 'Open Sans',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1x4gaVI.ttf',
      fontWeight: 'bold',
    },
    {
      src: 'https://fonts.gstatic.com/s/opensans/v40/memQYaGs126MiZpBA-UFUIcVXSCEkx2cmqvXlWq8tWZ0Pw86hd0Rk5hkaVc.ttf',
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
  ],
});

Font.register({
  family: 'Merriweather',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-fCZMdeX3rg.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/merriweather/v30/u-4n0qyriQwlOrhSvowK_l52xwNZVcf6lvg.ttf',
      fontWeight: 'bold',
    },
    {
      src: 'https://fonts.gstatic.com/s/merriweather/v30/u-4m0qyriQwlOrhSvowK_l5-eR7lXcf_hP3hPGWH.ttf',
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
  ],
});

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ.ttf',
      fontWeight: 'bold',
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu51xIIzIXKMny.ttf',
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
  ],
});

Font.register({
  family: 'Montserrat',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459WRhyyTh89Y.ttf',
      fontWeight: 'bold',
    },
    {
      src: 'https://fonts.gstatic.com/s/montserrat/v26/JTUFjIg1_i6t8kCHKm459Wx7xQYXK0vOoz6jq6R8aX9-p7K5ILg.ttf',
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
  ],
});

Font.register({
  family: 'Playfair Display',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/playfairdisplay/v36/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDQZNLo_U2r.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/playfairdisplay/v36/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKd3vXDQZNLo_U2r.ttf',
      fontWeight: 'bold',
    },
    {
      src: 'https://fonts.gstatic.com/s/playfairdisplay/v36/nuFRD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_qiTbtbK-F2rA0s.ttf',
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
  ],
});

Font.register({
  family: 'Lora',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/lora/v35/0QI6MX1D_JOuGQbT0gvTJPa787weuxJBkq0.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/lora/v35/0QI6MX1D_JOuGQbT0gvTJPa787z_uRJBkq0.ttf',
      fontWeight: 'bold',
    },
    {
      src: 'https://fonts.gstatic.com/s/lora/v35/0QI8MX1D_JOuMw_hLdO6T2wV9KnW-MoFkqh8ndeZzZ0.ttf',
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
  ],
});

Font.register({
  family: 'Source Code Pro',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/sourcecodepro/v23/HI_diYsKILxRpg3hIP6sJ7fM7PqPMcMnZFqUwX28DMyQtMRrTEcVpaKKxg.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/sourcecodepro/v23/HI_diYsKILxRpg3hIP6sJ7fM7PqPMcMnZFqUwX28DJyVtMRrTEcVpaKKxg.ttf',
      fontWeight: 'bold',
    },
  ],
});

Font.register({
  family: 'Courier New',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/courierprime/v9/u-450q2lgwslOqpF_6gQ8kELWwZjW-_-tvg.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/courierprime/v9/u-4k0q2lgwslOqpF_6gQ8kELY7pMf-fVqvHoJXw.ttf',
      fontWeight: 'bold',
    },
  ],
});

Font.register({
  family: 'Georgia',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/ebgaramond/v27/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-6_RUA4V-e6yHgQ.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/ebgaramond/v27/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-NfVUA4V-e6yHgQ.ttf',
      fontWeight: 'bold',
    },
  ],
});

Font.register({
  family: 'PT Serif',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/ptserif/v18/EJRVQgYoZZY2vCFuvAFWzr-_dSb_.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://fonts.gstatic.com/s/ptserif/v18/EJRSQgYoZZY2vCFuvAnt65qVXSr3pNNB.ttf',
      fontWeight: 'bold',
    },
    {
      src: 'https://fonts.gstatic.com/s/ptserif/v18/EJRTQgYoZZY2vCFuvAFT_r21VTz9pNNB4Q.ttf',
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
  ],
});

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
