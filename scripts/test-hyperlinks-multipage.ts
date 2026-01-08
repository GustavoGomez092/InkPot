/**
 * Test Hyperlinks Across Multiple Pages
 * Verifies that internal link destinations work correctly across page breaks
 */

import { homedir } from "node:os";
import { join } from "node:path";
import { exportPDF, generatePDF, type TOCConfiguration } from "../src/main/services/pdf-service.js";
import type { ThemeData } from "../src/shared/types/ipc-contracts.js";

async function testMultiPageHyperlinks() {
	try {
		console.log("🧪 Testing Hyperlinks Across Multiple Pages...\n");

		// Use Professional theme with link styling
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

		// TOC configuration - enable TOC to test TOC links
		const tocConfig: TOCConfiguration = {
			enabled: true,
			minLevel: 1,
			maxLevel: 3,
		};

		console.log(`📄 Using theme: ${theme.name}`);
		console.log(`📑 TOC enabled: levels ${tocConfig.minLevel}-${tocConfig.maxLevel}\n`);

		// Test markdown content with multiple pages and cross-page links
		const testContent = `# Multi-Page Hyperlink Test Document

This document tests internal link functionality across multiple pages.

## Table of Contents

- [Introduction](#introduction)
- [Section on Page 2](#section-on-page-2)
- [Section on Page 3](#section-on-page-3)
- [Final Section](#final-section)

## Introduction

This is the introduction section. It contains a link to the [Final Section](#final-section) which should be on a later page.

We'll also link to [Section on Page 2](#section-on-page-2) and [Section on Page 3](#section-on-page-3).

### Subsection 1.1

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Check the [External Link Test](#external-link-test) section for external links.

### Subsection 1.2

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Link back to [Introduction](#introduction) from subsection.

---PAGE_BREAK---

## Section on Page 2

This section should appear on page 2. From here, we can link back to the [Introduction](#introduction) on page 1, or forward to [Section on Page 3](#section-on-page-3).

### Subsection 2.1

More content to fill the page. Let's add multiple paragraphs to ensure proper page layout.

Paragraph 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.

Paragraph 2: Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

### Subsection 2.2

Paragraph 3: Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem.

Jump to [Final Section](#final-section) or go back to [Subsection 1.1](#subsection-11).

### Subsection 2.3

Paragraph 4: Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh.

Paragraph 5: Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis.

---PAGE_BREAK---

## Section on Page 3

This is page 3. We can link to any previous section:
- [Introduction](#introduction) (page 1)
- [Subsection 1.1](#subsection-11) (page 1)
- [Section on Page 2](#section-on-page-2) (page 2)
- [Subsection 2.2](#subsection-22) (page 2)

Or forward to [Final Section](#final-section).

### External Link Test

Here are some external links to test:
- [Google](https://www.google.com)
- [GitHub](https://github.com)
- [Stack Overflow](https://stackoverflow.com)

### Subsection 3.1

More content for page 3. This ensures the page has enough content to be realistic.

Paragraph 6: Nulla facilisi. Integer lacinia sollicitudin massa. Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue.

Paragraph 7: Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede. Ut orci risus, accumsan porttitor, cursus quis, aliquet eget, justo.

### Subsection 3.2

Paragraph 8: Sed pretium blandit orci. Ut eu diam at pede suscipit sodales. Aenean lectus elit, fermentum non, convallis id, sagittis at, neque. Nullam mauris orci, aliquet et, iaculis et, viverra vitae, ligula.

Link to [Subsection 2.3](#subsection-23) or [Subsection 1.2](#subsection-12).

---PAGE_BREAK---

## Final Section

This is the final section on page 4. All previous links should correctly navigate here.

### Summary of Internal Links

This document tested the following internal link scenarios:

1. **Forward links**: Links from earlier pages to later pages
   - [Introduction](#introduction) → [Final Section](#final-section) ✓
   - [Section on Page 2](#section-on-page-2) → [Section on Page 3](#section-on-page-3) ✓

2. **Backward links**: Links from later pages to earlier pages
   - [Section on Page 3](#section-on-page-3) → [Introduction](#introduction) ✓
   - [Final Section](#final-section) → [Subsection 1.1](#subsection-11) ✓

3. **Same-page links**: Links within the same page
   - [Introduction](#introduction) → [Subsection 1.1](#subsection-11) ✓

4. **TOC links**: Table of contents links to all sections
   - Should work for all heading levels configured (H1, H2, H3)

5. **External links**: Regular URLs (not affected by page breaks)
   - [External Link Test](#external-link-test) section contains external links

### Verification Checklist

To verify this test:

1. ✓ Open the generated PDF
2. ✓ Check that TOC appears after cover page (if enabled)
3. ✓ Click on TOC entries - should navigate to correct sections
4. ✓ Click on forward links (page 1 → page 4) - should jump to correct location
5. ✓ Click on backward links (page 3 → page 1) - should jump to correct location
6. ✓ Click on external links - should open in browser
7. ✓ Verify all headings are reachable as link destinations
8. ✓ Verify no "broken" links or incorrect destinations

### Test Result

If all internal links navigate to the correct locations and external links open properly, this test **PASSES** ✅

If any links navigate to wrong locations or don't work, this test **FAILS** ❌

---

## Appendix

### Edge Case: Duplicate Headings

We'll test duplicate heading handling:

#### Introduction

This is a duplicate "Introduction" heading. The link should go to the first one, and this should be "introduction-1".

Link to the first [Introduction](#introduction) and this duplicate [Introduction](#introduction-1).

### Edge Case: Special Characters

Test headings with special characters that need proper anchor ID generation.

#### Hello, World!

This heading has punctuation. Link: [Hello, World!](#hello-world)

#### Test #123 & More

This heading has special chars. Link: [Test #123 & More](#test-123--more)

---

*End of test document. Total pages: ~5-6*`;

		console.log("📝 Generating multi-page PDF with internal links...\n");

		// Generate PDF with TOC enabled
		const buffer = await generatePDF(testContent, theme, undefined, undefined, undefined, tocConfig);

		console.log(`✅ PDF generated successfully (${buffer.length} bytes)\n`);

		// Export to desktop
		const outputPath = join(homedir(), "Desktop", "inkpot-hyperlink-test.pdf");
		await exportPDF(buffer, outputPath);

		console.log(`✅ PDF exported to: ${outputPath}\n`);

		console.log("📋 Test Summary:");
		console.log("  - Document spans 5-6 pages with explicit page breaks");
		console.log("  - TOC enabled (H1-H3 levels)");
		console.log("  - Forward links: page 1 → page 4");
		console.log("  - Backward links: page 3 → page 1");
		console.log("  - Cross-page links between all sections");
		console.log("  - External links to test baseline functionality");
		console.log("  - Duplicate headings with -1 suffix");
		console.log("  - Special characters in headings\n");

		console.log("🔍 Manual Verification Required:");
		console.log("  1. Open the generated PDF");
		console.log("  2. Click on TOC entries - verify navigation works");
		console.log("  3. Click on internal links - verify they jump to correct sections");
		console.log("  4. Test links that span multiple pages (page 1 → page 4)");
		console.log("  5. Click on external links - verify they open in browser");
		console.log("  6. Check that all headings are reachable destinations\n");

		console.log("🎉 Multi-page hyperlink test completed successfully!");
		console.log("📄 Review the PDF to verify all links work across page breaks.");
	} catch (error) {
		console.error("❌ Multi-page hyperlink test failed:", error);
		process.exit(1);
	}
}

// Run test
testMultiPageHyperlinks();
