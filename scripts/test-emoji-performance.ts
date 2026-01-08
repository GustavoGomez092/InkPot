/**
 * Emoji Performance Validation Test - Subtask 4.2
 *
 * Dedicated performance test to verify that emoji processing adds less than 100ms
 * overhead to typical documents. This test measures:
 * - Baseline performance (document without emojis)
 * - Emoji performance (document with 50+ emojis)
 * - Performance delta to isolate emoji processing overhead
 */

import { generatePDF } from "../src/main/services/pdf-service.js";
import type { ThemeData } from "../src/shared/types/ipc-contracts.js";
import { countEmojis } from "../src/main/pdf/utils/emoji-utils.js";

// Performance test configuration
const PERFORMANCE_THRESHOLD_MS = 100; // Maximum acceptable overhead
const EMOJI_COUNT_TARGET = 50; // Minimum emojis for realistic test
const TEST_ITERATIONS = 5; // Run multiple times for accurate average

interface PerformanceResult {
	iteration: number;
	generationTime: number;
	emojiCount: number;
	contentLength: number;
}

async function measurePerformance(
	content: string,
	theme: ThemeData,
	label: string,
): Promise<PerformanceResult[]> {
	const results: PerformanceResult[] = [];
	const emojiCount = countEmojis(content);
	const contentLength = content.length;

	console.log(`\n  Testing: ${label}`);
	console.log(`  Content: ${contentLength} chars, ${emojiCount} emojis`);
	console.log(`  Running ${TEST_ITERATIONS} iterations...`);

	for (let i = 0; i < TEST_ITERATIONS; i++) {
		const startTime = Date.now();
		await generatePDF(content, theme);
		const endTime = Date.now();
		const generationTime = endTime - startTime;

		results.push({
			iteration: i + 1,
			generationTime,
			emojiCount,
			contentLength,
		});

		process.stdout.write(`    Iteration ${i + 1}: ${generationTime}ms\n`);
	}

	return results;
}

function calculateStats(results: PerformanceResult[]) {
	const times = results.map((r) => r.generationTime);
	const sum = times.reduce((a, b) => a + b, 0);
	const avg = sum / times.length;
	const min = Math.min(...times);
	const max = Math.max(...times);
	const sorted = [...times].sort((a, b) => a - b);
	const median =
		times.length % 2 === 0
			? (sorted[times.length / 2 - 1] + sorted[times.length / 2]) / 2
			: sorted[Math.floor(times.length / 2)];

	return { avg, min, max, median };
}

async function testEmojiPerformance() {
	console.log("╔═══════════════════════════════════════════════════════════════╗");
	console.log("║         EMOJI PERFORMANCE VALIDATION - SUBTASK 4.2           ║");
	console.log("╚═══════════════════════════════════════════════════════════════╝\n");

	try {
		// Standard theme for consistent testing
		const theme: ThemeData = {
			id: "performance-test",
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

		console.log("📊 PERFORMANCE TEST OBJECTIVE\n");
		console.log("  • Measure baseline performance (document without emojis)");
		console.log("  • Measure emoji performance (document with 50+ emojis)");
		console.log("  • Calculate emoji processing overhead");
		console.log(`  • Verify overhead <${PERFORMANCE_THRESHOLD_MS}ms\n`);

		// Baseline test: Document without emojis
		const baselineContent = `# Performance Test Document

This is a typical markdown document without emojis, used to establish baseline performance metrics.

## Introduction

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Section 1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Subsection 1.1

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

#### Subsection 1.1.1

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Section 2

- First list item with regular text
- Second list item with regular text
- Third list item with regular text
- Fourth list item with regular text
- Fifth list item with regular text

### Lists and Tables

1. Numbered item one
2. Numbered item two
3. Numbered item three
4. Numbered item four
5. Numbered item five

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data A1  | Data B1  | Data C1  |
| Data A2  | Data B2  | Data C2  |
| Data A3  | Data B3  | Data C3  |

## Section 3

> This is a blockquote with regular text.
> It contains multiple lines.
> And tests typical formatting.

More paragraph text with **bold** and *italic* formatting. Also testing [links](https://example.com) and \`inline code\`.

## Conclusion

Final paragraph to complete the baseline document. This provides a realistic document structure for performance comparison.
`;

		// Emoji test: Document with 50+ emojis distributed throughout
		const emojiContent = `# Performance Test Document 📊

This is a typical markdown document with emojis distributed throughout, used to measure emoji processing overhead 🎯

## Introduction 🚀

Lorem ipsum dolor sit amet, consectetur adipiscing elit 😀 Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua 🎉

## Section 1 ✨

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat 👍

### Subsection 1.1 🌟

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur ❤️

#### Subsection 1.1.1 ⭐

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum ✅

## Section 2 🔥

- First list item with emoji 😊
- Second list item with emoji 🎈
- Third list item with emoji 🌈
- Fourth list item with skin tone emoji 👋🏽
- Fifth list item with ZWJ emoji 👨‍💻

### Lists and Tables 📋

1. Numbered item one 1️⃣
2. Numbered item two 2️⃣
3. Numbered item three 3️⃣
4. Numbered item four 4️⃣
5. Numbered item five 5️⃣

| Column 1 😀 | Column 2 🎉 | Column 3 🚀 |
|-------------|-------------|-------------|
| Data A1 ✅  | Data B1 ❤️  | Data C1 ⭐  |
| Data A2 👍  | Data B2 🔥  | Data C2 ✨  |
| Data A3 🌟  | Data B3 💫  | Data C3 ⚡  |

## Section 3 💭

> This is a blockquote with emojis 🎯
> It contains multiple lines 📝
> And tests emoji formatting 🎨

More paragraph text with **bold 🎪** and *italic 🎭* formatting. Also testing [links with emoji 🔗](https://example.com) and inline text 📄

### Additional Emoji Coverage 🎊

Testing various emoji types:
- Basic: 😀 😃 😄 😁 😆
- Variation selectors: ❤️ ✅ ⭐ ✨ 💫
- Skin tones: 👋🏻 👋🏼 👋🏽 👋🏾 👋🏿
- ZWJ sequences: 👨‍👩‍👧 👨‍💻 👩‍⚕️
- Flags: 🇺🇸 🇬🇧 🇫🇷 🇩🇪 🇯🇵
- Keycaps: #️⃣ *️⃣

## Conclusion 🎉

Final paragraph to complete the emoji document 🏁 This provides a realistic document structure with distributed emojis for accurate performance measurement 📊✨
`;

		console.log("═══════════════════════════════════════════════════════════════");
		console.log("TEST 1: BASELINE PERFORMANCE (NO EMOJIS)");
		console.log("═══════════════════════════════════════════════════════════════");

		const baselineResults = await measurePerformance(
			baselineContent,
			theme,
			"Document without emojis",
		);
		const baselineStats = calculateStats(baselineResults);

		console.log("\n  Statistics:");
		console.log(`    Average:  ${baselineStats.avg.toFixed(2)}ms`);
		console.log(`    Median:   ${baselineStats.median.toFixed(2)}ms`);
		console.log(`    Min:      ${baselineStats.min}ms`);
		console.log(`    Max:      ${baselineStats.max}ms`);

		console.log("\n═══════════════════════════════════════════════════════════════");
		console.log("TEST 2: EMOJI PERFORMANCE (50+ EMOJIS)");
		console.log("═══════════════════════════════════════════════════════════════");

		const emojiResults = await measurePerformance(
			emojiContent,
			theme,
			"Document with 50+ emojis",
		);
		const emojiStats = calculateStats(emojiResults);

		console.log("\n  Statistics:");
		console.log(`    Average:  ${emojiStats.avg.toFixed(2)}ms`);
		console.log(`    Median:   ${emojiStats.median.toFixed(2)}ms`);
		console.log(`    Min:      ${emojiStats.min}ms`);
		console.log(`    Max:      ${emojiStats.max}ms`);

		// Calculate overhead
		const avgOverhead = emojiStats.avg - baselineStats.avg;
		const medianOverhead = emojiStats.median - baselineStats.median;
		const emojiCount = countEmojis(emojiContent);

		console.log("\n═══════════════════════════════════════════════════════════════");
		console.log("PERFORMANCE ANALYSIS");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("📊 Results Summary:\n");
		console.log(`  Baseline (no emojis):`);
		console.log(`    • Average: ${baselineStats.avg.toFixed(2)}ms`);
		console.log(`    • Median:  ${baselineStats.median.toFixed(2)}ms\n`);

		console.log(`  With emojis (${emojiCount} instances):`);
		console.log(`    • Average: ${emojiStats.avg.toFixed(2)}ms`);
		console.log(`    • Median:  ${emojiStats.median.toFixed(2)}ms\n`);

		console.log(`  Emoji Processing Overhead:`);
		console.log(`    • Average overhead: ${avgOverhead.toFixed(2)}ms`);
		console.log(`    • Median overhead:  ${medianOverhead.toFixed(2)}ms`);
		console.log(
			`    • Per emoji:        ${(avgOverhead / emojiCount).toFixed(3)}ms\n`,
		);

		// Validation
		const performancePass = avgOverhead < PERFORMANCE_THRESHOLD_MS;
		const performanceStatus = performancePass ? "✅ PASS" : "❌ FAIL";

		console.log("🎯 Performance Validation:\n");
		console.log(
			`  ${performanceStatus} Overhead: ${avgOverhead.toFixed(2)}ms (threshold: <${PERFORMANCE_THRESHOLD_MS}ms)`,
		);
		console.log(`  ${emojiCount >= EMOJI_COUNT_TARGET ? "✅" : "❌"} Emoji count: ${emojiCount} (target: ${EMOJI_COUNT_TARGET}+)`);

		if (performancePass) {
			console.log(`\n  ✅ Emoji processing overhead is within acceptable limits!`);
			console.log(
				`  ✅ Performance impact is minimal (${avgOverhead.toFixed(2)}ms for ${emojiCount} emojis)`,
			);
		} else {
			console.log(`\n  ❌ WARNING: Emoji processing overhead exceeds threshold!`);
			console.log(`  ⚠️  Consider optimization of emoji detection or rendering logic.`);
		}

		console.log("\n═══════════════════════════════════════════════════════════════");
		console.log("DETAILED METRICS");
		console.log("═══════════════════════════════════════════════════════════════\n");

		console.log("Performance Characteristics:");
		console.log(`  • Total test iterations: ${TEST_ITERATIONS} per test`);
		console.log(`  • Document size: ~${baselineContent.length} characters`);
		console.log(`  • Emoji density: ${emojiCount} emojis in ${emojiContent.length} chars`);
		console.log(
			`  • Processing rate: ${(emojiCount / (emojiStats.avg / 1000)).toFixed(0)} emojis/second`,
		);
		console.log(
			`  • Relative overhead: ${((avgOverhead / baselineStats.avg) * 100).toFixed(2)}% increase\n`,
		);

		console.log("Emoji Types Tested:");
		console.log("  • Basic Unicode emojis: 😀 🎉 🚀");
		console.log("  • Variation selectors: ❤️ ✅ ⭐");
		console.log("  • Skin tone modifiers: 👋🏽 👍🏾");
		console.log("  • ZWJ sequences: 👨‍💻 👩‍⚕️ 👨‍👩‍👧");
		console.log("  • Regional flags: 🇺🇸 🇬🇧 🇫🇷");
		console.log("  • Keycap sequences: 1️⃣ #️⃣ *️⃣\n");

		console.log("Implementation Details:");
		console.log("  • Emoji detection: Intl.Segmenter with grapheme clustering");
		console.log("  • Text segmentation: splitTextIntoSegments() utility");
		console.log("  • Rendering: React-PDF with Font.registerEmojiSource()");
		console.log("  • Emoji source: CDN-based PNG images (64x64)\n");

		console.log("═══════════════════════════════════════════════════════════════\n");

		// Final status
		if (performancePass) {
			console.log("🎉 PERFORMANCE TEST PASSED!\n");
			console.log(
				`Emoji processing adds only ${avgOverhead.toFixed(2)}ms overhead for typical documents.`,
			);
			console.log(
				"This meets the acceptance criteria of <100ms additional processing.\n",
			);
		} else {
			console.log("❌ PERFORMANCE TEST FAILED\n");
			console.log(
				`Emoji processing adds ${avgOverhead.toFixed(2)}ms overhead, exceeding the ${PERFORMANCE_THRESHOLD_MS}ms threshold.`,
			);
			console.log("Performance optimization required.\n");
		}

		// Exit with appropriate code
		process.exit(performancePass ? 0 : 1);
	} catch (error) {
		console.error("\n❌ PERFORMANCE TEST ERROR\n");
		console.error("Error:", error);
		if (error instanceof Error) {
			console.error("Message:", error.message);
			console.error("Stack:", error.stack);
		}
		console.error("\n═══════════════════════════════════════════════════════════════\n");
		process.exit(1);
	}
}

// Run performance test
testEmojiPerformance();
