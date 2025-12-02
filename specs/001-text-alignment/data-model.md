# Data Model: Text Alignment

**Feature**: Text Alignment
**Date**: 2025-12-01
**Status**: Design Complete

## Overview

Text alignment is implemented as a node-level attribute in the Tiptap/ProseMirror document model. No new database entities are required; alignment extends existing `Document` and `Paragraph` concepts.

---

## Entities

### 1. Document

**Description**: User project file containing rich text content with formatting metadata.

**Attributes**:
- `id`: string (existing)
- `title`: string (existing)
- `content`: ProseMirror JSON (existing) - **contains alignment metadata**
- `contentHtml`: string (existing) - **serialized with inline alignment styles**
- `updatedAt`: timestamp (existing)

**Alignment Storage**:
Alignment is embedded within `content` as node attributes, not a separate field.

**Example ProseMirror JSON**:
```json
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": "center"
      },
      "content": [
        {
          "type": "text",
          "text": "Centered paragraph"
        }
      ]
    },
    {
      "type": "heading",
      "attrs": {
        "level": 1,
        "textAlign": "right"
      },
      "content": [
        {
          "type": "text",
          "text": "Right-aligned heading"
        }
      ]
    }
  ]
}
```

**HTML Serialization**:
```html
<p style="text-align: center">Centered paragraph</p>
<h1 style="text-align: right">Right-aligned heading</h1>
```

**Changes**:
- ✅ No schema migration needed
- ✅ Alignment added via Tiptap extension's global attributes
- ✅ Existing documents compatible (default to `left`)

---

### 2. TextBlock / Paragraph

**Description**: Editable node type in the ProseMirror schema representing a paragraph or heading.

**Attributes**:
- `type`: 'paragraph' | 'heading' (existing)
- `textAlign`: 'left' | 'center' | 'right' | undefined (new)
- `level`: number (existing, for headings)
- `content`: inline content array (existing)

**Alignment Metadata**:
- **Type**: Node attribute (not a mark)
- **Default**: `left` (or undefined, treated as left)
- **Scope**: Per-node (each paragraph/heading has independent alignment)
- **Inheritance**: None (child nodes don't inherit alignment)

**Valid Values**:
| Value | Description | Spec Status |
|-------|-------------|-------------|
| `'left'` | Left alignment (default) | ✅ MVP |
| `'center'` | Center alignment | ✅ MVP |
| `'right'` | Right alignment | ✅ MVP |
| `'justify'` | Full justification | ❌ Deferred |
| `undefined` | No explicit alignment (treated as left) | ✅ Default |

**Validation Rules**:
1. Value MUST be one of: `'left'`, `'center'`, `'right'`, or undefined
2. Empty string treated as undefined
3. Invalid values ignored (fallback to default)
4. Only applied to node types: `paragraph`, `heading`

**Example Node**:
```typescript
{
  type: 'paragraph',
  attrs: {
    textAlign: 'center'
  },
  content: [
    { type: 'text', text: 'Centered text' }
  ]
}
```

---

### 3. Exported PDF

**Description**: Rendered PDF output generated from `Document` content.

**Attributes**:
- `filePath`: string (export destination)
- `theme`: ThemeData (existing - page size, margins, fonts)
- `elements`: MarkdownElement[] (parsed from document HTML)

**Alignment Integration**:

**MarkdownElement Interface** (extended):
```typescript
interface MarkdownElement {
  type: 'paragraph' | 'heading' | 'list' | ...;
  content?: string | MarkdownElement[];
  textAlign?: 'left' | 'center' | 'right';  // NEW
  // ... other properties (level, ordered, etc.)
}
```

**PDF Rendering**:
```tsx
// In MarkdownElements.tsx
export const ParagraphElement: React.FC<ParagraphElementProps> = ({ element, theme }) => {
  return (
    <Text style={{
      fontSize: theme.bodyFontSize,
      textAlign: element.textAlign || 'left',  // Apply alignment
      // ... other styles
    }}>
      {renderInlineContent(element.content)}
    </Text>
  );
};
```

**Changes**:
- ✅ Add `textAlign` to `MarkdownElement` interface
- ✅ Parse alignment from HTML `style` attribute in `markdown-parser.ts`
- ✅ Apply `textAlign` style in PDF components

---

## State Transitions

### Alignment Lifecycle

```
┌─────────────────────────────────────────────────────┐
│ 1. User Action (Toolbar Click / Keyboard Shortcut) │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│ 2. Tiptap Command: setTextAlign('center')          │
│    → ProseMirror Transaction                        │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│ 3. Document State Updated                           │
│    node.attrs.textAlign = 'center'                  │
│    History plugin records transaction               │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│ 4. Editor Re-renders with Alignment                 │
│    <p style="text-align: center">...</p>            │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│ 5. Save: Serialize to HTML                          │
│    contentHtml stored in database                   │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│ 6. Export: Parse HTML → MarkdownElement             │
│    element.textAlign = 'center'                     │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│ 7. PDF Render: Apply textAlign style                │
│    <Text style={{ textAlign: 'center' }}>          │
└─────────────────────────────────────────────────────┘
```

### Undo/Redo Flow

```
User applies alignment (center)
  → Transaction T1: { textAlign: 'left' } → { textAlign: 'center' }
  → History stack: [T1]

User undoes
  → History inverts T1: { textAlign: 'center' } → { textAlign: 'left' }
  → Redo stack: [T1]

User redoes
  → History replays T1: { textAlign: 'left' } → { textAlign: 'center' }
```

---

## Relationships

```
Document (1)
  │
  ├─ content (ProseMirror JSON)
  │    │
  │    └─ nodes (*)
  │         │
  │         └─ Paragraph/Heading
  │              └─ attrs.textAlign: 'left' | 'center' | 'right'
  │
  ├─ contentHtml (HTML serialization)
  │    │
  │    └─ <p style="text-align: center">...</p>
  │
  └─ Export to PDF (1)
       │
       └─ MarkdownElement (*)
            └─ textAlign: 'left' | 'center' | 'right'
```

**Relationships**:
- Document **has many** TextBlocks (via `content` JSON)
- TextBlock **has one** alignment value (via `textAlign` attribute)
- Document **exports to** PDF (via IPC)
- PDF **contains** MarkdownElements (parsed from HTML)
- MarkdownElement **has one** alignment value (mapped from TextBlock)

---

## Validation Rules

### Editor Level (Tiptap)

1. **Type Restriction**:
   - Alignment ONLY applies to: `paragraph`, `heading`
   - Ignored for: `listItem`, `codeBlock`, `blockquote`, `table` (no alignment in MVP)

2. **Value Validation**:
   ```typescript
   const VALID_ALIGNMENTS = ['left', 'center', 'right'] as const;
   
   function isValidAlignment(value: string): boolean {
     return VALID_ALIGNMENTS.includes(value as any);
   }
   ```

3. **Command Validation**:
   - `setTextAlign()` returns `false` if value not in `alignments` config
   - Invalid values logged as warnings, not errors

### PDF Export Level

1. **Fallback Logic**:
   ```typescript
   const textAlign = element.textAlign || 'left';
   ```

2. **Type Validation**:
   ```typescript
   type TextAlign = 'left' | 'center' | 'right';
   
   function sanitizeAlignment(value: unknown): TextAlign {
     if (typeof value === 'string' && ['left', 'center', 'right'].includes(value)) {
       return value as TextAlign;
     }
     return 'left';
   }
   ```

---

## Migration & Backward Compatibility

### Existing Documents

**Scenario**: Documents created before alignment feature

**Behavior**:
- Load without errors (alignment attribute optional)
- Paragraphs with no `textAlign` attribute render as left-aligned
- No data migration required

**Example**:
```json
// Old document (pre-alignment)
{
  "type": "paragraph",
  "content": [{ "type": "text", "text": "Old paragraph" }]
}

// Renders as: <p>Old paragraph</p>
// PDF exports as: <Text style={{ textAlign: 'left' }}>
```

### New Documents

**Behavior**:
- Alignment saved when explicitly set by user
- Default (left) alignment NOT saved (keeps document compact)
- HTML serialization includes `style="text-align: X"` when non-default

**Example**:
```json
// New document with center alignment
{
  "type": "paragraph",
  "attrs": {
    "textAlign": "center"
  },
  "content": [{ "type": "text", "text": "Centered paragraph" }]
}
```

---

## Performance Considerations

### Storage Impact

**Document Size**:
- Alignment adds ~25 bytes per aligned paragraph: `"textAlign":"center",`
- Typical document (100 paragraphs, 30% aligned): +750 bytes (~0.75 KB)
- **Impact**: Negligible

### Query Performance

**No database queries affected**:
- Alignment stored in `content` JSON (existing field)
- No new indexes needed
- No additional database reads/writes

### Render Performance

**Editor**:
- Tiptap re-renders aligned nodes via React (optimized by React 19 compiler)
- No manual memoization needed
- **Impact**: <10ms for alignment changes

**PDF Export**:
- Alignment parsed once during HTML-to-MarkdownElement conversion
- Applied as inline style during PDF render
- **Impact**: <1ms per element

---

## Type Definitions

```typescript
// src/shared/types/ipc-contracts.ts

export type TextAlignment = 'left' | 'center' | 'right';

export interface MarkdownElement {
  type: 'paragraph' | 'heading' | 'list' | 'code' | 'quote' | 'table' | 'image' | 'hr' | 'br';
  content?: string | MarkdownElement[];
  textAlign?: TextAlignment;  // NEW
  // ... existing properties
}

// src/renderer/editor/types.ts

export interface TiptapNodeAttrs {
  textAlign?: TextAlignment;
  level?: number;
  // ... other attributes
}
```

---

## Testing Strategy

### Unit Tests

1. **Tiptap Extension Integration**:
   - Verify `textAlign` attribute added to paragraph/heading nodes
   - Test command: `setTextAlign('center')` updates node attrs
   - Test active state: `isActive({ textAlign: 'center' })` returns correct value

2. **Markdown Parser**:
   - Parse `<p style="text-align: center">` → `{ textAlign: 'center' }`
   - Fallback for missing/invalid alignment → `{ textAlign: 'left' }`

3. **PDF Components**:
   - Render `<Text style={{ textAlign: 'center' }}>` correctly
   - Default alignment when `textAlign` undefined

### Integration Tests

1. **Editor → PDF**:
   - Apply center alignment in editor
   - Export to PDF
   - Verify PDF text is centered

2. **Undo/Redo**:
   - Apply alignment → Undo → Verify reverted → Redo → Verify reapplied

3. **Persistence**:
   - Save document with alignment
   - Reload document
   - Verify alignment preserved

---

## Summary

**Data Model Changes**:
- ✅ No new entities
- ✅ No database migrations
- ✅ Add `textAlign` attribute to Tiptap nodes (via extension)
- ✅ Add `textAlign` property to `MarkdownElement` interface
- ✅ Backward compatible with existing documents

**Next Steps**:
- Generate IPC contracts (none required for this feature)
- Create quickstart.md for developers
- Update agent context
