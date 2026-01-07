/**
 * Emoji Detection and Segmentation Utilities
 *
 * Provides robust emoji detection that handles all Unicode emoji types including:
 * - Basic emojis (😀, ❤️)
 * - Emoji with skin tone modifiers (👍🏽)
 * - ZWJ sequences (👨‍👩‍👧, 👨‍💻)
 * - Flag emojis (🇺🇸, 🇬🇧)
 * - Keycap sequences (1️⃣, #️⃣)
 * - Variation selectors (❤️ vs ❤)
 *
 * Uses Unicode properties and grapheme segmentation to correctly identify
 * emoji boundaries, ensuring compound emojis are treated as single units.
 */

/**
 * Text segment with emoji classification
 */
export interface TextSegment {
  /** The text content of this segment */
  text: string;
  /** Whether this segment is an emoji */
  isEmoji: boolean;
}

/**
 * Comprehensive emoji detection regex using Unicode properties
 *
 * This regex matches:
 * - \p{Emoji_Presentation}: Characters that have emoji presentation by default
 * - \p{Emoji}\uFE0F: Characters with emoji variation selector
 * - \p{Emoji_Modifier_Base}: Base characters that can be modified (e.g., hand gestures)
 * - \p{Emoji_Component}: Component characters used in sequences (skin tones, ZWJ, etc.)
 *
 * The regex is used per-grapheme to classify complete emoji sequences.
 */
const EMOJI_REGEX = /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Regional_Indicator}{2})/u;

/**
 * Additional pattern for keycap sequences (e.g., 1️⃣, #️⃣, *️⃣)
 * Format: base character + variation selector (optional) + combining enclosing keycap
 */
const KEYCAP_REGEX = /^[0-9#*]\uFE0F?\u20E3/;

/**
 * Pattern for flag emoji (two regional indicator symbols)
 * Each regional indicator is U+1F1E6 to U+1F1FF
 */
const FLAG_REGEX = /^[\u{1F1E6}-\u{1F1FF}]{2}/u;

/**
 * Check if a grapheme cluster is an emoji
 *
 * Uses multiple detection strategies to handle various emoji types:
 * 1. Keycap sequences (must be checked first due to specific pattern)
 * 2. Flag emojis (regional indicator pairs)
 * 3. General emoji using Unicode properties
 *
 * @param grapheme - A single grapheme cluster (may be multiple codepoints)
 * @returns true if the grapheme is an emoji
 */
export function isEmoji(grapheme: string): boolean {
  if (!grapheme || grapheme.length === 0) {
    return false;
  }

  // Check for keycap sequences (e.g., 1️⃣)
  if (KEYCAP_REGEX.test(grapheme)) {
    return true;
  }

  // Check for flag emojis (e.g., 🇺🇸)
  if (FLAG_REGEX.test(grapheme)) {
    return true;
  }

  // Check for general emoji using Unicode properties
  if (EMOJI_REGEX.test(grapheme)) {
    return true;
  }

  // Check if any character in the grapheme has emoji properties
  // This handles edge cases and compound sequences
  for (const char of grapheme) {
    const code = char.codePointAt(0);
    if (code !== undefined) {
      // Emoji ranges and special characters
      // Emoji modifiers: U+1F3FB to U+1F3FF (skin tones)
      if (code >= 0x1F3FB && code <= 0x1F3FF) {
        return true;
      }
      // Zero-width joiner (used in compound emojis like 👨‍👩‍👧)
      if (code === 0x200D) {
        return true;
      }
      // Variation Selector-16 (forces emoji presentation)
      if (code === 0xFE0F) {
        return true;
      }
      // Combining Enclosing Keycap
      if (code === 0x20E3) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Split text into segments of emoji and non-emoji content using grapheme segmentation
 *
 * This function uses the Intl.Segmenter API to properly segment text into grapheme
 * clusters (user-perceived characters), which correctly handles compound emojis like:
 * - ZWJ sequences: 👨‍👩‍👧 (family) - treated as single grapheme
 * - Skin tone modifiers: 👍🏽 - treated as single grapheme
 * - Flag emojis: 🇺🇸 (two regional indicators) - treated as single grapheme
 * - Keycap sequences: 1️⃣ - treated as single grapheme
 *
 * Each grapheme is then classified as emoji or non-emoji, and consecutive
 * segments of the same type are merged together for efficient rendering.
 *
 * Example:
 * ```
 * splitTextIntoSegments("Hello 👋 World 🌍!")
 * // Returns:
 * // [
 * //   { text: "Hello ", isEmoji: false },
 * //   { text: "👋", isEmoji: true },
 * //   { text: " World ", isEmoji: false },
 * //   { text: "🌍", isEmoji: true },
 * //   { text: "!", isEmoji: false }
 * // ]
 * ```
 *
 * @param text - The text to segment
 * @returns Array of text segments with emoji classification
 */
export function splitTextIntoSegments(text: string): TextSegment[] {
  if (!text || text.length === 0) {
    return [];
  }

  // Use Intl.Segmenter for proper grapheme cluster segmentation
  // This is a native JavaScript API available in Node.js 16+ and modern browsers
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  const graphemes = Array.from(segmenter.segment(text));

  const segments: TextSegment[] = [];
  let currentSegment = '';
  let currentIsEmoji = false;

  for (let i = 0; i < graphemes.length; i++) {
    const { segment: grapheme } = graphemes[i];
    const graphemeIsEmoji = isEmoji(grapheme);

    if (i === 0) {
      // First grapheme - start the first segment
      currentSegment = grapheme;
      currentIsEmoji = graphemeIsEmoji;
    } else if (graphemeIsEmoji === currentIsEmoji) {
      // Same type as current segment - append to it
      currentSegment += grapheme;
    } else {
      // Different type - push current segment and start a new one
      segments.push({ text: currentSegment, isEmoji: currentIsEmoji });
      currentSegment = grapheme;
      currentIsEmoji = graphemeIsEmoji;
    }
  }

  // Push the final segment
  if (currentSegment) {
    segments.push({ text: currentSegment, isEmoji: currentIsEmoji });
  }

  return segments;
}

/**
 * Count the total number of emojis in a text string
 *
 * Useful for performance monitoring and validation.
 *
 * @param text - The text to analyze
 * @returns The number of emoji graphemes found
 */
export function countEmojis(text: string): number {
  const segments = splitTextIntoSegments(text);
  return segments.filter(seg => seg.isEmoji).reduce((count, seg) => {
    // Each emoji segment may contain multiple emojis, count them
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    const emojiGraphemes = Array.from(segmenter.segment(seg.text));
    return count + emojiGraphemes.length;
  }, 0);
}

/**
 * Check if a text string contains any emojis
 *
 * More efficient than countEmojis() when you only need a boolean result.
 *
 * @param text - The text to check
 * @returns true if the text contains at least one emoji
 */
export function hasEmoji(text: string): boolean {
  if (!text || text.length === 0) {
    return false;
  }

  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });

  for (const { segment: grapheme } of segmenter.segment(text)) {
    if (isEmoji(grapheme)) {
      return true;
    }
  }

  return false;
}
