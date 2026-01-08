/**
 * Test Emoji PDF Generation
 * Tests emoji rendering in PDF exports to identify current failure modes
 */

import { homedir } from "node:os";
import { join } from "node:path";
import { exportPDF, generatePDF } from "../src/main/services/pdf-service.js";
import type { ThemeData } from "../src/shared/types/ipc-contracts.js";

async function testEmojiPDFGeneration() {
	try {
		console.log("🧪 Testing Emoji PDF Generation...\n");

		// Use a mock theme (Professional theme)
		const theme: ThemeData = {
			id: "test-emoji-theme",
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

		// Test markdown content with various emoji types
		const testContent = `# Emoji Rendering Test

This document tests various types of emojis to understand current rendering behavior in PDF exports.

## 1. Standard Unicode Emojis

Basic emojis that should render consistently:

- Smiling face: 😀
- Heart: ❤️
- Thumbs up: 👍
- Laughing: 😂
- Party popper: 🎉
- Fire: 🔥
- Check mark: ✅
- Star: ⭐
- Rocket: 🚀
- Globe: 🌍

**Test sentence:** I love 😀 using emojis 🎉 in my documents 📝 because they're fun! 🚀

## 2. Emoji with Skin Tone Modifiers

Emojis with Fitzpatrick scale modifiers (U+1F3FB through U+1F3FF):

- Light skin tone: 👍🏻 👋🏻 👶🏻
- Medium-light skin tone: 👍🏼 👋🏼 👶🏼
- Medium skin tone: 👍🏽 👋🏽 👶🏽
- Medium-dark skin tone: 👍🏾 👋🏾 👶🏾
- Dark skin tone: 👍🏿 👋🏿 👶🏿

**Test sentence:** People of all backgrounds 👋🏽 can use emojis 👍🏻 to express themselves 🙌🏿

## 3. Zero-Width Joiner (ZWJ) Sequences

Complex emojis composed of multiple codepoints joined with ZWJ (U+200D):

- Family: 👨‍👩‍👧 👨‍👩‍👧‍👦 👩‍👩‍👦
- Professions: 👨‍💻 👩‍⚕️ 👨‍🚀 👩‍🎨
- Activities: 🏃‍♂️ 🏃‍♀️ 🤦‍♂️ 🤦‍♀️
- Compound: 👨‍🦰 👩‍🦱 👨‍🦳 👩‍🦲

**Test sentence:** The 👨‍💻 developer worked with the 👩‍⚕️ doctor to help the 👨‍🚀 astronaut.

## 4. Flag Emojis

Regional indicator symbols (pairs of U+1F1E6 through U+1F1FF):

- United States: 🇺🇸
- United Kingdom: 🇬🇧
- France: 🇫🇷
- Germany: 🇩🇪
- Japan: 🇯🇵
- Canada: 🇨🇦
- Australia: 🇦🇺
- Brazil: 🇧🇷
- India: 🇮🇳
- China: 🇨🇳

**Test sentence:** I've traveled to 🇺🇸 🇬🇧 🇯🇵 and many other countries! 🌍

## 5. Keycap Sequences

Number and symbol keycaps (base + U+FE0F + U+20E3):

- Numbers: 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 0️⃣
- Symbols: #️⃣ *️⃣

**Test sentence:** The top 3️⃣ reasons to use emojis are fun 🎉 clarity ✅ and engagement 🚀

## 6. Emoji with Variation Selectors

Emojis with VS-16 (U+FE0F) for emoji presentation:

- Heavy black heart: ❤️ (with VS-16) vs ❤ (without)
- Check mark: ✅ (with VS-16) vs ✓ (without)
- Star: ⭐ (with VS-16)
- Sparkles: ✨ (with VS-16)

## 7. Mixed Content Test

A paragraph with emojis mixed throughout regular text to test inline rendering:

This is a normal sentence 📝 with emojis 😀 scattered throughout. Some have modifiers 👍🏽 and some are complex 👨‍💻 sequences. We might also see flags 🇺🇸 and keycaps 1️⃣ mixed in. The goal is to verify ✅ that emojis render correctly in context without disrupting ❌ the flow of text. Let's also test multiple emojis together: 🎉🎊🎈🎁🎀

## 8. Bold and Italic with Emojis

Testing emojis within formatted text:

- **Bold text with emoji:** This is **bold 😀 text** with emojis
- *Italic text with emoji:* This is *italic 🎉 text* with emojis
- **Bold and complex emoji:** This is **bold 👨‍💻 text** with ZWJ sequence

## 9. Lists with Emojis

Unordered list:
- 🚀 Rocket emoji item
- 🎉 Party emoji item
- ❤️ Heart emoji item

Ordered list:
1. First item with emoji 😀
2. Second item with emoji 🎉
3. Third item with emoji 🚀

## 10. Edge Cases

Testing potential problem scenarios:

- Multiple identical emojis: 😀😀😀😀😀
- Different emojis together: 😀🎉🚀❤️👍🏽👨‍💻🇺🇸1️⃣
- Emoji at start of line: 🎉 This line starts with emoji
- Emoji at end of line: This line ends with emoji 🎉
- Only emoji paragraph:

😀🎉🚀❤️👍

---

## Summary

This document tested the following emoji categories:
1. ✅ Standard Unicode emojis (10 examples)
2. ✅ Skin tone modifiers (15 examples)
3. ✅ ZWJ sequences (12 examples)
4. ✅ Flag emojis (10 examples)
5. ✅ Keycap sequences (12 examples)
6. ✅ Variation selectors (4 examples)
7. ✅ Mixed content (inline emojis)
8. ✅ Formatted text with emojis
9. ✅ Lists with emojis
10. ✅ Edge cases

**Total unique emoji tests: 63+ individual emoji instances**

Expected behavior: All emojis should render as colorful glyphs from the Apple emoji set.
Current behavior: [TO BE DOCUMENTED AFTER VISUAL INSPECTION]
`;

		console.log("📝 Generating emoji test PDF from markdown...\n");
		console.log(`📊 Test content includes ${testContent.length} characters\n`);

		// Generate PDF
		const startTime = Date.now();
		const buffer = await generatePDF(testContent, theme);
		const endTime = Date.now();

		const generationTime = endTime - startTime;

		console.log(`✅ PDF generated successfully (${buffer.length} bytes)`);
		console.log(`⏱️  Generation time: ${generationTime}ms\n`);

		// Export to desktop with descriptive filename
		const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
		const outputPath = join(
			homedir(),
			"Desktop",
			`inkpot-emoji-test-${timestamp}.pdf`,
		);
		await exportPDF(buffer, outputPath);

		console.log(`✅ PDF exported to: ${outputPath}\n`);

		// Report summary
		console.log("=" .repeat(60));
		console.log("📋 EMOJI TEST SUMMARY");
		console.log("=" .repeat(60));
		console.log("\nEmoji categories tested:");
		console.log("  ✅ Standard Unicode emojis (😀, ❤️, 👍, etc.)");
		console.log("  ✅ Skin tone modifiers (👍🏽, 👋🏿, etc.)");
		console.log("  ✅ ZWJ sequences (👨‍💻, 👨‍👩‍👧, etc.)");
		console.log("  ✅ Flag emojis (🇺🇸, 🇬🇧, etc.)");
		console.log("  ✅ Keycap sequences (1️⃣, #️⃣, etc.)");
		console.log("  ✅ Variation selectors (❤️ vs ❤)");
		console.log("  ✅ Mixed content and edge cases");
		console.log(`\n📈 Total emoji instances: 63+`);
		console.log(`⏱️  Generation time: ${generationTime}ms`);
		console.log(`📦 File size: ${(buffer.length / 1024).toFixed(2)} KB`);
		console.log("\n" + "=".repeat(60));
		console.log("\n📋 Next steps:");
		console.log("  1. Open the generated PDF on Desktop");
		console.log("  2. Visually inspect emoji rendering");
		console.log("  3. Document which emoji types render correctly");
		console.log("  4. Document which emoji types fail or show as boxes");
		console.log("  5. Update build-progress.txt with findings");
		console.log("\n🎉 Emoji test completed successfully!");
	} catch (error) {
		console.error("❌ Emoji PDF generation test failed:", error);
		if (error instanceof Error) {
			console.error("📋 Error details:", error.message);
			console.error("📚 Stack trace:", error.stack);
		}
		process.exit(1);
	}
}

// Run test
testEmojiPDFGeneration();
