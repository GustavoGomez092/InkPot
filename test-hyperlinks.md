# Comprehensive Hyperlink Test Document

This document provides comprehensive testing for all hyperlink functionality including external URLs, internal heading links, table of contents markers, and various edge cases.

## Quick Navigation

- [Introduction](#introduction)
- [External Links](#external-links)
- [Internal Links](#internal-links)
- [Cross-Page Links](#cross-page-links)
- [Edge Cases](#edge-cases)
- [Verification Checklist](#verification-checklist)

---

## Introduction

This test document validates the following hyperlink features:

1. **External URLs**: HTTP/HTTPS links that open in browser
2. **Internal Links**: References to headings within this document
3. **Table of Contents**: Auto-generated TOC with clickable entries
4. **Edge Cases**: Special characters, duplicates, and unusual formatting

### Purpose

The purpose of this document is to ensure that all hyperlinks work correctly in exported PDFs, addressing the critical pain points from Obsidian (lost internal links) and Pandoc (hyperlink rendering issues).

### Test Coverage

This document includes:
- Multiple heading levels (H1 through H6) for TOC testing
- Forward links (early sections → later sections)
- Backward links (later sections → earlier sections)
- Same-page links
- External links to various domains
- Duplicate headings with numbered suffixes
- Special characters in headings and links

---

## External Links

### Common Websites

Test that these external URLs are clickable and open in the default browser:

- [Google](https://www.google.com) - Search engine
- [GitHub](https://github.com) - Code hosting platform
- [Stack Overflow](https://stackoverflow.com) - Developer Q&A
- [Wikipedia](https://en.wikipedia.org) - Encyclopedia
- [MDN Web Docs](https://developer.mozilla.org) - Web development documentation

### Secure HTTPS Links

All links should use HTTPS protocol:

- [Anthropic](https://www.anthropic.com)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js](https://nodejs.org)

### Link with Query Parameters

- [GitHub Search for React](https://github.com/search?q=react&type=repositories)
- [Google Maps](https://www.google.com/maps?q=San+Francisco)

### Link with Fragment Identifiers

- [MDN: Array.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#examples)

---

## Internal Links

### Basic Internal Links

These links reference other sections in this document:

- Jump to [Introduction](#introduction)
- Jump to [External Links](#external-links)
- Jump to [Edge Cases](#edge-cases)
- Jump to [Verification Checklist](#verification-checklist)

### Links to Subsections

Test links to nested heading levels:

- [Purpose](#purpose) (H3)
- [Test Coverage](#test-coverage) (H3)
- [Common Websites](#common-websites) (H3)
- [Secure HTTPS Links](#secure-https-links) (H3)

### Same-Section Links

Link to a heading in the same section: [Basic Internal Links](#basic-internal-links)

---

## Cross-Page Links

This section tests links that may span across page boundaries in the PDF.

### Long Content Section 1

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Link to section far below: [Long Content Section 5](#long-content-section-5)

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

### Long Content Section 2

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.

Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.

Link back to [Introduction](#introduction) and forward to [Edge Cases](#edge-cases).

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.

### Long Content Section 3

Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.

Id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.

Link to [Long Content Section 1](#long-content-section-1) (backward link).

Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.

#### Subsection 3.1

This is a level 4 heading. Link to [Subsection 3.2](#subsection-32).

Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum. Donec id elit non mi porta gravida at eget metus.

#### Subsection 3.2

This is another level 4 heading. Link back to [Subsection 3.1](#subsection-31).

Maecenas sed diam eget risus varius blandit sit amet non magna. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper.

### Long Content Section 4

Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla sed consectetur.

Etiam porta sem malesuada magna mollis euismod. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec sed odio dui.

Link to [Verification Checklist](#verification-checklist) at the end of the document.

Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula ut id elit.

##### Level 5 Heading

This is a level 5 heading to test deeper nesting. Link to [Level 6 Heading](#level-6-heading).

Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Duis mollis, est non commodo luctus.

###### Level 6 Heading

This is a level 6 heading (the deepest level). Link back to [Level 5 Heading](#level-5-heading).

Nisi erat porttitor ligula, eget lacinia odio sem nec elit. Sed posuere consectetur est at lobortis. Cras justo odio, dapibus ac facilisis in, egestas eget quam.

### Long Content Section 5

This section is referenced from [Long Content Section 1](#long-content-section-1) above.

Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Cras mattis consectetur purus sit amet fermentum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.

Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.

Link to multiple sections:
- [Introduction](#introduction)
- [External Links](#external-links)
- [Internal Links](#internal-links)
- [Edge Cases](#edge-cases)

---

## Edge Cases

This section tests various edge cases for anchor generation and link resolution.

### Special Characters

Test headings with punctuation and special characters:

#### Hello, World!

This heading has a comma and exclamation mark. Test link: [Hello, World!](#hello-world)

#### Question? Answer!

Multiple punctuation marks. Test link: [Question? Answer!](#question-answer)

#### 100% Success Rate

Heading with percentage symbol. Test link: [100% Success Rate](#100-success-rate)

#### Test #123 & More

Heading with hash and ampersand. Test link: [Test #123 & More](#test-123--more)

#### "Quoted Heading"

Heading with quotation marks. Test link: ["Quoted Heading"](#quoted-heading)

#### Heading with (Parentheses)

Heading with parentheses. Test link: [Heading with (Parentheses)](#heading-with-parentheses)

### Duplicate Headings

Test handling of duplicate heading text with numbered suffixes:

#### Introduction

This is a duplicate "Introduction" heading (the original is at the top). This should get anchor ID `introduction-1`.

Test links:
- Link to first [Introduction](#introduction) (should go to the top)
- Link to this duplicate [Introduction](#introduction-1) (should stay here)

#### Introduction

A third "Introduction" heading. This should get anchor ID `introduction-2`.

Link to this third [Introduction](#introduction-2).

### Unicode and International Characters

Test headings with unicode characters:

#### Café ☕

Heading with accented character and emoji. Link: [Café ☕](#café-)

#### 日本語 (Japanese)

Heading with Japanese characters. Link: [日本語 (Japanese)](#日本語-japanese)

#### Über & Äpfel

Heading with German umlauts. Link: [Über & Äpfel](#über--äpfel)

### Very Long Heading That Spans Multiple Lines When Displayed and Tests How The Anchor ID Generation Handles Extremely Long Text

This heading is intentionally very long to test anchor ID generation for lengthy headings.

Link to this section: [Very Long Heading...](#very-long-heading-that-spans-multiple-lines-when-displayed-and-tests-how-the-anchor-id-generation-handles-extremely-long-text)

### Numbers and Symbols

#### 2024 Roadmap

Heading starting with numbers. Link: [2024 Roadmap](#2024-roadmap)

#### Version 1.2.3

Heading with semantic versioning. Link: [Version 1.2.3](#version-123)

#### $100 Budget

Heading with dollar sign. Link: [$100 Budget](#100-budget)

### Mixed Case Testing

#### CamelCaseHeading

All one word in camel case. Link: [CamelCaseHeading](#camelcaseheading)

#### UPPERCASE HEADING

All uppercase heading. Link: [UPPERCASE HEADING](#uppercase-heading)

#### lowercase heading

All lowercase heading. Link: [lowercase heading](#lowercase-heading)

---

## Verification Checklist

Use this checklist to verify that all hyperlink functionality is working correctly in the exported PDF.

### External Link Verification

- [ ] All external HTTPS links are clickable
- [ ] Clicking external links opens them in the default browser
- [ ] External links work in multiple PDF viewers (Preview, Chrome, Acrobat)
- [ ] Links with query parameters work correctly
- [ ] Links with fragment identifiers work correctly

### Internal Link Verification

- [ ] All internal #heading links are clickable
- [ ] Clicking internal links navigates to the correct heading
- [ ] Same-page links work correctly
- [ ] Forward links (to later sections) work correctly
- [ ] Backward links (to earlier sections) work correctly
- [ ] Cross-page links work when heading is on different page

### Table of Contents Verification

- [ ] TOC is generated and appears after cover page
- [ ] TOC includes all configured heading levels
- [ ] TOC entries are clickable
- [ ] Clicking TOC entry navigates to correct section
- [ ] TOC respects theme styling (colors, fonts, indentation)
- [ ] TOC hierarchy reflects heading levels correctly

### Edge Case Verification

- [ ] Headings with special characters work as link destinations
- [ ] Duplicate headings have unique anchor IDs (with -1, -2 suffixes)
- [ ] Links to duplicate headings navigate to correct instance
- [ ] Unicode characters in headings work correctly
- [ ] Very long headings work as link destinations
- [ ] Headings with numbers and symbols work correctly
- [ ] Case-insensitive link matching works

### Link Styling Verification

- [ ] All links use theme.linkColor consistently
- [ ] Link underline setting is respected (theme.linkUnderline)
- [ ] Links are visually distinct from regular text
- [ ] Link colors have good contrast with background
- [ ] Hover states work (if supported by PDF viewer)

### Overall Functionality

- [ ] All links preserve their destinations across page breaks
- [ ] Page numbering is correct with TOC enabled
- [ ] No broken links or unresolved references
- [ ] No console warnings about unresolved links
- [ ] PDF meets accessibility standards for links

---

## Test Results

**Document Generated**: [Date/Time]
**PDF Viewer Used**: [Viewer Name/Version]
**Test Status**: [ ] PASS / [ ] FAIL

### Issues Found

List any issues discovered during testing:

1.
2.
3.

### Notes

Additional observations or comments:

---

## Conclusion

This comprehensive test document validates all hyperlink functionality for InkPot's PDF export feature. If all verification checkboxes pass, the hyperlink implementation meets the acceptance criteria and addresses the identified pain points from Obsidian and Pandoc.

**Expected Outcomes:**
- ✅ External URLs are clickable and open in browser
- ✅ Internal links navigate to correct locations in PDF
- ✅ Links are visually styled consistently per theme
- ✅ Link destinations are preserved across page breaks
- ✅ Table of contents entries link to corresponding sections

---

*End of Comprehensive Hyperlink Test Document*
