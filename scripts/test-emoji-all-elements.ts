/**
 * Test Script: Emoji Rendering in All Markdown Elements
 *
 * Verifies that emojis render correctly in:
 * - H1-H6 headings
 * - List items (ordered and unordered)
 * - Blockquotes
 * - Table cells (headers and data)
 * - Paragraphs (baseline)
 *
 * This test addresses subtask 3.3 acceptance criteria
 */

import { Document, Page, StyleSheet, pdf } from '@react-pdf/renderer';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { MarkdownElements } from '../src/main/pdf/components/MarkdownElements.js';
import type { MarkdownElement } from '../src/main/pdf/markdown-parser.js';
import { parseInlineFormatting } from '../src/main/pdf/markdown-parser.js';

// Register emoji source (same as in Document.tsx)
import { Font } from '@react-pdf/renderer';
Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/',
  withVariationSelectors: true,
});

// Define test theme
const testTheme = {
  bodyFont: 'Helvetica',
  bodySize: 12,
  headingFont: 'Helvetica',
  headingColor: '#000000',
  h1Size: 24,
  h2Size: 20,
  h3Size: 18,
  h4Size: 16,
  h5Size: 14,
  h6Size: 12,
  textColor: '#000000',
  linkColor: '#0066cc',
  codeBackground: '#f5f5f5',
  kerning: 0,
  leading: 1.5,
};

// Define test elements
const testElements: MarkdownElement[] = [
  // Test heading - H1
  {
    type: 'heading',
    level: 1,
    content: 'Heading 1 with Emojis 🎉 🚀 🌟',
    inline: parseInlineFormatting('Heading 1 with Emojis 🎉 🚀 🌟'),
  },

  // Test heading - H2
  {
    type: 'heading',
    level: 2,
    content: 'Heading 2: Testing Multiple Types 😀 ❤️ 👍',
    inline: parseInlineFormatting('Heading 2: Testing Multiple Types 😀 ❤️ 👍'),
  },

  // Test heading - H3
  {
    type: 'heading',
    level: 3,
    content: 'Heading 3: Skin Tones 👋🏻 👋🏼 👋🏽 👋🏾 👋🏿',
    inline: parseInlineFormatting('Heading 3: Skin Tones 👋🏻 👋🏼 👋🏽 👋🏾 👋🏿'),
  },

  // Test heading - H4
  {
    type: 'heading',
    level: 4,
    content: 'Heading 4: ZWJ Sequences 👨‍👩‍👧 👨‍💻 👩‍⚕️',
    inline: parseInlineFormatting('Heading 4: ZWJ Sequences 👨‍👩‍👧 👨‍💻 👩‍⚕️'),
  },

  // Test heading - H5
  {
    type: 'heading',
    level: 5,
    content: 'Heading 5: Flags 🇺🇸 🇬🇧 🇫🇷 🇩🇪 🇯🇵',
    inline: parseInlineFormatting('Heading 5: Flags 🇺🇸 🇬🇧 🇫🇷 🇩🇪 🇯🇵'),
  },

  // Test heading - H6
  {
    type: 'heading',
    level: 6,
    content: 'Heading 6: Keycaps 1️⃣ 2️⃣ 3️⃣ #️⃣ *️⃣',
    inline: parseInlineFormatting('Heading 6: Keycaps 1️⃣ 2️⃣ 3️⃣ #️⃣ *️⃣'),
  },

  // Test paragraph (baseline)
  {
    type: 'paragraph',
    content: 'Regular paragraph with emojis: Hello 👋 World 🌍! This should work.',
    inline: parseInlineFormatting('Regular paragraph with emojis: Hello 👋 World 🌍! This should work.'),
  },

  // Test unordered list
  {
    type: 'list',
    ordered: false,
    items: [
      '🎯 First list item with emoji',
      '✅ Second item with checkmark',
      '🚀 Third item with rocket',
      '❤️ Fourth item with heart (variation selector)',
      '👨‍👩‍👧 Fifth item with family emoji (ZWJ sequence)',
    ],
    content: '',
  },

  // Test ordered list
  {
    type: 'list',
    ordered: true,
    items: [
      'Start with emoji 📝 in the middle',
      'Multiple 🎉🎊🎈 consecutive emojis',
      'Skin tones in list 👍🏽 work great',
      'Flags in ordered lists 🇨🇦 🇲🇽',
    ],
    content: '',
  },

  // Test blockquote
  {
    type: 'blockquote',
    content: 'This is a blockquote with emojis 💭 and should render properly with all types: 😀 ❤️ 👍🏽 👨‍💻 🇺🇸 1️⃣',
    inline: parseInlineFormatting('This is a blockquote with emojis 💭 and should render properly with all types: 😀 ❤️ 👍🏽 👨‍💻 🇺🇸 1️⃣'),
  },

  // Test table with emojis in headers and cells
  {
    type: 'table',
    headers: ['Name 📛', 'Status ✅', 'Country 🌍', 'Score 🎯'],
    rows: [
      ['Alice 👩', 'Active ✅', 'USA 🇺🇸', '100 💯'],
      ['Bob 👨', 'Pending ⏳', 'UK 🇬🇧', '95 ⭐'],
      ['Family 👨‍👩‍👧', 'Complete ✔️', 'Canada 🇨🇦', 'Great 🎉'],
      ['Mixed 🎭', 'Testing 🧪', 'Multi 🌎🌍🌏', 'Varied 🎲'],
    ],
    content: '',
  },

  // Test paragraph with all emoji types combined
  {
    type: 'paragraph',
    content: 'Combined Test: Basic 😀 Variation ❤️ Skin 👍🏽 ZWJ 👨‍💻 Flag 🇺🇸 Keycap 1️⃣ - All in one!',
    inline: parseInlineFormatting('Combined Test: Basic 😀 Variation ❤️ Skin 👍🏽 ZWJ 👨‍💻 Flag 🇺🇸 Keycap 1️⃣ - All in one!'),
  },
];

// Create PDF document
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
});

const TestDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <MarkdownElements elements={testElements} theme={testTheme} />
    </Page>
  </Document>
);

// Generate PDF
async function generateTestPDF() {
  console.log('🧪 Starting Emoji Rendering Test for All Markdown Elements');
  console.log('═══════════════════════════════════════════════════════════\n');

  const startTime = Date.now();

  try {
    console.log('📝 Test Elements:');
    console.log('  ✓ H1-H6 Headings (6 elements)');
    console.log('  ✓ Paragraphs (3 elements)');
    console.log('  ✓ Unordered List (5 items with emojis)');
    console.log('  ✓ Ordered List (4 items with emojis)');
    console.log('  ✓ Blockquote (all emoji types)');
    console.log('  ✓ Table (4x4 with emojis in headers and cells)\n');

    console.log('📋 Emoji Types Tested:');
    console.log('  ✓ Basic emojis (😀, 🎉, 🚀)');
    console.log('  ✓ Variation selectors (❤️, ✅, ⭐)');
    console.log('  ✓ Skin tone modifiers (👋🏻 through 👋🏿)');
    console.log('  ✓ ZWJ sequences (👨‍👩‍👧, 👨‍💻, 👩‍⚕️)');
    console.log('  ✓ Flag emojis (🇺🇸, 🇬🇧, 🇫🇷)');
    console.log('  ✓ Keycap sequences (1️⃣, 2️⃣, #️⃣)\n');

    console.log('🔄 Generating PDF...');
    const pdfDoc = pdf(<TestDocument />);
    const pdfBuffer = await pdfDoc.toBuffer();

    const fileName = `emoji-all-elements-test-${Date.now()}.pdf`;
    const outputPath = path.join(os.homedir(), 'Desktop', fileName);
    fs.writeFileSync(outputPath, pdfBuffer);

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log('✅ PDF generated successfully!\n');
    console.log('📊 Results:');
    console.log(`  • Output: ${outputPath}`);
    console.log(`  • Size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
    console.log(`  • Generation Time: ${duration}ms`);
    console.log(`  • Performance: ${duration < 100 ? '✅ PASS' : '⚠️ WARN'} (<100ms threshold)`);
    console.log('\n🔍 Manual Verification Required:');
    console.log('  1. Open the generated PDF file');
    console.log('  2. Verify emojis render in ALL heading levels (H1-H6)');
    console.log('  3. Verify emojis render in list items (both ordered and unordered)');
    console.log('  4. Verify emojis render in blockquotes');
    console.log('  5. Verify emojis render in table headers AND data cells');
    console.log('  6. Verify all emoji types (basic, skin tones, ZWJ, flags, keycaps)');
    console.log('  7. Check that no boxes □ or missing glyphs appear\n');
    console.log('📝 Acceptance Criteria:');
    console.log('  • Emojis render in H1-H6 headings');
    console.log('  • Emojis render in list items');
    console.log('  • Emojis render in blockquotes');
    console.log('  • Emojis render in table cells');
    console.log('\n✨ Test complete!');
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  }
}

// Run the test
generateTestPDF();
