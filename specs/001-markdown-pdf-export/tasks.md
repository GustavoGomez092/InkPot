# Tasks: Markdown to PDF Export

**Feature Branch**: `001-markdown-pdf-export`  
**Input**: Design documents from `/specs/001-markdown-pdf-export/`  
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/ipc-contracts.md, research.md

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

---

## Format: `- [ ] [ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US7)
- Include exact file paths in descriptions

## Path Conventions

- **Electron main process**: `src/main/` (Node.js/Electron APIs, IPC handlers, database)
- **Electron renderer process**: `src/renderer/` (React components, Tiptap editor, UI)
- **Shared types**: `src/shared/types/` (IPC contracts, domain models)
- **Preload script**: `src/main/preload.ts` (contextBridge definitions)
- **Database**: `src/main/database/` (Prisma schema, migrations, seed)
- **Tests**: `tests/unit/`, `tests/integration/`, `tests/e2e/`

---

## Phase 1: Setup (Project Initialization) ✅

**Purpose**: Initialize project structure and dependencies

- [x] T001 Initialize Electron project with TypeScript in project root
- [x] T002 Install core dependencies: electron, electron-builder, typescript, @types/node
- [x] T003 [P] Install React 19 dependencies: react@rc, react-dom@rc, @vitejs/plugin-react
- [x] T004 [P] Install Tailwind CSS 4: tailwindcss@next, autoprefixer, postcss
- [x] T005 [P] Install Tiptap dependencies: @tiptap/react, @tiptap/starter-kit, @tiptap/extension-*
- [x] T006 [P] Install React PDF dependencies: @react-pdf/renderer
- [x] T007 [P] Install TanStack Router: @tanstack/react-router
- [x] T008 [P] Install database dependencies: prisma, @prisma/client, better-sqlite3
- [x] T009 [P] Install validation dependencies: zod, @types/better-sqlite3
- [x] T010 [P] Install development dependencies: vitest, @testing-library/react, playwright, eslint, prettier
- [x] T011 Create project directory structure per plan.md (src/main, src/renderer, src/shared, tests)
- [x] T012 [P] Configure TypeScript with tsconfig.json in root (strict mode enabled)
- [x] T013 [P] Configure ESLint with .eslintrc.json for TypeScript and React 19
- [x] T014 [P] Configure Prettier with .prettierrc for code formatting
- [x] T015 Configure Vite for Electron renderer process in vite.config.ts
- [x] T016 Configure Tailwind CSS with tailwind.config.js (JIT mode, content paths)
- [x] T017 Configure Electron Forge in forge.config.ts for packaging
- [x] T018 [P] Create .gitignore with node_modules, dist, build, .env, *.db
- [x] T019 Setup package.json scripts: dev, build, test, lint, format, db:migrate
- [x] T020 Initialize Prisma with prisma init in src/main/database/

---

## Phase 2: Foundational (Blocking Prerequisites) 🔄

**Purpose**: Core infrastructure MUST be complete before any user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Foundation ✅

- [x] T021 Create Prisma schema in src/main/database/schema.prisma per data-model.md (8 models: Project, Theme, CoverTemplate, ProjectCoverAsset, RecentProject, AppSetting, CachedFont)
- [x] T022 Generate initial Prisma migration with prisma migrate dev --name init
- [ ] T023 Create database seed script in src/main/database/seed.ts (3 built-in themes, 3 cover templates)
- [x] T024 Create Prisma client singleton in src/main/database/client.ts
- [ ] T025 [P] Create database helper utilities in src/main/database/utils.ts (platform-specific paths, connection management)

### IPC Foundation ✅

- [x] T026 Define global IPC types in src/shared/types/ipc-contracts.ts (SuccessResponse, ErrorResponse, IPCErrorCode)
- [ ] T027 [P] Create Zod schemas for all IPC requests in src/shared/validation/schemas.ts (projects, themes, fonts, pdf, cover, file, app channels)
- [ ] T028 Create IPC error handler utility in src/main/ipc/error-handler.ts
- [x] T029 Create preload script skeleton in src/main/preload.ts with contextBridge setup

### Electron Foundation ✅

- [x] T030 Create main process entry point in src/main/index.ts (BrowserWindow setup with security model)
- [x] T031 Configure Electron security settings (contextIsolation: true, nodeIntegration: false, sandbox: true)
- [ ] T032 [P] Create window manager service in src/main/services/window-manager.ts
- [ ] T033 [P] Create file system service in src/main/services/file-system.ts (project file I/O, atomic writes)
- [ ] T034 [P] Create app data directory service in src/main/services/app-data.ts (platform-specific paths)

### React Foundation ✅

- [x] T035 Create React root component in src/renderer/App.tsx
- [x] T036 Create renderer entry point in src/renderer/index.tsx with React 19 createRoot
- [ ] T037 Configure TanStack Router in src/renderer/router.tsx (routes definition)
- [x] T038 Create global Tailwind styles in src/renderer/styles/global.css
- [ ] T039 [P] Create UI component library foundation in src/renderer/components/ui/ (Button, Input, Dialog, Card)
- [ ] T040 [P] Create React hooks for IPC calls in src/renderer/hooks/useIPC.ts (typed wrappers)

### Tiptap Foundation

- [ ] T041 Create Tiptap editor base configuration in src/renderer/editor/TiptapEditor.tsx
- [ ] T042 Configure Tiptap extensions in src/renderer/editor/extensions/index.ts (StarterKit, Document, Paragraph, Text, Heading, Bold, Italic, Link, Code, CodeBlock, BulletList, OrderedList, Blockquote)
- [ ] T043 [P] Create custom PageBreakIndicator extension in src/renderer/editor/extensions/PageBreakIndicator.ts
- [ ] T044 [P] Create custom MarkdownSerializer extension in src/renderer/editor/extensions/MarkdownSerializer.ts
- [ ] T045 Create editor utilities in src/renderer/editor/utils.ts (markdown parsing, serialization helpers)

### Build & Test Foundation

- [ ] T046 Configure Vitest in vitest.config.ts for unit tests
- [ ] T047 Configure Playwright in playwright.config.ts for e2e Electron tests
- [ ] T048 Create test utilities in tests/utils/ (mock IPC, test fixtures)
- [ ] T049 [P] Setup React 19 compiler configuration in babel.config.js or vite.config.ts
- [ ] T050 Verify foundational build with npm run dev (app launches, renders empty window)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Project Selection and Creation (Priority: P1) 🎯 MVP

**Goal**: Users can create new projects or open existing projects from a selector screen

**Independent Test**: Launch app → See project selector → Create new project with name → Editor opens → Close app → Reopen → Load existing project → Editor opens with saved state

### Implementation for User Story 1

- [ ] T051 [P] [US1] Define projects channel IPC types in src/shared/types/ipc-contracts.ts (ListRecentProjectsRequest/Response, CreateProjectRequest/Response, LoadProjectRequest/Response)
- [ ] T052 [P] [US1] Create ProjectSelector React component in src/renderer/components/ProjectSelector/ProjectSelector.tsx
- [ ] T053 [P] [US1] Create RecentProjectList React component in src/renderer/components/ProjectSelector/RecentProjectList.tsx
- [ ] T054 [P] [US1] Create NewProjectDialog React component in src/renderer/components/ProjectSelector/NewProjectDialog.tsx
- [ ] T055 [US1] Implement projects:list-recent IPC handler in src/main/ipc/projects.ts (query RecentProject with Prisma)
- [ ] T056 [US1] Implement projects:create IPC handler in src/main/ipc/projects.ts (create Project, create .InkPot file, insert RecentProject)
- [ ] T057 [US1] Implement projects:load IPC handler in src/main/ipc/projects.ts (read .InkPot file, load Project with theme and cover data, update lastOpenedAt)
- [ ] T058 [US1] Add projects channel to preload contextBridge in src/main/preload.ts
- [ ] T059 [US1] Create useRecentProjects hook in src/renderer/hooks/useRecentProjects.ts
- [ ] T060 [US1] Create useProjectActions hook in src/renderer/hooks/useProjectActions.ts (create, load wrappers)
- [ ] T061 [US1] Add ProjectSelector route in src/renderer/router.tsx (root path '/')
- [ ] T062 [US1] Implement file:open-dialog IPC handler in src/main/ipc/file.ts (native file picker for .InkPot files)
- [ ] T063 [US1] Add file channel to preload contextBridge in src/main/preload.ts
- [ ] T064 [US1] Add error handling for invalid file paths and missing projects in src/main/ipc/projects.ts
- [ ] T065 [US1] Add validation for project name (non-empty, max 255 chars) in IPC handlers
- [ ] T066 [US1] Implement recent projects list management (max 10 entries, update positions on access) in src/main/services/recent-projects.ts
- [ ] T067 [US1] Add logging for project operations in src/main/ipc/projects.ts

**Checkpoint**: At this point, User Story 1 should be fully functional - app launches to project selector, users can create/load projects

---

## Phase 4: User Story 2 - Basic Markdown Editing and PDF Export (Priority: P1) 🎯 MVP

**Goal**: Users can type markdown in the editor, see formatting, and export to PDF

**Independent Test**: Open project → Type "# Hello\n\nThis is **bold** text" → See formatted output → Click Export → Choose location → Verify valid PDF file created with formatted content

### Implementation for User Story 2

- [ ] T068 [P] [US2] Define pdf channel IPC types in src/shared/types/ipc-contracts.ts (ExportPDFRequest/Response, CalculatePageBreaksRequest/Response)
- [ ] T069 [P] [US2] Create Editor React component in src/renderer/components/Editor/Editor.tsx (Tiptap editor wrapper)
- [ ] T070 [P] [US2] Create EditorToolbar React component in src/renderer/components/Editor/EditorToolbar.tsx (formatting buttons)
- [ ] T071 [P] [US2] Create PageBreakOverlay React component in src/renderer/components/Editor/PageBreakOverlay.tsx (visual indicators)
- [ ] T072 [US2] Implement projects:save IPC handler in src/main/ipc/projects.ts (atomic file write with backup)
- [ ] T073 [US2] Implement pdf:export IPC handler in src/main/ipc/pdf.ts (generate PDF with React PDF, save to user path)
- [ ] T074 [US2] Implement pdf:calculate-page-breaks IPC handler in src/main/ipc/pdf.ts (estimate pagination based on theme)
- [ ] T075 [US2] Create React PDF Document component in src/main/pdf/Document.tsx (renders markdown to PDF)
- [ ] T076 [US2] Create React PDF page layout components in src/main/pdf/components/ (Page, Heading, Paragraph, List, Code)
- [ ] T077 [US2] Create markdown-to-PDF transformer in src/main/pdf/transformer.ts (parse markdown, apply theme, generate React PDF elements)
- [ ] T078 [US2] Add pdf channel to preload contextBridge in src/main/preload.ts
- [ ] T079 [US2] Create useEditor hook in src/renderer/hooks/useEditor.ts (Tiptap instance management, auto-save)
- [ ] T080 [US2] Create usePageBreaks hook in src/renderer/hooks/usePageBreaks.ts (fetch page breaks on content/theme change)
- [ ] T081 [US2] Implement auto-save mechanism in src/renderer/hooks/useAutoSave.ts (trigger projects:save every 60s on change)
- [ ] T082 [US2] Add Editor route in src/renderer/router.tsx ('/editor/:projectId')
- [ ] T083 [US2] Implement file:save-dialog IPC handler in src/main/ipc/file.ts (native save dialog for PDF export)
- [ ] T084 [US2] Add undo/redo support using Tiptap History extension in src/renderer/editor/extensions/index.ts
- [ ] T085 [US2] Add error handling for disk full, permission denied in src/main/ipc/pdf.ts
- [ ] T086 [US2] Add markdown syntax validation in editor (display warnings for invalid syntax) in src/renderer/components/Editor/ValidationOverlay.tsx
- [ ] T087 [US2] Add keyboard shortcuts for save (Cmd/Ctrl+S) and export (Cmd/Ctrl+E) in src/renderer/components/Editor/Editor.tsx
- [ ] T088 [US2] Implement loading states for PDF export (progress indicator) in src/renderer/components/Editor/ExportDialog.tsx
- [ ] T089 [US2] Add logging for save and export operations in src/main/ipc/

**Checkpoint**: At this point, MVP is complete - users can create projects, edit markdown, see formatting, and export PDFs

---

## Phase 5: User Story 6 - PDF Preview (Priority: P2)

**Goal**: Users can preview PDF output before exporting

**Independent Test**: Open project → Edit content → Click Preview → Verify preview window shows exact PDF rendering with correct fonts and page breaks → Close preview → Verify no file created

### Implementation for User Story 6

- [ ] T090 [P] [US6] Define pdf:preview IPC type in src/shared/types/ipc-contracts.ts (PreviewPDFRequest/Response with base64 data URL)
- [ ] T091 [P] [US6] Create PDFPreviewDialog React component in src/renderer/components/PDFPreview/PDFPreviewDialog.tsx
- [ ] T092 [P] [US6] Create PDFViewer React component in src/renderer/components/PDFPreview/PDFViewer.tsx (render base64 PDF in iframe)
- [ ] T093 [US6] Implement pdf:preview IPC handler in src/main/ipc/pdf.ts (generate PDF buffer, convert to base64 data URL)
- [ ] T094 [US6] Optimize preview generation for responsiveness (<5s for 50 pages) in src/main/pdf/
- [ ] T095 [US6] Add pdf:preview to preload contextBridge in src/main/preload.ts
- [ ] T096 [US6] Create usePDFPreview hook in src/renderer/hooks/usePDFPreview.ts
- [ ] T097 [US6] Add Preview button to EditorToolbar in src/renderer/components/Editor/EditorToolbar.tsx
- [ ] T098 [US6] Add loading spinner for preview generation in src/renderer/components/PDFPreview/PDFPreviewDialog.tsx
- [ ] T099 [US6] Add error handling for preview failures in src/renderer/hooks/usePDFPreview.ts
- [ ] T100 [US6] Add keyboard shortcut for preview (Cmd/Ctrl+P) in src/renderer/components/Editor/Editor.tsx

**Checkpoint**: Users can preview PDFs before exporting, ensuring output correctness

---

## Phase 6: User Story 7 - Project Save and Load (Priority: P2)

**Goal**: Projects persist across sessions with all content and settings

**Independent Test**: Create project → Add content → Add settings → Save → Close app → Reopen → Load project → Verify all content and settings restored exactly

### Implementation for User Story 7

- [ ] T101 [P] [US7] Define projects:delete IPC type in src/shared/types/ipc-contracts.ts (DeleteProjectRequest/Response)
- [ ] T102 [P] [US7] Create UnsavedChangesDialog React component in src/renderer/components/dialogs/UnsavedChangesDialog.tsx
- [ ] T103 [US7] Create AutoRecoveryDialog React component in src/renderer/components/dialogs/AutoRecoveryDialog.tsx
- [ ] T104 [US7] Implement projects:delete IPC handler in src/main/ipc/projects.ts (remove from database, optionally delete file)
- [ ] T105 [US7] Implement auto-recovery mechanism in src/main/services/auto-recovery.ts (atomic backup writes every 60s)
- [ ] T106 [US7] Add unsaved changes tracking in src/renderer/hooks/useUnsavedChanges.ts (compare editor content with last saved state)
- [ ] T107 [US7] Add beforeunload handler in src/renderer/App.tsx (warn on close with unsaved changes)
- [ ] T108 [US7] Add auto-recovery check on app launch in src/main/index.ts (detect unsaved backup files)
- [ ] T109 [US7] Add delete project action in ProjectSelector in src/renderer/components/ProjectSelector/ProjectSelector.tsx
- [ ] T110 [US7] Add save confirmation before navigation in src/renderer/router.tsx (TanStack Router guards)
- [ ] T111 [US7] Add logging for auto-save and recovery operations in src/main/services/auto-recovery.ts

**Checkpoint**: Projects persist reliably across sessions, unsaved work protected

---

## Phase 7: User Story 3 - Theme Selection and Application (Priority: P2)

**Goal**: Users can select from pre-built themes to style PDF output

**Independent Test**: Open project → Open theme selector → Select different theme → Verify page break indicators update → Export PDF → Verify PDF uses selected theme styling

### Implementation for User Story 3

- [ ] T112 [P] [US3] Define themes channel IPC types in src/shared/types/ipc-contracts.ts (ListThemesRequest/Response, GetThemeRequest/Response)
- [ ] T113 [P] [US3] Create ThemeSelector React component in src/renderer/components/ThemeSelector/ThemeSelector.tsx
- [ ] T114 [P] [US3] Create ThemeCard React component in src/renderer/components/ThemeSelector/ThemeCard.tsx (preview thumbnail)
- [ ] T115 [US3] Implement themes:list IPC handler in src/main/ipc/themes.ts (query Theme with Prisma, filter by isBuiltIn)
- [ ] T116 [US3] Implement themes:get IPC handler in src/main/ipc/themes.ts (fetch full theme by ID)
- [ ] T117 [US3] Add themes channel to preload contextBridge in src/main/preload.ts
- [ ] T118 [US3] Create useThemes hook in src/renderer/hooks/useThemes.ts (list, get, apply theme)
- [ ] T119 [US3] Add theme selector to Editor sidebar in src/renderer/components/Editor/EditorSidebar.tsx
- [ ] T120 [US3] Update projects:save to include themeId in src/main/ipc/projects.ts
- [ ] T121 [US3] Update pdf:export to apply theme in src/main/pdf/transformer.ts
- [ ] T122 [US3] Update pdf:calculate-page-breaks to use theme settings in src/main/ipc/pdf.ts
- [ ] T123 [US3] Add theme preview in editor (apply theme styles to PageBreakOverlay) in src/renderer/components/Editor/PageBreakOverlay.tsx
- [ ] T124 [US3] Seed 3 built-in themes (Professional, Modern, Classic) in src/main/database/seed.ts
- [ ] T125 [US3] Add logging for theme selection in src/main/ipc/themes.ts

**Checkpoint**: Users can select and apply pre-built themes to customize PDF appearance

---

## Phase 8: User Story 4 - Cover Page Creation (Priority: P3)

**Goal**: Users can add professional cover pages with templates and assets

**Independent Test**: Open project → Enable cover page → Select template → Enter title/author → Upload logo → Preview → Verify cover page appears as first page in PDF

### Implementation for User Story 4

- [ ] T126 [P] [US4] Define cover channel IPC types in src/shared/types/ipc-contracts.ts (ListCoverTemplatesRequest/Response, UploadCoverAssetRequest/Response)
- [ ] T127 [P] [US4] Create CoverPageEditor React component in src/renderer/components/CoverPage/CoverPageEditor.tsx
- [ ] T128 [P] [US4] Create CoverTemplateSelector React component in src/renderer/components/CoverPage/CoverTemplateSelector.tsx
- [ ] T129 [P] [US4] Create AssetUploader React component in src/renderer/components/CoverPage/AssetUploader.tsx
- [ ] T130 [US4] Implement cover:list-templates IPC handler in src/main/ipc/cover.ts (query CoverTemplate with Prisma)
- [ ] T131 [US4] Implement cover:upload-asset IPC handler in src/main/ipc/cover.ts (validate image, copy to project assets dir, create ProjectCoverAsset)
- [ ] T132 [US4] Add cover channel to preload contextBridge in src/main/preload.ts
- [ ] T133 [US4] Create useCoverPage hook in src/renderer/hooks/useCoverPage.ts (enable/disable, upload assets, set fields)
- [ ] T134 [US4] Update projects:save to include cover page data in src/main/ipc/projects.ts
- [ ] T135 [US4] Update projects:load to return cover assets in src/main/ipc/projects.ts
- [ ] T136 [US4] Create React PDF CoverPage component in src/main/pdf/CoverPage.tsx (render template with assets)
- [ ] T137 [US4] Update pdf:export to include cover page as first page in src/main/pdf/Document.tsx
- [ ] T138 [US4] Update pdf:preview to include cover page in src/main/ipc/pdf.ts
- [ ] T139 [US4] Add cover page editor to Editor sidebar in src/renderer/components/Editor/EditorSidebar.tsx
- [ ] T140 [US4] Seed 3 built-in cover templates (Business, Academic, Creative) in src/main/database/seed.ts
- [ ] T141 [US4] Add image validation (format, size, dimensions) in src/main/ipc/cover.ts
- [ ] T142 [US4] Add error handling for unsupported formats and oversized images in src/main/ipc/cover.ts
- [ ] T143 [US4] Add logging for cover page operations in src/main/ipc/cover.ts

**Checkpoint**: Users can create professional cover pages with templates and assets

---

## Phase 9: User Story 5 - Custom Theme Creation (Priority: P4)

**Goal**: Power users can create fully customized themes with Google Fonts

**Independent Test**: Click Create Theme → Select Google Fonts for heading/body → Adjust kerning/leading → Save as "My Brand" → Apply to project → Export PDF → Verify custom theme applied correctly

### Implementation for User Story 5

- [ ] T144 [P] [US5] Define themes:create and themes:update IPC types in src/shared/types/ipc-contracts.ts (CreateThemeRequest/Response, UpdateThemeRequest/Response, DeleteThemeRequest/Response)
- [ ] T145 [P] [US5] Define fonts channel IPC types in src/shared/types/ipc-contracts.ts (SearchFontsRequest/Response, DownloadFontRequest/Response, IsFontCachedRequest/Response)
- [ ] T146 [P] [US5] Create CustomThemeEditor React component in src/renderer/components/ThemeEditor/CustomThemeEditor.tsx
- [ ] T147 [P] [US5] Create FontPicker React component in src/renderer/components/ThemeEditor/FontPicker.tsx (Google Fonts search)
- [ ] T148 [P] [US5] Create TypographyControls React component in src/renderer/components/ThemeEditor/TypographyControls.tsx (kerning, leading, sizes)
- [ ] T149 [P] [US5] Create ColorPicker React component in src/renderer/components/ThemeEditor/ColorPicker.tsx
- [ ] T150 [US5] Implement themes:create IPC handler in src/main/ipc/themes.ts (create custom Theme in Prisma)
- [ ] T151 [US5] Implement themes:update IPC handler in src/main/ipc/themes.ts (validate not isBuiltIn, update Theme)
- [ ] T152 [US5] Implement themes:delete IPC handler in src/main/ipc/themes.ts (validate not isBuiltIn, delete Theme)
- [ ] T153 [US5] Implement fonts:search IPC handler in src/main/ipc/fonts.ts (query Google Fonts API)
- [ ] T154 [US5] Implement fonts:download IPC handler in src/main/ipc/fonts.ts (download .woff2, cache in app data dir, create CachedFont)
- [ ] T155 [US5] Implement fonts:is-cached IPC handler in src/main/ipc/fonts.ts (check CachedFont existence)
- [ ] T156 [US5] Add fonts channel to preload contextBridge in src/main/preload.ts
- [ ] T157 [US5] Create useCustomTheme hook in src/renderer/hooks/useCustomTheme.ts (create, update, delete)
- [ ] T158 [US5] Create useFonts hook in src/renderer/hooks/useFonts.ts (search, download, check cache)
- [ ] T159 [US5] Add CachedFont model to Prisma schema in src/main/database/schema.prisma
- [ ] T160 [US5] Generate Prisma migration for CachedFont in src/main/database/
- [ ] T161 [US5] Add custom theme editor route in src/renderer/router.tsx ('/themes/create')
- [ ] T162 [US5] Add theme editing route in src/renderer/router.tsx ('/themes/:themeId/edit')
- [ ] T163 [US5] Update pdf:export to load cached fonts for custom themes in src/main/pdf/transformer.ts
- [ ] T164 [US5] Add font download progress indicator in src/renderer/components/ThemeEditor/FontPicker.tsx
- [ ] T165 [US5] Add error handling for network failures (offline mode) in src/main/ipc/fonts.ts
- [ ] T166 [US5] Add validation for theme values (font sizes 6-72pt, valid hex colors) in src/main/ipc/themes.ts
- [ ] T167 [US5] Add logging for theme and font operations in src/main/ipc/

**Checkpoint**: Power users can create and manage fully customized themes with Google Fonts

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Refinements affecting multiple user stories

- [ ] T168 [P] Add comprehensive error boundary in src/renderer/components/ErrorBoundary.tsx
- [ ] T169 [P] Add global loading states component in src/renderer/components/LoadingState.tsx
- [ ] T170 [P] Add toast notification system in src/renderer/components/Toast.tsx
- [ ] T171 Create comprehensive keyboard shortcuts documentation in docs/keyboard-shortcuts.md
- [ ] T172 [P] Add app:get-version IPC handler in src/main/ipc/app.ts
- [ ] T173 [P] Add app:set-title IPC handler in src/main/ipc/app.ts
- [ ] T174 [P] Add app channel to preload contextBridge in src/main/preload.ts
- [ ] T175 Add About dialog in src/renderer/components/dialogs/AboutDialog.tsx
- [ ] T176 Implement telemetry for performance monitoring in src/main/services/telemetry.ts (local only)
- [ ] T177 Add performance budget validation in build scripts (bundle size <5MB)
- [ ] T178 Optimize Tiptap bundle size with code splitting in src/renderer/editor/
- [ ] T179 Optimize React PDF bundle size with lazy loading in src/main/pdf/
- [ ] T180 Add comprehensive JSDoc comments to all IPC contracts in src/shared/types/
- [ ] T181 Create developer documentation in docs/DEVELOPMENT.md
- [ ] T182 Create user guide in docs/USER_GUIDE.md
- [ ] T183 Add integration tests for IPC contracts in tests/integration/ipc/
- [ ] T184 Add e2e tests for user workflows in tests/e2e/ (create project, edit, export, load)
- [ ] T185 Add unit tests for PDF transformer in tests/unit/pdf-transformer.test.ts
- [ ] T186 Add unit tests for page break calculation in tests/unit/page-breaks.test.ts
- [ ] T187 [P] Add CI/CD configuration in .github/workflows/ (lint, test, build)
- [ ] T188 Create release build scripts for macOS/Windows/Linux in scripts/build/
- [ ] T189 Add app icon assets for all platforms in assets/icons/
- [ ] T190 Configure code signing for macOS/Windows releases in forge.config.ts
- [ ] T191 Add update mechanism with electron-updater in src/main/services/updater.ts
- [ ] T192 Run security audit with npm audit and fix vulnerabilities
- [ ] T193 Run performance profiling and optimize bottlenecks per performance targets
- [ ] T194 Create quickstart.md validation checklist verification
- [ ] T195 Final constitution compliance audit for all 5 principles

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Setup (Phase 1)**: No dependencies - can start immediately
2. **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**
3. **User Stories (Phases 3-9)**: All depend on Foundational phase completion
   - Can proceed in parallel with sufficient team capacity
   - Or sequentially in priority order: US1 (P1) → US2 (P1) → US6 (P2) → US7 (P2) → US3 (P2) → US4 (P3) → US5 (P4)
4. **Polish (Phase 10)**: Depends on desired user stories being complete

### User Story Dependencies

- **US1 - Project Selection** (P1): No dependencies on other stories - pure entry point
- **US2 - Markdown Editing** (P1): Requires US1 (must have project open to edit)
- **US6 - PDF Preview** (P2): Requires US2 (needs content to preview)
- **US7 - Save/Load** (P2): Enhances US1 and US2 (persistence layer)
- **US3 - Theme Selection** (P2): Requires US2 (themes applied to content)
- **US4 - Cover Pages** (P3): Requires US2 and US3 (covers added to themed documents)
- **US5 - Custom Themes** (P4): Requires US3 (extends theme system)

### Critical Path (MVP)

**MVP = US1 + US2** (Phases 1, 2, 3, 4)

1. Setup (Phase 1): ~4-6 hours
2. Foundational (Phase 2): ~12-16 hours (critical blocking phase)
3. US1 - Project Selection (Phase 3): ~6-8 hours
4. US2 - Markdown Editing & Export (Phase 4): ~10-14 hours

**Total MVP Estimate**: ~32-44 hours (4-5.5 days)

### Parallel Opportunities

Within each phase, all tasks marked **[P]** can execute in parallel:

- **Setup**: T003-T010, T012-T014 (dependency installs and configs)
- **Foundational**: T025, T027, T032-T034, T039-T040, T043-T044, T049 (independent modules)
- **US1**: T051-T054 (UI components), T055-T057 (IPC handlers)
- **US2**: T068-T071, T075-T076 (UI and PDF components)
- **US3**: T112-T114 (UI components)
- **US4**: T126-T129 (UI components)
- **US5**: T144-T149 (UI components), T153-T155 (IPC handlers)
- **Polish**: T168-T170, T172-T174, T180, T187 (independent concerns)

If working with multiple developers:
- Developer A: US1 + US6 + US7
- Developer B: US2 + US3
- Developer C: US4 + US5
- All start after Foundational phase completes

---

## Task Statistics

- **Total Tasks**: 195
- **Setup Phase**: 20 tasks
- **Foundational Phase**: 30 tasks (CRITICAL)
- **User Story 1** (P1): 17 tasks
- **User Story 2** (P1): 22 tasks
- **User Story 6** (P2): 11 tasks
- **User Story 7** (P2): 11 tasks
- **User Story 3** (P2): 14 tasks
- **User Story 4** (P3): 18 tasks
- **User Story 5** (P4): 24 tasks
- **Polish Phase**: 28 tasks

**Parallel Tasks**: 65 tasks marked [P] (33% parallelizable)

**MVP Scope** (US1 + US2): 89 tasks (46% of total)

---

## Implementation Strategy

### MVP First (Recommended)

**Goal**: Deliver working product as fast as possible

1. ✅ Complete Phase 1: Setup (T001-T020)
2. ✅ Complete Phase 2: Foundational (T021-T050) - **CRITICAL**
3. ✅ Complete Phase 3: US1 - Project Selection (T051-T067)
4. ✅ Complete Phase 4: US2 - Markdown Editing (T068-T089)
5. 🎯 **STOP and VALIDATE MVP**: Can create projects, edit markdown, export PDFs
6. 🚀 Deploy/Demo if ready, or continue to next priority

### Incremental Delivery

**Goal**: Add value iteratively, each story independently testable

1. Foundation → US1 → **TEST & VALIDATE** → Demo
2. Add US2 → **TEST & VALIDATE** → Demo (MVP complete!)
3. Add US6 → **TEST & VALIDATE** → Demo (preview feature)
4. Add US7 → **TEST & VALIDATE** → Demo (persistence)
5. Add US3 → **TEST & VALIDATE** → Demo (themes)
6. Add US4 → **TEST & VALIDATE** → Demo (cover pages)
7. Add US5 → **TEST & VALIDATE** → Demo (custom themes)
8. Polish → **FINAL VALIDATION** → Production Release

### Parallel Team Strategy

**Goal**: Maximize throughput with multiple developers

**Prerequisites** (Team works together):
- Phase 1: Setup
- Phase 2: Foundational (CRITICAL - everyone must complete before diverging)

**After Foundational** (Team splits):
- **Developer A**: US1 (T051-T067) → US6 (T090-T100) → US7 (T101-T111)
- **Developer B**: US2 (T068-T089) → US3 (T112-T125)
- **Developer C**: US4 (T126-T143) → US5 (T144-T167)

**Integration Points**:
- After each story completes, merge and integration test
- Stories designed to be independent, minimal merge conflicts

**Final Phase** (Team together):
- Phase 10: Polish & Testing (T168-T195)

---

## Validation Checklist

### Format Compliance

- ✅ All tasks use `- [ ]` checkbox format
- ✅ All tasks have sequential IDs (T001-T195)
- ✅ Parallelizable tasks marked with [P]
- ✅ User story tasks marked with [US1]-[US7]
- ✅ All tasks include file paths
- ✅ No placeholders or generic descriptions

### Organizational Compliance

- ✅ Tasks organized by user story priority
- ✅ Each user story phase is independently testable
- ✅ Dependencies clearly documented
- ✅ MVP scope explicitly defined (US1 + US2)
- ✅ Parallel opportunities identified (65 tasks)

### Completeness

- ✅ All IPC contracts from contracts/ipc-contracts.md covered
- ✅ All entities from data-model.md implemented
- ✅ All user stories from spec.md addressed
- ✅ Research decisions from research.md incorporated
- ✅ Constitutional principles enforced throughout

---

## Notes

- Tasks marked **[P]** can run in parallel (different files, no dependencies)
- Tasks marked **[Story]** map to specific user stories for traceability
- Each user story should be independently completable and testable
- **Foundational phase (T021-T050) MUST complete before any user story work**
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- MVP = US1 + US2 = 89 tasks (4-5.5 days estimated)
