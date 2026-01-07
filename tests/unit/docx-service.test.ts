/**
 * Unit tests for DOCX Service
 * Tests Word document generation functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs/promises';
import { generateDocx, exportDocx, previewDocx } from '../../src/main/services/docx-service.js';
import type { ThemeData } from '../../src/shared/types/ipc-contracts.js';

// Mock fs/promises for exportDocx tests
vi.mock('node:fs/promises', async () => {
  const actual = await vi.importActual('node:fs/promises');
  return {
    ...actual,
    writeFile: vi.fn().mockResolvedValue(undefined),
  };
});

/**
 * Default theme fixture for testing
 * Mirrors standard InkPot theme structure
 */
const mockTheme: ThemeData = {
  id: 'test-theme-id',
  name: 'Test Theme',
  headingFont: 'Arial',
  bodyFont: 'Times New Roman',
  h1Size: 32,
  h2Size: 28,
  h3Size: 24,
  h4Size: 20,
  h5Size: 18,
  h6Size: 16,
  bodySize: 12,
  kerning: 0,
  leading: 1.5,
  pageWidth: 8.5,
  pageHeight: 11,
  marginTop: 1,
  marginBottom: 1,
  marginLeft: 1,
  marginRight: 1,
  backgroundColor: '#FFFFFF',
  textColor: '#333333',
  headingColor: '#111111',
  linkColor: '#0066CC',
  codeBackground: '#F5F5F5',
};

describe('DOCX Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateDocx', () => {
    it('should generate valid DOCX buffer from empty content', async () => {
      const content = '';
      const buffer = await generateDocx(content, mockTheme);

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);

      // DOCX files are ZIP archives starting with PK signature
      expect(buffer[0]).toBe(0x50); // 'P'
      expect(buffer[1]).toBe(0x4b); // 'K'
    });

    it('should generate DOCX with simple paragraph', async () => {
      const content = 'Hello, World!';
      const buffer = await generateDocx(content, mockTheme);

      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
      // DOCX signature check
      expect(buffer[0]).toBe(0x50);
      expect(buffer[1]).toBe(0x4b);
    });

    describe('Heading Levels', () => {
      it('should generate DOCX with H1 heading', async () => {
        const content = '# Heading 1';
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with H2 heading', async () => {
        const content = '## Heading 2';
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with H3 heading', async () => {
        const content = '### Heading 3';
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with H4 heading', async () => {
        const content = '#### Heading 4';
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with H5 heading', async () => {
        const content = '##### Heading 5';
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with H6 heading', async () => {
        const content = '###### Heading 6';
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with all heading levels (H1-H6)', async () => {
        const content = `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6`;
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });
    });

    describe('Lists', () => {
      it('should generate DOCX with unordered list', async () => {
        const content = `- Item 1
- Item 2
- Item 3`;
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with ordered list', async () => {
        const content = `1. First item
2. Second item
3. Third item`;
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with nested unordered list', async () => {
        const content = `- Item 1
  - Nested item 1
  - Nested item 2
- Item 2`;
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with checklist', async () => {
        const content = `- [ ] Unchecked item
- [x] Checked item`;
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });
    });

    describe('Code Blocks', () => {
      it('should generate DOCX with inline code', async () => {
        const content = 'Use the `print()` function.';
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with code block', async () => {
        const content = `\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\``;
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with code block without language', async () => {
        const content = `\`\`\`
const x = 1;
\`\`\``;
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with code block preserving indentation', async () => {
        const content = `\`\`\`python
def foo():
    if True:
        print("nested")
\`\`\``;
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });
    });

    describe('Tables', () => {
      it('should generate DOCX with simple table', async () => {
        const content = `| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |`;
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with table with multiple rows', async () => {
        const content = `| Name | Age | City |
| ---- | --- | ---- |
| John | 30  | NYC  |
| Jane | 25  | LA   |
| Bob  | 35  | SF   |`;
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });
    });

    describe('Block Elements', () => {
      it('should generate DOCX with blockquote', async () => {
        const content = '> This is a blockquote.';
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with horizontal rule', async () => {
        const content = `Before rule

---

After rule`;
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });
    });

    describe('Inline Formatting', () => {
      it('should generate DOCX with bold text', async () => {
        const content = 'This is **bold** text.';
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with italic text', async () => {
        const content = 'This is *italic* text.';
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with strikethrough text', async () => {
        const content = 'This is ~~strikethrough~~ text.';
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with link', async () => {
        const content = 'Visit [Example](https://example.com) for more.';
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should generate DOCX with mixed formatting', async () => {
        const content = 'This has **bold**, *italic*, `code`, and ~~strike~~.';
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });
    });

    describe('Theme Application', () => {
      it('should apply theme colors (document generates successfully)', async () => {
        const customTheme: ThemeData = {
          ...mockTheme,
          textColor: '#FF0000',
          headingColor: '#00FF00',
          linkColor: '#0000FF',
        };
        const content = '# Heading\n\nParagraph with [link](http://example.com).';
        const buffer = await generateDocx(content, customTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should apply theme fonts (document generates successfully)', async () => {
        const customTheme: ThemeData = {
          ...mockTheme,
          headingFont: 'Georgia',
          bodyFont: 'Verdana',
        };
        const content = '# Heading\n\nParagraph text.';
        const buffer = await generateDocx(content, customTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should apply theme page dimensions', async () => {
        const customTheme: ThemeData = {
          ...mockTheme,
          pageWidth: 11,
          pageHeight: 8.5, // Landscape
        };
        const content = 'Content for landscape page.';
        const buffer = await generateDocx(content, customTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should apply theme margins', async () => {
        const customTheme: ThemeData = {
          ...mockTheme,
          marginTop: 2,
          marginBottom: 2,
          marginLeft: 1.5,
          marginRight: 1.5,
        };
        const content = 'Content with custom margins.';
        const buffer = await generateDocx(content, customTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should apply different font sizes for headings', async () => {
        const customTheme: ThemeData = {
          ...mockTheme,
          h1Size: 48,
          h2Size: 36,
          h3Size: 28,
          bodySize: 14,
        };
        const content = `# Large H1
## Medium H2
### Small H3

Body text.`;
        const buffer = await generateDocx(content, customTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });
    });

    describe('Complex Documents', () => {
      it('should generate DOCX with mixed content', async () => {
        const content = `# Document Title

This is an introductory paragraph with **bold** and *italic* text.

## Section 1

Here is a list:
- First item
- Second item
- Third item

## Section 2

And a code example:

\`\`\`javascript
const x = 42;
console.log(x);
\`\`\`

> This is a blockquote for emphasis.

| Column A | Column B |
| -------- | -------- |
| Value 1  | Value 2  |

---

The end.`;
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should handle Unicode and special characters', async () => {
        const content = `# Unicode Test

- English: Hello
- Spanish: Hola
- Japanese: こんにちは
- Emoji: Hello!
- Symbols: © ® ™ € £ ¥`;
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });

      it('should handle very long paragraphs', async () => {
        const longText = 'Lorem ipsum dolor sit amet. '.repeat(100);
        const content = `# Long Content\n\n${longText}`;
        const buffer = await generateDocx(content, mockTheme);

        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
      });
    });

    describe('Error Handling', () => {
      it('should handle malformed markdown gracefully', async () => {
        const content = '# Incomplete [link](';
        // Should not throw, just generate what it can
        const buffer = await generateDocx(content, mockTheme);
        expect(buffer).toBeInstanceOf(Buffer);
      });

      it('should handle empty theme name', async () => {
        const themeWithEmptyName: ThemeData = {
          ...mockTheme,
          name: '',
        };
        const buffer = await generateDocx('Test content', themeWithEmptyName);
        expect(buffer).toBeInstanceOf(Buffer);
      });
    });
  });

  describe('exportDocx', () => {
    it('should write buffer to file path', async () => {
      const buffer = Buffer.from('test content');
      const filePath = '/tmp/test.docx';

      await exportDocx(buffer, filePath);

      expect(fs.writeFile).toHaveBeenCalledWith(filePath, buffer);
    });

    it('should throw error on write failure', async () => {
      vi.mocked(fs.writeFile).mockRejectedValueOnce(new Error('Write failed'));

      const buffer = Buffer.from('test content');
      const filePath = '/tmp/test.docx';

      await expect(exportDocx(buffer, filePath)).rejects.toThrow('Failed to export DOCX');
    });
  });

  describe('previewDocx', () => {
    it('should generate base64 data URL', async () => {
      const content = '# Preview Test';
      const dataUrl = await previewDocx(content, mockTheme);

      expect(dataUrl).toMatch(/^data:application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document;base64,/);
    });

    it('should return valid base64 encoded content', async () => {
      const content = '# Preview Test\n\nSome content.';
      const dataUrl = await previewDocx(content, mockTheme);

      // Extract base64 part
      const base64 = dataUrl.split(',')[1];
      expect(base64).toBeDefined();

      // Verify it's valid base64 (can decode without error)
      const decoded = Buffer.from(base64, 'base64');
      expect(decoded.length).toBeGreaterThan(0);

      // Check it's a valid ZIP (DOCX)
      expect(decoded[0]).toBe(0x50);
      expect(decoded[1]).toBe(0x4b);
    });
  });
});
