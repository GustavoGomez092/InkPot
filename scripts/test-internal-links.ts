/**
 * Test Internal Link Navigation
 * Subtask 5.3: Verify internal links navigate to correct heading locations within the PDF
 */

import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { exportPDF, generatePDF, type TOCConfiguration } from "../src/main/services/pdf-service.js";
import type { ThemeData } from "../src/shared/types/ipc-contracts.js";

async function testInternalLinks() {
	try {
		console.log("🧪 Testing Internal Link Navigation (Subtask 5.3)...\n");

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
		console.log(`🔗 Link color: ${theme.linkColor} (underline: ${theme.linkUnderline})`);
		console.log(`📑 TOC enabled: levels ${tocConfig.minLevel}-${tocConfig.maxLevel}\n`);

		// Read the comprehensive test markdown file created in subtask 5.1
		const testMarkdownPath = join(process.cwd(), "test-hyperlinks.md");
		console.log(`📖 Reading test document: test-hyperlinks.md`);
		const testContent = await readFile(testMarkdownPath, "utf-8");
		console.log(`✅ Loaded ${testContent.length} characters\n`);

		console.log("📝 Generating PDF with internal links...\n");

		// Generate PDF with TOC enabled
		const buffer = await generatePDF(testContent, theme, undefined, undefined, undefined, tocConfig);

		console.log(`✅ PDF generated successfully (${buffer.length} bytes)\n`);

		// Export to desktop
		const outputPath = join(homedir(), "Desktop", "inkpot-internal-links-test.pdf");
		await exportPDF(buffer, outputPath);

		console.log(`✅ PDF exported to: ${outputPath}\n`);

		// Verification Instructions
		console.log("═══════════════════════════════════════════════════════════════");
		console.log("📋 MANUAL VERIFICATION REQUIRED - INTERNAL LINKS (Subtask 5.3)");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("📄 PDF Location:");
		console.log(`   ${outputPath}\n`);

		console.log("🔍 Test Procedure:\n");

		console.log("1️⃣  TABLE OF CONTENTS NAVIGATION");
		console.log("   The PDF should have a Table of Contents page after the cover.");
		console.log("   Click on TOC entries and verify they navigate to correct sections:\n");
		console.log("   ✓ Introduction → scrolls to Introduction heading");
		console.log("   ✓ External Links → scrolls to External Links section");
		console.log("   ✓ Internal Links → scrolls to Internal Links section");
		console.log("   ✓ Cross-Page Links → scrolls to Cross-Page Links section");
		console.log("   ✓ Edge Cases → scrolls to Edge Cases section");
		console.log("   ✓ All TOC links should jump to the EXACT heading location\n");

		console.log("2️⃣  SAME-PAGE INTERNAL LINKS");
		console.log("   Navigate to the 'Internal Links' section.");
		console.log("   Test links that navigate within the same page:\n");
		console.log("   ✓ Click links to headings on the same page");
		console.log("   ✓ Verify the PDF viewer scrolls to the correct heading");
		console.log("   ✓ Heading should be visible at/near the top of the viewport\n");

		console.log("3️⃣  CROSS-PAGE INTERNAL LINKS (FORWARD)");
		console.log("   Test links from earlier pages to later pages:\n");
		console.log("   ✓ Go to 'Quick Navigation' section (near start)");
		console.log("   ✓ Click link to 'Verification Checklist' (near end)");
		console.log("   ✓ Should jump forward multiple pages to correct section");
		console.log("   ✓ Click link to 'Edge Cases' section");
		console.log("   ✓ Should navigate to the Edge Cases heading\n");

		console.log("4️⃣  CROSS-PAGE INTERNAL LINKS (BACKWARD)");
		console.log("   Test links from later pages to earlier pages:\n");
		console.log("   ✓ Go to a later section (e.g., 'Edge Cases')");
		console.log("   ✓ Click link back to 'Introduction' or 'External Links'");
		console.log("   ✓ Should jump backward to correct section on earlier page");
		console.log("   ✓ Test multiple backward links to verify consistency\n");

		console.log("5️⃣  NESTED HEADING NAVIGATION");
		console.log("   Test links to nested headings at different levels:\n");
		console.log("   ✓ Links to H2 headings (##)");
		console.log("   ✓ Links to H3 headings (###)");
		console.log("   ✓ Links to H4, H5, H6 headings (if present)");
		console.log("   ✓ All heading levels should be reachable destinations\n");

		console.log("6️⃣  DUPLICATE HEADING HANDLING");
		console.log("   The document has multiple 'Introduction' headings.");
		console.log("   Test that anchor ID generation handles duplicates:\n");
		console.log("   ✓ First 'Introduction' has anchor 'introduction'");
		console.log("   ✓ Second 'Introduction' has anchor 'introduction-1'");
		console.log("   ✓ Links correctly navigate to the intended heading");
		console.log("   ✓ No confusion between duplicate headings\n");

		console.log("7️⃣  SPECIAL CHARACTERS IN HEADINGS");
		console.log("   Test links to headings with special characters:\n");
		console.log("   ✓ Headings with punctuation (!, ?, %, etc.)");
		console.log("   ✓ Headings with symbols (#, &, $, quotes)");
		console.log("   ✓ Headings with unicode/emoji (café, über, ☕, 日本語)");
		console.log("   ✓ Anchor IDs are properly generated and links work\n");

		console.log("8️⃣  LINK ACCURACY AND PRECISION");
		console.log("   Verify the exact scroll position:\n");
		console.log("   ✓ Clicking link scrolls to the heading (not above/below)");
		console.log("   ✓ Heading is visible and not cut off");
		console.log("   ✓ Consistent behavior across all internal links");
		console.log("   ✓ No 'destination not found' errors in PDF viewer\n");

		console.log("9️⃣  PDF VIEWER COMPATIBILITY");
		console.log("   Test internal link navigation in multiple PDF viewers:\n");
		console.log("   macOS:");
		console.log("   ✓ Preview.app - test TOC and internal links");
		console.log("   ✓ Chrome/Safari - test navigation behavior");
		console.log("   ✓ Adobe Acrobat Reader (if available)\n");
		console.log("   Windows:");
		console.log("   ✓ Microsoft Edge - test internal links");
		console.log("   ✓ Chrome - test TOC navigation");
		console.log("   ✓ Adobe Acrobat Reader\n");
		console.log("   Linux:");
		console.log("   ✓ Evince/GNOME Document Viewer");
		console.log("   ✓ Firefox - test internal navigation");
		console.log("   ✓ Chrome\n");

		console.log("═══════════════════════════════════════════════════════════════");
		console.log("📝 ACCEPTANCE CRITERIA (Subtask 5.3)");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("✓ Clicking internal link scrolls to correct heading");
		console.log("✓ Works for headings on same page");
		console.log("✓ Works for headings on different pages\n");

		console.log("═══════════════════════════════════════════════════════════════");
		console.log("📊 TEST RESULTS CHECKLIST");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("After completing manual verification, check off:\n");
		console.log("TOC Navigation:");
		console.log("[ ] All TOC entries navigate to correct sections");
		console.log("[ ] TOC links scroll to exact heading position");
		console.log("[ ] TOC works for all configured heading levels (H1-H3)\n");

		console.log("Same-Page Links:");
		console.log("[ ] Links within same page navigate correctly");
		console.log("[ ] Scroll position is accurate (heading visible)\n");

		console.log("Cross-Page Links:");
		console.log("[ ] Forward links (earlier → later pages) work");
		console.log("[ ] Backward links (later → earlier pages) work");
		console.log("[ ] Links span multiple pages correctly\n");

		console.log("Edge Cases:");
		console.log("[ ] Duplicate headings handled correctly (-1, -2 suffixes)");
		console.log("[ ] Special characters in headings work");
		console.log("[ ] Unicode/emoji headings work");
		console.log("[ ] Nested heading levels (H2-H6) reachable\n");

		console.log("Viewer Compatibility:");
		console.log("[ ] Works in Preview.app / default viewer");
		console.log("[ ] Works in Chrome PDF viewer");
		console.log("[ ] Works in Adobe Acrobat (if tested)\n");

		console.log("Overall:");
		console.log("[ ] No broken internal links");
		console.log("[ ] No 'destination not found' errors");
		console.log("[ ] Consistent navigation behavior");
		console.log("[ ] All acceptance criteria met\n");

		console.log("═══════════════════════════════════════════════════════════════");
		console.log("🎉 Test script completed successfully!");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("Next steps:");
		console.log("1. Open the generated PDF at:");
		console.log(`   ${outputPath}`);
		console.log("2. Follow the test procedure above");
		console.log("3. Test in multiple PDF viewers if possible");
		console.log("4. Record test results in implementation_plan.json");
		console.log("5. Mark subtask 5.3 as 'completed' if all tests pass\n");

		console.log("📚 For detailed verification guide, see:");
		console.log("   .auto-claude/specs/003-working-pdf-hyperlinks/subtask-5.3-verification.md\n");
	} catch (error) {
		console.error("❌ Internal link test failed:", error);
		console.error("\nPossible issues:");
		console.error("- test-hyperlinks.md file not found");
		console.error("- PDF generation error");
		console.error("- File write permission error\n");
		process.exit(1);
	}
}

// Run test
testInternalLinks();
