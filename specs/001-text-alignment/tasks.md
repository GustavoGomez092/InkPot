# Tasks: Text Alignment

**Feature**: Text Alignment for Tiptap Editor  
**Branch**: `001-text-alignment`  
**Input**: Design documents from `/specs/001-text-alignment/`  
**Prerequisites**: ✅ plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

---

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Implementation Strategy

### MVP Scope (Recommended)
**User Story 1 Only** - Delivers core alignment functionality:
- Toolbar alignment buttons (Left, Center, Right)
- Keyboard shortcuts (Cmd/Ctrl+L/E/R)
- Editor preview with alignment
- PDF export with alignment
- Estimated: 6-8 hours

### Incremental Delivery Path
1. **Phase 3 (US1)**: Core alignment → **Shippable MVP**
2. **Phase 4 (US2)**: Persistence + Undo/Redo → **Production-ready**
3. **Phase 5 (US3)**: Multi-block alignment → **Enhanced UX**

Each phase delivers independently testable value.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and verify build pipeline

- [ ] T001 Install @tiptap/extension-text-align package via npm
- [ ] T002 Verify TypeScript compilation passes with new dependency
- [ ] T003 [P] Run existing test suite to establish baseline

**Estimated Time**: 15 minutes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Type definitions and shared infrastructure required by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Define TextAlignment type in src/shared/types/ipc-contracts.ts
- [ ] T005 [P] Extend MarkdownElement interface with textAlign property in src/shared/types/ipc-contracts.ts
- [ ] T006 [P] Import alignment icons (AlignLeft, AlignCenter, AlignRight) from lucide-react in src/renderer/components/editor/TiptapEditor.tsx

**Estimated Time**: 30 minutes

**Checkpoint**: ✅ Type definitions ready - user story implementation can begin

---

## Phase 3: User Story 1 - Apply alignment to selected text or paragraph (Priority: P1) 🎯 MVP

**Goal**: Users can apply Left/Center/Right alignment via toolbar or keyboard shortcuts; alignment renders in editor and exports to PDF

**Independent Test**:
1. Open editor with sample text
2. Click paragraph, press Cmd+E (center alignment)
3. Verify text centers in editor preview
4. Export to PDF
5. Open PDF and verify text is centered

**Success Criteria**: Alignment applies to current paragraph/selection, renders in editor, exports correctly to PDF

### Implementation for User Story 1

#### Editor Integration

- [ ] T007 [P] [US1] Import TextAlign extension in src/renderer/components/editor/TiptapEditor.tsx
- [ ] T008 [US1] Configure TextAlign extension with types=['heading','paragraph'], alignments=['left','center','right'], defaultAlignment='left' in useEditor extensions array in src/renderer/components/editor/TiptapEditor.tsx
- [ ] T009 [US1] Add custom keyboard shortcuts extension (Cmd/Ctrl+L/E/R) to override default shortcuts in src/renderer/components/editor/TiptapEditor.tsx

#### Toolbar UI

- [ ] T010 [P] [US1] Create alignment button group in toolbar (Left/Center/Right buttons) in src/renderer/components/editor/TiptapEditor.tsx
- [ ] T011 [US1] Implement button onClick handlers using editor.chain().focus().setTextAlign() commands in src/renderer/components/editor/TiptapEditor.tsx
- [ ] T012 [US1] Add active state highlighting using editor.isActive({ textAlign }) for toolbar buttons in src/renderer/components/editor/TiptapEditor.tsx
- [ ] T013 [US1] Add button title tooltips with keyboard shortcut hints in src/renderer/components/editor/TiptapEditor.tsx

#### PDF Export Integration

- [ ] T014 [P] [US1] Create parseAlignment helper function to extract text-align from HTML style attribute in src/main/pdf/markdown-parser.ts
- [ ] T015 [US1] Update parseParagraph function to call parseAlignment and add textAlign to element in src/main/pdf/markdown-parser.ts
- [ ] T016 [US1] Update parseHeading function to call parseAlignment and add textAlign to element in src/main/pdf/markdown-parser.ts
- [ ] T017 [P] [US1] Apply textAlign style in ParagraphElement component with fallback to 'left' in src/main/pdf/components/MarkdownElements.tsx
- [ ] T018 [P] [US1] Apply textAlign style in HeadingElement component with fallback to 'left' in src/main/pdf/components/MarkdownElements.tsx

#### Validation & Error Handling

- [ ] T019 [US1] Add validation in parseAlignment to only accept 'left'|'center'|'right' values in src/main/pdf/markdown-parser.ts
- [ ] T020 [US1] Add error boundary around alignment buttons to prevent toolbar crashes in src/renderer/components/editor/TiptapEditor.tsx

**Checkpoint**: ✅ User Story 1 complete - Core alignment functionality working end-to-end

**Estimated Time**: 5-6 hours

---

## Phase 4: User Story 2 - Persist alignment in document and support undo/redo (Priority: P2)

**Goal**: Alignment persists when documents are saved/reloaded; undo/redo operations work correctly

**Independent Test**:
1. Open editor, apply center alignment to paragraph
2. Save project (Cmd+S)
3. Close and reopen project
4. Verify alignment preserved
5. Press Cmd+Z (undo) → verify alignment reverts
6. Press Cmd+Shift+Z (redo) → verify alignment reapplies

**Success Criteria**: Alignment persists across save/load cycles; undo/redo behaves correctly

### Implementation for User Story 2

**Note**: Most persistence and undo/redo functionality already works via Tiptap's built-in mechanisms. This phase focuses on verification and edge case handling.

- [ ] T021 [P] [US2] Verify Tiptap's HTML serialization includes alignment styles (test with existing save mechanism)
- [ ] T022 [P] [US2] Verify Tiptap's history plugin tracks alignment changes (test undo/redo with alignment)
- [ ] T023 [US2] Add integration test: Save document with alignment, reload, verify alignment preserved in tests/integration/alignment-persistence.test.ts
- [ ] T024 [US2] Add integration test: Apply alignment, undo, redo, verify state changes in tests/integration/alignment-undo-redo.test.ts
- [ ] T025 [US2] Handle edge case: Loading document with invalid alignment values (fallback to 'left') in src/main/pdf/markdown-parser.ts

**Checkpoint**: ✅ User Story 2 complete - Persistence and undo/redo verified

**Estimated Time**: 1-2 hours

---

## Phase 5: User Story 3 - Bulk and multi-block alignment (Priority: P3)

**Goal**: Users can select multiple paragraphs/blocks and apply alignment to all at once

**Independent Test**:
1. Open editor with multiple paragraphs
2. Select text spanning 3+ paragraphs
3. Click Center alignment button
4. Verify all selected paragraphs center-aligned
5. Export to PDF and verify all are centered

**Success Criteria**: Alignment applies to all paragraphs in selection; PDF export reflects all alignments

### Implementation for User Story 3

**Note**: Multi-block alignment already works via Tiptap's selection handling. This phase focuses on edge case testing and UX refinement.

- [ ] T026 [P] [US3] Test multi-paragraph selection with alignment commands (verify Tiptap applies to all selected nodes)
- [ ] T027 [US3] Add integration test: Select multiple blocks, apply alignment, verify all blocks updated in tests/integration/multi-block-alignment.test.ts
- [ ] T028 [US3] Handle edge case: Mixed alignment states in selection (verify normalization behavior) in src/renderer/components/editor/TiptapEditor.tsx
- [ ] T029 [US3] Add visual feedback for mixed alignment states in toolbar (optional: show indeterminate state) in src/renderer/components/editor/TiptapEditor.tsx

**Checkpoint**: ✅ User Story 3 complete - Multi-block alignment verified

**Estimated Time**: 1-2 hours

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements, documentation, and production readiness

- [ ] T030 [P] Add JSDoc comments to parseAlignment function in src/main/pdf/markdown-parser.ts
- [ ] T031 [P] Add JSDoc comments to alignment-related props in src/renderer/components/editor/TiptapEditor.tsx
- [ ] T032 [P] Update user-facing documentation with alignment feature and keyboard shortcuts in docs/ or README.md
- [ ] T033 [P] Run full test suite and verify no regressions
- [ ] T034 Test alignment with large documents (1000+ paragraphs) for performance
- [ ] T035 Test alignment across different themes and font sizes in PDF export
- [ ] T036 [P] Manual cross-platform testing: macOS, Windows, Linux (keyboard shortcuts)
- [ ] T037 Add CHANGELOG entry for text alignment feature

**Estimated Time**: 2-3 hours

---

## Dependencies & Execution Order

### Story Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational) → User Stories (can run in parallel)
                                          ├─ Phase 3: US1 (P1) ✅ MVP
                                          ├─ Phase 4: US2 (P2) (independent)
                                          └─ Phase 5: US3 (P3) (independent)
                                          → Phase 6 (Polish)
```

### Critical Path (Minimum for MVP)
```
T001 → T002 → T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012 → T013 → T014 → T015 → T016 → T017 → T018
```

**Minimum MVP**: Complete Phase 1 + Phase 2 + Phase 3 (US1)  
**Time Estimate**: 6-8 hours

### Parallel Execution Opportunities

#### Within Phase 2 (Foundational)
Can run in parallel after T004:
- T005 (Extend MarkdownElement)
- T006 (Import icons)

#### Within Phase 3 (US1)
Can run in parallel after T009:
- T010, T011, T012, T013 (Toolbar UI)
- T014, T015, T016 (PDF Parser changes)
- T017, T018 (PDF Component changes)

#### Between User Stories
After Phase 2 complete:
- Phase 3 (US1), Phase 4 (US2), Phase 5 (US3) are independent
- Recommended: Complete US1 first for stable MVP, then US2 and US3 in parallel if needed

#### Within Phase 6 (Polish)
Most polish tasks can run in parallel:
- T030, T031 (Documentation)
- T032 (User docs)
- T033 (Test suite)
- T034, T035, T036 (Testing)

---

## Testing Strategy

### Manual Testing Checklist (Per User Story)

**US1 - Core Alignment**:
- [ ] Toolbar buttons apply alignment
- [ ] Keyboard shortcuts work (Cmd/Ctrl+L/E/R)
- [ ] Active button highlights correctly
- [ ] Alignment visible in editor preview
- [ ] PDF export preserves alignment
- [ ] Alignment works with headings and paragraphs

**US2 - Persistence & Undo/Redo**:
- [ ] Save → Close → Reopen preserves alignment
- [ ] Undo reverts alignment
- [ ] Redo reapplies alignment
- [ ] Multiple undo/redo steps work correctly

**US3 - Multi-block**:
- [ ] Select multiple paragraphs → Apply alignment → All updated
- [ ] Mixed alignment states normalize correctly
- [ ] PDF export with multiple aligned blocks renders correctly

### Automated Tests (Optional - if TDD requested)

Integration tests for T023, T024, T027 cover:
- Persistence across save/load
- Undo/redo state transitions
- Multi-block alignment application

**Note**: Tests are optional for this feature. If automated testing is desired, uncomment test tasks and implement using Vitest/Jest + React Testing Library.

---

## Success Metrics

**Completion Criteria**:
- ✅ All P1 tasks complete (Phase 1 + Phase 2 + Phase 3)
- ✅ Manual testing checklist for US1 passes
- ✅ PDF export correctly renders aligned text
- ✅ No TypeScript errors
- ✅ Existing tests still pass

**MVP Ready When**:
- User can apply Left/Center/Right alignment via toolbar
- Keyboard shortcuts work
- Alignment exports to PDF correctly
- No console errors or warnings

**Production Ready When**:
- All user stories (P1, P2, P3) complete
- Manual testing checklist fully passes
- Cross-platform testing complete
- Documentation updated

---

## Task Summary

**Total Tasks**: 37

**By Phase**:
- Phase 1 (Setup): 3 tasks
- Phase 2 (Foundational): 3 tasks
- Phase 3 (US1 - Core): 14 tasks ← **MVP Critical Path**
- Phase 4 (US2 - Persistence): 5 tasks
- Phase 5 (US3 - Multi-block): 4 tasks
- Phase 6 (Polish): 8 tasks

**By User Story**:
- US1: 14 tasks (P1 - Core alignment)
- US2: 5 tasks (P2 - Persistence & undo/redo)
- US3: 4 tasks (P3 - Multi-block)
- Infrastructure: 6 tasks (Setup + Foundational)
- Polish: 8 tasks

**Parallel Opportunities**: 14 tasks marked [P]

**MVP Scope**: Phase 1 (3) + Phase 2 (3) + Phase 3 (14) = **20 tasks**

---

## Quick Start Guide

### For MVP Implementation (US1 Only)

1. **Setup** (T001-T003): Install dependencies
2. **Foundation** (T004-T006): Add type definitions
3. **Editor** (T007-T009): Integrate Tiptap extension
4. **Toolbar** (T010-T013): Add UI buttons
5. **PDF Export** (T014-T018): Map alignment to PDF
6. **Validation** (T019-T020): Error handling

**Time**: 6-8 hours  
**Result**: Shippable alignment feature

### For Full Feature (US1 + US2 + US3)

Complete all phases sequentially or:
- Complete US1 (MVP) first
- Add US2 and US3 in parallel (independent stories)

**Time**: 8-10 hours  
**Result**: Production-ready with all enhancements

---

## Notes

- **No new IPC contracts**: Alignment is renderer-only, uses existing save/export channels
- **Tiptap handles undo/redo**: History plugin automatically tracks alignment changes
- **HTML serialization**: Alignment stored as inline styles (`style="text-align: center"`)
- **Future enhancement**: Markdown comment-based serialization (deferred to Phase 2)
- **Justify alignment**: Deferred to post-MVP (Firefox compatibility issues)

---

## References

- **Spec**: [spec.md](./spec.md)
- **Plan**: [plan.md](./plan.md)
- **Research**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **Quickstart**: [quickstart.md](./quickstart.md)
- **Contracts**: [contracts/ipc-contracts.md](./contracts/ipc-contracts.md)
