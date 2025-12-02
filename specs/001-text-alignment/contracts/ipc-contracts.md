# IPC Contracts: Text Alignment

**Feature**: Text Alignment
**Date**: 2025-12-01
**Status**: No New Contracts Required

## Overview

Text alignment is a renderer-only feature that does not require new IPC channels. Alignment is handled entirely within the Tiptap editor (renderer process) and persisted as part of the existing document content.

---

## Existing IPC Channels (Unmodified)

The following existing IPC channels continue to handle document operations, including alignment metadata:

### 1. `project:save`

**Direction**: Renderer → Main

**Purpose**: Save project content to file system

**Request**:
```typescript
interface SaveProjectRequest {
  projectId: string;
  content: string;  // HTML with alignment: <p style="text-align: center">
  contentMarkdown?: string;
}
```

**Response**:
```typescript
interface SaveProjectResponse {
  success: boolean;
  error?: string;
}
```

**Alignment Integration**:
- `content` field includes HTML with inline alignment styles
- No changes to request/response structure
- Alignment persists automatically via existing serialization

**Example**:
```typescript
// Renderer
ipcRenderer.invoke('project:save', {
  projectId: 'proj_123',
  content: '<p style="text-align: center">Centered text</p>',
  contentMarkdown: '<!-- align:center -->\nCentered text'
});
```

---

### 2. `project:load`

**Direction**: Renderer → Main

**Purpose**: Load project content from file system

**Request**:
```typescript
interface LoadProjectRequest {
  projectId: string;
}
```

**Response**:
```typescript
interface LoadProjectResponse {
  success: boolean;
  project?: {
    id: string;
    title: string;
    content: string;  // HTML with alignment
    contentMarkdown?: string;
    // ... other fields
  };
  error?: string;
}
```

**Alignment Integration**:
- `content` field contains HTML with alignment styles
- Tiptap parses alignment from `style="text-align: X"` automatically
- No changes to request/response structure

---

### 3. `pdf:export`

**Direction**: Renderer → Main

**Purpose**: Export document to PDF

**Request**:
```typescript
interface ExportPDFRequest {
  projectId: string;
  coverPage?: {
    title?: string;
    subtitle?: string;
    author?: string;
    // ...
  };
  theme: ThemeData;
  outputPath: string;
}
```

**Response**:
```typescript
interface ExportPDFResponse {
  success: boolean;
  filePath?: string;
  error?: string;
}
```

**Alignment Integration**:
- Main process loads project content (includes alignment HTML)
- `markdown-parser.ts` extracts `textAlign` from HTML styles
- PDF components render with alignment
- No changes to request/response structure

**Flow**:
```
Renderer                           Main Process
   │                                    │
   ├─ pdf:export ──────────────────────>│
   │  { projectId, theme, ... }         │
   │                                    │
   │                                    ├─ Load project content
   │                                    │  (HTML with alignment)
   │                                    │
   │                                    ├─ Parse HTML → MarkdownElements
   │                                    │  { textAlign: 'center', ... }
   │                                    │
   │                                    ├─ Render PDF with alignment
   │                                    │  <Text style={{ textAlign }}>
   │                                    │
   │<────────────── response ───────────┤
   │  { success: true, filePath }       │
```

---

## Type Extensions (No IPC Changes)

While IPC contracts remain unchanged, internal type definitions are extended:

### MarkdownElement (Main Process)

**File**: `src/main/pdf/markdown-parser.ts`

```typescript
// Extended to include textAlign
interface MarkdownElement {
  type: 'paragraph' | 'heading' | 'list' | 'code' | 'quote' | 'table' | 'image' | 'hr' | 'br';
  content?: string | MarkdownElement[];
  textAlign?: 'left' | 'center' | 'right';  // NEW - parsed from HTML
  level?: number;
  ordered?: boolean;
  // ... other properties
}
```

**Changes**:
- ✅ Add `textAlign` property
- ✅ Parse from HTML `style` attribute
- ❌ No IPC contract changes

---

## Security Considerations

### No New Attack Surface

- Alignment is CSS styling metadata (no code execution risk)
- HTML sanitization (existing) applies to alignment styles
- No file system access beyond existing `project:save`/`project:load`
- No new IPC channels introduced

### Existing Security Measures (Sufficient)

1. **Context Isolation**: Enabled ✅
2. **Node Integration**: Disabled ✅
3. **Sandbox**: Enabled ✅
4. **IPC Validation**: Main process validates all inputs ✅

---

## Validation

### Main Process (IPC Handlers)

**No new validation required** - existing handlers suffice:

```typescript
// src/main/ipc/handlers.ts (unchanged)

ipcMain.handle('project:save', async (_event, request: SaveProjectRequest) => {
  // Existing validation
  if (!request.projectId || !request.content) {
    return { success: false, error: 'Invalid request' };
  }
  
  // Save content (includes alignment HTML)
  // No special handling for alignment
  return projectService.save(request);
});
```

### PDF Parser (New Validation)

**File**: `src/main/pdf/markdown-parser.ts`

```typescript
function parseAlignmentFromStyle(styleAttr: string): TextAlignment | undefined {
  const match = /text-align:\s*(left|center|right|justify)/i.exec(styleAttr);
  if (!match) return undefined;
  
  const value = match[1].toLowerCase();
  
  // Validate alignment value
  if (['left', 'center', 'right'].includes(value)) {
    return value as TextAlignment;
  }
  
  // Ignore 'justify' (deferred) or invalid values
  return undefined;
}
```

---

## Error Handling

### Renderer Process

**Scenario**: Alignment command fails (rare)

```typescript
try {
  editor.chain().focus().setTextAlign('center').run();
} catch (error) {
  console.warn('Alignment command failed:', error);
  // Graceful degradation - alignment remains unchanged
}
```

### Main Process (PDF Export)

**Scenario**: Invalid alignment in HTML

```typescript
// markdown-parser.ts
const alignment = parseAlignmentFromStyle(element.getAttribute('style'));
// If invalid, alignment = undefined → defaults to 'left' in PDF component
```

**Scenario**: PDF render fails with alignment style

```typescript
// MarkdownElements.tsx
const textAlign = element.textAlign || 'left';  // Fallback
<Text style={{ textAlign }}>  // @react-pdf/renderer handles invalid values
```

---

## Testing Requirements

### IPC Contract Tests (No Changes Needed)

Existing tests for `project:save`, `project:load`, `pdf:export` continue to work:

```typescript
describe('project:save', () => {
  it('saves content with alignment HTML', async () => {
    const request = {
      projectId: 'test_proj',
      content: '<p style="text-align: center">Test</p>',
    };
    const response = await ipcRenderer.invoke('project:save', request);
    expect(response.success).toBe(true);
  });
});
```

### Integration Tests (New)

**Test PDF export with alignment**:

```typescript
describe('pdf:export with alignment', () => {
  it('exports PDF with centered text', async () => {
    // Setup: Create project with centered paragraph
    const projectId = await createTestProject({
      content: '<p style="text-align: center">Centered</p>',
    });
    
    // Export PDF
    const response = await ipcRenderer.invoke('pdf:export', {
      projectId,
      theme: defaultTheme,
      outputPath: '/tmp/test.pdf',
    });
    
    expect(response.success).toBe(true);
    
    // Verify PDF contains centered text
    const pdfContent = await parsePDF(response.filePath);
    expect(pdfContent).toContainCenteredText('Centered');
  });
});
```

---

## Documentation Requirements

### For Developers

**No IPC documentation updates needed** - alignment is transparent to IPC layer.

**Internal documentation**:
1. **Comment in `markdown-parser.ts`**: Explain alignment parsing logic
2. **Comment in `MarkdownElements.tsx`**: Document alignment style application
3. **README update**: Mention alignment feature in changelog

### For Users

**User-facing documentation**:
- Keyboard shortcuts: `Cmd/Ctrl + L/E/R` for alignment
- Toolbar buttons: Visual indicators for alignment
- PDF export: "Alignment is preserved in PDF exports"

---

## Migration Path

### Phase 1 (MVP) - Current

- ✅ No IPC changes
- ✅ Alignment in HTML serialization
- ✅ Existing IPC channels handle alignment transparently

### Phase 2 (Future) - Markdown Serialization

**Potential IPC contract change** (if needed):

```typescript
// Future: Add markdownVersion to track serialization format
interface SaveProjectRequest {
  projectId: string;
  content: string;  // HTML (legacy)
  contentMarkdown?: string;  // Markdown with comment-based alignment
  markdownVersion?: 2;  // NEW - indicates comment-based alignment support
}
```

**Migration strategy**:
- Opt-in: Clients send `markdownVersion: 2` to enable comment serialization
- Backward compatible: Older clients continue using HTML serialization
- Main process detects version and serializes accordingly

---

## Summary

**IPC Contract Status**: ✅ No changes required

**Existing Contracts Sufficient**:
- `project:save` handles alignment via HTML content
- `project:load` loads alignment via HTML content  
- `pdf:export` exports alignment via HTML parsing

**Internal Type Extensions**:
- `MarkdownElement` gains `textAlign` property (main process only)
- No shared types updated (no IPC contract impact)

**Security**: ✅ No new risks, existing measures sufficient

**Testing**: ✅ Existing IPC tests continue to pass, new integration tests added

**Next Steps**:
- Create `quickstart.md` for developers
- Update agent context with alignment feature
