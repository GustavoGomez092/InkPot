# Text Alignment Research Report

## Executive Summary

This report covers how ProseMirror and Tiptap handle text alignment through schema modifications, attribute persistence, and serialization. The findings inform the implementation approach for InkPot's markdown-based document system.

---

## 1. Schema Modification & Attribute Storage

### How Tiptap TextAlign Extension Works

The TextAlign extension uses **global attributes** to add alignment capabilities to multiple node types without modifying each node's base schema:

```typescript
// Core mechanism from Tiptap source
const TextAlign = Extension.create({
  addGlobalAttributes() {
    return [
      {
        types: ['heading', 'paragraph'],  // Which nodes get alignment
        attributes: {
          textAlign: {
            default: 'left',
            renderHTML: (attributes) => ({
              style: `text-align: ${attributes.textAlign}`
            }),
            parseHTML: (element) => element.style.textAlign || 'left',
          },
        },
      },
    ]
  },
})
```

**Key Points:**
- **Non-destructive**: Attributes are added to existing nodes, not replacing them
- **Configurable target nodes**: Via `types` array configuration
- **Default values**: Ensures nodes always have a valid alignment state
- **Rendering**: Outputs as inline CSS `style` attribute in DOM

### ProseMirror Node Attribute System

In ProseMirror, node attributes are stored in the document model as plain JavaScript objects:

```typescript
// Document structure
Node {
  type: NodeType,
  attrs: { textAlign: 'center', ... },  // Attributes stored here
  content: Fragment,
  marks: [...]
}
```

**Characteristics:**
- **First-class citizens**: Attributes are part of the immutable document state
- **Schema-validated**: Only attributes defined in schema can be set
- **Persistent**: Automatically preserved through transactions
- **Type-safe**: Can specify validation and default values

---

## 2. Document State & Persistence

### Attribute Persistence in ProseMirror

Attributes persist automatically through ProseMirror's immutable state management:

1. **Transaction-based updates**: Changes flow through transactions
2. **State derivation**: New states derived from old + transaction
3. **Structural sharing**: Unchanged nodes reused (efficient)
4. **No manual tracking**: Framework handles persistence

```typescript
// How attributes persist
const tr = state.tr;
tr.setNodeMarkup(pos, null, { textAlign: 'center' }); // Update attribute
const newState = state.apply(tr); // New state with persisted change
```

### Undo/Redo Compatibility

✅ **Fully compatible with undo history**

- History plugin tracks all transactions including attribute changes
- `setNodeMarkup` creates steps that can be inverted
- No special handling required for alignment
- Works out of the box with `prosemirror-history`

---

## 3. Serialization Approaches

### Option A: HTML with Style Attributes (Tiptap Default)

**How it works:**
```typescript
renderHTML: (attributes) => ({
  style: `text-align: ${attributes.textAlign}`
})
```

**Pros:**
- ✅ Standard HTML - works everywhere
- ✅ Browser-native rendering
- ✅ No custom parsing needed
- ✅ Rich ecosystem support

**Cons:**
- ❌ Not pure markdown
- ❌ Loses semantic intent in plain text
- ❌ Requires HTML parser for round-trip

### Option B: Extended Markdown Syntax

**Common approaches:**

1. **Comment-based metadata:**
```markdown
<!-- {textAlign: center} -->
This paragraph is centered
```

2. **Attribute syntax (Pandoc-style):**
```markdown
{.text-center}
This paragraph is centered
```

3. **Custom markers:**
```markdown
->: This paragraph is centered
```

**Pros:**
- ✅ Markdown-compatible
- ✅ Human-readable
- ✅ Plain text friendly
- ✅ Version control diff-friendly

**Cons:**
- ❌ Non-standard (fragmentation risk)
- ❌ Requires custom parser/serializer
- ❌ Limited tool support
- ❌ May conflict with other extensions

### Option C: Separate Metadata Layer

**Structure:**
```json
{
  "content": "# Document\n\nParagraph text...",
  "metadata": {
    "alignments": {
      "p1": "center",
      "h1": "right"
    }
  }
}
```

**Pros:**
- ✅ Clean markdown separation
- ✅ Standard markdown parsers work
- ✅ Flexible metadata structure
- ✅ Easy to extend

**Cons:**
- ❌ Coordination complexity
- ❌ Position tracking fragility
- ❌ Two files to manage
- ❌ Markdown portability reduced

---

## 4. Current InkPot Implementation Analysis

### Existing Markdown Serializer

InkPot currently uses `prosemirror-markdown` with custom serializers:

```typescript
// From src/renderer/editor/markdown-serializer.ts
export const markdownSerializer = new MarkdownSerializer(
  {
    doc: defaultMarkdownSerializer.nodes.doc,
    paragraph: defaultMarkdownSerializer.nodes.paragraph,
    heading: defaultMarkdownSerializer.nodes.heading,
    // ... custom serializers for tables, images, task lists
  },
  {
    em: defaultMarkdownSerializer.marks.em,
    strong: defaultMarkdownSerializer.marks.strong,
    // ...
  }
);
```

**Current capabilities:**
- ✅ Standard markdown node serialization
- ✅ Custom page break handling (`---PAGE_BREAK---`)
- ✅ Task list support with checkboxes
- ✅ Table serialization
- ✅ Image handling

**Missing for alignment:**
- ❌ No attribute serialization for nodes
- ❌ No custom parsing for extended syntax
- ❌ No metadata layer

---

## 5. Recommended Approach for InkPot

### Strategy: Progressive Enhancement with Fallback

**Phase 1: Editor-Only (Immediate)**
- Use Tiptap TextAlign extension as-is
- Store alignment in ProseMirror state
- Don't persist to markdown yet
- Works immediately, no breaking changes

**Phase 2: Comment-Based Metadata (Near-term)**
```markdown
<!-- align:center -->
This paragraph is centered.

<!-- align:right -->
This one is right-aligned.
```

**Rationale:**
1. ✅ Valid markdown (comments ignored by parsers)
2. ✅ Human-readable
3. ✅ Version-control friendly
4. ✅ Easy to strip if needed
5. ✅ Doesn't break existing documents

**Implementation:**

```typescript
// Custom serializer node
paragraph: (state, node) => {
  // Add alignment comment if non-default
  if (node.attrs.textAlign && node.attrs.textAlign !== 'left') {
    state.write(`<!-- align:${node.attrs.textAlign} -->\n`);
  }
  defaultMarkdownSerializer.nodes.paragraph(state, node);
}

// Custom parser rule
{
  block: 'paragraph',
  getAttrs: (tok) => {
    // Look for alignment comment in preceding tokens
    const alignComment = findPrecedingComment(tok);
    if (alignComment) {
      const match = /align:(\w+)/.exec(alignComment);
      return match ? { textAlign: match[1] } : {};
    }
    return {};
  }
}
```

### Phase 3: Optional Metadata Layer (Future)

For advanced use cases, provide opt-in metadata storage:

```typescript
// Save document with metadata
{
  "content": "markdown string",
  "metadata": {
    "version": "1.0",
    "alignments": [...],
    "customStyles": [...]
  }
}
```

---

## 6. Transaction & Undo/Redo Integration

### Commands for Text Alignment

```typescript
// Tiptap provides built-in commands
editor.commands.setTextAlign('center')
editor.commands.unsetTextAlign()
editor.commands.toggleTextAlign('center')
```

**Transaction flow:**
1. Command called → creates transaction
2. Transaction updates node attributes via `setNodeMarkup`
3. Transaction applied → new state created
4. History plugin records step
5. Undo inverts the step → restores old alignment

**No special handling needed** - the history plugin automatically:
- ✅ Records attribute changes
- ✅ Creates invertible steps
- ✅ Handles selective undo
- ✅ Preserves alignment through rebasing (collaborative editing)

---

## 7. Migration & Backwards Compatibility

### Approach: Gradual Adoption

**New documents:**
- Created with alignment capability
- Default to left alignment (no metadata needed)

**Existing documents:**
- Load without alignment metadata → all default to left
- No breaking changes
- User can add alignment incrementally

**Document version indicator:**
```markdown
<!-- inkpot-version: 1.1.0 -->
<!-- features: textAlign, customStyles -->
```

**Safe migration path:**
1. Detect if document has alignment metadata
2. If yes: parse and apply
3. If no: treat as v1.0 document (all left-aligned)
4. On save: add metadata only if alignment used

---

## 8. Best Practices & Recommendations

### Do's ✅

1. **Use Tiptap's TextAlign extension as-is**
   - Well-tested, maintained
   - Standard implementation
   - Handles edge cases

2. **Start with editor-only implementation**
   - Get UX right first
   - Test with users
   - Persist later

3. **Use comment-based markdown metadata**
   - Valid markdown
   - Human-readable
   - Tool-friendly

4. **Provide export options**
   - Markdown (with alignment comments)
   - Markdown (plain, no alignment)
   - HTML (full styling)

5. **Version your document format**
   - Allow evolution
   - Provide migration paths

### Don'ts ❌

1. **Don't modify core markdown syntax**
   - Breaks compatibility
   - Confuses users
   - Limits portability

2. **Don't couple alignment to visual position**
   - Alignment is semantic, not positional
   - Use attributes, not coordinates

3. **Don't skip undo/redo testing**
   - Complex interactions
   - Edge cases exist
   - Test thoroughly

4. **Don't persist empty/default values**
   - Bloats document
   - Harder to read
   - No benefit

---

## 9. Implementation Checklist

### Phase 1: Editor Integration (Week 1)
- [ ] Install `@tiptap/extension-text-align`
- [ ] Configure extension with target nodes
- [ ] Add alignment toolbar buttons
- [ ] Test basic alignment changes
- [ ] Verify undo/redo works
- [ ] Test with selection edge cases

### Phase 2: Serialization (Week 2)
- [ ] Extend markdown serializer for alignment
- [ ] Add comment-based metadata output
- [ ] Implement parser rules for reading comments
- [ ] Test round-trip (save/load) preservation
- [ ] Handle migration from v1.0 documents
- [ ] Add export options (plain vs. enhanced markdown)

### Phase 3: Polish (Week 3)
- [ ] Add keyboard shortcuts (Cmd+Shift+L/C/R)
- [ ] Persist alignment in database
- [ ] Update PDF export to respect alignment
- [ ] Add alignment to document metadata
- [ ] Write migration guide
- [ ] Update documentation

---

## 10. Technical Specifications

### Schema Extension

```typescript
import { Extension } from '@tiptap/core';
import TextAlign from '@tiptap/extension-text-align';

// In your Tiptap editor configuration
const editor = useEditor({
  extensions: [
    // ... other extensions
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    }),
  ],
});
```

### Custom Markdown Serializer

```typescript
// Extend existing serializer
const alignmentAwareSerializer = new MarkdownSerializer(
  {
    ...markdownSerializer.nodes,
    paragraph: (state, node) => {
      if (node.attrs.textAlign && node.attrs.textAlign !== 'left') {
        state.write(`<!-- align:${node.attrs.textAlign} -->\n`);
      }
      defaultMarkdownSerializer.nodes.paragraph(state, node);
    },
    heading: (state, node) => {
      if (node.attrs.textAlign && node.attrs.textAlign !== 'left') {
        state.write(`<!-- align:${node.attrs.textAlign} -->\n`);
      }
      defaultMarkdownSerializer.nodes.heading(state, node);
    },
  },
  markdownSerializer.marks
);
```

### Custom Markdown Parser

```typescript
// Add to markdown parser token rules
{
  block: 'paragraph',
  getAttrs: (token) => {
    // Look for alignment comment before paragraph
    const prevToken = getPreviousToken(token);
    if (prevToken?.type === 'html_block') {
      const match = /<!--\s*align:(\w+)\s*-->/.exec(prevToken.content);
      if (match) {
        return { textAlign: match[1] };
      }
    }
    return {};
  }
}
```

---

## 11. References

### Documentation
- [ProseMirror Guide - Schema](https://prosemirror.net/docs/guide/#schema)
- [ProseMirror Guide - Document](https://prosemirror.net/docs/guide/#doc)
- [Tiptap TextAlign Extension](https://tiptap.dev/api/extensions/text-align)
- [ProseMirror Transform](https://prosemirror.net/docs/guide/#transform)
- [ProseMirror History](https://prosemirror.net/docs/ref/#history)

### Source Code
- [Tiptap TextAlign Implementation](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-text-align/src/text-align.ts)
- [ProseMirror Model](https://github.com/prosemirror/prosemirror-model)
- [ProseMirror Markdown](https://github.com/prosemirror/prosemirror-markdown)

---

## Conclusion

Text alignment in Tiptap/ProseMirror is:
- ✅ **Well-supported**: Built-in extension with standard patterns
- ✅ **Non-invasive**: Adds attributes without modifying core schema
- ✅ **Persistent**: Automatically preserved through transactions
- ✅ **Undo-compatible**: Works seamlessly with history
- ✅ **Serializable**: Multiple options for markdown persistence

**Recommended path:** Start with editor-only implementation, then add comment-based markdown serialization for persistence. This provides immediate value while maintaining markdown compatibility and allowing future enhancement.
