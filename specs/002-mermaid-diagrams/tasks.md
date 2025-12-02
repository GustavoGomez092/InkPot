# Tasks: Mermaid.js Diagram Support

**Input**: Design documents from `/specs/002-mermaid-diagrams/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/api-contracts.md ✅, quickstart.md ✅

**Tests**: Test tasks are NOT included as they were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Electron main process**: `src/main/` (Node.js/Electron APIs, IPC handlers)
- **Electron renderer process**: `src/renderer/` (React components, Tiptap editor)
- **Shared types**: `src/shared/types/` (IPC contracts, common interfaces)
- **Preload script**: `src/main/preload.ts` (contextBridge definitions)
- **Tests**: `tests/unit/`, `tests/integration/`, `tests/e2e/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and create shared type definitions used across all user stories

**Duration Estimate**: 30 minutes

- [x] T001 Install Mermaid.js library: `npm install mermaid@latest`
- [x] T002 Install Mermaid TypeScript definitions: `npm install --save-dev @types/mermaid`
- [x] T003 [P] Create shared type definitions in `src/shared/types/mermaid.ts` with MermaidDiagramAttributes, MermaidValidationResult, MermaidModalProps, MermaidModalState, and PdfMermaidElement interfaces

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core Mermaid rendering and validation infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

**Duration Estimate**: 2 hours

- [x] T004 Create useMermaid hook in `src/renderer/hooks/useMermaid.ts` with lazy loading, renderDiagram, and validateMermaid functions
- [x] T005 Implement Mermaid library initialization with theme configuration (neutral theme, strict security, Inter font family)
- [x] T006 Add error handling and loading states to useMermaid hook
- [x] T007 [P] Create Tiptap extension file in `src/renderer/editor/mermaid-extension.ts` with node schema definition
- [x] T008 Configure MermaidDiagram node with atom: true, draggable: true, and block group
- [x] T009 Define node attributes (code, id, caption, createdAt, updatedAt) with parseHTML and renderHTML methods
- [x] T010 Add insertMermaidDiagram command to extension accepting code and optional caption
- [x] T011 Add updateMermaidDiagram command to extension accepting id and code
- [x] T012 Add deleteMermaidDiagram command to extension accepting id
- [x] T013 Implement auto-generated unique ID creation (format: mermaid-timestamp-random)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Insert New Diagram (Priority: P1) 🎯 MVP

**Goal**: Users can insert a Mermaid.js diagram into their document by clicking a toolbar button, entering diagram code in a modal editor, and seeing the rendered diagram appear in the document.

**Independent Test**: Click the "Insert Diagram" toolbar button, enter valid Mermaid syntax (e.g., "graph TD; A-->B"), click accept, and verify a diagram placeholder appears in the editor at the cursor position.

**Duration Estimate**: 6-8 hours

### Implementation for User Story 1

- [x] T014 [P] [US1] Create MermaidModal component file in `src/renderer/components/editor/MermaidModal.tsx`
- [x] T015 [P] [US1] Implement modal UI with Radix UI Dialog component (title, overlay, content)
- [x] T016 [US1] Add textarea for Mermaid code input with monospace font styling
- [x] T017 [US1] Add Input field for optional diagram caption
- [x] T018 [US1] Implement two-column layout: left for code editor, right for live preview
- [x] T019 [US1] Add Accept and Cancel buttons with proper disabled states
- [x] T020 [US1] Integrate useMermaid hook for real-time validation (500ms debounce)
- [x] T021 [US1] Display validation errors in preview area with syntax error messages
- [x] T022 [US1] Render live preview of valid Mermaid code in preview pane
- [x] T023 [US1] Implement onSave callback that passes code and caption to parent
- [x] T024 [US1] Implement onClose callback that resets modal state
- [x] T025 [P] [US1] Create MermaidNodeView component in `src/renderer/editor/MermaidNodeView.tsx`
- [x] T026 [US1] Render diagram using useMermaid hook in NodeViewWrapper
- [x] T027 [US1] Display loading state while diagram is rendering
- [x] T028 [US1] Display error state with error message if rendering fails
- [x] T029 [US1] Add caption display below diagram if caption exists
- [x] T030 [US1] Style diagram container with rounded border and hover effects
- [x] T031 [US1] Apply selected state styling (ProseMirror-selectednode class)
- [x] T032 [US1] Register MermaidNodeView with ReactNodeViewRenderer in extension addNodeView method
- [x] T033 [US1] Register MermaidDiagram extension in TiptapEditor configuration (`src/renderer/components/editor/TiptapEditor.tsx`)
- [x] T034 [US1] Create toolbar button component for "Insert Diagram" in TiptapEditor
- [x] T035 [US1] Add DiagramIcon SVG component in `src/renderer/components/icons/DiagramIcon.tsx`
- [x] T036 [US1] Implement modal state management (open/close) in TiptapEditor
- [x] T037 [US1] Connect toolbar button onClick to open modal with empty initial code
- [x] T038 [US1] Implement onSave handler that calls editor.commands.insertMermaidDiagram
- [x] T039 [US1] Add keyboard shortcut Mod-Shift-d in extension addKeyboardShortcuts method
- [x] T040 [US1] Add CSS styles for mermaid-node-view and mermaid-container in `src/renderer/styles/global.css`
- [ ] T041 [US1] Verify diagram persists in document JSON structure on save

**Checkpoint**: At this point, User Story 1 should be fully functional - users can insert diagrams via toolbar button and see them rendered in the editor

---

## Phase 4: User Story 2 - Edit Existing Diagram (Priority: P2)

**Goal**: Users can edit an existing diagram by clicking on the diagram placeholder in the document, which reopens the modal editor with the current diagram code pre-loaded for modification.

**Independent Test**: Insert a diagram using US1, then click on the diagram placeholder to verify the modal reopens with the existing code, make changes to the code, click accept, and confirm the diagram updates in the editor.

**Duration Estimate**: 2-3 hours

### Implementation for User Story 2

- [x] T042 [US2] Add click handler to MermaidNodeView component that triggers modal open
- [x] T043 [US2] Add keyboard handler (Enter/Space) for accessibility in MermaidNodeView
- [x] T044 [US2] Pass diagram ID and current code to modal when opening for edit
- [x] T045 [US2] Update MermaidModal to accept initialCode prop and pre-populate textarea
- [x] T046 [US2] Update MermaidModal to accept diagramId prop for edit mode detection
- [x] T047 [US2] Change modal title to "Edit Diagram" when diagramId is present
- [x] T048 [US2] Change button text to "Update" instead of "Insert" in edit mode
- [x] T049 [US2] Implement onSave handler in TiptapEditor that calls updateMermaidDiagram command when editing
- [x] T050 [US2] Update node attributes (code, caption, updatedAt) in updateMermaidDiagram command
- [x] T051 [US2] Trigger NodeView re-render when diagram code is updated
- [x] T052 [US2] Add cursor pointer and hover styles to diagram container
- [ ] T053 [US2] Verify undo/redo works for diagram edits (Tiptap handles automatically)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can insert and edit diagrams

---

## Phase 5: User Story 3 - PDF Export with Rendered Diagrams (Priority: P3)

**Goal**: Users can export their document to PDF and see all Mermaid diagrams rendered as images in the final PDF output.

**Independent Test**: Create a document with multiple diagrams using US1/US2, trigger PDF export, open the generated PDF, and verify all diagrams appear as rendered images with correct positioning and captions.

**Duration Estimate**: 3-4 hours

### Implementation for User Story 3

- [x] T054 [P] [US3] Update markdown serializer in `src/renderer/editor/markdown-serializer.ts` to serialize mermaidDiagram nodes
- [x] T055 [US3] Write Mermaid nodes as fenced code blocks with ```mermaid syntax
- [x] T056 [US3] Include caption as italic text below code block if present
- [x] T057 [P] [US3] Update markdown parser in `src/main/pdf/markdown-parser.ts` to detect mermaid fenced blocks
- [x] T058 [US3] Parse fence tokens with info === 'mermaid' into PdfMermaidElement objects
- [x] T059 [US3] Extract caption from following paragraph token if italic format
- [x] T060 [P] [US3] Create MermaidDiagram PDF component in `src/main/pdf/components/MermaidDiagram.tsx`
- [x] T061 [US3] Import and initialize Mermaid.js in main process (dynamic import)
- [x] T062 [US3] Implement diagram rendering to SVG string using mermaid.render()
- [x] T063 [US3] Convert SVG to base64-encoded data URL for @react-pdf/renderer Image component
- [x] T064 [US3] Add error handling that renders error placeholder View for failed diagrams
- [x] T065 [US3] Display error message in red background with monospace font
- [x] T066 [US3] Render caption below diagram using Text component with italic style
- [x] T067 [US3] Apply maxWidth prop (default 500) for diagram scaling
- [x] T068 [US3] Add marginVertical spacing for proper PDF layout
- [x] T069 [US3] Register MermaidDiagram component in PDF Document renderer (`src/main/pdf/Document.tsx`)
- [x] T070 [US3] Add conditional rendering for element.type === 'mermaid'
- [x] T071 [US3] Test PDF generation with valid diagrams renders correctly - Created test-mermaid-diagrams.md with 5 different diagram types (flowchart, sequence, class, pie, git graph)
- [ ] T072 [US3] Test PDF generation with invalid diagrams shows error placeholders
- [ ] T073 [US3] Test PDF generation with 20 diagrams completes in under 30 seconds

**Checkpoint**: All user stories should now be independently functional - complete diagram workflow from insertion to PDF export

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements, documentation, and quality assurance

**Duration Estimate**: 2-3 hours

- [ ] T074 [P] Add JSDoc comments to all public APIs (extension commands, hook interface, component props)
- [ ] T075 [P] Create user documentation in `docs/features/mermaid-diagrams.md` with usage examples
- [ ] T076 [P] Add error boundary around MermaidNodeView component for graceful error handling
- [ ] T077 [P] Optimize Mermaid bundle with dynamic import and code splitting
- [ ] T078 Verify performance: modal opens in <200ms
- [ ] T079 Verify performance: diagram insertion completes in <5s (SC-001)
- [ ] T080 Verify performance: diagram edit modal reopens in <2s (SC-002)
- [ ] T081 Verify performance: 20 diagrams in document without degradation (SC-008)
- [ ] T082 Test all edge cases: extremely large code, invalid syntax on load, modal open during PDF export
- [ ] T083 Test keyboard navigation and accessibility (tab order, escape key, screen readers)
- [ ] T084 [P] Update RELEASE_NOTES.md with feature announcement and user-facing changes
- [ ] T085 Create demo video showing insert → edit → PDF export workflow

**Checkpoint**: Feature complete and ready for release

---

## Dependencies

### User Story Completion Order

```
Phase 1 (Setup) + Phase 2 (Foundational)
    ↓
Phase 3 (US1: Insert) ← MVP milestone
    ↓
Phase 4 (US2: Edit) ← Can be implemented independently after US1
    ↓
Phase 5 (US3: PDF Export) ← Depends on US1 (needs diagrams to export)
    ↓
Phase 6 (Polish)
```

**Critical Path**: Setup → Foundational → US1 → US3 → Polish

**Parallel Opportunities**:
- After US1 is complete, US2 (Edit) can be implemented in parallel with US3 (PDF Export)
- Phase 1 tasks T001-T003 can all run in parallel
- US1 tasks T014-T015, T025, T035 can run in parallel (different files)
- US3 tasks T054-T055, T057-T058, T060-T061 can run in parallel (different processes)

### Task Dependencies

**Foundational (must complete first)**:
- T004-T013: Core hook and extension infrastructure
- All user story tasks depend on Phase 2 completion

**User Story 1 (Insert)**:
- T014-T024: Modal component (depends on T004-T006 for useMermaid hook and types)
- T025-T032: NodeView component (depends on T007-T013 for extension)
- T033-T041: Editor integration (depends on T014-T032)

**User Story 2 (Edit)**:
- T042-T053: All depend on US1 completion (need working insert and NodeView)

**User Story 3 (PDF Export)**:
- T054-T056: Markdown serialization (depends on T007-T013 for node schema)
- T057-T059: Markdown parsing (independent, can run parallel with T054-T056)
- T060-T068: PDF component (depends on T004-T006 for types, T054-T059 for parser)
- T069-T073: Integration (depends on T060-T068)

---

## Parallel Execution Examples

### Within User Story 1 (Maximum Parallelization)

**Wave 1** (after Phase 2 complete):
```
T014-T015 (Modal UI structure)  ║  T025 (NodeView file)  ║  T035 (Icon component)
```

**Wave 2**:
```
T016-T024 (Complete modal logic)  ║  T026-T032 (Complete NodeView)
```

**Wave 3**:
```
T033-T041 (Editor integration - sequential)
```

### Between User Stories (After US1 Complete)

**Parallel Track A - US2 (Edit)**:
```
T042 → T043 → T044 → ... → T053
```

**Parallel Track B - US3 (PDF Export)**:
```
T054 → T055 → T056 (Serializer)
T057 → T058 → T059 (Parser)
T060 → T061 → ... → T073 (PDF Component)
```

### Within Phase 6 (Polish)

**All parallel**:
```
T074 (JSDoc)  ║  T075 (Docs)  ║  T076 (Error boundary)  ║  T077 (Optimize)  ║  T084 (Release notes)
```

**Then sequential verification**:
```
T078 → T079 → T080 → T081 → T082 → T083 → T085
```

---

## Implementation Strategy

### MVP Scope (Recommended First Release)

**Include**: User Story 1 only (Insert diagrams)
- Phases 1, 2, 3 (T001-T041)
- Subset of Phase 6 for basic polish (T074-T077, T084)

**Rationale**: 
- Delivers core value (diagram creation)
- Reduces scope by 60%
- Allows early user feedback
- Edit and PDF can be added incrementally

**Estimated Effort**: 10-12 hours

### Full Feature Scope

**Include**: All user stories (Insert + Edit + PDF Export)
- All phases (T001-T085)

**Estimated Effort**: 16-24 hours

### Incremental Delivery Plan

1. **Sprint 1** (MVP): US1 - Insert diagrams
   - Tasks: T001-T041, T074-T077, T084
   - Deliverable: Users can insert and view diagrams
   
2. **Sprint 2**: US2 - Edit diagrams
   - Tasks: T042-T053
   - Deliverable: Users can edit existing diagrams
   
3. **Sprint 3**: US3 - PDF Export
   - Tasks: T054-T073
   - Deliverable: Complete workflow with PDF output
   
4. **Sprint 4**: Polish & QA
   - Tasks: T078-T083, T085
   - Deliverable: Production-ready feature

---

## Task Summary

**Total Tasks**: 85
- **Phase 1 (Setup)**: 3 tasks
- **Phase 2 (Foundational)**: 10 tasks
- **Phase 3 (US1 - Insert)**: 28 tasks
- **Phase 4 (US2 - Edit)**: 12 tasks
- **Phase 5 (US3 - PDF Export)**: 20 tasks
- **Phase 6 (Polish)**: 12 tasks

**Task Distribution by User Story**:
- **US1 (Insert)**: 28 tasks (33%)
- **US2 (Edit)**: 12 tasks (14%)
- **US3 (PDF Export)**: 20 tasks (24%)
- **Infrastructure**: 13 tasks (15%)
- **Polish**: 12 tasks (14%)

**Parallel Opportunities**: 18 tasks marked [P] can run in parallel (21%)

**Independent Test Criteria**:
- **US1**: Can insert diagram via toolbar and see rendered placeholder
- **US2**: Can click diagram to edit and see updates
- **US3**: Can export PDF with rendered diagrams

**Suggested MVP**: User Story 1 only (41 tasks, 10-12 hours)

---

## Format Validation

✅ All tasks follow checklist format: `- [ ] [ID] [P?] [Story?] Description with file path`
✅ All task IDs are sequential (T001-T085)
✅ All user story tasks include [US#] label
✅ Setup and foundational tasks have NO story label
✅ All tasks include specific file paths or clear actions
✅ Parallel tasks marked with [P] flag
✅ Dependencies clearly documented
✅ Independent test criteria provided for each story

---

## Next Steps

1. Review task breakdown with team
2. Confirm MVP scope (US1 only vs. full feature)
3. Assign tasks to implementation sprints
4. Begin Phase 1 (Setup) - install dependencies
5. Complete Phase 2 (Foundational) - core infrastructure
6. Implement User Story 1 for MVP
7. Iterate with user feedback before implementing US2/US3

**Ready for Implementation**: ✅ All tasks are specific, actionable, and immediately executable
