# Quickstart: Text Alignment Implementation

**Feature**: Text Alignment
**Target Audience**: Developers implementing the feature
**Estimated Time**: 6-8 hours for MVP

---

## Prerequisites

Before starting implementation:

- ✅ Node.js and npm installed
- ✅ InkPot project cloned and dependencies installed (`npm install`)
- ✅ Familiar with Tiptap editor basics
- ✅ Understanding of React components and TypeScript

**Read First**:
- [spec.md](./spec.md) - Feature requirements
- [research.md](./research.md) - Technical decisions
- [data-model.md](./data-model.md) - Data structures

---

## Implementation Overview

### High-Level Steps

1. **Install Dependencies** (5 min)
2. **Integrate Tiptap Extension** (1-2 hours)
3. **Add Toolbar UI** (2-3 hours)
4. **Keyboard Shortcuts** (30 min)
5. **PDF Export Integration** (2-3 hours)
6. **Testing** (1-2 hours)

### Files to Modify

```
src/renderer/components/editor/TiptapEditor.tsx    # Add extension + toolbar
src/main/pdf/markdown-parser.ts                    # Parse alignment
src/main/pdf/components/MarkdownElements.tsx       # Render alignment in PDF
src/shared/types/ipc-contracts.ts                  # Type definitions
```

---

## Step 1: Install Dependencies

```bash
npm install @tiptap/extension-text-align
```

**Verify installation**:
```bash
npm list @tiptap/extension-text-align
```

Expected output:
```
@tiptap/extension-text-align@2.x.x
```

---

## Step 2: Integrate Tiptap Extension

### 2.1 Import Extension

**File**: `src/renderer/components/editor/TiptapEditor.tsx`

```typescript
// Add to existing imports
import TextAlign from '@tiptap/extension-text-align';
```

### 2.2 Add to Editor Configuration

**File**: `src/renderer/components/editor/TiptapEditor.tsx`

Find the `useEditor` hook and add `TextAlign` to extensions array:

```typescript
const editor = useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: props.placeholder }),
    Table,
    TableRow,
    TableHeader,
    TableCell,
    TaskList,
    TaskItem,
    Image.configure({ projectId: props.projectId }),
    PageBreak,
    // ADD THIS:
    TextAlign.configure({
      types: ['heading', 'paragraph'],  // Apply to headings and paragraphs
      alignments: ['left', 'center', 'right'],  // Omit 'justify' per spec
      defaultAlignment: 'left',
    }),
  ],
  content: props.content,
  onUpdate: ({ editor }) => {
    if (props.onUpdate) {
      const markdown = getMarkdownContent(editor);
      props.onUpdate(markdown);
    }
  },
});
```

### 2.3 Override Keyboard Shortcuts

**Note**: Default shortcuts are `Cmd/Ctrl+Shift+L/E/R`. Spec requires `Cmd/Ctrl+L/E/R` (no Shift).

**Option A**: Extend the extension (recommended):

```typescript
import TextAlign from '@tiptap/extension-text-align';
import { Extension } from '@tiptap/core';

const CustomTextAlign = TextAlign.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-l': () => this.editor.commands.setTextAlign('left'),
      'Mod-e': () => this.editor.commands.setTextAlign('center'),
      'Mod-r': () => this.editor.commands.setTextAlign('right'),
    };
  },
});

// Use CustomTextAlign in extensions array instead of TextAlign
```

**Option B**: Disable default shortcuts and add custom keybindings (simpler):

```typescript
TextAlign.configure({
  types: ['heading', 'paragraph'],
  alignments: ['left', 'center', 'right'],
  defaultAlignment: 'left',
}),

// Add custom keyboard shortcuts extension
Extension.create({
  name: 'customAlignmentShortcuts',
  addKeyboardShortcuts() {
    return {
      'Mod-l': () => this.editor.commands.setTextAlign('left'),
      'Mod-e': () => this.editor.commands.setTextAlign('center'),
      'Mod-r': () => this.editor.commands.setTextAlign('right'),
    };
  },
}),
```

---

## Step 3: Add Toolbar UI

### 3.1 Import Icons

**File**: `src/renderer/components/editor/TiptapEditor.tsx`

```typescript
// Add to existing lucide-react imports
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
```

### 3.2 Create Alignment Button Group

Find the toolbar section in `TiptapEditor.tsx` and add alignment buttons:

```tsx
{/* Text Alignment Group */}
<div className="flex items-center gap-1 border-l border-gray-300 pl-2">
  <Button
    variant="ghost"
    size="sm"
    onClick={() => editor.chain().focus().setTextAlign('left').run()}
    className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}
    disabled={!editor.can().setTextAlign('left')}
    title="Align Left (Cmd+L)"
  >
    <AlignLeft className="h-4 w-4" />
  </Button>

  <Button
    variant="ghost"
    size="sm"
    onClick={() => editor.chain().focus().setTextAlign('center').run()}
    className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}
    disabled={!editor.can().setTextAlign('center')}
    title="Align Center (Cmd+E)"
  >
    <AlignCenter className="h-4 w-4" />
  </Button>

  <Button
    variant="ghost"
    size="sm"
    onClick={() => editor.chain().focus().setTextAlign('right').run()}
    className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}
    disabled={!editor.can().setTextAlign('right')}
    title="Align Right (Cmd+R)"
  >
    <AlignRight className="h-4 w-4" />
  </Button>
</div>
```

### 3.3 Positioning Recommendation

Place alignment buttons after text formatting (Bold, Italic, etc.) and before list buttons for logical grouping:

```
[B] [I] [S] | [Left] [Center] [Right] | [•List] [1.List] | ...
```

---

## Step 4: Keyboard Shortcuts (Already Done)

If you followed Step 2.3 Option A or B, keyboard shortcuts are already configured.

**Test Shortcuts**:
1. Open editor
2. Type some text
3. Press `Cmd+E` (macOS) or `Ctrl+E` (Windows/Linux)
4. Verify text centers
5. Press `Cmd+L` to align left
6. Press `Cmd+R` to align right

---

## Step 5: PDF Export Integration

### 5.1 Update Type Definitions

**File**: `src/shared/types/ipc-contracts.ts` (or wherever `MarkdownElement` is defined)

**Find**:
```typescript
export interface MarkdownElement {
  type: 'paragraph' | 'heading' | 'list' | ...;
  content?: string | MarkdownElement[];
  // ... existing properties
}
```

**Add**:
```typescript
export type TextAlignment = 'left' | 'center' | 'right';

export interface MarkdownElement {
  type: 'paragraph' | 'heading' | 'list' | ...;
  content?: string | MarkdownElement[];
  textAlign?: TextAlignment;  // NEW
  // ... existing properties
}
```

### 5.2 Parse Alignment in Markdown Parser

**File**: `src/main/pdf/markdown-parser.ts`

Find the function that parses HTML elements (likely `parseElement` or similar).

**Add alignment parsing**:

```typescript
function parseAlignment(element: HTMLElement): TextAlignment | undefined {
  const style = element.getAttribute('style');
  if (!style) return undefined;

  // Match text-align CSS property
  const match = /text-align:\s*(left|center|right|justify)/i.exec(style);
  if (!match) return undefined;

  const value = match[1].toLowerCase();

  // Only return supported alignments (justify deferred)
  if (value === 'left' || value === 'center' || value === 'right') {
    return value as TextAlignment;
  }

  return undefined;
}

// In paragraph/heading parsing logic:
function parseParagraph(element: HTMLElement): MarkdownElement {
  return {
    type: 'paragraph',
    content: parseInlineContent(element),
    textAlign: parseAlignment(element),  // ADD THIS
  };
}

function parseHeading(element: HTMLElement): MarkdownElement {
  const level = parseInt(element.tagName.substring(1), 10); // H1 → 1
  return {
    type: 'heading',
    level,
    content: parseInlineContent(element),
    textAlign: parseAlignment(element),  // ADD THIS
  };
}
```

### 5.3 Apply Alignment in PDF Components

**File**: `src/main/pdf/components/MarkdownElements.tsx`

**Find Paragraph Component** (may be named `ParagraphElement` or similar):

```tsx
export const ParagraphElement: React.FC<ParagraphElementProps> = ({ element, theme }) => {
  return (
    <Text
      style={{
        fontSize: theme.bodyFontSize,
        lineHeight: theme.lineHeight,
        marginBottom: theme.paragraphSpacing * 72,
        textAlign: element.textAlign || 'left',  // ADD THIS
      }}
    >
      {renderInlineContent(element.content, theme)}
    </Text>
  );
};
```

**Find Heading Component**:

```tsx
export const HeadingElement: React.FC<HeadingElementProps> = ({ element, theme }) => {
  const fontSize = getHeadingFontSize(element.level, theme);
  
  return (
    <Text
      style={{
        fontSize,
        fontWeight: 'bold',
        marginTop: theme.headingSpacing * 72,
        marginBottom: theme.headingSpacing * 72,
        textAlign: element.textAlign || 'left',  // ADD THIS
      }}
    >
      {renderInlineContent(element.content, theme)}
    </Text>
  );
};
```

---

## Step 6: Testing

### 6.1 Manual Testing Checklist

- [ ] **Editor Toolbar**:
  - [ ] Alignment buttons appear in toolbar
  - [ ] Clicking Left/Center/Right applies alignment
  - [ ] Active button highlights correctly
  - [ ] Alignment visible in editor preview

- [ ] **Keyboard Shortcuts**:
  - [ ] `Cmd/Ctrl+L` applies left alignment
  - [ ] `Cmd/Ctrl+E` applies center alignment
  - [ ] `Cmd/Ctrl+R` applies right alignment

- [ ] **Undo/Redo**:
  - [ ] Apply alignment → Undo → Alignment reverts
  - [ ] Undo → Redo → Alignment reapplies

- [ ] **Persistence**:
  - [ ] Apply alignment → Save → Close → Reopen → Alignment preserved

- [ ] **PDF Export**:
  - [ ] Export PDF with centered text → PDF shows centered text
  - [ ] Export PDF with right-aligned text → PDF shows right-aligned text
  - [ ] Export PDF with mixed alignments → All alignments correct

- [ ] **Edge Cases**:
  - [ ] Select multiple paragraphs → Apply alignment → All selected paragraphs align
  - [ ] Mix of aligned and non-aligned paragraphs → Export → Correct rendering
  - [ ] Open old document (no alignment) → Default to left → No errors

### 6.2 Automated Tests

**Unit Test Example** (`TiptapEditor.test.tsx`):

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { TiptapEditor } from './TiptapEditor';

describe('TiptapEditor - Text Alignment', () => {
  it('applies center alignment when center button clicked', () => {
    const onUpdate = jest.fn();
    render(<TiptapEditor content="<p>Test</p>" onUpdate={onUpdate} />);
    
    const centerButton = screen.getByTitle('Align Center (Cmd+E)');
    fireEvent.click(centerButton);
    
    // Verify button is active
    expect(centerButton).toHaveClass('bg-gray-200');
    
    // Verify content updated
    expect(onUpdate).toHaveBeenCalled();
    const updatedContent = onUpdate.mock.calls[0][0];
    expect(updatedContent).toContain('text-align: center');
  });
});
```

**Integration Test Example** (`pdf-export.test.ts`):

```typescript
describe('PDF Export with Alignment', () => {
  it('exports centered paragraph to PDF', async () => {
    const projectId = await createTestProject({
      content: '<p style="text-align: center">Centered</p>',
    });
    
    const result = await exportPDF({ projectId, outputPath: '/tmp/test.pdf' });
    
    expect(result.success).toBe(true);
    
    // Verify PDF contains centered text
    const pdfText = await extractPDFText(result.filePath);
    expect(pdfText).toContain('Centered');
    
    // Verify alignment (requires PDF parsing library)
    const pdfElements = await parsePDFLayout(result.filePath);
    const centeredElement = pdfElements.find(el => el.text === 'Centered');
    expect(centeredElement.alignment).toBe('center');
  });
});
```

---

## Troubleshooting

### Issue: Alignment buttons don't appear

**Solution**:
1. Verify `TextAlign` extension is in `extensions` array
2. Check toolbar render logic includes alignment button group
3. Verify `lucide-react` icons imported

### Issue: Alignment doesn't apply

**Solution**:
1. Check browser console for errors
2. Verify `types: ['heading', 'paragraph']` in TextAlign config
3. Ensure editor has focus before applying alignment
4. Test with `editor.can().setTextAlign('center')` - should return `true`

### Issue: Alignment not preserved in PDF

**Solution**:
1. Verify `parseAlignment()` function extracts alignment from HTML
2. Check `textAlign` property added to `MarkdownElement` interface
3. Ensure PDF components apply `textAlign` style
4. Test with simple document first

### Issue: Keyboard shortcuts don't work

**Solution**:
1. Verify custom shortcuts extension added
2. Check `Mod` key maps correctly (`Cmd` on macOS, `Ctrl` on Windows/Linux)
3. Test in different editors (might be OS/browser conflict)
4. Add logging: `console.log('Alignment shortcut triggered')`

### Issue: Undo doesn't work

**Solution**:
1. Verify `StarterKit` includes history plugin (enabled by default)
2. Test with other operations (bold, italic) - if those don't undo, history plugin issue
3. Check Tiptap version compatibility

---

## Performance Tips

1. **React 19 Optimization**: Don't manually memoize alignment buttons - React 19 compiler handles it
2. **Large Documents**: Alignment is per-node, no performance impact even with thousands of paragraphs
3. **PDF Export**: Alignment parsed once, cached in `MarkdownElement` - no repeated parsing

---

## Common Mistakes

❌ **Forgetting `types` config**:
```typescript
TextAlign.configure({})  // WRONG - empty types array by default
```

✅ **Correct**:
```typescript
TextAlign.configure({
  types: ['heading', 'paragraph'],
})
```

---

❌ **Not using `chain().focus()`**:
```typescript
editor.commands.setTextAlign('center');  // May not work if editor not focused
```

✅ **Correct**:
```typescript
editor.chain().focus().setTextAlign('center').run();
```

---

❌ **Hardcoding alignment in PDF without fallback**:
```typescript
<Text style={{ textAlign: element.textAlign }}>  // undefined breaks rendering
```

✅ **Correct**:
```typescript
<Text style={{ textAlign: element.textAlign || 'left' }}>
```

---

## Next Steps

After MVP implementation:

1. **Phase 2**: Add markdown comment-based serialization (see [research.md](./research.md))
2. **Future Enhancement**: Add `Justify` alignment (requires Firefox workaround research)
3. **Future Enhancement**: Table cell alignment (separate feature)

---

## Resources

- [Tiptap TextAlign Docs](https://tiptap.dev/api/extensions/text-align)
- [ProseMirror Commands](https://prosemirror.net/docs/ref/#commands)
- [@react-pdf/renderer Styling](https://react-pdf.org/styling)
- [InkPot Constitution](/.specify/memory/constitution.md)

---

## Questions?

Refer to:
- [spec.md](./spec.md) for requirements
- [research.md](./research.md) for technical decisions
- [data-model.md](./data-model.md) for data structures
- [contracts/ipc-contracts.md](./contracts/ipc-contracts.md) for IPC details

**Ready to start coding!** 🚀
