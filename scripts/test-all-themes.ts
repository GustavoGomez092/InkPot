/**
 * Test PDF Generation with Multiple Themes
 * Tests PDF generation with all three built-in themes
 */

import { homedir } from "node:os";
import { join } from "node:path";
import { exportPDF, generatePDF } from "../src/main/services/pdf-service.js";
import type { ThemeData } from "../src/shared/types/ipc-contracts.js";

// Professional Theme
const professionalTheme: ThemeData = {
	id: "professional",
	name: "Professional",
	headingFont: "Helvetica",
	bodyFont: "Helvetica",
	h1Size: 32,
	h2Size: 24,
	h3Size: 20,
	h4Size: 16,
	h5Size: 14,
	h6Size: 12,
	bodySize: 11,
	kerning: 0,
	leading: 1.5,
	pageWidth: 8.5,
	pageHeight: 11,
	marginTop: 1,
	marginBottom: 1,
	marginLeft: 1,
	marginRight: 1,
	backgroundColor: "#FFFFFF",
	textColor: "#000000",
	headingColor: "#1a1a1a",
	linkColor: "#0066CC",
	codeBackground: "#F5F5F5",
};

// Modern Theme
const modernTheme: ThemeData = {
	id: "modern",
	name: "Modern",
	headingFont: "Helvetica",
	bodyFont: "Helvetica",
	h1Size: 36,
	h2Size: 28,
	h3Size: 22,
	h4Size: 18,
	h5Size: 14,
	h6Size: 12,
	bodySize: 11,
	kerning: 0.02,
	leading: 1.6,
	pageWidth: 8.5,
	pageHeight: 11,
	marginTop: 0.75,
	marginBottom: 0.75,
	marginLeft: 0.75,
	marginRight: 0.75,
	backgroundColor: "#FFFFFF",
	textColor: "#2d2d2d",
	headingColor: "#000000",
	linkColor: "#2563EB",
	codeBackground: "#E5E7EB",
};

// Classic Theme
const classicTheme: ThemeData = {
	id: "classic",
	name: "Classic",
	headingFont: "Helvetica",
	bodyFont: "Helvetica",
	h1Size: 30,
	h2Size: 22,
	h3Size: 18,
	h4Size: 16,
	h5Size: 14,
	h6Size: 12,
	bodySize: 12,
	kerning: 0,
	leading: 1.8,
	pageWidth: 8.5,
	pageHeight: 11,
	marginTop: 1.25,
	marginBottom: 1.25,
	marginLeft: 1.25,
	marginRight: 1.25,
	backgroundColor: "#FFFEF9",
	textColor: "#1a1a1a",
	headingColor: "#000000",
	linkColor: "#8B4513",
	codeBackground: "#F0EDE6",
};

const testContent = `# InkForge PDF Test Document

This document tests PDF generation with various markdown elements.

## Text Formatting

Regular text paragraph with **bold text**, *italic text*, and \`inline code\`.

You can also ~~strikethrough text~~ and create [hyperlinks](https://example.com).

### Heading Level 3
#### Heading Level 4
##### Heading Level 5
###### Heading Level 6

## Lists

### Ordered Lists

1. First item
2. Second item with **bold**
3. Third item with *italic*
4. Fourth item with \`code\`

### Unordered Lists

- Apple
- Banana  
- Cherry
- Date

## Code Blocks

Here's a JavaScript code block:

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet("InkForge");
\`\`\`

Here's a Python code block:

\`\`\`python
def calculate_sum(numbers):
    return sum(numbers)

result = calculate_sum([1, 2, 3, 4, 5])
print(f"Sum: {result}")
\`\`\`

## Blockquotes

> This is a blockquote.
> It can span multiple lines and contain **formatted text**.

> A second blockquote with *different* content.

## Horizontal Rules

Content above the line.

---

Content below the line.

---PAGE_BREAK---

# Page 2

This content appears on page 2 after an explicit page break.

## More Content

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Complex List with Formatting

1. **Bold item** with regular text
2. *Italic item* with regular text
3. Item with \`inline code\`
4. Item with [a link](https://example.com)

### Nested Concepts

- Main point 1
- Main point 2 with **emphasis**
- Main point 3 with *italics*

## Final Section

This is the end of our comprehensive test document. It includes:

- Various heading levels (H1-H6)
- Text formatting (bold, italic, code, strike, links)
- Ordered and unordered lists
- Code blocks in multiple languages
- Blockquotes
- Horizontal rules
- Explicit page breaks

Thank you for using **InkForge**!
`;

async function testAllThemes() {
	const themes = [professionalTheme, modernTheme, classicTheme];

	console.log("🧪 Testing PDF Generation with All Themes\n");

	for (const theme of themes) {
		try {
			console.log(`📄 Generating PDF with "${theme.name}" theme...`);

			// Generate PDF
			const buffer = await generatePDF(testContent, theme);

			// Export to desktop
			const filename = `inkforge-test-${theme.name.toLowerCase()}.pdf`;
			const outputPath = join(homedir(), "Desktop", filename);
			await exportPDF(buffer, outputPath);

			console.log(`✅ ${theme.name}: ${buffer.length} bytes → ${outputPath}\n`);
		} catch (error) {
			console.error(`❌ ${theme.name} theme failed:`, error);
		}
	}

	console.log("🎉 All theme tests completed!");
	console.log("\n📂 Check your Desktop for the generated PDFs:");
	console.log("   - inkforge-test-professional.pdf");
	console.log("   - inkforge-test-modern.pdf");
	console.log("   - inkforge-test-classic.pdf");
}

// Run test
testAllThemes();
