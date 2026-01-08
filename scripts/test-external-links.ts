/**
 * Test External Link Functionality
 * Subtask 5.2: Generate PDF with test document and verify external URLs are clickable and open in browser
 */

import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { exportPDF, generatePDF, type TOCConfiguration } from "../src/main/services/pdf-service.js";
import type { ThemeData } from "../src/shared/types/ipc-contracts.js";

async function testExternalLinks() {
	try {
		console.log("🧪 Testing External Link Functionality (Subtask 5.2)...\n");

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

		// TOC configuration - enable TOC for full testing
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

		console.log("📝 Generating PDF with external links...\n");

		// Generate PDF with TOC enabled
		const buffer = await generatePDF(testContent, theme, undefined, undefined, undefined, tocConfig);

		console.log(`✅ PDF generated successfully (${buffer.length} bytes)\n`);

		// Export to desktop
		const outputPath = join(homedir(), "Desktop", "inkpot-external-links-test.pdf");
		await exportPDF(buffer, outputPath);

		console.log(`✅ PDF exported to: ${outputPath}\n`);

		// Verification Instructions
		console.log("═══════════════════════════════════════════════════════════════");
		console.log("📋 MANUAL VERIFICATION REQUIRED - EXTERNAL LINKS (Subtask 5.2)");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("📄 PDF Location:");
		console.log(`   ${outputPath}\n`);

		console.log("🔍 Test Procedure:\n");

		console.log("1️⃣  EXTERNAL LINK CLICKABILITY");
		console.log("   Open the PDF and navigate to the 'External Links' section.");
		console.log("   Verify the following external links are clickable:\n");
		console.log("   ✓ Google (https://www.google.com)");
		console.log("   ✓ GitHub (https://github.com)");
		console.log("   ✓ Stack Overflow (https://stackoverflow.com)");
		console.log("   ✓ Wikipedia (https://en.wikipedia.org)");
		console.log("   ✓ MDN Web Docs (https://developer.mozilla.org)");
		console.log("   ✓ Anthropic (https://www.anthropic.com)");
		console.log("   ✓ React Documentation (https://react.dev)");
		console.log("   ✓ TypeScript Handbook (https://www.typescriptlang.org/docs/)");
		console.log("   ✓ Node.js (https://nodejs.org)\n");

		console.log("2️⃣  LINK BEHAVIOR");
		console.log("   Click on each external link and verify:");
		console.log("   ✓ Link opens in your default web browser");
		console.log("   ✓ Correct URL is loaded (matches the link text)");
		console.log("   ✓ No errors or broken links\n");

		console.log("3️⃣  SPECIAL URL FORMATS");
		console.log("   Test these special cases:\n");
		console.log("   ✓ Links with query parameters:");
		console.log("     - GitHub Search for React");
		console.log("     - Google Maps (San Francisco)");
		console.log("   ✓ Links with fragment identifiers:");
		console.log("     - MDN: Array.map() (should navigate to #examples section)\n");

		console.log("4️⃣  LINK STYLING");
		console.log("   Verify visual appearance:");
		console.log("   ✓ Links use theme color (#0066CC - blue)");
		console.log("   ✓ Links are underlined");
		console.log("   ✓ Links are visually distinct from regular text");
		console.log("   ✓ Good contrast with background (white)\n");

		console.log("5️⃣  PDF VIEWER COMPATIBILITY");
		console.log("   Test in multiple PDF viewers:\n");
		console.log("   macOS:");
		console.log("   ✓ Preview.app");
		console.log("   ✓ Chrome/Safari (built-in PDF viewer)");
		console.log("   ✓ Adobe Acrobat Reader (if available)\n");
		console.log("   Windows:");
		console.log("   ✓ Microsoft Edge");
		console.log("   ✓ Chrome (built-in PDF viewer)");
		console.log("   ✓ Adobe Acrobat Reader\n");
		console.log("   Linux:");
		console.log("   ✓ Evince/GNOME Document Viewer");
		console.log("   ✓ Firefox (built-in PDF viewer)");
		console.log("   ✓ Chrome (built-in PDF viewer)\n");

		console.log("═══════════════════════════════════════════════════════════════");
		console.log("📝 ACCEPTANCE CRITERIA (Subtask 5.2)");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("✓ External links are clickable in PDF viewer");
		console.log("✓ Clicking opens URL in default browser");
		console.log("✓ Links work in major PDF viewers (Preview, Chrome, Acrobat)\n");

		console.log("═══════════════════════════════════════════════════════════════");
		console.log("📊 TEST RESULTS");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("After completing manual verification, record results:\n");
		console.log("[ ] All external links are clickable");
		console.log("[ ] Links open correct URLs in browser");
		console.log("[ ] Links work in Preview.app (macOS)");
		console.log("[ ] Links work in Chrome PDF viewer");
		console.log("[ ] Links work in Adobe Acrobat (if tested)");
		console.log("[ ] Link styling is correct (color, underline)");
		console.log("[ ] Query parameters preserved");
		console.log("[ ] Fragment identifiers preserved\n");

		console.log("═══════════════════════════════════════════════════════════════");
		console.log("🎉 Test script completed successfully!");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("Next steps:");
		console.log("1. Open the generated PDF");
		console.log("2. Follow the test procedure above");
		console.log("3. Record test results in implementation_plan.json");
		console.log("4. Mark subtask 5.2 as 'completed' if all tests pass\n");
	} catch (error) {
		console.error("❌ External link test failed:", error);
		console.error("\nPossible issues:");
		console.error("- test-hyperlinks.md file not found");
		console.error("- PDF generation error");
		console.error("- File write permission error\n");
		process.exit(1);
	}
}

// Run test
testExternalLinks();
