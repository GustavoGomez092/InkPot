# Technical Research: Markdown to PDF Export

**Feature**: 001-markdown-pdf-export  
**Date**: 2025-11-07  
**Status**: Complete

## Overview

This document consolidates research findings and technical decisions for implementing InkForge's markdown-to-PDF export feature using Electron, React 19, Tiptap, React PDF, SQLite, and related technologies.

---

## 1. Electron Architecture & Security

### Decision: Strict Security Model with Context Isolation

**Chosen Approach**:
- Enable `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`
- Use preload script with `contextBridge` for all IPC communication
- Main process handles all privileged operations (file system, database)

**Rationale**:
- Aligns with Electron security best practices and constitutional requirement
- Prevents renderer process compromise from escalating to system access
- Type-safe IPC contracts enforced at compile time
- Industry standard for production Electron apps

**Alternatives Considered**:
- **Remote module** (deprecated): Rejected - security vulnerability, deprecated in Electron 14+
- **Node integration in renderer**: Rejected - violates security model, exposes system APIs to web content

**Implementation Pattern**:
```typescript
// src/main/preload.ts
const api = {
  projects: {
    create: (name: string) => ipcRenderer.invoke('projects:create', name),
    load: (id: string) => ipcRenderer.invoke('projects:load', id),
    // ... all typed IPC methods
  }
};
contextBridge.exposeInMainWorld('electronAPI', api);
```

---

## 2. React 19 Compiler Integration

### Decision: Enable Automatic Optimization Compiler

**Chosen Approach**:
- Use React 19's built-in compiler for automatic memoization
- Avoid manual `useMemo`, `useCallback`, `memo` unless profiling proves necessary
- Configure via `babel-plugin-react-compiler` or React's compiler flag

**Rationale**:
- React 19 compiler analyzes components and auto-optimizes re-renders
- Reduces boilerplate and human error in performance optimization
- Aligns with "Performance First" constitutional principle
- Industry momentum toward compiler-driven optimization

**Alternatives Considered**:
- **Manual memoization**: Rejected - error-prone, verbose, React 19 compiler makes it unnecessary
- **Class components**: Rejected - functional components with hooks are React 19 standard

**Performance Targets**:
- Initial render <1s
- Component updates <50ms
- No unnecessary re-renders (verified via React DevTools Profiler)

---

## 3. Tiptap Editor Configuration & Custom Extensions

### Decision: Modular Tiptap with Custom Extensions

**Chosen Approach**:
- Use Tiptap's extension API to create custom nodes for page break indicators
- Lazy-load extensions to reduce initial bundle size
- Define strict ProseMirror schema for document integrity

**Custom Extensions Needed**:
1. **PageBreakIndicator**: Visual marker showing PDF page boundaries
2. **ThemeStyler**: Applies theme CSS to editor preview
3. **MarkdownSerializer**: Faithful markdown round-trip serialization

**Rationale**:
- Tiptap's headless architecture separates editor logic from UI
- ProseMirror foundation ensures robust document model
- Custom extensions enable page break calculation and theme preview
- Aligns with "Content Model Integrity" principle

**Alternatives Considered**:
- **Draft.js**: Rejected - less active maintenance, heavier bundle
- **Slate.js**: Rejected - more low-level, requires more custom code
- **Monaco Editor**: Rejected - code editor, not rich text focused

**Implementation Pattern**:
```typescript
// Custom extension for page break indicators
export const PageBreakIndicator = Extension.create({
  name: 'pageBreakIndicator',
  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          pageBreakAfter: {
            default: false,
            renderHTML: attributes => {
              if (attributes.pageBreakAfter) {
                return { class: 'page-break-indicator' };
              }
            }
          }
        }
      }
    ];
  }
});
```

---

## 4. React PDF for Document Generation

### Decision: @react-pdf/renderer for PDF Generation

**Chosen Approach**:
- Use `@react-pdf/renderer` to generate PDFs from React components
- Create theme-based PDF templates as React components
- Generate PDFs in main process to avoid blocking renderer

**Rationale**:
- React-based API matches existing skill set
- Supports custom fonts (Google Fonts integration)
- Server-side rendering capability for main process generation
- Strong TypeScript support

**Alternatives Considered**:
- **Puppeteer/Playwright**: Rejected - heavier, requires browser context, slower
- **jsPDF**: Rejected - imperative API, harder to maintain complex layouts
- **PDFKit**: Rejected - Node.js streams API less familiar, no React integration

**Implementation Pattern**:
```typescript
import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';

const PDFDocument = ({ content, theme }) => (
  <Document>
    <Page style={theme.pageStyle}>
      <Text style={theme.h1Style}>{content.title}</Text>
      {/* Render markdown as PDF elements */}
    </Page>
  </Document>
);
```

---

## 5. SQLite + Prisma for Local Data Persistence

### Decision: SQLite with Prisma ORM

**Chosen Approach**:
- SQLite for embedded database (no server required)
- Prisma as TypeScript-first ORM for type-safe queries
- Store: projects, themes, settings, recent files list
- Project documents stored as files; database stores metadata only

**Rationale**:
- SQLite is embedded (zero-config, perfect for local-first)
- Prisma generates type-safe client from schema
- Migrations managed declaratively
- Aligns with "Type Safety" principle

**Alternatives Considered**:
- **IndexedDB**: Rejected - less structured, browser API, harder to query
- **LowDB/Conf**: Rejected - JSON files don't scale, no relational queries
- **Direct SQL**: Rejected - no type safety, verbose, error-prone

**Schema Strategy**:
```prisma
model Project {
  id          String   @id @default(uuid())
  name        String
  filePath    String   @unique
  themeId     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  theme       Theme?   @relation(fields: [themeId], references: [id])
}

model Theme {
  id          String   @id @default(uuid())
  name        String
  headingFont String
  bodyFont    String
  kerning     Float
  leading     Float
  // ... other settings
  projects    Project[]
}
```

---

## 6. TanStack Router for Renderer Navigation

### Decision: TanStack Router for Type-Safe Routing

**Chosen Approach**:
- Use TanStack Router for renderer process navigation
- Routes: `/`, `/project/:id`, `/theme-editor`, `/preview`
- Type-safe route params and search params

**Rationale**:
- Type-safe routing with TypeScript inference
- Built for React, small bundle size
- Supports nested layouts for consistent UI chrome
- Better DX than React Router v6

**Alternatives Considered**:
- **React Router**: Rejected - less type-safe, larger API surface
- **Wouter**: Rejected - too minimal, lacks advanced features
- **No router**: Rejected - manual state management for navigation is error-prone

**Route Structure**:
```typescript
const routeTree = rootRoute.addChildren([
  indexRoute,           // Project selector
  projectRoute,         // Editor view
  themeEditorRoute,     // Theme customization
  previewRoute,         // PDF preview modal
]);
```

---

## 7. Tailwind CSS 4 Configuration

### Decision: Tailwind 4 with JIT Mode

**Chosen Approach**:
- Tailwind 4.x with Just-In-Time compilation
- Content paths configured for `src/renderer/**/*.{ts,tsx}`
- Custom theme tokens for brand consistency
- Purge unused styles in production

**Rationale**:
- Utility-first approach matches constitutional principle
- JIT mode generates only used classes (smaller bundle)
- Tailwind 4 performance improvements over v3
- Easy to maintain consistent design system

**Alternatives Considered**:
- **CSS Modules**: Rejected - more boilerplate, harder to maintain consistency
- **Styled Components**: Rejected - runtime cost, conflicts with React 19 compiler
- **Vanilla CSS**: Rejected - no design system, hard to maintain

**Configuration**:
```javascript
// tailwind.config.js
export default {
  content: ['./src/renderer/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: { /* custom palette */ }
      }
    }
  }
};
```

---

## 8. Google Fonts Integration & Caching

### Decision: Dynamic Font Loading with Local Cache

**Chosen Approach**:
- Fetch fonts via Google Fonts API on demand
- Cache font files locally in app data directory
- Fallback to system fonts if offline and font not cached

**Rationale**:
- Only network dependency in local-first architecture
- Caching enables offline operation after first download
- Google Fonts CDN provides optimized font delivery

**Implementation**:
```typescript
// src/main/services/font-service.ts
async function downloadFont(family: string): Promise<string> {
  const cacheDir = path.join(app.getPath('userData'), 'fonts');
  const cachedPath = path.join(cacheDir, `${family}.woff2`);
  
  if (fs.existsSync(cachedPath)) {
    return cachedPath; // Use cached version
  }
  
  // Download from Google Fonts API
  const fontUrl = await fetchGoogleFont(family);
  const fontData = await fetch(fontUrl).then(r => r.arrayBuffer());
  
  await fs.promises.mkdir(cacheDir, { recursive: true });
  await fs.promises.writeFile(cachedPath, Buffer.from(fontData));
  
  return cachedPath;
}
```

---

## 9. Auto-Save & Crash Recovery

### Decision: Periodic Auto-Save with Atomic Writes

**Chosen Approach**:
- Auto-save every 60 seconds when document has unsaved changes
- Use atomic writes (write to temp file, rename) to prevent corruption
- Store auto-save recovery file separately from main project file

**Rationale**:
- Prevents data loss from crashes (constitutional requirement: SC-010)
- Atomic writes ensure file integrity
- Separate recovery file doesn't corrupt saved projects

**Implementation Pattern**:
```typescript
// Auto-save logic
let autoSaveTimer: NodeJS.Timeout;

function scheduleAutoSave(projectId: string, content: string) {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(async () => {
    const tempFile = `${projectPath}.tmp`;
    await fs.promises.writeFile(tempFile, content);
    await fs.promises.rename(tempFile, projectPath); // Atomic
  }, 60000);
}
```

---

## 10. Testing Strategy

### Decision: Multi-Layer Testing Approach

**Chosen Approach**:
1. **Unit Tests**: Vitest for React components, utilities, business logic
2. **Integration Tests**: IPC contract validation between main/renderer
3. **E2E Tests**: Playwright for full user workflows

**Rationale**:
- Unit tests catch logic errors early
- Integration tests ensure IPC type safety
- E2E tests verify user scenarios from spec
- Aligns with constitutional testing requirements

**Test Pyramid**:
- 70% Unit tests (fast, isolated)
- 20% Integration tests (IPC contracts, database operations)
- 10% E2E tests (critical user journeys)

**Tools**:
- Vitest (fast, Vite-native, TypeScript support)
- React Testing Library (component testing)
- Playwright (Electron automation)

---

## 11. Build & Distribution

### Decision: Electron Forge with Platform-Specific Installers

**Chosen Approach**:
- Electron Forge for building and packaging
- Platform-specific installers: DMG (macOS), NSIS (Windows), AppImage (Linux)
- Code signing for macOS and Windows
- Auto-update capability via Electron's built-in updater

**Rationale**:
- Electron Forge is official Electron tooling
- Handles platform differences automatically
- Supports code signing and auto-updates
- Good developer experience

**Alternatives Considered**:
- **Electron Builder**: Rejected - more complex configuration
- **Manual packaging**: Rejected - too much boilerplate

---

## 12. Performance Optimization Strategy

### Decision: Lazy Loading & Code Splitting

**Chosen Approach**:
- Lazy load Tiptap extensions on-demand
- Code-split React PDF generation (only load when previewing/exporting)
- Separate bundle for theme editor
- Use dynamic imports for heavy libraries

**Rationale**:
- Reduces initial bundle size for faster startup
- Users don't pay for features they don't use
- Aligns with "Performance First" principle

**Bundle Structure**:
- Core: ~2MB (React, Electron, Tiptap core, TanStack Router)
- Lazy: Tiptap extensions, React PDF, theme editor

---

## Summary of Key Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| Architecture | Electron two-process with strict isolation | Security, testability, constitutional compliance |
| UI Framework | React 19 with automatic compiler | Performance, modern DX, auto-optimization |
| Editor | Tiptap with custom extensions | Flexibility, ProseMirror foundation, extensibility |
| PDF Generation | @react-pdf/renderer | React-based API, theme support, type-safe |
| Database | SQLite + Prisma | Local-first, zero-config, type-safe ORM |
| Routing | TanStack Router | Type-safety, modern API, small bundle |
| Styling | Tailwind CSS 4 | Utility-first, JIT mode, constitutional mandate |
| Testing | Vitest + Playwright | Fast unit tests, reliable E2E, Electron support |
| Build | Electron Forge | Official tooling, platform installers, auto-update |

---

## Risks & Mitigation

### Risk: React PDF Performance with Large Documents
- **Mitigation**: Generate PDFs in main process with progress reporting; implement pagination streaming

### Risk: SQLite File Locking on Network Drives
- **Mitigation**: Detect network paths, warn users, recommend local storage

### Risk: Google Fonts Download Failures
- **Mitigation**: Robust fallback to system fonts, cache validation, offline detection

### Risk: Tiptap Performance with 10,000+ Nodes
- **Mitigation**: Implement virtual scrolling for editor, lazy render off-screen content

---

## Next Steps

1. **Phase 1**: Create data model (Prisma schema)
2. **Phase 1**: Define IPC contracts (TypeScript interfaces)
3. **Phase 1**: Document quickstart (setup instructions)
4. **Phase 2**: Generate task breakdown
