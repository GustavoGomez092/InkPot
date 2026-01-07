/**
 * Inline Text Component for React-PDF
 * Renders formatted inline text (bold, italic, code, links, etc.)
 */

import { Link, Text } from '@react-pdf/renderer';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import type React from 'react';
import type { InlineElement } from '../markdown-parser.js';
import { splitTextIntoSegments } from '../utils/emoji-utils.js';

// biome-ignore lint/suspicious/noExplicitAny: React-PDF Style type
type PDFStyle = any;

interface InlineTextProps {
  elements: InlineElement[];
  theme: ThemeData;
  style?: PDFStyle;
}

/**
 * Render text content with proper emoji segmentation
 *
 * Splits text into emoji and non-emoji segments to ensure React-PDF's
 * Font.registerEmojiSource() can properly detect and render emojis as images.
 * Each segment is rendered as a separate Text component, allowing React-PDF
 * to apply the appropriate font/image handling.
 *
 * @param content - The text content to render
 * @param style - Optional style to apply to each segment
 * @param keyPrefix - Prefix for React keys
 * @returns Array of Text components with properly segmented content
 */
function renderTextWithEmojiSupport(
  content: string,
  style: PDFStyle = {},
  keyPrefix: string
): React.ReactNode {
  const segments = splitTextIntoSegments(content);

  // If there's only one segment or no emojis, render directly for efficiency
  if (segments.length === 1) {
    return content;
  }

  // Render each segment as a separate Text component
  // React-PDF will automatically convert emoji segments to images
  return segments.map((segment, idx) => (
    <Text key={`${keyPrefix}-seg-${idx}`} style={style}>
      {segment.text}
    </Text>
  ));
}

/**
 * Render inline formatted text elements
 */
export const InlineText: React.FC<InlineTextProps> = ({ elements, theme, style = {} }) => {
  return (
    <Text style={style}>
      {elements.map((element, idx) => {
        const key = `${element.type}-${idx}-${element.content.slice(0, 10)}`;

        switch (element.type) {
          case 'bold':
            return (
              <Text
                key={key}
                style={{
                  fontWeight: 'bold',
                }}
              >
                {renderTextWithEmojiSupport(
                  element.content,
                  { fontWeight: 'bold' },
                  `${key}-bold`
                )}
              </Text>
            );

          case 'italic':
            return (
              <Text
                key={key}
                style={{
                  fontStyle: 'italic',
                }}
              >
                {renderTextWithEmojiSupport(
                  element.content,
                  { fontStyle: 'italic' },
                  `${key}-italic`
                )}
              </Text>
            );

          case 'code':
            return (
              <Text
                key={key}
                style={{
                  fontFamily: 'Courier',
                  backgroundColor: theme.codeBackground,
                  padding: 2,
                  borderRadius: 2,
                }}
              >
                {renderTextWithEmojiSupport(
                  element.content,
                  {
                    fontFamily: 'Courier',
                    backgroundColor: theme.codeBackground,
                    padding: 2,
                    borderRadius: 2,
                  },
                  `${key}-code`
                )}
              </Text>
            );

          case 'link':
            return (
              <Link
                key={key}
                src={element.href || '#'}
                style={{
                  color: theme.linkColor,
                  textDecoration: 'underline',
                }}
              >
                {renderTextWithEmojiSupport(
                  element.content,
                  {
                    color: theme.linkColor,
                    textDecoration: 'underline',
                  },
                  `${key}-link`
                )}
              </Link>
            );

          case 'strike':
            return (
              <Text
                key={key}
                style={{
                  textDecoration: 'line-through',
                }}
              >
                {renderTextWithEmojiSupport(
                  element.content,
                  { textDecoration: 'line-through' },
                  `${key}-strike`
                )}
              </Text>
            );

          case 'lineBreak':
            // Return just the newline character - it will be part of the parent Text
            return '\n';

          case 'text':
          default:
            return renderTextWithEmojiSupport(element.content, {}, `${key}-text`);
        }
      })}
    </Text>
  );
};
