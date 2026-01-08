/**
 * Test Table of Contents Functionality
 * Subtask 5.4: Verify TOC is generated correctly with working links to all sections
 */

import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { exportPDF, generatePDF, type TOCConfiguration } from "../src/main/services/pdf-service.js";
import type { ThemeData } from "../src/shared/types/ipc-contracts.js";

async function testTOC() {
	try {
		console.log("🧪 Testing Table of Contents Functionality (Subtask 5.4)...\n");

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

		console.log(`📄 Theme: ${theme.name}`);
		console.log(`🎨 Link styling: ${theme.linkColor} (underline: ${theme.linkUnderline})`);
		console.log(`🎨 Heading color: ${theme.headingColor}`);
		console.log(`🎨 Text color: ${theme.textColor}\n`);

		// Test multiple TOC configurations
		const tocConfigs: Array<{ name: string; config: TOCConfiguration }> = [
			{
				name: "Default (H1-H3)",
				config: { enabled: true, minLevel: 1, maxLevel: 3 },
			},
			{
				name: "Full (H1-H6)",
				config: { enabled: true, minLevel: 1, maxLevel: 6 },
			},
			{
				name: "Minimal (H1-H2)",
				config: { enabled: true, minLevel: 1, maxLevel: 2 },
			},
		];

		// Read the comprehensive test markdown file created in subtask 5.1
		const testMarkdownPath = join(process.cwd(), "test-hyperlinks.md");
		console.log(`📖 Reading test document: test-hyperlinks.md`);
		const testContent = await readFile(testMarkdownPath, "utf-8");
		console.log(`✅ Loaded ${testContent.length} characters\n`);

		console.log("📝 Generating PDFs with different TOC configurations...\n");

		// Generate PDFs with different TOC configurations
		for (const { name, config } of tocConfigs) {
			console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
			console.log(`📑 Configuration: ${name}`);
			console.log(`   Enabled: ${config.enabled}`);
			console.log(`   Levels: H${config.minLevel} - H${config.maxLevel}`);
			console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

			const buffer = await generatePDF(testContent, theme, undefined, undefined, undefined, config);

			const filename = `inkpot-toc-test-h${config.minLevel}-h${config.maxLevel}.pdf`;
			const outputPath = join(homedir(), "Desktop", filename);
			await exportPDF(buffer, outputPath);

			console.log(`✅ PDF generated successfully (${buffer.length} bytes)`);
			console.log(`✅ Exported to: ${outputPath}\n`);
		}

		// Verification Instructions
		console.log("\n═══════════════════════════════════════════════════════════════");
		console.log("📋 MANUAL VERIFICATION REQUIRED - TABLE OF CONTENTS (Subtask 5.4)");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("📄 PDF Files Generated:\n");
		for (const { name, config } of tocConfigs) {
			const filename = `inkpot-toc-test-h${config.minLevel}-h${config.maxLevel}.pdf`;
			const outputPath = join(homedir(), "Desktop", filename);
			console.log(`   ${name}:`);
			console.log(`   ${outputPath}\n`);
		}

		console.log("🔍 Test Procedure:\n");

		console.log("1️⃣  TOC PAGE PRESENCE AND LOCATION");
		console.log("   Open each PDF and verify the TOC page:\n");
		console.log("   ✓ TOC page exists (should be page 1 or after cover if enabled)");
		console.log("   ✓ TOC appears BEFORE main content");
		console.log("   ✓ TOC page has clear 'Table of Contents' or 'Contents' title");
		console.log("   ✓ TOC is on its own dedicated page(s)\n");

		console.log("2️⃣  TOC HEADING LEVEL CONFIGURATION");
		console.log("   Verify TOC respects configured heading levels:\n");
		console.log("   For H1-H3 PDF:");
		console.log("   ✓ Shows H1 headings (e.g., 'Introduction', 'External Links')");
		console.log("   ✓ Shows H2 headings (e.g., 'Common Websites', 'Purpose')");
		console.log("   ✓ Shows H3 headings (e.g., subsections under H2)");
		console.log("   ✓ Does NOT show H4, H5, H6 headings\n");
		console.log("   For H1-H6 PDF:");
		console.log("   ✓ Shows ALL heading levels including H4, H5, H6");
		console.log("   ✓ Deep nesting visible in TOC\n");
		console.log("   For H1-H2 PDF:");
		console.log("   ✓ Shows only H1 and H2 headings");
		console.log("   ✓ H3 and deeper levels are excluded\n");

		console.log("3️⃣  TOC HIERARCHICAL INDENTATION");
		console.log("   Verify TOC entries are properly indented:\n");
		console.log("   ✓ H1 entries are flush left (no indentation)");
		console.log("   ✓ H2 entries are indented (12px from left)");
		console.log("   ✓ H3 entries are further indented (24px from left)");
		console.log("   ✓ H4 entries (if shown) are indented more (36px)");
		console.log("   ✓ Indentation increases consistently with heading level");
		console.log("   ✓ Visual hierarchy is clear and readable\n");

		console.log("4️⃣  TOC LINK FUNCTIONALITY");
		console.log("   Click each TOC entry and verify navigation:\n");
		console.log("   ✓ ALL TOC entries are clickable (cursor changes to pointer)");
		console.log("   ✓ Clicking navigates to the correct section in the document");
		console.log("   ✓ Target heading appears at/near top of viewport after click");
		console.log("   ✓ Links work for headings on same page as TOC");
		console.log("   ✓ Links work for headings on later pages");
		console.log("   ✓ No broken links or 'destination not found' errors");
		console.log("   ✓ Navigation is instant (no lag or errors)\n");

		console.log("5️⃣  TOC THEME STYLING");
		console.log("   Verify TOC respects theme colors and styling:\n");
		console.log("   ✓ TOC title uses heading color (#1a1a1a)");
		console.log("   ✓ TOC entries use link color (#0066CC)");
		console.log("   ✓ TOC entries are underlined (linkUnderline: true)");
		console.log("   ✓ Text is readable with good contrast");
		console.log("   ✓ Font matches theme settings (Helvetica)");
		console.log("   ✓ Font sizes are appropriate (smaller for deeper levels)");
		console.log("   ✓ Spacing between entries is consistent and readable\n");

		console.log("6️⃣  TOC ENTRY COMPLETENESS");
		console.log("   Verify all expected headings appear in TOC:\n");
		console.log("   ✓ Count headings in source document (test-hyperlinks.md)");
		console.log("   ✓ Count TOC entries in PDF");
		console.log("   ✓ Numbers match for configured heading levels");
		console.log("   ✓ No headings are missing from TOC");
		console.log("   ✓ No duplicate entries (unless headings are duplicated in source)");
		console.log("   ✓ Heading text matches exactly (no truncation or alteration)\n");

		console.log("7️⃣  TOC LINK ACCURACY - SPECIFIC TESTS");
		console.log("   Test specific TOC entries:\n");
		console.log("   ✓ Click 'Introduction' → navigates to Introduction heading");
		console.log("   ✓ Click 'External Links' → navigates to External Links section");
		console.log("   ✓ Click 'Internal Links' → navigates to Internal Links section");
		console.log("   ✓ Click 'Cross-Page Links' → navigates to Cross-Page section");
		console.log("   ✓ Click 'Edge Cases' → navigates to Edge Cases section");
		console.log("   ✓ Click 'Verification Checklist' → navigates to checklist");
		console.log("   ✓ Test nested heading (e.g., 'Common Websites' under 'External Links')");
		console.log("   ✓ Test deeply nested heading (H3+ if shown)\n");

		console.log("8️⃣  TOC SPECIAL CASES");
		console.log("   Test TOC with edge cases from test document:\n");
		console.log("   ✓ Duplicate headings appear in TOC with correct text");
		console.log("   ✓ Each duplicate TOC entry links to correct instance");
		console.log("   ✓ Headings with special characters appear correctly in TOC");
		console.log("   ✓ Unicode/emoji headings render correctly in TOC");
		console.log("   ✓ Long headings are not truncated");
		console.log("   ✓ Numbers and symbols in headings work in TOC\n");

		console.log("9️⃣  PDF VIEWER COMPATIBILITY");
		console.log("   Test TOC in multiple PDF viewers:\n");
		console.log("   macOS:");
		console.log("   ✓ Preview.app - TOC navigation works");
		console.log("   ✓ Chrome - TOC links function correctly");
		console.log("   ✓ Adobe Acrobat Reader (if available)\n");
		console.log("   Windows:");
		console.log("   ✓ Microsoft Edge - TOC navigation works");
		console.log("   ✓ Chrome - TOC links function");
		console.log("   ✓ Adobe Acrobat Reader\n");
		console.log("   Linux:");
		console.log("   ✓ Evince/Document Viewer - TOC works");
		console.log("   ✓ Firefox - TOC navigation");
		console.log("   ✓ Chrome\n");

		console.log("🔟 MULTI-PAGE TOC VERIFICATION");
		console.log("   If TOC spans multiple pages (for H1-H6 config):\n");
		console.log("   ✓ TOC continues seamlessly across pages");
		console.log("   ✓ All TOC entries remain clickable");
		console.log("   ✓ Page breaks don't cut off entries awkwardly");
		console.log("   ✓ Links work from all TOC pages\n");

		console.log("═══════════════════════════════════════════════════════════════");
		console.log("📝 ACCEPTANCE CRITERIA (Subtask 5.4)");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("✓ TOC lists all configured heading levels");
		console.log("✓ Each TOC entry links to correct section");
		console.log("✓ TOC respects theme styling\n");

		console.log("═══════════════════════════════════════════════════════════════");
		console.log("📊 TEST RESULTS CHECKLIST");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("After completing manual verification, check off:\n");

		console.log("TOC Page Presence:");
		console.log("[ ] TOC page exists in PDF");
		console.log("[ ] TOC appears after cover (if any) and before content");
		console.log("[ ] TOC has clear title ('Table of Contents' or 'Contents')");
		console.log("[ ] TOC is on dedicated page(s)\n");

		console.log("Heading Level Configuration:");
		console.log("[ ] H1-H3 PDF shows only H1, H2, H3 headings");
		console.log("[ ] H1-H6 PDF shows all heading levels");
		console.log("[ ] H1-H2 PDF shows only H1, H2 headings");
		console.log("[ ] No headings outside configured range appear");
		console.log("[ ] Configuration is respected correctly\n");

		console.log("Hierarchical Indentation:");
		console.log("[ ] H1 entries are not indented");
		console.log("[ ] H2 entries are indented");
		console.log("[ ] H3+ entries show progressive indentation");
		console.log("[ ] Visual hierarchy is clear");
		console.log("[ ] Indentation is consistent\n");

		console.log("Link Functionality:");
		console.log("[ ] All TOC entries are clickable");
		console.log("[ ] Clicking navigates to correct section");
		console.log("[ ] Target heading appears at/near top of viewport");
		console.log("[ ] No broken links");
		console.log("[ ] Works for same-page and cross-page links\n");

		console.log("Theme Styling:");
		console.log("[ ] TOC title uses heading color");
		console.log("[ ] TOC entries use link color (#0066CC)");
		console.log("[ ] Links are underlined");
		console.log("[ ] Text is readable with good contrast");
		console.log("[ ] Font matches theme (Helvetica)");
		console.log("[ ] Appropriate font sizes for different levels\n");

		console.log("Entry Completeness:");
		console.log("[ ] All expected headings appear in TOC");
		console.log("[ ] No missing headings");
		console.log("[ ] No unexpected duplicates");
		console.log("[ ] Heading text matches source exactly\n");

		console.log("Link Accuracy:");
		console.log("[ ] 'Introduction' link works");
		console.log("[ ] 'External Links' link works");
		console.log("[ ] 'Internal Links' link works");
		console.log("[ ] 'Cross-Page Links' link works");
		console.log("[ ] 'Edge Cases' link works");
		console.log("[ ] Nested heading links work");
		console.log("[ ] All specific tests pass\n");

		console.log("Special Cases:");
		console.log("[ ] Duplicate headings handled correctly");
		console.log("[ ] Special characters render correctly");
		console.log("[ ] Unicode/emoji headings work");
		console.log("[ ] Long headings not truncated\n");

		console.log("Viewer Compatibility:");
		console.log("[ ] Works in Preview.app / default viewer");
		console.log("[ ] Works in Chrome PDF viewer");
		console.log("[ ] Works in Adobe Acrobat (if tested)");
		console.log("[ ] Consistent across all viewers tested\n");

		console.log("Multi-Page TOC (if applicable):");
		console.log("[ ] TOC continues across pages correctly");
		console.log("[ ] All entries remain clickable");
		console.log("[ ] Page breaks are clean");
		console.log("[ ] Links work from all TOC pages\n");

		console.log("Overall:");
		console.log("[ ] All configured heading levels appear");
		console.log("[ ] Every TOC entry links to correct section");
		console.log("[ ] Theme styling is respected throughout");
		console.log("[ ] All acceptance criteria met\n");

		console.log("═══════════════════════════════════════════════════════════════");
		console.log("🎉 Test script completed successfully!");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("Next steps:");
		console.log("1. Open the generated PDFs from your Desktop:");
		for (const { name, config } of tocConfigs) {
			const filename = `inkpot-toc-test-h${config.minLevel}-h${config.maxLevel}.pdf`;
			console.log(`   - ${filename} (${name})`);
		}
		console.log("2. Follow the test procedure above for each PDF");
		console.log("3. Pay special attention to heading level filtering");
		console.log("4. Test in multiple PDF viewers if possible");
		console.log("5. Record test results in implementation_plan.json");
		console.log("6. Mark subtask 5.4 as 'completed' if all tests pass\n");

		console.log("📚 For detailed verification guide, see:");
		console.log("   .auto-claude/specs/003-working-pdf-hyperlinks/subtask-5.4-verification.md\n");
	} catch (error) {
		console.error("❌ TOC test failed:", error);
		console.error("\nPossible issues:");
		console.error("- test-hyperlinks.md file not found");
		console.error("- PDF generation error");
		console.error("- File write permission error");
		console.error("- TOC configuration issues\n");
		process.exit(1);
	}
}

// Run test
testTOC();
