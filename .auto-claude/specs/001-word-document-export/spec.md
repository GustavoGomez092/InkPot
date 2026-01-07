# Specification: Word Document Export Feature

## Overview

This feature extends InkPot's export capabilities from PDF-only to support multiple export formats, starting with Microsoft Word documents (.docx). The implementation will leverage the existing markdown parsing infrastructure and create a parallel document generation pipeline using the `docx` npm package. The architecture will be designed to be extensible for future format additions while maintaining backward compatibility with the existing PDF export functionality.

## Workflow Type

**Type**: feature

**Rationale**: This is a new capability being added to the application. It requires creating new services, IPC handlers, and UI components while preserving existing PDF export functionality. The task involves both backend document generation logic and frontend UI changes for format selection.

## Task Scope

### Services Involved
- **main** (primary) - Electron main process where document generation services and IPC handlers reside
- **renderer** (integration) - React frontend for UI changes to export dialog/format selection

### This Task Will:
- [ ] Install the `docx` npm package for Word document generation
- [ ] Create `src/main/services/docx-service.ts` with Word document generation logic
- [ ] Create `src/main/docx/Document.ts` for building Word documents from markdown elements
- [ ] Create `src/main/docx/elements/` components for rendering each markdown element type
- [ ] Add new IPC handlers for Word export (`docx:export`, `docx:preview`)
- [ ] Update IPC contracts with Word export types
- [ ] Add validation schemas for Word export requests
- [ ] Modify export UI to allow format selection (PDF vs Word)
- [ ] Add tests for Word document generation

### Out of Scope:
- Other export formats (HTML, Markdown, etc.) - future work
- Word import functionality
- Advanced Word features (track changes, comments, macros)
- Template system for Word documents
- Cover page support for Word documents (may be added later)

## Service Context

### Main Service

**Tech Stack:**
- Language: TypeScript
- Framework: React (renderer), Electron (main process)
- Build Tool: Vite
- Styling: Tailwind CSS
- Database: Prisma with LibSQL
- Testing: Vitest (unit), Playwright (e2e)

**Key Directories:**
- `src/main/` - Electron main process code
- `src/main/services/` - Service modules (pdf-service.ts, etc.)
- `src/main/pdf/` - PDF generation components
- `src/main/ipc/` - IPC handler registration
- `src/renderer/` - React frontend code
- `src/shared/` - Shared types and validation schemas

**Entry Point:** `src/main/index.ts`

**How to Run:**
```bash
npm run dev
```

**Port:** 3000 (Vite dev server)

## Files to Modify

| File | Service | What to Change |
|------|---------|---------------|
| `package.json` | main | Add `docx` dependency |
| `src/main/ipc/handlers.ts` | main | Add `docx:export` and `docx:preview` IPC handlers |
| `src/shared/types/ipc-contracts.ts` | shared | Add Word export request/response types and ElectronAPI interface |
| `src/shared/validation/schemas.ts` | shared | Add Zod schemas for Word export validation |
| `src/main/preload.ts` | main | Expose Word export methods to renderer |
| `src/renderer/views/EditorView.tsx` | renderer | Add export format selection UI |

## Files to Create

| File | Service | Purpose |
|------|---------|---------|
| `src/main/services/docx-service.ts` | main | Word document generation orchestration |
| `src/main/docx/Document.ts` | main | Build Word document from markdown elements |
| `src/main/docx/elements/Heading.ts` | main | Heading element converter |
| `src/main/docx/elements/Paragraph.ts` | main | Paragraph element converter |
| `src/main/docx/elements/List.ts` | main | List element converter |
| `src/main/docx/elements/CodeBlock.ts` | main | Code block element converter |
| `src/main/docx/elements/Table.ts` | main | Table element converter |
| `src/main/docx/elements/Image.ts` | main | Image element converter |
| `src/main/docx/elements/index.ts` | main | Element exports barrel file |
| `tests/unit/docx-service.test.ts` | tests | Unit tests for Word generation |

## Files to Reference

These files show patterns to follow:

| File | Pattern to Copy |
|------|----------------|
| `src/main/services/pdf-service.ts` | Service structure, export function signatures, error handling |
| `src/main/pdf/Document.tsx` | Document generation flow, theme application, element processing |
| `src/main/pdf/markdown-parser.ts` | MarkdownElement interface, parseMarkdown function |
| `src/main/pdf/components/MarkdownElements.tsx` | Element type switching pattern, theme-based styling |
| `src/main/ipc/handlers.ts` | IPC handler registration pattern, validation, database access |
| `src/shared/types/ipc-contracts.ts` | Type definition patterns for IPC |

## Patterns to Follow

### Service Structure Pattern

From `src/main/services/pdf-service.ts`:

```typescript
import { writeFile } from "node:fs/promises";
import type { ThemeData } from "@shared/types/ipc-contracts.js";

export interface CoverData {
  hasCoverPage: boolean;
  title?: string | null;
  // ... other fields
}

export async function generatePDF(
  content: string,
  theme: ThemeData,
  projectDir?: string,
  coverData?: CoverData,
  mermaidDiagrams?: Record<string, string>,
): Promise<Buffer> {
  try {
    console.log("📄 Generating PDF with theme:", theme.name);
    // ... generation logic
    console.log("✅ PDF generated successfully");
    return Buffer.from(buffer);
  } catch (error) {
    console.error("❌ PDF generation failed:", error);
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function exportPDF(
  buffer: Buffer,
  filePath: string,
): Promise<void> {
  await writeFile(filePath, buffer);
}
```

**Key Points:**
- Use descriptive console logging with emojis for debugging
- Wrap operations in try/catch with meaningful error messages
- Separate generation from export (buffer vs file)
- Accept theme data for styling
- Use consistent function signatures

### IPC Handler Pattern

From `src/main/ipc/handlers.ts`:

```typescript
ipcMain.handle(
  "pdf:export",
  wrapIPCHandler(async (args) => {
    const { projectId, outputPath, openAfterExport, mermaidDiagrams } =
      exportPDFSchema.parse(args);

    // Get project with theme
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { theme: true },
    });

    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    // ... rest of handler logic

    return { success: true, filePath: outputPath };
  }),
);
```

**Key Points:**
- Use `wrapIPCHandler` for consistent error handling
- Validate input with Zod schema
- Fetch related data (project, theme) from database
- Return structured response object

### Element Conversion Pattern

The docx library uses a programmatic approach instead of React components:

```typescript
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

// Creating headings
new Paragraph({
  text: "My Heading",
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 400, after: 200 },
});

// Creating styled text
new Paragraph({
  children: [
    new TextRun({ text: "Bold text", bold: true }),
    new TextRun({ text: "Normal text" }),
  ],
});

// Export to buffer
const buffer = await Packer.toBuffer(doc);
```

**Key Points:**
- Use `HeadingLevel.HEADING_1` through `HEADING_6` (constants, not strings)
- Create separate `Paragraph` elements for line breaks (never use `\n` in TextRun)
- Measurements are in DXA units (1440 DXA = 1 inch, 20 DXA = 1 point)
- Images REQUIRE the `type` parameter ('png', 'jpg', etc.)
- Lists use `LevelFormat.BULLET` constant, not string 'bullet'

## Requirements

### Functional Requirements

1. **Word Document Generation**
   - Description: Generate .docx files from markdown content using the same parsing infrastructure as PDF
   - Acceptance: User can export any project to .docx format and open in Microsoft Word or compatible applications

2. **Theme Application**
   - Description: Apply project theme styling (fonts, colors, sizes) to Word document elements
   - Acceptance: Word documents reflect the same visual hierarchy as PDF exports (heading sizes, body text styling)

3. **Markdown Element Support**
   - Description: Support all markdown elements that PDF export supports
   - Acceptance: Headings, paragraphs, lists (ordered/unordered), code blocks, blockquotes, tables, and images render correctly

4. **Export Format Selection**
   - Description: UI allows user to choose between PDF and Word export
   - Acceptance: Export dialog/button provides format selection option

5. **File Dialog Integration**
   - Description: Save dialog uses appropriate file extension filter for selected format
   - Acceptance: Saving as Word shows .docx filter, saving as PDF shows .pdf filter

### Edge Cases

1. **Empty Document** - Generate valid but empty Word document
2. **Very Large Documents** - Handle memory efficiently for large content
3. **Missing Images** - Show placeholder text instead of crashing
4. **Special Characters** - Properly encode special characters in text
5. **Complex Tables** - Handle tables with varying column counts gracefully
6. **Unsupported Fonts** - Fall back to standard fonts if custom fonts unavailable

## Implementation Notes

### DO
- Follow the pattern in `pdf-service.ts` for the service structure
- Reuse `parseMarkdown()` from `markdown-parser.ts` - do not duplicate parsing logic
- Use DXA units for all measurements (1440 = 1 inch, 20 = 1 point)
- Create separate Paragraph elements for each line/block
- Always specify image `type` parameter ('png', 'jpg', 'gif', etc.)
- Use `LevelFormat.BULLET` constant for bullet lists
- Handle errors gracefully with meaningful messages
- Add console logging for debugging

### DON'T
- Create a new markdown parser - reuse existing infrastructure
- Use `\n` in TextRun content - create separate Paragraphs instead
- Use string literals for list formats - use constants
- Omit image type parameter - it's required
- Modify existing PDF export code - keep it separate
- Use unicode bullet characters - use proper list formatting

## Development Environment

### Start Services

```bash
# Install dependencies (including new docx package)
npm install

# Start development server
npm run dev
```

### Service URLs
- Development: http://localhost:3000

### Required Dependencies

To be added to package.json:
```json
{
  "dependencies": {
    "docx": "^8.5.0"
  }
}
```

### Key docx Imports

```typescript
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  HeadingLevel,
  AlignmentType,
  LevelFormat,
  NumberFormat,
  WidthType,
  BorderStyle,
  ShadingType,
  convertInchesToTwip,
} from "docx";
```

## Success Criteria

The task is complete when:

1. [ ] `docx` npm package is installed and importable
2. [ ] `src/main/services/docx-service.ts` generates valid Word documents
3. [ ] All markdown element types render correctly in Word format
4. [ ] IPC handlers `docx:export` work end-to-end
5. [ ] Export UI allows format selection (PDF/Word)
6. [ ] Generated Word documents open correctly in Microsoft Word and LibreOffice
7. [ ] No console errors during export process
8. [ ] Existing PDF export functionality still works
9. [ ] Unit tests pass for Word generation service

## QA Acceptance Criteria

**CRITICAL**: These criteria must be verified by the QA Agent before sign-off.

### Unit Tests

| Test | File | What to Verify |
|------|------|----------------|
| Generate empty document | `tests/unit/docx-service.test.ts` | Empty content produces valid .docx |
| Generate with headings | `tests/unit/docx-service.test.ts` | All heading levels (H1-H6) render |
| Generate with lists | `tests/unit/docx-service.test.ts` | Ordered and unordered lists render |
| Generate with code blocks | `tests/unit/docx-service.test.ts` | Code blocks have monospace font |
| Generate with tables | `tests/unit/docx-service.test.ts` | Tables render with correct structure |
| Theme application | `tests/unit/docx-service.test.ts` | Theme colors and fonts are applied |
| Error handling | `tests/unit/docx-service.test.ts` | Graceful handling of invalid input |

### Integration Tests

| Test | Services | What to Verify |
|------|----------|----------------|
| IPC Export Flow | main ↔ renderer | `docx:export` handler returns success |
| Project Loading | main ↔ database | Theme and content are fetched correctly |
| File System Write | main ↔ filesystem | .docx file is written to specified path |

### End-to-End Tests

| Flow | Steps | Expected Outcome |
|------|-------|------------------|
| Export to Word | 1. Open project 2. Click Export 3. Select Word format 4. Save | Valid .docx file created at location |
| Format Selection | 1. Click Export 2. Toggle between PDF/Word | Dialog updates file extension filter |
| Open After Export | 1. Export with "open after" checked | System opens file with default app |

### Manual Verification

| Check | Method | Expected |
|-------|--------|----------|
| Word document opens | Open in Microsoft Word | Document displays correctly |
| Word document opens | Open in LibreOffice Writer | Document displays correctly |
| Word document opens | Open in Google Docs | Document displays correctly |
| Formatting preserved | Compare to PDF export | Similar visual hierarchy |
| Images display | Export document with images | Images visible in Word |
| Tables display | Export document with tables | Tables have proper borders/structure |

### QA Sign-off Requirements
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Manual verification complete in Word/LibreOffice
- [ ] No regressions in existing PDF export functionality
- [ ] Code follows established patterns from pdf-service.ts
- [ ] No security vulnerabilities introduced
- [ ] Console logging follows project conventions
- [ ] Error messages are user-friendly
