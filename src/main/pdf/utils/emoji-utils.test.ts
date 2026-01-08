/**
 * Unit tests for emoji-utils.ts
 *
 * Tests all emoji detection functionality including:
 * - Basic emojis
 * - Skin tone modifiers
 * - ZWJ sequences (compound emojis)
 * - Flag emojis
 * - Keycap sequences
 * - Variation selectors
 */

import { describe, it, expect } from 'vitest';
import {
  splitTextIntoSegments,
  isEmoji,
  hasEmoji,
  countEmojis,
  type TextSegment,
} from './emoji-utils';

describe('emoji-utils', () => {
  describe('isEmoji()', () => {
    describe('basic emojis', () => {
      it('should detect standard Unicode emojis', () => {
        expect(isEmoji('😀')).toBe(true);
        expect(isEmoji('😂')).toBe(true);
        expect(isEmoji('🎉')).toBe(true);
        expect(isEmoji('🔥')).toBe(true);
        expect(isEmoji('🚀')).toBe(true);
      });

      it('should detect emojis with variation selectors', () => {
        expect(isEmoji('❤️')).toBe(true); // Heart with VS-16
        expect(isEmoji('✅')).toBe(true); // Check mark with VS-16
        expect(isEmoji('⭐')).toBe(true); // Star with VS-16
      });

      it('should not detect plain text characters', () => {
        expect(isEmoji('a')).toBe(false);
        expect(isEmoji('Z')).toBe(false);
        expect(isEmoji('1')).toBe(false);
        expect(isEmoji(' ')).toBe(false);
        expect(isEmoji('!')).toBe(false);
      });

      it('should handle empty strings', () => {
        expect(isEmoji('')).toBe(false);
      });
    });

    describe('skin tone modifiers', () => {
      it('should detect emojis with Fitzpatrick scale modifiers', () => {
        expect(isEmoji('👍🏻')).toBe(true); // Light skin tone
        expect(isEmoji('👍🏼')).toBe(true); // Medium-light skin tone
        expect(isEmoji('👍🏽')).toBe(true); // Medium skin tone
        expect(isEmoji('👍🏾')).toBe(true); // Medium-dark skin tone
        expect(isEmoji('👍🏿')).toBe(true); // Dark skin tone
      });

      it('should detect various emoji types with skin tones', () => {
        expect(isEmoji('👋🏽')).toBe(true); // Waving hand
        expect(isEmoji('🤚🏾')).toBe(true); // Raised back of hand
        expect(isEmoji('✊🏿')).toBe(true); // Raised fist
      });
    });

    describe('ZWJ sequences', () => {
      it('should detect family emoji sequences', () => {
        expect(isEmoji('👨‍👩‍👧')).toBe(true); // Family: man, woman, girl
        expect(isEmoji('👨‍👩‍👧‍👦')).toBe(true); // Family: man, woman, girl, boy
        expect(isEmoji('👨‍👨‍👧')).toBe(true); // Family: man, man, girl
      });

      it('should detect profession emoji sequences', () => {
        expect(isEmoji('👨‍💻')).toBe(true); // Man technologist
        expect(isEmoji('👩‍⚕️')).toBe(true); // Woman health worker
        expect(isEmoji('👨‍🚀')).toBe(true); // Man astronaut
        expect(isEmoji('👩‍🎨')).toBe(true); // Woman artist
      });

      it('should detect gendered emoji sequences', () => {
        expect(isEmoji('🏃‍♂️')).toBe(true); // Man running
        expect(isEmoji('🏃‍♀️')).toBe(true); // Woman running
        expect(isEmoji('🧑‍🎤')).toBe(true); // Person singer
      });
    });

    describe('flag emojis', () => {
      it('should detect flag emojis (regional indicator pairs)', () => {
        expect(isEmoji('🇺🇸')).toBe(true); // United States
        expect(isEmoji('🇬🇧')).toBe(true); // United Kingdom
        expect(isEmoji('🇫🇷')).toBe(true); // France
        expect(isEmoji('🇩🇪')).toBe(true); // Germany
        expect(isEmoji('🇯🇵')).toBe(true); // Japan
        expect(isEmoji('🇨🇦')).toBe(true); // Canada
      });
    });

    describe('keycap sequences', () => {
      it('should detect number keycap emojis', () => {
        expect(isEmoji('1️⃣')).toBe(true);
        expect(isEmoji('2️⃣')).toBe(true);
        expect(isEmoji('5️⃣')).toBe(true);
        expect(isEmoji('9️⃣')).toBe(true);
        expect(isEmoji('0️⃣')).toBe(true);
      });

      it('should detect symbol keycap emojis', () => {
        expect(isEmoji('#️⃣')).toBe(true); // Hash keycap
        expect(isEmoji('*️⃣')).toBe(true); // Asterisk keycap
      });
    });
  });

  describe('splitTextIntoSegments()', () => {
    it('should return empty array for empty string', () => {
      const segments = splitTextIntoSegments('');
      expect(segments).toEqual([]);
    });

    it('should handle text with no emojis', () => {
      const segments = splitTextIntoSegments('Hello World');
      expect(segments).toEqual([
        { text: 'Hello World', isEmoji: false },
      ]);
    });

    it('should handle text with only emojis', () => {
      const segments = splitTextIntoSegments('😀😂🎉');
      expect(segments).toEqual([
        { text: '😀😂🎉', isEmoji: true },
      ]);
    });

    it('should segment basic emoji within text', () => {
      const segments = splitTextIntoSegments('Hello 😀 World');
      expect(segments).toHaveLength(3);
      expect(segments[0]).toEqual({ text: 'Hello ', isEmoji: false });
      expect(segments[1]).toEqual({ text: '😀', isEmoji: true });
      expect(segments[2]).toEqual({ text: ' World', isEmoji: false });
    });

    it('should segment emoji with variation selector', () => {
      const segments = splitTextIntoSegments('Heart ❤️ Symbol');
      expect(segments).toHaveLength(3);
      expect(segments[0]).toEqual({ text: 'Heart ', isEmoji: false });
      expect(segments[1]).toEqual({ text: '❤️', isEmoji: true });
      expect(segments[2]).toEqual({ text: ' Symbol', isEmoji: false });
    });

    it('should segment emoji with skin tone modifier', () => {
      const segments = splitTextIntoSegments('Thumbs up 👍🏽 Nice');
      expect(segments).toHaveLength(3);
      expect(segments[0]).toEqual({ text: 'Thumbs up ', isEmoji: false });
      expect(segments[1]).toEqual({ text: '👍🏽', isEmoji: true });
      expect(segments[2]).toEqual({ text: ' Nice', isEmoji: false });
    });

    it('should segment ZWJ sequences correctly', () => {
      const segments = splitTextIntoSegments('Family 👨‍👩‍👧 Photo');
      expect(segments).toHaveLength(3);
      expect(segments[0]).toEqual({ text: 'Family ', isEmoji: false });
      expect(segments[1]).toEqual({ text: '👨‍👩‍👧', isEmoji: true });
      expect(segments[2]).toEqual({ text: ' Photo', isEmoji: false });
    });

    it('should segment flag emojis correctly', () => {
      const segments = splitTextIntoSegments('USA 🇺🇸 Flag');
      expect(segments).toHaveLength(3);
      expect(segments[0]).toEqual({ text: 'USA ', isEmoji: false });
      expect(segments[1]).toEqual({ text: '🇺🇸', isEmoji: true });
      expect(segments[2]).toEqual({ text: ' Flag', isEmoji: false });
    });

    it('should segment keycap sequences correctly', () => {
      const segments = splitTextIntoSegments('Number 1️⃣ Key');
      expect(segments).toHaveLength(3);
      expect(segments[0]).toEqual({ text: 'Number ', isEmoji: false });
      expect(segments[1]).toEqual({ text: '1️⃣', isEmoji: true });
      expect(segments[2]).toEqual({ text: ' Key', isEmoji: false });
    });

    it('should handle multiple consecutive emojis', () => {
      const segments = splitTextIntoSegments('Test 😀😂🎉 End');
      expect(segments).toHaveLength(3);
      expect(segments[0]).toEqual({ text: 'Test ', isEmoji: false });
      expect(segments[1]).toEqual({ text: '😀😂🎉', isEmoji: true });
      expect(segments[2]).toEqual({ text: ' End', isEmoji: false });
    });

    it('should handle multiple separated emojis', () => {
      const segments = splitTextIntoSegments('Hello 👋 World 🌍 Test');
      expect(segments).toHaveLength(5);
      expect(segments[0]).toEqual({ text: 'Hello ', isEmoji: false });
      expect(segments[1]).toEqual({ text: '👋', isEmoji: true });
      expect(segments[2]).toEqual({ text: ' World ', isEmoji: false });
      expect(segments[3]).toEqual({ text: '🌍', isEmoji: true });
      expect(segments[4]).toEqual({ text: ' Test', isEmoji: false });
    });

    it('should handle emoji at start of text', () => {
      const segments = splitTextIntoSegments('😀 Hello');
      expect(segments).toHaveLength(2);
      expect(segments[0]).toEqual({ text: '😀', isEmoji: true });
      expect(segments[1]).toEqual({ text: ' Hello', isEmoji: false });
    });

    it('should handle emoji at end of text', () => {
      const segments = splitTextIntoSegments('Hello 😀');
      expect(segments).toHaveLength(2);
      expect(segments[0]).toEqual({ text: 'Hello ', isEmoji: false });
      expect(segments[1]).toEqual({ text: '😀', isEmoji: true });
    });

    it('should handle complex mixed content', () => {
      const segments = splitTextIntoSegments('Test 👋🏽 with 🇺🇸 and 1️⃣ emoji!');
      expect(segments).toHaveLength(7);
      expect(segments[0]).toEqual({ text: 'Test ', isEmoji: false });
      expect(segments[1]).toEqual({ text: '👋🏽', isEmoji: true });
      expect(segments[2]).toEqual({ text: ' with ', isEmoji: false });
      expect(segments[3]).toEqual({ text: '🇺🇸', isEmoji: true });
      expect(segments[4]).toEqual({ text: ' and ', isEmoji: false });
      expect(segments[5]).toEqual({ text: '1️⃣', isEmoji: true });
      expect(segments[6]).toEqual({ text: ' emoji!', isEmoji: false });
    });
  });

  describe('hasEmoji()', () => {
    it('should return false for empty string', () => {
      expect(hasEmoji('')).toBe(false);
    });

    it('should return false for text without emojis', () => {
      expect(hasEmoji('Hello World')).toBe(false);
      expect(hasEmoji('Just plain text')).toBe(false);
      expect(hasEmoji('Numbers 123 and symbols !@#')).toBe(false);
    });

    it('should return true for text with basic emojis', () => {
      expect(hasEmoji('Hello 😀')).toBe(true);
      expect(hasEmoji('😀 Hello')).toBe(true);
      expect(hasEmoji('Hello 😀 World')).toBe(true);
    });

    it('should return true for text with emoji variations', () => {
      expect(hasEmoji('Heart ❤️')).toBe(true);
      expect(hasEmoji('Thumbs 👍🏽')).toBe(true);
      expect(hasEmoji('Family 👨‍👩‍👧')).toBe(true);
      expect(hasEmoji('Flag 🇺🇸')).toBe(true);
      expect(hasEmoji('Number 1️⃣')).toBe(true);
    });

    it('should return true for emoji-only strings', () => {
      expect(hasEmoji('😀')).toBe(true);
      expect(hasEmoji('😀😂🎉')).toBe(true);
    });

    it('should handle long text efficiently', () => {
      const longText = 'This is a long text with an emoji 😀 somewhere in the middle and more text after it.';
      expect(hasEmoji(longText)).toBe(true);
    });
  });

  describe('countEmojis()', () => {
    it('should return 0 for empty string', () => {
      expect(countEmojis('')).toBe(0);
    });

    it('should return 0 for text without emojis', () => {
      expect(countEmojis('Hello World')).toBe(0);
      expect(countEmojis('No emojis here')).toBe(0);
    });

    it('should count single emoji', () => {
      expect(countEmojis('Hello 😀')).toBe(1);
      expect(countEmojis('😀 World')).toBe(1);
    });

    it('should count multiple separated emojis', () => {
      expect(countEmojis('Hello 👋 World 🌍')).toBe(2);
      expect(countEmojis('Test 😀 with 😂 multiple 🎉 emojis')).toBe(3);
    });

    it('should count multiple consecutive emojis', () => {
      expect(countEmojis('😀😂🎉')).toBe(3);
      expect(countEmojis('Emojis: 😀😂🎉🔥')).toBe(4);
    });

    it('should count emoji variations correctly', () => {
      expect(countEmojis('Heart ❤️')).toBe(1);
      expect(countEmojis('Thumbs 👍🏽')).toBe(1);
      expect(countEmojis('Family 👨‍👩‍👧')).toBe(1);
      expect(countEmojis('Flag 🇺🇸')).toBe(1);
      expect(countEmojis('Number 1️⃣')).toBe(1);
    });

    it('should count mixed emoji types', () => {
      expect(countEmojis('😀 ❤️ 👍🏽 👨‍👩‍👧 🇺🇸 1️⃣')).toBe(6);
    });

    it('should handle emoji at different positions', () => {
      expect(countEmojis('😀 Start')).toBe(1);
      expect(countEmojis('End 😀')).toBe(1);
      expect(countEmojis('😀 Both 😀')).toBe(2);
    });
  });

  describe('type safety', () => {
    it('should return correctly typed TextSegment array', () => {
      const segments: TextSegment[] = splitTextIntoSegments('Hello 😀');
      expect(segments[0].text).toBeDefined();
      expect(segments[0].isEmoji).toBeDefined();
      expect(typeof segments[0].text).toBe('string');
      expect(typeof segments[0].isEmoji).toBe('boolean');
    });
  });

  describe('edge cases', () => {
    it('should handle strings with only whitespace', () => {
      expect(hasEmoji('   ')).toBe(false);
      expect(countEmojis('   ')).toBe(0);
      expect(splitTextIntoSegments('   ')).toEqual([
        { text: '   ', isEmoji: false },
      ]);
    });

    it('should handle strings with special characters', () => {
      expect(hasEmoji('!@#$%^&*()')).toBe(false);
      expect(countEmojis('!@#$%^&*()')).toBe(0);
    });

    it('should handle newlines and tabs', () => {
      const text = 'Hello\n😀\tWorld';
      const segments = splitTextIntoSegments(text);
      expect(segments).toHaveLength(3);
      expect(segments[1]).toEqual({ text: '😀', isEmoji: true });
    });

    it('should handle very long strings', () => {
      const longText = 'a'.repeat(1000) + '😀' + 'b'.repeat(1000);
      expect(hasEmoji(longText)).toBe(true);
      expect(countEmojis(longText)).toBe(1);
    });

    it('should handle multiple emoji types in sequence', () => {
      const text = '😀👍🏽👨‍👩‍👧🇺🇸1️⃣';
      const segments = splitTextIntoSegments(text);
      expect(segments).toHaveLength(1);
      expect(segments[0].isEmoji).toBe(true);
      expect(countEmojis(text)).toBe(5);
    });
  });
});
