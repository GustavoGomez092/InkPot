/**
 * Mermaid Diagram Component for React-PDF
 * Renders Mermaid diagrams as PNG images in PDF documents
 * Note: Expects pre-rendered PNG data URL from browser
 * React-PDF's Image component does not support SVG data URIs
 */

import { Image, Text, View } from '@react-pdf/renderer';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import type React from 'react';

// biome-ignore lint/suspicious/noExplicitAny: React-PDF Style type
type PDFStyle = any;

interface MermaidDiagramProps {
  svgContent: string; // File path to PNG image or PNG data URL as fallback
  caption?: string;
  theme: ThemeData;
}

/**
 * Render a Mermaid diagram as a PNG image in the PDF
 * Now uses file paths to PNG images stored in project folder
 * This avoids browser memory limitations with large data URLs
 */
export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ svgContent, caption, theme }) => {
  const isDataUrl = svgContent?.startsWith('data:');
  const isFilePath = svgContent && !isDataUrl;

  console.log('📊 MermaidDiagram component - Content:', {
    length: svgContent?.length,
    isDataUrl,
    isFilePath,
    path: isFilePath ? svgContent : 'N/A',
  });

  // Validate content
  if (!svgContent || svgContent.trim().length === 0) {
    console.warn('⚠️ Empty content for mermaid diagram');
    return (
      <View style={styles.container}>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Invalid diagram data</Text>
          <Text style={styles.errorDetail}>Expected PNG file path or data URL</Text>
        </View>
        {caption && <Text style={styles.caption}>{caption}</Text>}
      </View>
    );
  }

  // React-PDF's Image component supports both file paths and data URLs
  // File paths are preferred to avoid memory issues with large diagrams
  return (
    <View style={styles.container} wrap={false}>
      <View style={styles.imageContainer}>
        <Image src={svgContent} style={styles.image} />
      </View>
      {caption && (
        <Text
          style={[
            styles.caption,
            { fontFamily: theme.bodyFont, fontSize: theme.bodySize - 2, color: theme.textColor },
          ]}
        >
          {caption}
        </Text>
      )}
    </View>
  );
};

const styles: Record<string, PDFStyle> = {
  container: {
    marginVertical: 12,
    marginHorizontal: 0,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  image: {
    width: '100%',
    objectFit: 'contain',
  },
  caption: {
    marginTop: 0,
    fontStyle: 'italic',
    textAlign: 'center',
    width: '100%',
  },
  errorBox: {
    padding: 12,
    backgroundColor: '#fee',
    border: '1px solid #c00',
    borderRadius: 4,
  },
  errorText: {
    color: '#c00',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
  },
  errorDetail: {
    color: '#666',
    fontSize: 10,
    fontFamily: 'Courier',
  },
};
