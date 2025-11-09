# Implementation Plan: Interface Design System Implementation

**Branch**: `002-interface-styling` | **Date**: November 7, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-interface-styling/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement a comprehensive design system for InkPot using OKLCH color space, custom typography (Inter, Source Serif 4, JetBrains Mono), shadow system, and Tailwind CSS v4 integration. The system provides light/dark theme support with semantic design tokens, ensuring visual consistency across all UI components while maintaining WCAG AA accessibility standards. Theme preference persists across application restarts with sub-300ms switching performance.

## Technical Context

**Language/Version**: TypeScript 5.x with strict mode, React 19
**Primary Dependencies**: Electron 39.x, React 19.0.0-rc, Tailwind CSS v4.0.0, @fontsource packages (Inter, Source Serif 4, JetBrains Mono)
**Storage**: Electron Store for theme preference persistence (light/dark mode)
**Testing**: Vitest with React Testing Library, visual regression tests for theme consistency, accessibility contrast testing
**Target Platform**: Desktop (macOS, Windows, Linux) via Electron
**Project Type**: Electron desktop application with renderer process UI
**Performance Goals**: Theme switching <300ms, font loading <2s, zero layout shift on theme change
**Constraints**: OKLCH browser support (Chromium 111+), bundle size for font files, CSS custom property fallback strategy
**Scale/Scope**: Single-user desktop application with 5 core UI components (Button, Card, Input, Dialog, Select), 2 theme variants (light/dark), 40+ design tokens

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Component Isolation**: UI components will only modify styling via Tailwind classes and CSS variables. No Electron API access required for design system. Theme state managed via React context.
- [x] **Type Safety**: Theme configuration typed with TypeScript interfaces. All CSS custom properties defined in typed constants. Strict mode enabled.
- [x] **Performance First**: CSS variables enable instant theme switching without re-render. Fonts loaded asynchronously with fallbacks. Tailwind purging minimizes CSS bundle. Zero runtime computation for colors.
- [x] **Content Model Integrity**: Design system does not modify Tiptap document structure. Typography styles applied via CSS classes only, preserving editor schema integrity.
- [x] **Cross-Process Communication**: Theme preference stored in main process via Electron Store. IPC handlers for get/set theme preference with typed contracts. No direct renderer access to file system.

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

```text
# Design System Implementation Structure
src/
├── main/
│   ├── ipc/
│   │   └── handlers.ts           # Add theme preference handlers (getTheme, setTheme)
│   └── services/
│       └── theme-service.ts      # NEW: Theme preference persistence with Electron Store
├── renderer/
│   ├── components/
│   │   └── ui/
│   │       ├── Button.tsx        # UPDATE: Apply design tokens
│   │       ├── Card.tsx          # UPDATE: Apply design tokens
│   │       ├── Input.tsx         # UPDATE: Apply design tokens
│   │       ├── Dialog.tsx        # UPDATE: Apply design tokens
│   │       └── Select.tsx        # UPDATE: Apply design tokens
│   ├── contexts/
│   │   └── ThemeContext.tsx      # NEW: React context for theme state (light/dark)
│   ├── hooks/
│   │   └── useTheme.ts           # NEW: Hook for accessing/toggling theme
│   ├── styles/
│   │   ├── global.css            # UPDATE: Add OKLCH variables, @theme inline directive
│   │   └── tokens.ts             # NEW: TypeScript definitions for design tokens
│   └── types/
│       └── theme.ts              # NEW: Theme type definitions
└── shared/
    └── types/
        └── ipc-contracts.ts      # UPDATE: Add theme IPC contracts

# Font files (bundled locally)
public/
└── fonts/
    ├── inter/                    # NEW: Inter font files (woff2)
    ├── source-serif-4/           # NEW: Source Serif 4 font files (woff2)
    └── jetbrains-mono/           # NEW: JetBrains Mono font files (woff2)

tests/
├── integration/
│   └── theme-persistence.test.ts # NEW: Test theme preference storage
└── unit/
    ├── theme-context.test.tsx    # NEW: Test theme context and hook
    └── token-contrast.test.ts    # NEW: Test WCAG AA contrast ratios
```

**Structure Decision**: Design system is purely a styling layer with minimal architectural changes. Theme state managed via React Context in renderer process, persisted to main process via IPC. Fonts bundled locally to avoid CDN dependency and ensure offline functionality. Existing UI components updated in place rather than creating new design system package.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations detected** - All constitutional principles satisfied:
- Design system is purely styling layer (Component Isolation maintained)
- All theme contracts typed (Type Safety maintained)
- CSS variables enable zero-runtime-cost theme switching (Performance First maintained)
- No Tiptap schema modifications (Content Model Integrity maintained)
- Theme persistence via typed IPC (Cross-Process Communication maintained)
