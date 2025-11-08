/**
 * Inline Text Component for React-PDF
 * Renders formatted inline text (bold, italic, code, links, etc.)
 */

import { Link, Text } from '@react-pdf/renderer';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import type React from 'react';
import type { InlineElement } from '../markdown-parser.js';

// biome-ignore lint/suspicious/noExplicitAny: React-PDF Style type
type PDFStyle = any;

interface InlineTextProps {
  elements: InlineElement[];
  theme: ThemeData;
  style?: PDFStyle;
}

/**
 * Render inline formatted text elements
 */
export const InlineText: React.FC<InlineTextProps> = ({ elements, theme, style = {} }) => {
  return (
    <>
      {elements.map((element, idx) => {
        const key = `${element.type}-${idx}-${element.content.slice(0, 10)}`;

        switch (element.type) {
          case 'bold':
            return (
              <Text key={key} style={{ ...style, fontWeight: 'bold' }}>
                {element.content}
              </Text>
            );

          case 'italic':
            return (
              <Text key={key} style={{ ...style, fontStyle: 'italic' }}>
                {element.content}
              </Text>
            );

          case 'code':
            return (
              <Text
                key={key}
                style={{
                  ...style,
                  fontFamily: 'Courier',
                  backgroundColor: theme.codeBackground,
                  padding: 2,
                  borderRadius: 2,
                }}
              >
                {element.content}
              </Text>
            );

          case 'link':
            return (
              <Link
                key={key}
                src={element.href || '#'}
                style={{
                  ...style,
                  color: theme.linkColor,
                  textDecoration: 'underline',
                }}
              >
                {element.content}
              </Link>
            );

          case 'strike':
            return (
              <Text key={key} style={{ ...style, textDecoration: 'line-through' }}>
                {element.content}
              </Text>
            );

          case 'text':
          default:
            return (
              <Text key={key} style={style}>
                {element.content}
              </Text>
            );
        }
      })}
    </>
  );
};
