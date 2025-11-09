<!--
Sync Impact Report
==================
Version: 0.0.0 → 1.0.0 (Initial constitution ratification)

Added Principles:
- Component Isolation: React component modularity and composition
- Type Safety: TypeScript-first development with strict validation
- Performance First: React 19 compiler optimization and bundle efficiency
- Content Model Integrity: Tiptap document structure and extensibility
- Cross-Process Communication: IPC safety patterns for Electron

Added Sections:
- Technology Stack: Concrete requirements for Electron, React 19, Tailwind, Tiptap
- Development Standards: Build/test/lint requirements and quality gates

Templates Status:
✅ plan-template.md - Updated with Electron structure, TypeScript/React context, constitution gates
✅ spec-template.md - Updated with desktop-specific edge case guidance
✅ tasks-template.md - Updated with main/renderer process paths, Electron foundational tasks
✅ checklist-template.md - Generic, no updates needed
✅ agent-file-template.md - Generic, no updates needed

Command Files:
✅ No agent-specific references (CLAUDE, etc.) found in .github/prompts/*.md

Follow-up TODOs:
- None (initial constitution, all templates synchronized)
-->

# InkPot Constitution

## Core Principles

### I. Component Isolation

React components MUST be modular, composable, and independently testable. Each component
MUST have a single responsibility and clear props interface. Components MUST NOT directly
access Electron APIs or node modules; use IPC abstraction layers. Shared UI components
MUST be framework-agnostic where practical (accept data, emit events). Tailwind utility
classes MUST be preferred over component-scoped CSS to maintain consistency.

**Rationale**: Ensures maintainability, testability, and enables component reuse across
different contexts. Isolation from Electron-specific code allows renderer process
components to be tested in standard browser environments.

### II. Type Safety

TypeScript MUST be used throughout with strict mode enabled (`strict: true`). All IPC
contracts between main and renderer processes MUST be defined with typed interfaces.
Tiptap editor schemas and extensions MUST define TypeScript types for all custom nodes,
marks, and commands. Runtime validation MUST occur at process boundaries (IPC handlers,
file I/O, external data). No `any` types except where explicitly justified and documented.

**Rationale**: Catches errors at compile time, improves IDE support, and documents
expected data shapes. Critical for safe IPC communication and preventing runtime errors
in production builds.

### III. Performance First

React 19 compiler optimizations MUST be leveraged; avoid manual memoization unless
profiling proves necessity. Bundle size MUST be monitored; code-split heavy dependencies
(Tiptap extensions, Electron modules). Initial render MUST complete within 1 second on
target hardware. Tiptap document operations MUST handle documents up to 10,000 nodes
without perceptible lag. Main process MUST remain responsive; offload heavy computation
to worker threads or asynchronous operations.

**Rationale**: Desktop apps compete with native performance expectations. React 19's
automatic optimizations reduce manual overhead. Large rich-text documents require
efficient rendering strategies.

### IV. Content Model Integrity

Tiptap document structure MUST follow ProseMirror schema contracts. Custom extensions
MUST validate input/output and handle edge cases (empty nodes, invalid marks). Document
serialization MUST preserve fidelity (export/import cycles produce identical structure).
Undo/redo operations MUST be atomic and reversible. Content changes MUST trigger save
state tracking without data loss risk.

**Rationale**: Rich text editors are data-critical applications. Schema violations cause
corruption. Users expect reliable save/undo behavior and data portability.

### V. Cross-Process Communication

All IPC between main and renderer MUST use explicit typed channels (via preload script).
Renderer process MUST NOT access Node.js APIs or Electron main process APIs directly;
use `contextBridge` exclusively. IPC handlers MUST validate inputs, handle errors
gracefully, and return structured responses. Sensitive operations (file writes, system
calls) MUST occur only in main process with appropriate security checks.

**Rationale**: Electron security model requires strict process isolation. Context bridge
prevents renderer compromise from escalating to system access. Typed contracts prevent
runtime errors from IPC mismatches.

## Technology Stack

**Frontend**:
- React 19 with new compiler (automatic optimization)
- TypeScript 5.x with strict mode enabled
- Tailwind CSS 4.x for utility-first styling
- Tiptap 2.x for rich text editing (ProseMirror-based)

**Desktop Runtime**:
- Electron (latest stable) with context isolation and sandbox enabled
- Node.js (version bundled with Electron)

**Build & Tooling**:
- Vite or Webpack for bundling (optimized for Electron)
- ESLint + TypeScript ESLint for linting
- Prettier for code formatting
- Vitest or Jest for unit testing (React Testing Library for components)

**Requirements**:
- TypeScript strict mode MUST be enabled
- Electron security features MUST be enabled: `contextIsolation: true`, `nodeIntegration: false`, `sandbox: true`
- Tailwind configuration MUST use content-based purging to minimize bundle size
- Tiptap MUST use modular imports (only load required extensions)

## Development Standards

**Code Quality**:
- All code MUST pass ESLint and TypeScript compiler with zero errors before commit
- Prettier MUST auto-format on save; consistent style is non-negotiable
- Unit tests MUST cover critical business logic (not required for simple UI components unless specified)
- Integration tests MUST verify main/renderer IPC contracts

**Build Process**:
- Development builds MUST support hot module replacement (HMR)
- Production builds MUST be code-split and minified
- Build MUST produce platform-specific installers (DMG for macOS, NSIS for Windows, AppImage for Linux)
- Build artifacts MUST include source maps for debugging production issues

**Review Gates**:
- No direct commits to main branch; all changes via pull requests
- PRs MUST pass CI checks: lint, type-check, tests, build
- Breaking changes to IPC contracts MUST include migration guide

## Governance

This constitution supersedes all other development practices and coding standards.
Amendments require documentation of rationale, impact analysis, and approval before
implementation. All feature specifications and implementation plans MUST reference
relevant constitutional principles and demonstrate compliance. Complexity introduced
(e.g., additional processes, non-standard patterns) MUST be justified against simpler
alternatives. Violations MUST be documented in implementation plans with explicit
reasoning.

All pull requests and code reviews MUST verify compliance with these principles.
Reviewers MUST challenge deviations and require justification. When constitutional
guidance conflicts with external best practices, this constitution takes precedence
unless amended through proper governance process.

**Version**: 1.0.0 | **Ratified**: 2025-11-07 | **Last Amended**: 2025-11-07
