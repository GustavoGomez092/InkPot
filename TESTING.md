# Testing Guide - External Link Functionality

## Quick Start - Test External Links (Subtask 5.2)

This guide provides instructions for testing external link functionality in PDF exports.

### Run the Test

```bash
npx tsx scripts/test-external-links.ts
```

This will:
1. Read the comprehensive test document (`test-hyperlinks.md`)
2. Generate a PDF with external links
3. Export the PDF to your Desktop as `inkpot-external-links-test.pdf`
4. Display detailed verification instructions

### What to Verify

After the PDF is generated:

1. **Open the PDF** on your Desktop: `inkpot-external-links-test.pdf`

2. **Navigate to "External Links" section** and click on links:
   - Google, GitHub, Stack Overflow, Wikipedia, MDN, etc.
   - Verify they open in your default browser
   - Verify correct URL is loaded

3. **Test special URL formats:**
   - Links with query parameters (GitHub search, Google Maps)
   - Links with fragments (MDN documentation with #examples)

4. **Check link styling:**
   - Links should be blue (#0066CC)
   - Links should be underlined
   - Good contrast with white background

5. **Test in multiple PDF viewers:**
   - macOS: Preview.app + Chrome
   - Windows: Edge + Chrome
   - Linux: Evince + Chrome

### Acceptance Criteria

✅ **PASS** if:
- All external links are clickable
- Clicking opens correct URL in browser
- Links work in at least 2 major PDF viewers (Preview/Edge + Chrome)

❌ **FAIL** if:
- Links are not clickable
- Links open wrong URLs
- Links don't work in major PDF viewers

### Detailed Verification Guide

See: `.auto-claude/specs/003-working-pdf-hyperlinks/subtask-5.2-verification.md`

### Other Test Scripts

- `scripts/test-pdf.ts` - Basic PDF generation test
- `scripts/test-hyperlinks-multipage.ts` - Cross-page internal links test
- `scripts/test-external-links.ts` - External links test (this one)
- `scripts/test-all-themes.ts` - Test all themes

### Troubleshooting

**Script won't run:**
```bash
# Try with full path
./node_modules/.bin/tsx scripts/test-external-links.ts

# Or install tsx globally
npm install -g tsx
```

**PDF not generated:**
- Check that `test-hyperlinks.md` exists in project root
- Check file permissions for Desktop folder
- Check console output for errors

**Links don't work:**
- Try a different PDF viewer
- Check browser default settings
- Verify PDF is not corrupted (re-generate if needed)

### Next Steps

After verifying external links work correctly:

1. Mark subtask 5.2 as completed in `implementation_plan.json`
2. Record test results in the verification document
3. Move on to subtask 5.3 (internal link navigation)

---

**Current Status:** External link test script ready for verification
**Last Updated:** 2026-01-07
