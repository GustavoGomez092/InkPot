# Quickstart Guide: Mermaid.js Diagram Support

**Feature**: 002-mermaid-diagrams  
**Estimated Implementation Time**: 16-24 hours  
**Priority**: P1 (Core Functionality)

---

## Overview

This guide provides step-by-step instructions for implementing Mermaid diagram support in InkPot. The feature allows users to insert and edit diagrams in the editor, with automatic PDF export support.

**Implementation Order**:
1. Install dependencies & create type definitions (30 min)
2. Create useMermaid hook (2 hrs)
3. Build Tiptap extension (3 hrs)
4. Implement NodeView component (2 hrs)
5. Build modal dialog UI (3 hrs)
6. Add markdown serialization (1 hr)
7. Integrate PDF rendering (2 hrs)
8. Add toolbar button (30 min)
9. Write tests (4 hrs)
10. Documentation & polish (2 hrs)

---

## Prerequisites

- Node.js 18+ and npm installed
- InkPot project cloned and dependencies installed
- Familiarity with TypeScript, React, and Tiptap
- Understanding of ProseMirror node structure

---

## Step 1: Install Dependencies (30 min)

### 1.1 Install Mermaid.js

```bash
npm install mermaid@latest
npm install --save-dev @types/mermaid
```

**Version**: Use latest v10.x (currently v10.6.1)

### 1.2 Verify Installation

```bash
npm list mermaid
```

Expected output: `mermaid@10.6.1` or higher

### 1.3 Add Type Definitions

Create `src/shared/types/mermaid.ts`:

```typescript
/**
 * Attributes for Mermaid diagram node
 */
export interface MermaidDiagramAttributes {
  /** Mermaid.js code */
  code: string;
  
  /** Unique identifier */
  id: string;
  
  /** Optional caption */
  caption?: string;
  
  /** Creation timestamp */
  createdAt: number;
  
  /** Last update timestamp */
  updatedAt: number;
}

/**
 * Validation result from Mermaid parser
 */
export interface MermaidValidationResult {
  /** Whether code is valid */
  isValid: boolean;
  
  /** Error message if invalid */
  error: string | null;
  
  /** Line number where error occurred */
  errorLine?: number;
}

/**
 * Modal component props
 */
export interface MermaidModalProps {
  open: boolean;
  onClose: () => void;
  initialCode?: string;
  onSave: (code: string, caption?: string) => void;
  diagramId?: string;
}

/**
 * Modal internal state
 */
export interface MermaidModalState {
  code: string;
  caption: string;
  validation: MermaidValidationResult;
  isValidating: boolean;
  previewKey: number;
}

/**
 * PDF element type for parsed Mermaid blocks
 */
export interface PdfMermaidElement {
  type: 'mermaid';
  code: string;
  caption?: string;
  svg?: string;
  error?: string;
}
```

---

## Step 2: Create useMermaid Hook (2 hrs)

### 2.1 Create Hook File

Create `src/renderer/hooks/useMermaid.ts`:

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';
import type { MermaidValidationResult } from '@/shared/types/mermaid';

let mermaidInstance: typeof import('mermaid').default | null = null;
let mermaidLoadPromise: Promise<typeof import('mermaid').default> | null = null;

/**
 * Lazy load Mermaid.js library
 */
async function loadMermaid() {
  if (mermaidInstance) return mermaidInstance;
  if (mermaidLoadPromise) return mermaidLoadPromise;

  mermaidLoadPromise = import('mermaid').then((module) => {
    mermaidInstance = module.default;
    mermaidInstance.initialize({
      startOnLoad: false,
      theme: 'neutral',
      securityLevel: 'strict',
      fontFamily: 'Inter, system-ui, sans-serif',
    });
    return mermaidInstance;
  });

  return mermaidLoadPromise;
}

export interface UseMermaidReturn {
  renderDiagram: (code: string, element: HTMLElement) => Promise<void>;
  validateMermaid: (code: string) => Promise<MermaidValidationResult>;
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
  clearError: () => void;
}

export function useMermaid(): UseMermaidReturn {
  const [isLoaded, setIsLoaded] = useState(!!mermaidInstance);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const renderCounter = useRef(0);

  useEffect(() => {
    loadMermaid()
      .then(() => setIsLoaded(true))
      .catch((err) => setError(err));
  }, []);

  const renderDiagram = useCallback(
    async (code: string, element: HTMLElement): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const mermaid = await loadMermaid();
        const id = `mermaid-render-${++renderCounter.current}`;

        // Clear previous content
        element.innerHTML = '';

        // Render diagram
        const { svg } = await mermaid.render(id, code);
        element.innerHTML = svg;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const validateMermaid = useCallback(
    async (code: string): Promise<MermaidValidationResult> => {
      try {
        const mermaid = await loadMermaid();
        
        // Use parse method for validation
        await mermaid.parse(code);
        
        return { isValid: true, error: null };
      } catch (err: any) {
        const errorMessage = err.message || String(err);
        const lineMatch = errorMessage.match(/line (\d+)/i);
        const errorLine = lineMatch ? parseInt(lineMatch[1], 10) : undefined;

        return {
          isValid: false,
          error: errorMessage,
          errorLine,
        };
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    renderDiagram,
    validateMermaid,
    isLoaded,
    isLoading,
    error,
    clearError,
  };
}
```

### 2.2 Test the Hook

Create `tests/unit/hooks/useMermaid.test.tsx`:

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useMermaid } from '@/renderer/hooks/useMermaid';

describe('useMermaid', () => {
  it('should load Mermaid library', async () => {
    const { result } = renderHook(() => useMermaid());
    
    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });
  });

  it('should validate valid Mermaid code', async () => {
    const { result } = renderHook(() => useMermaid());
    
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    const validation = await result.current.validateMermaid('graph TD\n  A-->B');
    expect(validation.isValid).toBe(true);
    expect(validation.error).toBeNull();
  });

  it('should reject invalid Mermaid code', async () => {
    const { result } = renderHook(() => useMermaid());
    
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    const validation = await result.current.validateMermaid('invalid syntax');
    expect(validation.isValid).toBe(false);
    expect(validation.error).toBeTruthy();
  });
});
```

---

## Step 3: Build Tiptap Extension (3 hrs)

### 3.1 Create Extension File

Create `src/renderer/editor/mermaid-extension.ts`:

```typescript
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import type { MermaidDiagramAttributes } from '@/shared/types/mermaid';
import { MermaidNodeView } from './MermaidNodeView';

export interface MermaidDiagramOptions {
  draggable?: boolean;
  onInsert?: (attrs: MermaidDiagramAttributes) => void;
  onUpdate?: (attrs: MermaidDiagramAttributes) => void;
  onDelete?: (id: string) => void;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mermaidDiagram: {
      insertMermaidDiagram: (code: string, caption?: string) => ReturnType;
      updateMermaidDiagram: (id: string, code: string) => ReturnType;
      deleteMermaidDiagram: (id: string) => ReturnType;
    };
  }
}

export const MermaidDiagram = Node.create<MermaidDiagramOptions>({
  name: 'mermaidDiagram',

  group: 'block',

  atom: true,

  draggable: true,

  addOptions() {
    return {
      draggable: true,
      onInsert: undefined,
      onUpdate: undefined,
      onDelete: undefined,
    };
  },

  addAttributes() {
    return {
      code: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-code') || '',
        renderHTML: (attributes) => ({
          'data-code': attributes.code,
        }),
      },
      id: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-id') || '',
        renderHTML: (attributes) => ({
          'data-id': attributes.id,
        }),
      },
      caption: {
        default: undefined,
        parseHTML: (element) => element.getAttribute('data-caption') || undefined,
        renderHTML: (attributes) => {
          if (!attributes.caption) return {};
          return { 'data-caption': attributes.caption };
        },
      },
      createdAt: {
        default: Date.now(),
        parseHTML: (element) => {
          const value = element.getAttribute('data-created-at');
          return value ? parseInt(value, 10) : Date.now();
        },
        renderHTML: (attributes) => ({
          'data-created-at': String(attributes.createdAt),
        }),
      },
      updatedAt: {
        default: Date.now(),
        parseHTML: (element) => {
          const value = element.getAttribute('data-updated-at');
          return value ? parseInt(value, 10) : Date.now();
        },
        renderHTML: (attributes) => ({
          'data-updated-at': String(attributes.updatedAt),
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="mermaid-diagram"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'mermaid-diagram' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MermaidNodeView);
  },

  addCommands() {
    return {
      insertMermaidDiagram:
        (code: string, caption?: string) =>
        ({ commands, state }) => {
          const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
          const attrs: MermaidDiagramAttributes = {
            code,
            id,
            caption,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          const success = commands.insertContent({
            type: this.name,
            attrs,
          });

          if (success) {
            this.options.onInsert?.(attrs);
          }

          return success;
        },

      updateMermaidDiagram:
        (id: string, code: string) =>
        ({ state, tr, dispatch }) => {
          let updated = false;

          state.doc.descendants((node, pos) => {
            if (node.type.name === this.name && node.attrs.id === id) {
              const updatedAttrs = {
                ...node.attrs,
                code,
                updatedAt: Date.now(),
              };

              tr.setNodeMarkup(pos, undefined, updatedAttrs);
              this.options.onUpdate?.(updatedAttrs);
              updated = true;
              return false;
            }
          });

          if (dispatch && updated) {
            dispatch(tr);
          }

          return updated;
        },

      deleteMermaidDiagram:
        (id: string) =>
        ({ state, tr, dispatch }) => {
          let deleted = false;

          state.doc.descendants((node, pos) => {
            if (node.type.name === this.name && node.attrs.id === id) {
              tr.delete(pos, pos + node.nodeSize);
              this.options.onDelete?.(id);
              deleted = true;
              return false;
            }
          });

          if (dispatch && deleted) {
            dispatch(tr);
          }

          return deleted;
        },
    };
  },
});
```

### 3.2 Register Extension in Editor

Update `src/renderer/components/editor/TiptapEditor.tsx`:

```typescript
import { MermaidDiagram } from '@/renderer/editor/mermaid-extension';

// In useEditor configuration
const editor = useEditor({
  extensions: [
    // ... existing extensions
    MermaidDiagram.configure({
      draggable: true,
    }),
  ],
  // ...
});
```

---

## Step 4: Implement NodeView Component (2 hrs)

### 4.1 Create NodeView File

Create `src/renderer/editor/MermaidNodeView.tsx`:

```typescript
import { NodeViewWrapper } from '@tiptap/react';
import { useEffect, useRef, useState } from 'react';
import { useMermaid } from '@/renderer/hooks/useMermaid';
import type { MermaidDiagramAttributes } from '@/shared/types/mermaid';

export interface MermaidNodeViewProps {
  node: {
    attrs: MermaidDiagramAttributes;
  };
  updateAttributes: (attrs: Partial<MermaidDiagramAttributes>) => void;
  deleteNode: () => void;
  editor: any;
  selected: boolean;
  getPos: () => number;
}

export function MermaidNodeView(props: MermaidNodeViewProps) {
  const { node, selected, editor } = props;
  const { code, caption } = node.attrs;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { renderDiagram, isLoading } = useMermaid();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (containerRef.current && code) {
      renderDiagram(code, containerRef.current)
        .then(() => setError(null))
        .catch((err) => setError(err.message));
    }
  }, [code, renderDiagram]);

  const handleClick = () => {
    // Open edit modal (implement in Step 5)
    editor.commands.focus();
  };

  return (
    <NodeViewWrapper
      className={`mermaid-node-view ${selected ? 'ProseMirror-selectednode' : ''}`}
      data-drag-handle
    >
      <div
        className="mermaid-container cursor-pointer rounded-lg border-2 border-transparent p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
      >
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-gray-500">Rendering diagram...</div>
          </div>
        )}

        {error && (
          <div className="rounded bg-red-50 p-4 text-sm text-red-700">
            <strong>Error rendering diagram:</strong>
            <pre className="mt-2 whitespace-pre-wrap font-mono text-xs">{error}</pre>
          </div>
        )}

        {!isLoading && !error && (
          <div ref={containerRef} className="mermaid-output" />
        )}

        {caption && (
          <div className="mt-2 text-center text-sm italic text-gray-600">
            {caption}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
```

### 4.2 Add Styles

Update `src/renderer/styles/global.css`:

```css
/* Mermaid diagram styles */
.mermaid-node-view {
  margin: 1rem 0;
}

.mermaid-node-view.ProseMirror-selectednode .mermaid-container {
  @apply border-blue-500 bg-blue-50;
}

.mermaid-output svg {
  max-width: 100%;
  height: auto;
}
```

---

## Step 5: Build Modal Dialog UI (3 hrs)

### 5.1 Create Modal Component

Create `src/renderer/components/editor/MermaidModal.tsx`:

```typescript
import { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/renderer/components/ui/Button';
import { Input } from '@/renderer/components/ui/Input';
import { Label } from '@/renderer/components/ui/Label';
import { useMermaid } from '@/renderer/hooks/useMermaid';
import type { MermaidModalProps, MermaidModalState } from '@/shared/types/mermaid';

export function MermaidModal(props: MermaidModalProps) {
  const { open, onClose, initialCode = '', onSave, diagramId } = props;
  
  const [state, setState] = useState<MermaidModalState>({
    code: initialCode,
    caption: '',
    validation: { isValid: true, error: null },
    isValidating: false,
    previewKey: 0,
  });

  const previewRef = useRef<HTMLDivElement>(null);
  const { renderDiagram, validateMermaid, isLoaded } = useMermaid();

  // Validate and render preview when code changes
  useEffect(() => {
    if (!open || !state.code.trim()) return;

    const debounceTimer = setTimeout(async () => {
      setState((prev) => ({ ...prev, isValidating: true }));

      const validation = await validateMermaid(state.code);
      setState((prev) => ({ ...prev, validation, isValidating: false }));

      if (validation.isValid && previewRef.current) {
        try {
          await renderDiagram(state.code, previewRef.current);
          setState((prev) => ({ ...prev, previewKey: prev.previewKey + 1 }));
        } catch (err) {
          console.error('Preview render error:', err);
        }
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [state.code, open, validateMermaid, renderDiagram]);

  const handleSave = () => {
    if (!state.validation.isValid) return;
    onSave(state.code, state.caption || undefined);
  };

  const handleCancel = () => {
    setState({
      code: initialCode,
      caption: '',
      validation: { isValid: true, error: null },
      isValidating: false,
      previewKey: 0,
    });
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="mb-4 text-xl font-semibold">
            {diagramId ? 'Edit Diagram' : 'Insert Diagram'}
          </Dialog.Title>

          <div className="grid grid-cols-2 gap-4">
            {/* Left: Code Editor */}
            <div className="flex flex-col">
              <Label htmlFor="mermaid-code" className="mb-2">
                Mermaid Code
              </Label>
              <textarea
                id="mermaid-code"
                className="min-h-[300px] flex-1 rounded border border-gray-300 p-3 font-mono text-sm"
                value={state.code}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, code: e.target.value }))
                }
                placeholder="graph TD&#10;  A[Start] --> B[End]"
                spellCheck={false}
              />

              <div className="mt-2">
                <Label htmlFor="mermaid-caption" className="mb-2">
                  Caption (optional)
                </Label>
                <Input
                  id="mermaid-caption"
                  value={state.caption}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, caption: e.target.value }))
                  }
                  placeholder="Diagram description"
                />
              </div>
            </div>

            {/* Right: Live Preview */}
            <div className="flex flex-col">
              <Label className="mb-2">Preview</Label>
              <div className="flex-1 overflow-auto rounded border border-gray-300 bg-gray-50 p-4">
                {state.isValidating && (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    Validating...
                  </div>
                )}

                {!state.isValidating && !state.validation.isValid && (
                  <div className="rounded bg-red-50 p-4 text-sm text-red-700">
                    <strong>Syntax Error:</strong>
                    <pre className="mt-2 whitespace-pre-wrap">
                      {state.validation.error}
                    </pre>
                  </div>
                )}

                {!state.isValidating && state.validation.isValid && (
                  <div
                    ref={previewRef}
                    key={state.previewKey}
                    className="mermaid-preview"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!state.validation.isValid || !state.code.trim()}
            >
              {diagramId ? 'Update' : 'Insert'}
            </Button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
              aria-label="Close"
            >
              ✕
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### 5.2 Integrate Modal in Editor

Update `src/renderer/components/editor/TiptapEditor.tsx`:

```typescript
import { useState } from 'react';
import { MermaidModal } from './MermaidModal';

function TiptapEditor() {
  const [mermaidModalOpen, setMermaidModalOpen] = useState(false);
  const [editingDiagramId, setEditingDiagramId] = useState<string | undefined>();

  const handleInsertDiagram = (code: string, caption?: string) => {
    editor?.commands.insertMermaidDiagram(code, caption);
    setMermaidModalOpen(false);
  };

  return (
    <>
      {/* Toolbar button (see Step 8) */}
      <button onClick={() => setMermaidModalOpen(true)}>
        Insert Diagram
      </button>

      {/* Modal */}
      <MermaidModal
        open={mermaidModalOpen}
        onClose={() => setMermaidModalOpen(false)}
        onSave={handleInsertDiagram}
        diagramId={editingDiagramId}
      />

      {/* Editor */}
      <EditorContent editor={editor} />
    </>
  );
}
```

---

## Step 6: Add Markdown Serialization (1 hr)

### 6.1 Update Markdown Serializer

Update `src/renderer/editor/markdown-serializer.ts`:

```typescript
export const markdownSerializer = new MarkdownSerializer(
  {
    // ... existing nodes
    
    mermaidDiagram(state, node) {
      state.write('```mermaid\n');
      state.text(node.attrs.code, false);
      state.ensureNewLine();
      state.write('```');
      state.closeBlock(node);
      
      if (node.attrs.caption) {
        state.write(`\n_${node.attrs.caption}_\n`);
      }
    },
  },
  // ... marks
);
```

### 6.2 Update Markdown Parser

Ensure markdown-it parses ` ```mermaid ` blocks correctly (it should work by default with existing setup).

---

## Step 7: Integrate PDF Rendering (2 hrs)

### 7.1 Create PDF Component

Create `src/main/pdf/components/MermaidDiagram.tsx`:

```typescript
import { View, Svg, Text, Image } from '@react-pdf/renderer';
import { useState, useEffect } from 'react';

interface MermaidDiagramProps {
  code: string;
  caption?: string;
  maxWidth?: number;
}

export function MermaidDiagram({ code, caption, maxWidth = 500 }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically import Mermaid
    import('mermaid').then(async ({ default: mermaid }) => {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          securityLevel: 'strict',
        });

        const id = `pdf-mermaid-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const { svg: renderedSvg } = await mermaid.render(id, code);
        setSvg(renderedSvg);
      } catch (err: any) {
        setError(err.message || 'Failed to render diagram');
      }
    });
  }, [code]);

  if (error) {
    return (
      <View style={{ padding: 10, backgroundColor: '#fee', marginVertical: 10 }}>
        <Text style={{ fontSize: 10, color: '#c00' }}>
          Error rendering Mermaid diagram:
        </Text>
        <Text style={{ fontSize: 9, fontFamily: 'Courier', marginTop: 5 }}>
          {error}
        </Text>
      </View>
    );
  }

  if (!svg) {
    return (
      <View style={{ padding: 10, marginVertical: 10 }}>
        <Text style={{ fontSize: 10, color: '#666' }}>Rendering diagram...</Text>
      </View>
    );
  }

  return (
    <View style={{ marginVertical: 10, alignItems: 'center' }}>
      <Image
        src={`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`}
        style={{ maxWidth }}
      />
      {caption && (
        <Text style={{ fontSize: 10, fontStyle: 'italic', marginTop: 5, color: '#666' }}>
          {caption}
        </Text>
      )}
    </View>
  );
}
```

### 7.2 Update Markdown Parser

Update `src/main/pdf/markdown-parser.ts`:

```typescript
export function parseMarkdown(markdown: string): ParsedElement[] {
  const elements: ParsedElement[] = [];
  const tokens = md.parse(markdown, {});

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // ... existing token handlers

    if (token.type === 'fence' && token.info.trim() === 'mermaid') {
      elements.push({
        type: 'mermaid',
        code: token.content,
        caption: undefined, // Extract from next token if italic
      });
      continue;
    }
  }

  return elements;
}
```

### 7.3 Update PDF Document Component

Update `src/main/pdf/Document.tsx`:

```typescript
import { MermaidDiagram } from './components/MermaidDiagram';

function renderElement(element: ParsedElement) {
  // ... existing cases
  
  if (element.type === 'mermaid') {
    return <MermaidDiagram code={element.code} caption={element.caption} />;
  }
}
```

---

## Step 8: Add Toolbar Button (30 min)

### 8.1 Create Icon Component (Optional)

Create `src/renderer/components/icons/DiagramIcon.tsx`:

```typescript
export function DiagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
```

### 8.2 Add Button to Toolbar

Update `src/renderer/components/editor/TiptapEditor.tsx`:

```typescript
import { DiagramIcon } from '../icons/DiagramIcon';

<ToolbarButton
  icon={<DiagramIcon />}
  label="Insert Diagram"
  onClick={() => setMermaidModalOpen(true)}
  disabled={!editor?.can().insertMermaidDiagram()}
  tooltip="Insert Mermaid Diagram"
/>
```

### 8.3 Add Keyboard Shortcut

Update `src/renderer/editor/mermaid-extension.ts`:

```typescript
addKeyboardShortcuts() {
  return {
    'Mod-Shift-d': () => {
      // Trigger modal open event
      this.options.onOpenModal?.();
      return true;
    },
  };
}
```

---

## Step 9: Write Tests (4 hrs)

### 9.1 Unit Tests for Hook

Already covered in Step 2.2.

### 9.2 Unit Tests for Extension

Create `tests/unit/editor/mermaid-extension.test.ts`:

```typescript
import { Editor } from '@tiptap/core';
import { MermaidDiagram } from '@/renderer/editor/mermaid-extension';

describe('MermaidDiagram Extension', () => {
  let editor: Editor;

  beforeEach(() => {
    editor = new Editor({
      extensions: [MermaidDiagram],
      content: '',
    });
  });

  afterEach(() => {
    editor.destroy();
  });

  it('should insert diagram with code', () => {
    const code = 'graph TD\n  A-->B';
    editor.commands.insertMermaidDiagram(code);

    const json = editor.getJSON();
    expect(json.content).toHaveLength(1);
    expect(json.content[0].type).toBe('mermaidDiagram');
    expect(json.content[0].attrs.code).toBe(code);
  });

  it('should generate unique IDs', () => {
    editor.commands.insertMermaidDiagram('graph TD; A-->B');
    editor.commands.insertMermaidDiagram('graph TD; C-->D');

    const json = editor.getJSON();
    const id1 = json.content[0].attrs.id;
    const id2 = json.content[1].attrs.id;

    expect(id1).not.toBe(id2);
  });

  it('should update diagram code', () => {
    editor.commands.insertMermaidDiagram('graph TD; A-->B');
    const json = editor.getJSON();
    const diagramId = json.content[0].attrs.id;

    editor.commands.updateMermaidDiagram(diagramId, 'graph LR; X-->Y');

    const updatedJson = editor.getJSON();
    expect(updatedJson.content[0].attrs.code).toBe('graph LR; X-->Y');
  });
});
```

### 9.3 Integration Tests for PDF Export

Create `tests/integration/pdf-mermaid.test.ts`:

```typescript
import { generatePDF } from '@/main/pdf/pdf-service';

describe('Mermaid PDF Export', () => {
  it('should render simple diagram in PDF', async () => {
    const markdown = `
# Test Document

\`\`\`mermaid
graph TD
  A-->B
\`\`\`
    `;

    const pdf = await generatePDF(markdown, {});
    expect(pdf).toBeDefined();
    // Additional assertions on PDF content
  });

  it('should handle invalid diagrams gracefully', async () => {
    const markdown = `
\`\`\`mermaid
invalid syntax
\`\`\`
    `;

    const pdf = await generatePDF(markdown, {});
    expect(pdf).toBeDefined(); // Should still generate PDF with error placeholder
  });
});
```

### 9.4 E2E Tests

Create `tests/e2e/mermaid-workflow.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Mermaid Diagram Workflow', () => {
  test('should insert and edit diagram', async ({ page }) => {
    // Open app
    await page.goto('/');

    // Click toolbar button
    await page.click('[aria-label="Insert Diagram"]');

    // Wait for modal
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Enter code
    await page.fill('#mermaid-code', 'graph TD\n  A-->B');

    // Wait for preview
    await expect(page.locator('.mermaid-preview svg')).toBeVisible();

    // Insert
    await page.click('button:has-text("Insert")');

    // Verify diagram in editor
    await expect(page.locator('.mermaid-node-view')).toBeVisible();
  });

  test('should export diagram in PDF', async ({ page }) => {
    // Insert diagram (as above)
    // ...

    // Export to PDF
    await page.click('[aria-label="Export PDF"]');

    // Wait for download
    const download = await page.waitForEvent('download');
    expect(download.suggestedFilename()).toContain('.pdf');
  });
});
```

---

## Step 10: Documentation & Polish (2 hrs)

### 10.1 Update User Documentation

Create `docs/features/mermaid-diagrams.md`:

```markdown
# Mermaid Diagrams

Insert flowcharts, sequence diagrams, and more using Mermaid.js syntax.

## Inserting Diagrams

1. Click the **Diagram** button in the toolbar (or press `Ctrl+Shift+D`)
2. Enter your Mermaid code in the editor
3. See a live preview on the right
4. Optionally add a caption
5. Click **Insert**

## Editing Diagrams

Click on any diagram in the editor to re-open the modal and edit.

## Supported Diagram Types

- Flowcharts (`graph`)
- Sequence diagrams (`sequenceDiagram`)
- Class diagrams (`classDiagram`)
- State diagrams (`stateDiagram`)
- Entity-relationship diagrams (`erDiagram`)
- And more! See [Mermaid.js docs](https://mermaid.js.org/) for full syntax.

## PDF Export

Diagrams automatically render as high-quality vector graphics in exported PDFs.
```

### 10.2 Add JSDoc Comments

Ensure all public APIs have JSDoc comments (examples shown in previous steps).

### 10.3 Performance Testing

```typescript
// Measure insertion time
console.time('insert-diagram');
editor.commands.insertMermaidDiagram(complexCode);
console.timeEnd('insert-diagram');
// Target: <5s for complex diagrams
```

---

## Troubleshooting

### Issue: Mermaid fails to load

**Solution**: Check browser console for module loading errors. Ensure `mermaid` is installed:

```bash
npm list mermaid
```

### Issue: Preview not rendering

**Solution**: Verify `useMermaid` hook is loaded:

```typescript
const { isLoaded } = useMermaid();
console.log('Mermaid loaded:', isLoaded);
```

### Issue: PDF export shows errors

**Solution**: Test SVG rendering in main process:

```typescript
import mermaid from 'mermaid';
const { svg } = await mermaid.render('test-id', 'graph TD; A-->B');
console.log('SVG:', svg);
```

### Issue: Keyboard shortcut not working

**Solution**: Check for conflicts in `addKeyboardShortcuts()`. Try alternative shortcut.

---

## Testing Checklist

Before marking feature complete:

- [ ] Insert diagram via toolbar button
- [ ] Insert diagram via keyboard shortcut (`Ctrl+Shift+D`)
- [ ] Edit existing diagram by clicking
- [ ] Validate invalid syntax (shows error in modal)
- [ ] Live preview updates as you type
- [ ] Caption displays correctly
- [ ] Drag-and-drop reorder diagrams
- [ ] Serialize to Markdown (fenced code blocks)
- [ ] PDF export renders diagram
- [ ] PDF export handles errors gracefully
- [ ] Unit tests pass (`npm test`)
- [ ] E2E tests pass
- [ ] Performance meets SLA (<5s insert, <2s edit)

---

## Next Steps After Implementation

1. Run `/speckit.verify` to validate implementation
2. Update RELEASE_NOTES.md with feature announcement
3. Create demo video showing workflow
4. Gather user feedback for improvements

---

## Resources

- [Mermaid.js Documentation](https://mermaid.js.org/)
- [Tiptap Custom Extensions Guide](https://tiptap.dev/guide/custom-extensions)
- [Radix UI Dialog Documentation](https://www.radix-ui.com/docs/primitives/components/dialog)
- [@react-pdf/renderer API](https://react-pdf.org/)

---

**Estimated Total Time**: 16-24 hours  
**Developer Level**: Intermediate (TypeScript, React, Tiptap experience required)  
**Priority**: P1 (Core Feature)
