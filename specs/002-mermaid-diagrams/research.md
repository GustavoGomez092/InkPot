# Research Report: Mermaid.js Diagram Support

**Feature**: 002-mermaid-diagrams  
**Date**: 2025-12-01  
**Phase**: 0 - Outline & Research  

## Overview

This research document consolidates technical decisions, best practices, and implementation patterns for adding Mermaid.js diagram support to InkPot's Tiptap-based rich text editor.

## Research Areas

### 1. Mermaid.js Integration

**Decision**: Use `mermaid` npm package (v10.6+) with client-side rendering

**Rationale**:
- **Mature library**: 60k+ GitHub stars, actively maintained, comprehensive diagram type support
- **Client-side rendering**: No server dependency, works offline, faster for users
- **TypeScript support**: Native TypeScript definitions available
- **Bundle size acceptable**: ~800KB minified, can be code-split and lazy-loaded
- **Browser compatibility**: Works in Electron/Chromium environment

**Alternatives Considered**:
- **Server-side rendering (Puppeteer)**: Rejected due to complexity, main process overhead, and slower performance
- **PlantUML**: Rejected due to Java dependency and less modern syntax
- **D3.js custom implementation**: Rejected due to development time and maintenance burden

**Implementation Pattern**:
```typescript
import mermaid from 'mermaid';

// Initialize once on app load
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose' // Required for custom styling
});

// Render diagram
const renderDiagram = async (code: string, element: HTMLElement) => {
  const { svg } = await mermaid.render('diagram-id', code);
  element.innerHTML = svg;
};
```

**Best Practices**:
- Lazy load mermaid library on first diagram insertion
- Use `startOnLoad: false` to control rendering timing
- Generate unique IDs for each diagram to avoid conflicts
- Wrap rendering in try-catch for syntax error handling

---

### 2. Tiptap Custom Node Extension

**Decision**: Create custom `mermaidDiagram` node extending Tiptap's `Node` base class

**Rationale**:
- **Schema compliance**: ProseMirror requires well-defined node schemas
- **Data persistence**: Node attributes store diagram code as string
- **Standard pattern**: Follows Tiptap extension architecture (similar to Image node)
- **Undo/redo support**: Automatic via ProseMirror transaction system
- **Type safety**: TypeScript interfaces for node attributes

**Alternatives Considered**:
- **Mark-based approach**: Rejected because diagrams are block-level elements, not inline formatting
- **Generic code block with metadata**: Rejected due to lack of specialized rendering control
- **External plugin system**: Rejected due to over-engineering for single feature

**Implementation Pattern**:
```typescript
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import MermaidNodeView from './MermaidNodeView';

export const MermaidDiagram = Node.create({
  name: 'mermaidDiagram',
  
  group: 'block',
  
  atom: true, // Cannot be split, treated as single unit
  
  addAttributes() {
    return {
      code: {
        default: '',
        parseHTML: element => element.getAttribute('data-code'),
        renderHTML: attributes => ({
          'data-code': attributes.code
        })
      },
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => ({
          'data-id': attributes.id
        })
      }
    };
  },
  
  parseHTML() {
    return [{ tag: 'div[data-type="mermaid-diagram"]' }];
  },
  
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, {
      'data-type': 'mermaid-diagram'
    })];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(MermaidNodeView);
  }
});
```

**Best Practices**:
- Use `atom: true` to prevent cursor entry and splitting
- Store code as string attribute (avoid nested JSON structures)
- Generate unique IDs for each diagram instance
- Use ReactNodeViewRenderer for React component integration

---

### 3. React NodeView Component

**Decision**: Use Tiptap's ReactNodeViewRenderer with isolated React component

**Rationale**:
- **React integration**: Seamless use of React hooks and state management
- **Component isolation**: Follows constitutional principle of component modularity
- **Event handling**: Easy click detection for edit modal trigger
- **SVG rendering**: Direct DOM manipulation for Mermaid output
- **Performance**: React 19 compiler optimizations apply automatically

**Alternatives Considered**:
- **Vanilla JavaScript NodeView**: Rejected due to increased complexity and loss of React ecosystem benefits
- **Web Component**: Rejected due to unnecessary abstraction layer

**Implementation Pattern**:
```typescript
import { NodeViewWrapper } from '@tiptap/react';
import { useEffect, useRef } from 'react';
import { useMermaid } from '@/hooks/useMermaid';

export const MermaidNodeView = ({ node, updateAttributes, deleteNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { renderDiagram, error } = useMermaid();
  const code = node.attrs.code;
  
  useEffect(() => {
    if (containerRef.current && code) {
      renderDiagram(code, containerRef.current);
    }
  }, [code]);
  
  const handleClick = () => {
    // Open edit modal with current code
    openMermaidModal(code, (newCode) => {
      updateAttributes({ code: newCode });
    });
  };
  
  return (
    <NodeViewWrapper className="mermaid-diagram-wrapper">
      <div
        ref={containerRef}
        className="mermaid-container cursor-pointer border rounded p-4"
        onClick={handleClick}
        role="button"
        aria-label="Edit diagram"
      />
      {error && <div className="error-message">{error}</div>}
    </NodeViewWrapper>
  );
};
```

**Best Practices**:
- Use `NodeViewWrapper` for proper ProseMirror integration
- Implement click handler for edit functionality
- Display error states inline
- Use refs for Mermaid SVG injection
- Memoize render function to avoid unnecessary re-renders

---

### 4. Modal Dialog UI

**Decision**: Use existing Radix UI Dialog components with custom content

**Rationale**:
- **Already in project**: Radix UI is established dependency (via shadcn/ui)
- **Accessibility**: WAI-ARIA compliant, keyboard navigation built-in
- **Portal rendering**: Renders outside DOM hierarchy, avoids z-index issues
- **Unstyled primitives**: Easy to style with Tailwind
- **Animation support**: Smooth transitions via Tailwind animate utilities

**Alternatives Considered**:
- **Custom modal implementation**: Rejected due to accessibility complexity
- **Electron native dialog**: Rejected because limited styling and not suitable for code editor

**Implementation Pattern**:
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';

export const MermaidModal = ({ open, onClose, initialCode, onSave }) => {
  const [code, setCode] = useState(initialCode || '');
  const [error, setError] = useState<string | null>(null);
  const { validateMermaid } = useMermaid();
  
  const handleSave = async () => {
    const validationError = await validateMermaid(code);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSave(code);
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Mermaid Diagram</DialogTitle>
        </DialogHeader>
        
        <textarea
          className="w-full h-64 font-mono text-sm p-4 border rounded"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="graph TD\n  A-->B"
        />
        
        {error && <div className="text-red-500 text-sm">{error}</div>}
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Accept</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

**Best Practices**:
- Validate syntax before saving
- Show clear error messages
- Use monospace font for code editor
- Provide syntax hints in placeholder
- Close on Escape key (handled by Radix)

---

### 5. Markdown Serialization

**Decision**: Extend existing markdown serializer to handle mermaid nodes as fenced code blocks

**Rationale**:
- **Standard Markdown**: Mermaid diagrams use ```mermaid fenced blocks
- **Compatibility**: Works with existing document storage and serialization
- **Round-trip fidelity**: Parse and serialize back to identical structure
- **Existing pattern**: Already have custom serializer for text alignment

**Alternatives Considered**:
- **HTML embedding**: Rejected due to lack of portability and markdown compatibility
- **Custom JSON format**: Rejected due to complexity and non-standard approach

**Implementation Pattern**:
```typescript
// In markdown-serializer.ts
export const markdownSerializer = new MarkdownSerializer({
  // ... existing nodes ...
  
  mermaidDiagram: (state, node) => {
    state.write('```mermaid\n');
    state.text(node.attrs.code, false);
    state.ensureNewLine();
    state.write('```');
    state.closeBlock(node);
  }
}, /* marks */);

// In markdown parser (for import)
export const markdownParser = new MarkdownParser(schema, markdownit(), {
  // ... existing tokens ...
  
  fence: {
    block: 'mermaidDiagram',
    getAttrs: (token) => {
      if (token.info === 'mermaid') {
        return { code: token.content };
      }
      return null; // Let other code blocks pass through
    }
  }
});
```

**Best Practices**:
- Use standard Markdown fence syntax
- Preserve whitespace exactly in code blocks
- Handle parsing errors gracefully
- Support both import and export workflows

---

### 6. PDF Export Integration

**Decision**: Render Mermaid to SVG in main process, embed as @react-pdf/renderer Image component

**Rationale**:
- **Existing infrastructure**: Already using @react-pdf/renderer for PDF generation
- **Vector quality**: SVG maintains crisp rendering at any zoom level
- **No new dependencies**: Mermaid can generate SVG strings directly
- **Type safety**: Leverages existing PDF component patterns

**Alternatives Considered**:
- **PNG rasterization**: Rejected due to quality loss at high zoom
- **Client-side rendering then IPC**: Rejected due to unnecessary complexity
- **Puppeteer screenshot**: Rejected due to heavyweight dependency

**Implementation Pattern**:
```typescript
// In src/main/pdf/components/MermaidDiagram.tsx
import { Svg } from '@react-pdf/renderer';
import mermaid from 'mermaid';

export const MermaidDiagram = ({ code }: { code: string }) => {
  const [svg, setSvg] = useState<string | null>(null);
  
  useEffect(() => {
    const renderSvg = async () => {
      try {
        const { svg: renderedSvg } = await mermaid.render('pdf-diagram', code);
        setSvg(renderedSvg);
      } catch (error) {
        console.error('Mermaid render failed:', error);
        setSvg(null);
      }
    };
    renderSvg();
  }, [code]);
  
  if (!svg) {
    return <Text>Error rendering diagram</Text>;
  }
  
  return <Svg src={svg} />;
};

// In markdown-parser.ts (PDF generation)
// Detect mermaid code blocks and create diagram elements
if (element.type === 'code' && element.language === 'mermaid') {
  return {
    type: 'mermaid',
    code: element.content
  };
}
```

**Best Practices**:
- Render SVG asynchronously
- Handle rendering errors with fallback UI
- Cache rendered SVGs during PDF generation
- Use unique IDs to avoid conflicts

---

### 7. Syntax Validation

**Decision**: Use Mermaid's built-in `mermaid.parse()` API for client-side validation

**Rationale**:
- **Built-in validation**: No additional parser needed
- **Accurate errors**: Reports specific syntax issues
- **Fast**: Runs synchronously, no network latency
- **User-friendly**: Validate before accepting diagram

**Alternatives Considered**:
- **Manual regex validation**: Rejected due to incomplete coverage and maintenance burden
- **Server-side validation**: Rejected due to unnecessary complexity

**Implementation Pattern**:
```typescript
// In src/renderer/lib/mermaid-utils.ts
import mermaid from 'mermaid';

export const validateMermaidSyntax = async (code: string): Promise<{
  isValid: boolean;
  error?: string;
}> => {
  try {
    await mermaid.parse(code);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid syntax'
    };
  }
};

// In useMermaid hook
export const useMermaid = () => {
  const validateMermaid = useCallback(async (code: string) => {
    const result = await validateMermaidSyntax(code);
    return result.isValid ? null : result.error;
  }, []);
  
  return { validateMermaid };
};
```

**Best Practices**:
- Validate on "Accept" button click, not on every keystroke
- Show clear error messages from Mermaid parser
- Allow saving empty diagrams (user might want placeholder)
- Timeout validation after 5 seconds for very complex diagrams

---

### 8. Performance Optimization

**Decision**: Lazy load Mermaid library and use code splitting

**Rationale**:
- **Bundle size**: Mermaid is ~800KB, significant impact if loaded upfront
- **User experience**: Most documents won't have diagrams
- **Fast initial load**: Maintains <1s initial render target

**Implementation Pattern**:
```typescript
// Dynamic import in useMermaid hook
let mermaidLib: typeof import('mermaid') | null = null;

export const useMermaid = () => {
  const loadMermaid = useCallback(async () => {
    if (!mermaidLib) {
      mermaidLib = await import('mermaid');
      mermaidLib.default.initialize({
        startOnLoad: false,
        theme: 'default'
      });
    }
    return mermaidLib.default;
  }, []);
  
  const renderDiagram = useCallback(async (code: string, element: HTMLElement) => {
    const mermaid = await loadMermaid();
    const { svg } = await mermaid.render(`diagram-${Date.now()}`, code);
    element.innerHTML = svg;
  }, []);
  
  return { renderDiagram };
};
```

**Best Practices**:
- Load Mermaid on first diagram insertion
- Cache loaded instance globally
- Show loading spinner during initial load
- Prefetch on hover over "Insert Diagram" button (optional optimization)

---

## Technical Decisions Summary

| Area | Decision | Rationale |
|------|----------|-----------|
| Diagram Library | Mermaid.js v10.6+ | Mature, TypeScript support, client-side rendering |
| Editor Integration | Custom Tiptap Node | Standard extension pattern, ProseMirror schema compliance |
| UI Component | React NodeView | React integration, component isolation, event handling |
| Modal UI | Radix UI Dialog | Already in project, accessible, portal rendering |
| Serialization | Markdown fenced blocks | Standard format, round-trip fidelity |
| PDF Rendering | SVG via @react-pdf/renderer | Vector quality, existing infrastructure |
| Validation | mermaid.parse() API | Built-in, accurate, fast |
| Performance | Dynamic import + code split | Reduces initial bundle, lazy loads 800KB library |

---

## Implementation Dependencies

### NPM Packages (New)
- `mermaid` (v10.6+): Core diagram rendering library
- No additional packages required (Radix UI, Tiptap already present)

### Internal Dependencies (Existing)
- `/src/renderer/editor/`: Tiptap editor setup and extensions
- `/src/renderer/components/ui/`: Radix UI Dialog components
- `/src/main/pdf/`: PDF generation infrastructure
- `/src/shared/types/`: Type definitions

### External Dependencies
- None (all rendering client-side)

---

## Risk Mitigation

### Risk: Large bundle size from Mermaid.js
**Mitigation**: Dynamic import with code splitting, lazy load on first use

### Risk: Complex diagrams cause performance issues
**Mitigation**: 
- Limit to 20 diagrams per document (spec SC-008)
- Timeout validation after 5s
- Debounce re-renders in NodeView

### Risk: Mermaid syntax errors crash editor
**Mitigation**:
- Validate before insertion with try-catch
- Render errors inline, don't prevent document editing
- Store invalid code safely, allow re-editing

### Risk: PDF rendering fails for some diagram types
**Mitigation**:
- Fallback to error placeholder in PDF
- Test all common diagram types (flowchart, sequence, class, state, gantt, pie)
- Document unsupported diagram types in user-facing docs

---

## Next Steps

**Phase 1**: Generate data-model.md, API contracts, and quickstart guide
- Define DiagramNode TypeScript interface
- Document Tiptap extension API contract
- Create integration testing contract
- Write developer quickstart for diagram feature

**Phase 2**: Task breakdown (via `/speckit.tasks` command)
- Break implementation into prioritized tasks
- Map tasks to user stories (P1, P2, P3)
- Estimate effort and dependencies
