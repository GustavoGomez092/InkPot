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

/**
 * Check if a character is an emoji
 */
function isEmoji(char: string): boolean {
  const emojiRegex =
    /[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier}\p{Emoji_Modifier_Base}\p{Emoji_Component}]/u;
  return emojiRegex.test(char);
}

/**
 * Split text into segments of emoji and non-emoji characters
 */
function splitTextWithEmoji(text: string): Array<{ text: string; isEmoji: boolean }> {
  const segments: Array<{ text: string; isEmoji: boolean }> = [];
  let currentSegment = '';
  let currentIsEmoji = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charIsEmoji = isEmoji(char);

    if (i === 0) {
      currentSegment = char;
      currentIsEmoji = charIsEmoji;
    } else if (charIsEmoji === currentIsEmoji) {
      currentSegment += char;
    } else {
      segments.push({ text: currentSegment, isEmoji: currentIsEmoji });
      currentSegment = char;
      currentIsEmoji = charIsEmoji;
    }
  }

  if (currentSegment) {
    segments.push({ text: currentSegment, isEmoji: currentIsEmoji });
  }

  return segments;
}

interface InlineTextProps {
  elements: InlineElement[];
  theme: ThemeData;
  style?: PDFStyle;
}

/**
 * Get the bold variant of a font family
 */
function getBoldFont(fontFamily: string): string {
  if (fontFamily === 'Helvetica') return 'Helvetica-Bold';
  if (fontFamily === 'Times-Roman') return 'Times-Bold';
  if (fontFamily === 'Courier') return 'Courier-Bold';
  return fontFamily;
}

/**
 * Get the italic variant of a font family
 */
function getItalicFont(fontFamily: string): string {
  if (fontFamily === 'Helvetica') return 'Helvetica-Oblique';
  if (fontFamily === 'Times-Roman') return 'Times-Italic';
  if (fontFamily === 'Courier') return 'Courier-Oblique';
  return fontFamily;
}

/**
 * Render text with proper emoji font support
 * Splits text into emoji and non-emoji segments and renders each with appropriate font
 *
 * NOTE: React-PDF has issues with nested Text components and arrays of Text.
 * For now, we just return the plain text. Emoji font support is disabled.
 */
function renderTextWithEmoji(text: string, fontFamily: string, keyPrefix: string): React.ReactNode {
  // TODO: Fix emoji font rendering - React-PDF doesn't handle mixed fonts well
  // For now, just return the text as-is
  return text;
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
                {element.content}
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
                {element.content}
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
                {element.content}
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
                {element.content}
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
                {element.content}
              </Text>
            );

          case 'lineBreak':
            // Return just the newline character - it will be part of the parent Text
            return '\n';

          case 'text':
          default:
            return element.content;
        }
      })}
    </Text>
  );
};
