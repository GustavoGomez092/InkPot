/**
 * Test PDF Generation
 * Simple script to test PDF generation functionality
 */

import { homedir } from "node:os";
import { join } from "node:path";
import { exportPDF, generatePDF } from "../src/main/services/pdf-service.js";
import type { ThemeData } from "../src/shared/types/ipc-contracts.js";

async function testPDFGeneration() {
	try {
		console.log("🧪 Testing PDF Generation...\n");

		// Use a mock theme (Professional theme from seed)
		const theme: ThemeData = {
			id: "test-theme",
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

		console.log(`📄 Using theme: ${theme.name}`);

		// Test markdown content
		const testContent = `# Welcome to InkPot

This is a test document to verify PDF generation.

## Features

- **Bold text** works
- *Italic text* works
- \`Inline code\` works
- [Links](https://example.com) work

### Code Block

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## Lists

1. Ordered item 1
2. Ordered item 2
3. Ordered item 3

- Unordered item A
- Unordered item B
- Unordered item C

> This is a blockquote
> It spans multiple lines

---

### Page Break Test

---PAGE_BREAK---

# Page 2

This content should appear on the second page.

## More Content

Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

---

## Horizontal Rule

Content above the line.

Content below the line.

## Final Section

The end of our test document.
`;

		console.log("📝 Generating PDF from markdown...\n");

		// Generate PDF
		const buffer = await generatePDF(testContent, theme);

		console.log(`✅ PDF generated successfully (${buffer.length} bytes)\n`);

		// Export to desktop
		const outputPath = join(homedir(), "Desktop", "inkpot-test.pdf");
		await exportPDF(buffer, outputPath);

		console.log(`✅ PDF exported to: ${outputPath}\n`);

		console.log("🎉 PDF generation test completed successfully!");
	} catch (error) {
		console.error("❌ PDF generation test failed:", error);
		process.exit(1);
	}
}

// Run test
testPDFGeneration();
