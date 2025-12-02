# Research Report: Text Alignment Implementation

**Feature**: Text Alignment for Tiptap Editor
**Date**: 2025-12-01
**Status**: Research Complete

## Overview

This document consolidates research findings for implementing text alignment (Left, Center, Right) in InkPot's Tiptap-based editor with PDF export support.

## Research Questions Addressed

1. **Tiptap TextAlign Extension**: Integration patterns and capabilities
2. **PDF Export Mapping**: @react-pdf/renderer alignment syntax
3. **ProseMirror Schema**: Attribute persistence and serialization

---

## 1. Tiptap TextAlign Extension

### Decision

Use `@tiptap/extension-text-align` official extension.

### Rationale

- Official Tiptap extension, actively maintained
- Built-in keyboard shortcuts (Mod+Shift+L/E/R/J)
- Automatic undo/redo support via ProseMirror transactions
- Proven integration with StarterKit
- Zero custom schema work needed

### Package Details

```bash
npm install @tiptap/extension-text-align
```

**Version**: Available in Tiptap 2.x (current stable)

### Integration Code

```typescript
import TextAlign from '@tiptap/extension-text-align';

const editor = useEditor({
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: ['heading', 'paragraph'],  // Required! Empty by default
      alignments: ['left', 'center', 'right'],  // Omit 'justify' per spec
      defaultAlignment: 'left',
    }),
  ],
});
```

### Command API

```typescript
// Set alignment
editor.chain().focus().setTextAlign('center').run();

// Check active state
editor.isActive({ textAlign: 'center' }); // boolean

// Unset alignment (revert to default)
editor.chain().focus().unsetTextAlign().run();
```

### Toolbar Implementation

```tsx
<button
  onClick={() => editor.chain().focus().setTextAlign('left').run()}
  className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''}
>
  <AlignLeft />
</button>
```

### Document Storage

- **Storage Method**: Node attribute (not a mark)
- **Schema**: Global attribute added to specified node types
- **HTML Rendering**: Inline CSS `style="text-align: center"`
- **Persistence**: Automatic via ProseMirror state management

### Keyboard Shortcuts

Built-in shortcuts (macOS/Windows):
- Left: `Cmd/Ctrl + Shift + L`
- Center: `Cmd/Ctrl + Shift + E`
- Right: `Cmd/Ctrl + Shift + R`

**Note**: Per spec requirements, we'll override to use `Cmd/Ctrl + L/E/R` (without Shift).

### Alternatives Considered

- **Custom ProseMirror plugin**: Rejected - unnecessary complexity, reinventing wheel
- **CSS-only solution**: Rejected - doesn't persist in document model
- **Tiptap Marks**: Rejected - alignment is node-level, not inline formatting

### Known Limitations

1. **Firefox Bug**: `justify` + `white-space: pre-wrap` conflict ([Mozilla Bug #1253840](https://bugzilla.mozilla.org/show_bug.cgi?id=1253840))
   - **Mitigation**: Justify deferred to post-MVP per spec
2. **Empty types default**: Must configure `types: ['heading', 'paragraph']` or extension does nothing
3. **Node-level only**: Applies per paragraph, not to partial text selections (as designed)

---

## 2. PDF Export Mapping (@react-pdf/renderer)

### Decision

Direct 1:1 mapping from Tiptap alignment to @react-pdf/renderer `textAlign` property.

### Rationale

- @react-pdf/renderer uses standard CSS `textAlign` property
- Identical value set: `'left' | 'center' | 'right' | 'justify'`
- No transformation logic needed
- Existing PDF pipeline uses @react-pdf/renderer

### @react-pdf/renderer Syntax

```tsx
import { Text, View } from '@react-pdf/renderer';

<Text style={{ textAlign: 'center' }}>
  Centered text in PDF
</Text>

<View style={{ textAlign: 'right' }}>
  <Text>Right-aligned paragraph</Text>
</View>
```

### Valid Values

- `'left'` - Default
- `'center'` - Center alignment
- `'right'` - Right alignment
- `'justify'` - Full justification (deferred per spec)

### Mapping Implementation

**Step 1**: Extract alignment from Tiptap markdown parser

```typescript
interface MarkdownElement {
  type: 'paragraph' | 'heading' | ...;
  textAlign?: 'left' | 'center' | 'right';
  // ... other properties
}
```

**Step 2**: Apply in PDF component

```tsx
export const ParagraphElement: React.FC<{ element: MarkdownElement }> = ({ element }) => {
  return (
    <Text style={{
      textAlign: element.textAlign || 'left',
      // ... other styles
    }}>
      {element.content}
    </Text>
  );
};
```

### Integration Points

1. **Markdown Parser** (`src/main/pdf/markdown-parser.ts`):
   - Parse alignment from HTML `style="text-align: X"`
   - Add `textAlign` property to element metadata
   
2. **PDF Components** (`src/main/pdf/components/MarkdownElements.tsx`):
   - Read `textAlign` from element
   - Apply to `<Text>` or `<View>` style prop

### Alternatives Considered

- **Custom PDF layout engine**: Rejected - @react-pdf/renderer handles alignment natively
- **Image-based rendering**: Rejected - loses text selectability, increases file size
- **Multiple component variants**: Rejected - single component with style prop is cleaner

### Limitations

- @react-pdf/renderer justify may have minor differences from browser rendering (acceptable)
- No support for per-line alignment (not required by spec)

---

## 3. ProseMirror Schema & Persistence

### Decision

Use Tiptap's global attributes system for alignment; defer markdown serialization to future iteration.

### Rationale

- ProseMirror global attributes integrate seamlessly with existing schema
- Undo/redo works automatically via transaction system
- HTML persistence (interim) sufficient for MVP
- Markdown serialization can be added non-disruptively later

### Schema Modification Approach

**No manual schema changes needed** - Tiptap TextAlign extension uses `addGlobalAttributes()`:

```typescript
// Extension automatically adds to specified node types
addGlobalAttributes() {
  return [{
    types: ['heading', 'paragraph'],
    attributes: {
      textAlign: {
        default: 'left',
        parseHTML: element => element.style.textAlign,
        renderHTML: attributes => ({
          style: `text-align: ${attributes.textAlign}`
        }),
      },
    },
  }];
}
```

### Document State Storage

```typescript
// ProseMirror internal document state
{
  type: 'paragraph',
  attrs: {
    textAlign: 'center'  // Stored here
  },
  content: [...]
}
```

### Undo/Redo Integration

✅ **Works automatically** - no special handling needed:

1. Alignment changes create ProseMirror transactions
2. History plugin tracks attribute changes
3. Undo reverts `setNodeMarkup()` transaction
4. Redo reapplies original transaction

**Transaction Example**:
```typescript
tr.setNodeMarkup(pos, null, { textAlign: 'center' });
// History plugin records this transaction
// Undo inverts it: { textAlign: 'left' }
```

### Serialization Strategy

**Phase 1 (MVP)**: HTML-based persistence
```html
<p style="text-align: center">Centered text</p>
```

**Advantages**:
- Works immediately with Tiptap's built-in serialization
- No additional code needed
- HTML is valid markdown input for Tiptap

**Limitations**:
- Not "pure" markdown
- Git diffs show full style attribute

**Phase 2 (Future)**: Markdown comment-based metadata
```markdown
<!-- align:center -->
This paragraph is centered.
```

**Advantages**:
- Valid markdown (comments ignored)
- Human-readable
- Git-friendly
- Doesn't break existing parsers

**Implementation**:
```typescript
// Custom markdown serializer
markdown(state, node) {
  if (node.attrs.textAlign && node.attrs.textAlign !== 'left') {
    state.write(`<!-- align:${node.attrs.textAlign} -->\n`);
  }
  // ... existing paragraph serialization
}

// Custom markdown parser rule
{
  match: /^<!-- align:(left|center|right|justify) -->$/,
  node: 'paragraph',
  getAttrs: match => ({ textAlign: match[1] }),
}
```

### Migration Path

1. **Existing documents**: Load as-is (no alignment metadata) → default to `left`
2. **New documents**: Save with alignment attributes
3. **Version detection**: Optional `documentVersion: 2` metadata field
4. **Backward compatibility**: v1 documents render correctly (assume left alignment)

### Alternatives Considered

- **Frontmatter metadata**: Rejected - too coarse-grained (per-document, not per-paragraph)
- **Custom markdown syntax** (e.g., `::center`): Rejected - breaks standard markdown parsers
- **Separate JSON sidecar**: Rejected - creates file management complexity

### Best Practices

✅ **Do**:
- Use Tiptap's extension as-is (battle-tested)
- Start with HTML serialization (simplest path)
- Add markdown serialization in Phase 2 if needed
- Version document format for evolution

❌ **Don't**:
- Modify core ProseMirror schema manually
- Create custom undo/redo logic
- Persist default values (bloat)
- Break standard markdown compatibility

---

## Implementation Recommendations

### Phase 1: Editor Integration (MVP)

1. Install `@tiptap/extension-text-align`
2. Add to `TiptapEditor.tsx` extensions array
3. Create toolbar buttons with alignment icons
4. Override keyboard shortcuts to `Cmd/Ctrl+L/E/R`
5. Test undo/redo functionality

**Estimated Effort**: 4-6 hours

### Phase 2: PDF Export

1. Update `markdown-parser.ts` to extract `textAlign` from HTML styles
2. Add `textAlign` property to `MarkdownElement` interface
3. Apply alignment in `MarkdownElements.tsx` components
4. Test alignment fidelity in exported PDFs

**Estimated Effort**: 3-4 hours

### Phase 3: Markdown Persistence (Optional)

1. Implement comment-based serialization
2. Add custom parser rules
3. Update serializer in `markdown-serializer.ts`
4. Add migration logic for existing documents

**Estimated Effort**: 6-8 hours (deferred)

---

## Open Questions / Future Work

1. **Markdown serialization timing**: MVP uses HTML; when to add markdown comments?
2. **Document versioning**: Add `documentVersion` field to project metadata?
3. **Justify support**: Deferred to post-MVP; needs Firefox workaround research
4. **Table cell alignment**: Not in spec; consider for future enhancement

---

## References

- [Tiptap TextAlign Extension Docs](https://tiptap.dev/api/extensions/text-align)
- [@react-pdf/renderer Styling](https://react-pdf.org/styling)
- [ProseMirror Schema Guide](https://prosemirror.net/docs/guide/#schema)
- [Mozilla Bug #1253840](https://bugzilla.mozilla.org/show_bug.cgi?id=1253840) (Firefox justify issue)

---

## Approval

Research findings approved for implementation planning.

**Next Step**: Phase 1 - Data Model & Contracts
