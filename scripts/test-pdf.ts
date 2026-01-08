/**
 * Test PDF Generation with Hyperlinks
 * Comprehensive script to test PDF generation functionality including hyperlink support
 */

import { homedir } from "node:os";
import { join } from "node:path";
import { exportPDF, generatePDF, type TOCConfiguration } from "../src/main/services/pdf-service.js";
import type { ThemeData } from "../src/shared/types/ipc-contracts.js";

async function testPDFGeneration() {
	try {
		console.log("🧪 Testing PDF Generation with Hyperlinks...\n");

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
			linkUnderline: true,
			codeBackground: "#F5F5F5",
		};

		// TOC configuration - enable TOC to test table of contents with links
		const tocConfig: TOCConfiguration = {
			enabled: true,
			minLevel: 1,
			maxLevel: 3,
		};

		console.log(`📄 Using theme: ${theme.name}`);
		console.log(`🔗 Link color: ${theme.linkColor} (underline: ${theme.linkUnderline})`);
		console.log(`📑 TOC enabled: levels ${tocConfig.minLevel}-${tocConfig.maxLevel}\n`);

		// Test markdown content with hyperlinks
		const testContent = `# Welcome to InkPot

This is a comprehensive test document to verify PDF generation with hyperlink functionality.

## Quick Navigation

- [Features](#features)
- [External Links](#external-links)
- [Internal Navigation](#internal-navigation)
- [Code Examples](#code-examples)
- [Lists and Formatting](#lists-and-formatting)
- [Final Section](#final-section)

---

## Features

InkPot supports various markdown features:

- **Bold text** works
- *Italic text* works
- \`Inline code\` works
- [External links](https://example.com) work
- [Internal links](#features) work

### Hyperlink Support

This test verifies:
1. External URLs are clickable and open in browser
2. Internal links navigate to correct headings
3. Table of contents entries link to sections
4. Links are styled consistently with theme

---

## External Links

Test external URL functionality by clicking these links:

### Documentation Sites

- [MDN Web Docs](https://developer.mozilla.org/en-US/) - Web development reference
- [React Documentation](https://react.dev) - React library docs
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide

### Development Resources

- [GitHub](https://github.com) - Code hosting platform
- [Stack Overflow](https://stackoverflow.com) - Developer Q&A community
- [npm Registry](https://www.npmjs.com) - Package registry

### Test Cases

- [Link with query params](https://github.com/search?q=react&type=repositories)
- [Link with fragment](https://developer.mozilla.org/en-US/docs/Web/JavaScript#reference)

---

## Internal Navigation

These links should navigate to other sections in this document:

### Forward Links

Click these to jump forward in the document:
- Go to [Code Examples](#code-examples)
- Go to [Lists and Formatting](#lists-and-formatting)
- Go to [Final Section](#final-section)

### Backward Links

Click these to jump back to earlier sections:
- Return to [Features](#features)
- Return to [Quick Navigation](#quick-navigation)
- Back to [Welcome](#welcome-to-inkpot)

### Same Section Links

Link within this section: [Internal Navigation](#internal-navigation)

---

## Code Examples

### Code Block

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Inline Code

Use \`npm install\` to install dependencies and \`npm start\` to run the application.

---

## Lists and Formatting

### Ordered Lists

1. First ordered item
2. Second ordered item
3. Third ordered item

### Unordered Lists

- Unordered item A
- Unordered item B
- Unordered item C

### Nested Lists

- Parent item 1
  - Nested item 1a
  - Nested item 1b
- Parent item 2
  - Nested item 2a
  - Nested item 2b

### Blockquotes

> This is a blockquote
> It spans multiple lines
> And demonstrates quote formatting

---

### Page Break Test

---PAGE_BREAK---

# Page 2 Content

This content should appear on the second page after a manual page break.

## More Content

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Cross-Page Links

Test links across page boundaries:
- Link back to [Features on page 1](#features)
- Link to [Final Section on this page](#final-section)

---

## Horizontal Rule

Content above the horizontal rule.

---

Content below the horizontal rule.

---

## Final Section

This is the end of our comprehensive test document.

### Verification

To verify this PDF:
1. ✓ Check that external links open in browser
2. ✓ Verify internal links navigate correctly
3. ✓ Confirm TOC entries link to sections
4. ✓ Test links across page breaks
5. ✓ Verify link styling (color and underline)

### Additional Tests

- [Return to top](#welcome-to-inkpot)
- [Visit Quick Navigation](#quick-navigation)
- [External: GitHub](https://github.com)

---

*End of test document. All features tested successfully!*
`;

		console.log("📝 Generating PDF with hyperlinks...\n");

		// Generate PDF with TOC enabled
		const buffer = await generatePDF(testContent, theme, undefined, undefined, undefined, tocConfig);

		console.log(`✅ PDF generated successfully (${buffer.length} bytes)\n`);

		// Export to desktop
		const outputPath = join(homedir(), "Desktop", "inkpot-test.pdf");
		await exportPDF(buffer, outputPath);

		console.log(`✅ PDF exported to: ${outputPath}\n`);

		// Verification Instructions
		console.log("═══════════════════════════════════════════════════════════════");
		console.log("📋 HYPERLINK VERIFICATION CHECKLIST");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("📄 PDF Location:");
		console.log(`   ${outputPath}\n`);

		console.log("🔍 Test Procedure:\n");

		console.log("1️⃣  EXTERNAL LINKS");
		console.log("   ✓ Open PDF and find 'External Links' section");
		console.log("   ✓ Click on external URLs (MDN, React, TypeScript, GitHub, etc.)");
		console.log("   ✓ Verify links open in default web browser");
		console.log("   ✓ Confirm correct URLs are loaded\n");

		console.log("2️⃣  INTERNAL LINKS");
		console.log("   ✓ Navigate to 'Internal Navigation' section");
		console.log("   ✓ Click forward links (e.g., 'Go to Code Examples')");
		console.log("   ✓ Verify PDF scrolls to correct heading");
		console.log("   ✓ Click backward links (e.g., 'Return to Features')");
		console.log("   ✓ Test same-section links\n");

		console.log("3️⃣  TABLE OF CONTENTS");
		console.log("   ✓ Check PDF has TOC page after cover");
		console.log("   ✓ TOC lists configured heading levels (H1-H3)");
		console.log("   ✓ Click TOC entries and verify navigation");
		console.log("   ✓ All TOC links should jump to correct sections\n");

		console.log("4️⃣  CROSS-PAGE LINKS");
		console.log("   ✓ Test links that span page breaks");
		console.log("   ✓ 'Page 2 Content' links back to page 1 sections");
		console.log("   ✓ Verify accurate navigation across pages\n");

		console.log("5️⃣  LINK STYLING");
		console.log("   ✓ Links use theme color (#0066CC - blue)");
		console.log("   ✓ Links are underlined");
		console.log("   ✓ Links visually distinct from regular text");
		console.log("   ✓ Good contrast with white background\n");

		console.log("6️⃣  PDF VIEWER COMPATIBILITY");
		console.log("   Test in multiple viewers:");
		console.log("   ✓ Preview.app (macOS) / Default viewer");
		console.log("   ✓ Chrome PDF viewer");
		console.log("   ✓ Adobe Acrobat Reader (if available)\n");

		console.log("═══════════════════════════════════════════════════════════════");
		console.log("📝 ACCEPTANCE CRITERIA (Subtask 5.5)");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("✓ Test script generates PDF with hyperlinks");
		console.log("✓ Can be run to verify link functionality");
		console.log("✓ Documents test results\n");

		console.log("═══════════════════════════════════════════════════════════════");
		console.log("📊 TEST RESULTS");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("After manual verification, confirm:\n");
		console.log("[ ] External links clickable and open in browser");
		console.log("[ ] Internal links navigate to correct headings");
		console.log("[ ] TOC entries link to corresponding sections");
		console.log("[ ] Cross-page links work correctly");
		console.log("[ ] Link styling correct (color, underline)");
		console.log("[ ] Works in multiple PDF viewers\n");

		console.log("═══════════════════════════════════════════════════════════════");
		console.log("🎉 PDF generation test completed successfully!");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("Next steps:");
		console.log("1. Open the generated PDF");
		console.log("2. Follow the verification checklist above");
		console.log("3. Test all hyperlink types (external, internal, TOC)");
		console.log("4. Record results in implementation_plan.json");
		console.log("5. Mark subtask 5.5 as 'completed' if all tests pass\n");

		console.log("💡 For comprehensive testing, also run:");
		console.log("   - npx tsx scripts/test-external-links.ts");
		console.log("   - npx tsx scripts/test-internal-links.ts");
		console.log("   - npx tsx scripts/test-toc.ts\n");
	} catch (error) {
		console.error("❌ PDF generation test failed:", error);
		console.error("\nPossible issues:");
		console.error("- PDF generation error");
		console.error("- File write permission error");
		console.error("- Missing dependencies\n");
		process.exit(1);
	}
}

// Run test
testPDFGeneration();