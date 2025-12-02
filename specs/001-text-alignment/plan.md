# Implementation Plan: Text Alignment

**Branch**: `001-text-alignment` | **Date**: 2025-12-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-text-alignment/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add text alignment functionality (Left, Center, Right) to the Tiptap-based rich text editor with toolbar buttons and keyboard shortcuts (Cmd/Ctrl+L/E/R). Alignment persists in the document model, renders correctly in the editor preview, and exports to PDF with visual fidelity. Supports undo/redo and applies to the current paragraph or selection.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x with strict mode, React 19
**Primary Dependencies**: Electron (latest stable), Tiptap 2.x (ProseMirror-based), Tailwind CSS 4.x, @react-pdf/renderer
**Storage**: Document metadata persisted via existing file system (project files)
**Testing**: Vitest/Jest with React Testing Library, Electron testing utilities
**Target Platform**: Desktop (macOS, Windows, Linux) via Electron
**Project Type**: Electron desktop application
**Performance Goals**: Alignment operations <100ms, no lag on documents with 10k nodes
**Constraints**: Must integrate with existing Tiptap editor and PDF export pipeline; no new IPC channels needed (alignment is renderer-only formatting)
**Scale/Scope**: Single-user documents, alignment applies at paragraph level (Tiptap node attribute)
**Unknowns Requiring Research**:
  - Tiptap TextAlign extension availability and integration patterns [NEEDS CLARIFICATION]
  - ProseMirror schema modification approach for alignment attribute [NEEDS CLARIFICATION]
  - PDF export: mapping Tiptap alignment metadata to @react-pdf/renderer styles [NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Component Isolation**: Alignment UI in React toolbar component; no Electron API access (renderer-only feature)
- [x] **Type Safety**: Alignment types defined for Tiptap node attributes; TypeScript strict mode enabled
- [x] **Performance First**: Alignment uses Tiptap commands (optimized by ProseMirror); no custom memoization needed
- [x] **Content Model Integrity**: Alignment stored as node attribute in Tiptap schema; undo/redo handled by Tiptap transaction system; serialization to Markdown and PDF preserves alignment
- [x] **Cross-Process Communication**: No IPC required (alignment is renderer-side formatting; PDF export already has IPC for file writes)

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

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

**Status**: ✅ No violations - all constitutional principles satisfied

**Post-Design Constitution Re-Check** (Phase 1 Complete):

- [x] **Component Isolation**: ✅ CONFIRMED - Alignment UI components isolated, use Tiptap commands via props
- [x] **Type Safety**: ✅ CONFIRMED - `TextAlignment` type defined; `MarkdownElement.textAlign` typed; strict mode enforced
- [x] **Performance First**: ✅ CONFIRMED - Using official Tiptap extension (optimized); React 19 compiler handles rendering; <100ms alignment operations
- [x] **Content Model Integrity**: ✅ CONFIRMED - ProseMirror schema extended via global attributes; undo/redo via history plugin; HTML/PDF serialization preserves alignment
- [x] **Cross-Process Communication**: ✅ CONFIRMED - No new IPC channels; alignment transparent to existing `project:save`/`pdf:export` contracts

**No additional complexity introduced** - feature uses existing patterns and official extensions.
