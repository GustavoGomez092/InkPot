/**
 * Inline Text Component for React-PDF
 * Renders formatted inline text (bold, italic, code, links, etc.)
 *
 * Link Styling:
 * - All links (external, internal, TOC) use theme.linkColor
 * - Link underline controlled by theme.linkUnderline (defaults to true for accessibility)
 * - Default linkColor (#0066CC) provides 7.5:1 contrast ratio on white background
 * - Meets WCAG AA and AAA accessibility standards for color contrast
 * - Unresolved internal links maintain consistent styling for visual clarity
 */

import { Link, Text } from '@react-pdf/renderer';
import type { ThemeData } from '@shared/types/ipc-contracts.js';
import type React from 'react';
import type { InlineElement } from '../markdown-parser.js';
import { splitTextIntoSegments } from '../utils/emoji-utils.js';
import { resolveAnchorLink } from '../utils/anchor-utils.js';

// biome-ignore lint/suspicious/noExplicitAny: React-PDF Style type
type PDFStyle = any;

interface InlineTextProps {
  elements: InlineElement[];
  theme: ThemeData;
  style?: PDFStyle;
  validAnchorIds?: Set<string> | string[]; // For resolving internal links to heading anchors
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
export const InlineText: React.FC<InlineTextProps> = ({ elements, theme, style = {}, validAnchorIds }) => {
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

          case 'link': {
            // Handle internal links (starting with #) differently from external URLs
            if (element.isInternal && element.href) {
              // This is an internal link - try to resolve to a heading anchor
              if (validAnchorIds) {
                const resolvedAnchor = resolveAnchorLink(element.href, validAnchorIds);

                if (resolvedAnchor) {
                  // Successfully resolved - render as internal link with #anchorId
                  return (
                    <Link
                      key={key}
                      src={`#${resolvedAnchor}`}
                      style={{
                        color: theme.linkColor,
                        textDecoration: theme.linkUnderline ? 'underline' : 'none',
                      }}
                    >
                      {renderTextWithEmojiSupport(
                        element.content,
                        {
                          color: theme.linkColor,
                          textDecoration: theme.linkUnderline ? 'underline' : 'none',
                        },
                        `${key}-link-internal`
                      )}
                    </Link>
                  );
                }

                // Could not resolve anchor - render as plain text with warning
                console.warn(`Internal link could not be resolved: ${element.href}`);
                return (
                  <Text key={key} style={{ color: theme.linkColor, textDecoration: theme.linkUnderline ? 'underline' : 'none' }}>
                    {renderTextWithEmojiSupport(
                      element.content,
                      {
                        color: theme.linkColor,
                        textDecoration: theme.linkUnderline ? 'underline' : 'none',
                      },
                      `${key}-link-unresolved`
                    )}
                  </Text>
                );
              }

              // No anchor IDs available yet - render as plain text with warning
              console.warn(`Internal link cannot be resolved (no anchor context): ${element.href}`);
              return (
                <Text key={key} style={{ color: theme.linkColor, textDecoration: theme.linkUnderline ? 'underline' : 'none' }}>
                  {renderTextWithEmojiSupport(
                    element.content,
                    {
                      color: theme.linkColor,
                      textDecoration: theme.linkUnderline ? 'underline' : 'none',
                    },
                    `${key}-link-nocontext`
                  )}
                </Text>
              );
            }

            // External link - render as normal
            return (
              <Link
                key={key}
                src={element.href || '#'}
                style={{
                  color: theme.linkColor,
                  textDecoration: theme.linkUnderline ? 'underline' : 'none',
                }}
              >
                {renderTextWithEmojiSupport(
                  element.content,
                  {
                    color: theme.linkColor,
                    textDecoration: theme.linkUnderline ? 'underline' : 'none',
                  },
                  `${key}-link-external`
                )}
              </Link>
            );
          }

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