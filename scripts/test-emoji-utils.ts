/**
 * Quick test script for emoji-utils.ts
 * Verifies that emoji detection works for all required emoji types
 */

import { splitTextIntoSegments, isEmoji, hasEmoji, countEmojis } from '../src/main/pdf/utils/emoji-utils.js';

console.log('🧪 Testing Emoji Detection Utility\n');

// Test cases from acceptance criteria
const testCases = [
  { name: 'Basic emoji', text: 'Hello 😀 World', expected: 3 }, // "Hello ", "😀", " World"
  { name: 'Emoji with variation selector', text: 'Heart ❤️ Symbol', expected: 3 },
  { name: 'Skin tone modifier', text: 'Thumbs up 👍🏽 Nice', expected: 3 },
  { name: 'ZWJ sequence (family)', text: 'Family 👨‍👩‍👧 Photo', expected: 3 },
  { name: 'Flag emoji', text: 'USA 🇺🇸 Flag', expected: 3 },
  { name: 'Keycap sequence', text: 'Number 1️⃣ Key', expected: 3 },
  { name: 'Multiple consecutive emojis', text: '😀😂🎉', expected: 1 }, // All emojis, one segment
  { name: 'No emojis', text: 'Just plain text', expected: 1 },
  { name: 'Mixed formatting', text: 'Test 👋 with 🌍 emojis!', expected: 5 },
];

console.log('📊 Segment Tests:\n');
let passed = 0;
let failed = 0;

for (const test of testCases) {
  const segments = splitTextIntoSegments(test.text);
  const success = segments.length === test.expected;

  if (success) {
    console.log(`✅ ${test.name}`);
    passed++;
  } else {
    console.log(`❌ ${test.name} - Expected ${test.expected} segments, got ${segments.length}`);
    console.log(`   Segments:`, segments);
    failed++;
  }
}

console.log(`\n📈 Results: ${passed} passed, ${failed} failed\n`);

// Test individual emoji detection
console.log('🔍 Individual Emoji Tests:\n');

const emojiTests = [
  { emoji: '😀', name: 'Smiling face' },
  { emoji: '❤️', name: 'Red heart with VS' },
  { emoji: '👍🏽', name: 'Thumbs up with skin tone' },
  { emoji: '👨‍👩‍👧', name: 'Family ZWJ sequence' },
  { emoji: '🇺🇸', name: 'US flag' },
  { emoji: '1️⃣', name: 'Keycap 1' },
  { emoji: '#️⃣', name: 'Keycap hash' },
];

for (const test of emojiTests) {
  const result = isEmoji(test.emoji);
  console.log(`${result ? '✅' : '❌'} ${test.name}: "${test.emoji}" - isEmoji = ${result}`);
}

// Test hasEmoji and countEmojis
console.log('\n📊 Utility Functions:\n');

const utilTests = [
  { text: 'Hello 👋 World 🌍', expectedHas: true, expectedCount: 2 },
  { text: 'No emojis here', expectedHas: false, expectedCount: 0 },
  { text: '😀😂🎉', expectedHas: true, expectedCount: 3 },
];

for (const test of utilTests) {
  const has = hasEmoji(test.text);
  const count = countEmojis(test.text);
  const hasMatch = has === test.expectedHas;
  const countMatch = count === test.expectedCount;

  console.log(`${hasMatch && countMatch ? '✅' : '❌'} "${test.text}"`);
  console.log(`   hasEmoji: ${has} (expected ${test.expectedHas})`);
  console.log(`   countEmojis: ${count} (expected ${test.expectedCount})`);
}

console.log('\n✅ Emoji detection utility tests complete!\n');
