/**
 * Markdown Elements for React-PDF
 * Renders different markdown element types (headings, paragraphs, lists, code blocks, etc.)
 */

import { Image, Text, View } from '@react-pdf/renderer';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import type React from 'react';
import type { MarkdownElement } from '../markdown-parser.js';
import { parseInlineFormatting } from '../markdown-parser.js';
import { InlineText } from './InlineText.js';
import { MermaidDiagram } from './MermaidDiagram.js';

// biome-ignore lint/suspicious/noExplicitAny: React-PDF Style type
type PDFStyle = any;

interface MarkdownElementsProps {
  elements: MarkdownElement[];
  theme: ThemeData;
  validAnchorIds?: Set<string>; // For resolving internal links to headings
}

/**
 * Render markdown elements to React-PDF components
 */
export const MarkdownElements: React.FC<MarkdownElementsProps> = ({
  elements,
  theme,
  validAnchorIds,
}) => {
  return (
    <>
      {elements.map((element, idx) => {
        const key = `${element.type}-${idx}`;

        switch (element.type) {
          case 'heading':
            return (
              <HeadingElement
                key={key}
                element={element}
                theme={theme}
                validAnchorIds={validAnchorIds}
              />
            );

          case 'paragraph':
            return (
              <ParagraphElement
                key={key}
                element={element}
                theme={theme}
                validAnchorIds={validAnchorIds}
              />
            );

          case 'list':
            return (
              <ListElement
                key={key}
                element={element}
                theme={theme}
                validAnchorIds={validAnchorIds}
              />
            );

          case 'checklist':
            return (
              <ChecklistElement
                key={key}
                element={element}
                theme={theme}
                validAnchorIds={validAnchorIds}
              />
            );

          case 'codeBlock':
            return <CodeBlockElement key={key} element={element} theme={theme} />;

          case 'blockquote':
            return (
              <BlockquoteElement
                key={key}
                element={element}
                theme={theme}
                validAnchorIds={validAnchorIds}
              />
            );

          case 'horizontalRule':
            return <HorizontalRuleElement key={key} theme={theme} />;

          case 'image':
            return <ImageElement key={key} element={element} theme={theme} />;

          case 'table':
            return <TableElement key={key} element={element} theme={theme} />;

          case 'mermaidDiagram':
            console.log(
              '📊 Rendering mermaid diagram element, diagram length:',
              element.diagram?.length
            );
            return (
              <MermaidDiagram
                key={key}
                svgContent={element.diagram || ''}
                caption={element.caption}
                theme={theme}
              />
            );

          case 'pageBreak':
            // Page breaks are handled by PDF page generation
            return null;

          default:
            return null;
        }
      })}
    </>
  );
};

/**
 * Get the bold variant of a font family for headings
 *
 * Maps React-PDF built-in font families to their bold variants.
 * This is necessary because React-PDF requires explicit bold font names
 * rather than using fontWeight: 'bold' for these standard PDF fonts.
 *
 * @param fontFamily - The base font family name
 * @returns The bold variant font family name
 */
function getBoldFont(fontFamily: string): string {
  if (fontFamily === 'Helvetica') return 'Helvetica-Bold';
  if (fontFamily === 'Times-Roman') return 'Times-Bold';
  if (fontFamily === 'Courier') return 'Courier-Bold';
  return fontFamily;
}

// Heading component
const HeadingElement: React.FC<{
  element: MarkdownElement;
  theme: ThemeData;
  validAnchorIds?: Set<string>;
}> = ({ element, theme, validAnchorIds }) => {
  const level = element.level || 1;

  const sizes = {
    1: theme.h1Size,
    2: theme.h2Size,
    3: theme.h3Size,
    4: theme.h4Size,
    5: theme.h5Size,
    6: theme.h6Size,
  };

  const marginTop = {
    1: 24,
    2: 20,
    3: 16,
    4: 12,
    5: 10,
    6: 8,
  };

  const style: PDFStyle = {
    fontSize: sizes[level as keyof typeof sizes],
    fontFamily: getBoldFont(theme.headingFont),
    color: theme.headingColor,
    marginTop: marginTop[level as keyof typeof marginTop],
    marginBottom: 8,
    letterSpacing: theme.kerning,
    lineHeight: theme.leading,
    textAlign: element.textAlign || 'left',
  };

  return (
    <Text style={style} id={element.anchorId}>
      {element.inline ? (
        <InlineText
          elements={element.inline}
          theme={theme}
          style={style}
          validAnchorIds={validAnchorIds}
        />
      ) : (
        element.content
      )}
    </Text>
  );
};

// Paragraph component
const ParagraphElement: React.FC<{
  element: MarkdownElement;
  theme: ThemeData;
  validAnchorIds?: Set<string>;
}> = ({ element, theme, validAnchorIds }) => {
  const style: PDFStyle = {
    fontSize: theme.bodySize,
    fontFamily: theme.bodyFont,
    color: theme.textColor,
    marginBottom: 12,
    letterSpacing: theme.kerning,
    lineHeight: theme.leading,
    textAlign: element.textAlign || 'left',
  };

  return (
    <Text style={style}>
      {element.inline ? (
        <InlineText
          elements={element.inline}
          theme={theme}
          style={style}
          validAnchorIds={validAnchorIds}
        />
      ) : (
        element.content
      )}
    </Text>
  );
};

// List component
const ListElement: React.FC<{
  element: MarkdownElement;
  theme: ThemeData;
  validAnchorIds?: Set<string>;
}> = ({ element, theme, validAnchorIds }) => {
  const itemStyle: PDFStyle = {
    fontSize: theme.bodySize,
    fontFamily: theme.bodyFont,
    color: theme.textColor,
    letterSpacing: theme.kerning,
    lineHeight: 1.4,
    marginBottom: 4,
  };

  return (
    <View style={{ marginBottom: 16 }}>
      {element.items?.map((item, idx) => {
        // Parse inline formatting for each list item
        const inlineElements = parseInlineFormatting(item);
        const prefix = element.ordered ? String(idx + 1) + '. ' : '• ';

        // Get indent level for this item (default to 0 if not provided)
        const indentLevel = element.indentLevels?.[idx] || 0;
        // Apply progressive left padding (20px per level)
        const itemMarginLeft = indentLevel * 20;

        return (
          <Text
            key={`item-${idx}-${item.slice(0, 10)}`}
            style={{
              ...itemStyle,
              marginLeft: itemMarginLeft,
            }}
          >
            <Text style={itemStyle}>{prefix}</Text>
            <InlineText
              elements={inlineElements}
              theme={theme}
              style={itemStyle}
              validAnchorIds={validAnchorIds}
            />
          </Text>
        );
      })}
    </View>
  );
};

// Checklist component
const ChecklistElement: React.FC<{
  element: MarkdownElement;
  theme: ThemeData;
  validAnchorIds?: Set<string>;
}> = ({ element, theme, validAnchorIds }) => {
  const itemStyle: PDFStyle = {
    fontSize: theme.bodySize,
    fontFamily: theme.bodyFont,
    color: theme.textColor,
    letterSpacing: theme.kerning,
    lineHeight: 1.4,
    marginBottom: 4,
  };

  return (
    <View style={{ marginBottom: 16 }}>
      {element.items?.map((item, idx) => {
        const inlineElements = parseInlineFormatting(item);
        const isChecked = element.checked?.[idx] || false;
        // Use emojis for better PDF rendering
        const checkbox = isChecked ? '✅ ' : '⬜ ';

        return (
          <Text key={`checklist-${idx}-${item.slice(0, 10)}`} style={itemStyle}>
            <Text style={itemStyle}>{checkbox}</Text>
            <InlineText
              elements={inlineElements}
              theme={theme}
              style={itemStyle}
              validAnchorIds={validAnchorIds}
            />
          </Text>
        );
      })}
    </View>
  );
};

// Code block component
const CodeBlockElement: React.FC<{
  element: MarkdownElement;
  theme: ThemeData;
}> = ({ element, theme }) => {
  const containerStyle: PDFStyle = {
    backgroundColor: theme.codeBackground,
    padding: 12,
    marginBottom: 12,
    marginTop: 12,
    borderRadius: 4,
  };

  const textStyle: PDFStyle = {
    fontSize: theme.bodySize - 1,
    fontFamily: 'Courier',
    color: theme.textColor,
    lineHeight: 1.5,
  };

  // React-PDF requires explicit line-by-line rendering to preserve spaces
  // Split by newlines and render each line separately
  const lines = element.content.split('\n');

  return (
    <View style={containerStyle}>
      {lines.map((line, idx) => (
        <Text key={idx} style={textStyle}>
          {/* Replace leading spaces with non-breaking spaces to preserve indentation */}
          {line.replace(/^ +/, (spaces) => '\u00A0'.repeat(spaces.length))}
        </Text>
      ))}
    </View>
  );
};

// Blockquote component
const BlockquoteElement: React.FC<{
  element: MarkdownElement;
  theme: ThemeData;
  validAnchorIds?: Set<string>;
}> = ({ element, theme, validAnchorIds }) => {
  const style: PDFStyle = {
    fontSize: theme.bodySize,
    fontFamily: theme.bodyFont,
    color: theme.textColor,
    fontStyle: 'italic',
    marginBottom: 12,
    marginLeft: 20,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.headingColor,
    borderLeftStyle: 'solid',
    letterSpacing: theme.kerning,
    lineHeight: theme.leading,
  };

  return (
    <View style={style}>
      <Text>
        {element.inline ? (
          <InlineText elements={element.inline} theme={theme} validAnchorIds={validAnchorIds} />
        ) : (
          element.content
        )}
      </Text>
    </View>
  );
};

// Horizontal rule component
const HorizontalRuleElement: React.FC<{ theme: ThemeData }> = ({ theme }) => {
  const style: PDFStyle = {
    marginTop: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.textColor,
    borderBottomStyle: 'solid',
    opacity: 0.3,
  };

  return <View style={style} />;
};

// Image component
const ImageElement: React.FC<{
  element: MarkdownElement;
  theme: ThemeData;
}> = ({ element, theme }) => {
  if (!element.src) {
    console.warn('⚠️ Image element has no src');
    return null;
  }

  // For React-PDF, we need to provide the image source correctly
  // File paths with spaces can cause issues, so we need to use proper file:// URLs
  let imageSrc = element.src;

  // If it's a file system path (not a URL), convert to proper file:// URL
  // Note: In main process (PDF generation), file:// protocol is safe to use
  if (
    !imageSrc.startsWith('http://') &&
    !imageSrc.startsWith('https://') &&
    !imageSrc.startsWith('data:')
  ) {
    // Ensure it's an absolute path
    if (!imageSrc.startsWith('/')) {
      console.warn('⚠️ Image path is not absolute:', imageSrc);
    } else {
      // Convert to file:// URL - React-PDF handles file:// URLs
      // This is safe in main process context for PDF generation
      imageSrc = `file://${imageSrc}`;
    }
  }

  const containerStyle: PDFStyle = {
    marginTop: 12,
    marginBottom: 12,
    alignItems: 'center',
  };

  const imageStyle: PDFStyle = {
    maxWidth: '100%',
    maxHeight: 400,
    objectFit: 'contain',
  };

  try {
    return (
      <View style={containerStyle}>
        <Image src={imageSrc} style={imageStyle} />
        {element.alt && (
          <Text
            style={{
              fontSize: theme.bodySize - 2,
              color: theme.textColor,
              marginTop: 4,
              fontStyle: 'italic',
              opacity: 0.7,
            }}
          >
            {element.alt}
          </Text>
        )}
      </View>
    );
  } catch (error) {
    console.error('❌ Failed to render image:', element.src, error);
    return (
      <Text style={{ color: '#ff0000', fontSize: theme.bodySize }}>
        [Image failed to load: {element.alt || 'untitled'}]
      </Text>
    );
  }
};

// Table component
const TableElement: React.FC<{
  element: MarkdownElement;
  theme: ThemeData;
}> = ({ element, theme }) => {
  const { headers = [], rows = [] } = element;

  const tableStyle: PDFStyle = {
    marginTop: 12,
    marginBottom: 12,
    border: `1pt solid ${theme.textColor}`,
  };

  const headerRowStyle: PDFStyle = {
    flexDirection: 'row',
    backgroundColor: theme.codeBackground || '#f5f5f5',
    borderBottom: `1pt solid ${theme.textColor}`,
  };

  const dataRowStyle: PDFStyle = {
    flexDirection: 'row',
    borderBottom: `0.5pt solid ${theme.textColor}`,
  };

  const cellStyle: PDFStyle = {
    flex: 1,
    padding: 6,
    fontSize: theme.bodySize,
    fontFamily: theme.bodyFont,
    color: theme.textColor,
    borderRight: `0.5pt solid ${theme.textColor}`,
  };

  const headerCellStyle: PDFStyle = {
    ...cellStyle,
    fontFamily: getBoldFont(theme.bodyFont),
  };

  const lastCellStyle: PDFStyle = {
    ...cellStyle,
    borderRight: 'none',
  };

  return (
    <View style={tableStyle}>
      {/* Header Row */}
      {headers.length > 0 && (
        <View style={headerRowStyle}>
          {headers.map((header, idx) => {
            // Parse inline formatting for header cells to support emojis and formatting
            const inlineElements = parseInlineFormatting(header);
            return (
              <Text
                key={idx}
                style={
                  idx === headers.length - 1
                    ? { ...headerCellStyle, borderRight: 'none' }
                    : headerCellStyle
                }
              >
                <InlineText elements={inlineElements} theme={theme} style={headerCellStyle} />
              </Text>
            );
          })}
        </View>
      )}

      {/* Data Rows */}
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={dataRowStyle}>
          {row.map((cell, cellIdx) => {
            // Parse inline formatting for data cells to support emojis and formatting
            const inlineElements = parseInlineFormatting(cell);
            const isLastCell = cellIdx === row.length - 1;
            return (
              <Text key={cellIdx} style={isLastCell ? lastCellStyle : cellStyle}>
                <InlineText
                  elements={inlineElements}
                  theme={theme}
                  style={isLastCell ? lastCellStyle : cellStyle}
                />
              </Text>
            );
          })}
        </View>
      ))}
    </View>
  );
};