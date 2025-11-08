/**
 * Markdown Elements for React-PDF
 * Renders different markdown element types (headings, paragraphs, lists, code blocks, etc.)
 */

import { Text, View } from '@react-pdf/renderer';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import type React from 'react';
import type { MarkdownElement } from '../markdown-parser.js';
import { InlineText } from './InlineText.js';

// biome-ignore lint/suspicious/noExplicitAny: React-PDF Style type
type PDFStyle = any;

interface MarkdownElementsProps {
  elements: MarkdownElement[];
  theme: ThemeData;
}

/**
 * Render markdown elements to React-PDF components
 */
export const MarkdownElements: React.FC<MarkdownElementsProps> = ({ elements, theme }) => {
  return (
    <>
      {elements.map((element, idx) => {
        const key = `${element.type}-${idx}`;

        switch (element.type) {
          case 'heading':
            return <HeadingElement key={key} element={element} theme={theme} />;

          case 'paragraph':
            return <ParagraphElement key={key} element={element} theme={theme} />;

          case 'list':
            return <ListElement key={key} element={element} theme={theme} />;

          case 'codeBlock':
            return <CodeBlockElement key={key} element={element} theme={theme} />;

          case 'blockquote':
            return <BlockquoteElement key={key} element={element} theme={theme} />;

          case 'horizontalRule':
            return <HorizontalRuleElement key={key} theme={theme} />;

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

// Heading component
const HeadingElement: React.FC<{
  element: MarkdownElement;
  theme: ThemeData;
}> = ({ element, theme }) => {
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
    fontFamily: theme.headingFont,
    color: theme.headingColor,
    fontWeight: 'bold',
    marginTop: marginTop[level as keyof typeof marginTop],
    marginBottom: 8,
    letterSpacing: theme.kerning,
    lineHeight: theme.leading,
  };

  return (
    <Text style={style}>
      {element.inline ? (
        <InlineText elements={element.inline} theme={theme} style={style} />
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
}> = ({ element, theme }) => {
  const style: PDFStyle = {
    fontSize: theme.bodySize,
    fontFamily: theme.bodyFont,
    color: theme.textColor,
    marginBottom: 12,
    letterSpacing: theme.kerning,
    lineHeight: theme.leading,
  };

  return (
    <Text style={style}>
      {element.inline ? (
        <InlineText elements={element.inline} theme={theme} style={style} />
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
}> = ({ element, theme }) => {
  const itemStyle: PDFStyle = {
    fontSize: theme.bodySize,
    fontFamily: theme.bodyFont,
    color: theme.textColor,
    marginBottom: 4,
    marginLeft: 20,
    letterSpacing: theme.kerning,
    lineHeight: theme.leading,
  };

  return (
    <View style={{ marginBottom: 12 }}>
      {element.items?.map((item, idx) => (
        <Text key={`item-${idx}-${item.slice(0, 10)}`} style={itemStyle}>
          {element.ordered ? `${idx + 1}. ` : '• '}
          {item}
        </Text>
      ))}
    </View>
  );
};

// Code block component
const CodeBlockElement: React.FC<{
  element: MarkdownElement;
  theme: ThemeData;
}> = ({ element, theme }) => {
  const style: PDFStyle = {
    fontSize: theme.bodySize - 1,
    fontFamily: 'Courier',
    color: theme.textColor,
    backgroundColor: theme.codeBackground,
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
    lineHeight: 1.4,
  };

  return <Text style={style}>{element.content}</Text>;
};

// Blockquote component
const BlockquoteElement: React.FC<{
  element: MarkdownElement;
  theme: ThemeData;
}> = ({ element, theme }) => {
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
        {element.inline ? <InlineText elements={element.inline} theme={theme} /> : element.content}
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
