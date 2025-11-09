# Implementation Plan: Markdown to PDF Export

**Branch**: `001-markdown-pdf-export` | **Date**: 2025-11-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-markdown-pdf-export/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

InkPot is a local-first desktop application for creating professional PDF documents from markdown content. Users launch the app to a project selector, create or open projects, edit markdown in a rich text editor with real-time formatting, apply themes for PDF styling, optionally add cover pages, preview PDFs before export, and save projects for later work. All data is stored locally with no cloud dependencies except Google Fonts downloads. The application leverages Electron for cross-platform desktop deployment, React 19 with the new compiler for optimal UI performance, Tiptap for extensible rich text editing, React PDF for document generation, and SQLite with Prisma for local data persistence.

## Technical Context

**Language/Version**: TypeScript 5.x with strict mode enabled, React 19 with new automatic compiler

**Primary Dependencies**:
- **Electron** (latest stable, ~v32+) - Desktop application framework
- **React 19** - UI library with automatic optimization compiler
- **Tailwind CSS 4.x** - Utility-first styling framework
- **Tiptap 2.x** - Headless rich text editor framework (ProseMirror-based)
- **TanStack Router** - Type-safe routing for renderer process
- **React PDF (@react-pdf/renderer)** - PDF document generation from React components
- **SQLite** - Embedded database for local data persistence
- **Prisma** - TypeScript ORM for SQLite database access

**Storage**: 
- SQLite database for structured data (projects, themes, settings, recent files)
- Local file system for project files, image assets, and exported PDFs
- Platform-specific app data directory for application metadata and cache

**Testing**: 
- Vitest for unit testing with React Testing Library
- Playwright for end-to-end Electron testing
- Integration tests for IPC contract validation

**Target Platform**: Cross-platform desktop (macOS, Windows, Linux) via Electron

**Project Type**: Electron desktop application with local-first architecture

**Performance Goals**: 
- Initial app launch <1s cold start, <500ms warm start
- Project selector render <100ms
- Editor initial render <1s for empty document
- Real-time markdown formatting response <50ms
- Theme switching with page break recalculation <1s
- PDF preview generation <5s for 50-page document
- Tiptap document operations up to 10,000 nodes without perceptible lag
- Auto-save operation <500ms

**Constraints**: 
- Entirely local operation (no cloud/network except Google Fonts)
- Main process must remain responsive during heavy operations
- Bundle size optimization for fast app startup
- Electron security model (context isolation, sandbox enabled)
- Strict TypeScript with no `any` types
- Cross-platform compatibility (macOS, Windows, Linux)

**Scale/Scope**: 
- Single-user, single-instance operation
- Documents up to 1,000 pages supported
- No collaborative editing
- No plugin system in v1 (future consideration)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Component Isolation**: React components in `src/renderer/components/` use props/events interface. No direct Electron API access - all system operations via IPC handlers. Tiptap editor wrapped in isolated component. Tailwind utility classes for all styling.

- [x] **Type Safety**: TypeScript strict mode enabled in `tsconfig.json`. All IPC contracts defined in `src/shared/types/ipc-contracts.ts` with Zod validation at boundaries. Tiptap custom extensions have full TypeScript definitions. Prisma generates type-safe database client.

- [x] **Performance First**: React 19 compiler enabled for automatic optimization. Heavy dependencies code-split: Tiptap extensions lazy-loaded, React PDF bundled separately for preview/export. Initial render target <1s verified through performance budgets. No manual memoization except where profiling proves necessary.

- [x] **Content Model Integrity**: Tiptap schema strictly defined with validation rules. Custom extensions validate input/output. Prosemirror document serialization/deserialization tested for fidelity. Undo/redo uses Tiptap's built-in history extension (atomic operations). Auto-save triggers on document change without data loss.

- [x] **Cross-Process Communication**: All IPC channels defined in preload.ts contextBridge. Renderer cannot access Node.js/Electron APIs directly. IPC handlers in `src/main/ipc/` validate inputs using Zod schemas, handle errors with structured responses. File operations, database queries, PDF exports occur only in main process.

**Validation**: All constitutional principles satisfied. No complexity violations requiring justification.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# Electron Desktop Application Structure
src/
├── main/                 # Main process (Node.js/Electron APIs)
│   ├── index.ts         # Entry point, BrowserWindow setup
│   ├── ipc/             # IPC handler implementations
│   ├── services/        # File system, system integration
│   └── preload.ts       # Context bridge definitions
├── renderer/            # Renderer process (React UI)
│   ├── components/      # React components (isolated, typed)
│   ├── editor/          # Tiptap editor setup and extensions
│   ├── hooks/           # Custom React hooks
│   ├── styles/          # Tailwind config and global styles
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Pure utility functions
│   └── App.tsx          # Root React component
└── shared/              # Code shared between processes
    └── types/           # IPC contract interfaces

tests/
├── e2e/                 # End-to-end Electron tests
├── integration/         # IPC contract tests
└── unit/                # Component and logic tests
```

**Structure Decision**: 

Using Electron's standard two-process architecture with strict separation:
- **Main process** (`src/main/`) handles all Node.js operations, file system access, SQLite/Prisma database operations, window management, and IPC handlers
- **Renderer process** (`src/renderer/`) contains React 19 UI, TanStack Router for navigation, Tiptap editor, and React PDF components
- **Shared types** (`src/shared/types/`) define IPC contracts and domain models used by both processes
- **Preload script** (`src/main/preload.ts`) exposes type-safe contextBridge APIs to renderer

This structure enforces the Cross-Process Communication constitutional principle and enables independent testing of UI components without Electron dependencies.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
