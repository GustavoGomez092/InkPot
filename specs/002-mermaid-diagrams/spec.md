# Feature Specification: Mermaid.js Diagram Support

**Feature Branch**: `002-mermaid-diagrams`  
**Created**: 2025-12-01  
**Status**: Draft  
**Input**: User description: "The application needs a feature to add mermaidjs diagrams over in the editor and PDF view, the editor should have a new button to insert mermaidjs diagrams, clicking the button should open a new popup window with an editor to add the mermaidjs code, once you add your mermaidjs code, you click the accept button and the popup should close and give you a clickable section on the editor to open the popup again and edit the mermaid code. the Preview section (PDF) should have the rendered mermaid diagram."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Insert New Diagram (Priority: P1)

Users can insert a Mermaid.js diagram into their document by clicking a button in the editor toolbar, entering diagram code in a modal editor, and seeing the rendered diagram appear in the document.

**Why this priority**: This is the core functionality that enables users to create diagrams. Without this, the feature cannot deliver any value. It represents the minimum viable product.

**Independent Test**: Can be fully tested by clicking the toolbar button, entering valid Mermaid syntax (e.g., "graph TD; A-->B"), clicking accept, and verifying a diagram placeholder appears in the editor. Delivers immediate value by allowing diagram creation.

**Acceptance Scenarios**:

1. **Given** user is editing a document, **When** user clicks the "Insert Diagram" button in the toolbar, **Then** a modal window opens with a text editor
2. **Given** the diagram modal is open, **When** user types valid Mermaid.js code and clicks "Accept", **Then** the modal closes and a diagram placeholder appears in the document at the cursor position
3. **Given** user enters invalid Mermaid syntax, **When** user clicks "Accept", **Then** system displays an error message and keeps the modal open
4. **Given** the diagram modal is open, **When** user clicks "Cancel" or closes the modal, **Then** the modal closes without inserting any diagram

---

### User Story 2 - Edit Existing Diagram (Priority: P2)

Users can edit an existing diagram by clicking on the diagram placeholder in the document, which reopens the modal editor with the current diagram code pre-loaded for modification.

**Why this priority**: Editing capability is essential for practical use but depends on the ability to insert diagrams first. Users need to iterate on their diagrams after initial creation.

**Independent Test**: Can be tested independently by inserting a diagram (using US1), then clicking on it to verify the modal reopens with the existing code, making changes, and confirming the diagram updates.

**Acceptance Scenarios**:

1. **Given** a diagram exists in the document, **When** user clicks on the diagram placeholder, **Then** the modal editor opens with the diagram's current Mermaid code
2. **Given** user is editing an existing diagram, **When** user modifies the code and clicks "Accept", **Then** the diagram in the document updates to reflect the changes
3. **Given** user is editing an existing diagram, **When** user clicks "Cancel", **Then** the modal closes without modifying the diagram

---

### User Story 3 - PDF Export with Rendered Diagrams (Priority: P3)

Users can export their document to PDF and see all Mermaid diagrams rendered as images in the final PDF output.

**Why this priority**: While important for the complete workflow, PDF export depends on successful diagram creation and editing. Users can still create and edit diagrams without PDF functionality.

**Independent Test**: Can be tested by creating a document with diagrams (using US1/US2), triggering PDF export, and verifying diagrams appear as rendered images in the PDF. This validates the complete diagram workflow.

**Acceptance Scenarios**:

1. **Given** a document contains one or more Mermaid diagrams, **When** user exports to PDF, **Then** all diagrams appear as rendered images in the PDF
2. **Given** a diagram rendering fails during PDF export, **When** PDF is generated, **Then** an error placeholder appears in place of the failed diagram with a message
3. **Given** document contains no diagrams, **When** user exports to PDF, **Then** PDF generates normally without diagram-related errors

---

### Edge Cases

- What happens when user enters extremely large or complex Mermaid code (e.g., >1000 nodes)?
- How does system handle invalid or malformed Mermaid syntax in existing documents when opening?
- What occurs when PDF export is triggered while a diagram modal is still open?
- How does system handle concurrent editing of multiple diagram instances?
- What happens when user attempts to insert a diagram in an unsupported location (e.g., inside a table cell)?
- How does system behave if Mermaid rendering library fails to load?
- What occurs when user copies and pastes a diagram to another location?
- How does system handle undo/redo operations for diagram insertion and editing?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a toolbar button labeled "Insert Diagram" or similar that is visible when the editor has focus
- **FR-002**: System MUST open a modal window when the diagram button is clicked, containing a text editor for Mermaid.js code
- **FR-003**: Modal window MUST include "Accept" and "Cancel" buttons
- **FR-004**: System MUST validate Mermaid.js syntax before accepting diagram code
- **FR-005**: System MUST display clear error messages when invalid Mermaid syntax is entered
- **FR-006**: System MUST insert a diagram placeholder in the document at the cursor position after accepting valid code
- **FR-007**: Diagram placeholders MUST be visually distinguishable from regular text (e.g., bordered container with preview)
- **FR-008**: Users MUST be able to click on a diagram placeholder to reopen the modal editor with the current code
- **FR-009**: System MUST update the diagram placeholder when edited code is accepted
- **FR-010**: System MUST preserve diagram code when documents are saved and reopened
- **FR-011**: System MUST render Mermaid diagrams as images during PDF export
- **FR-012**: System MUST handle diagram rendering errors gracefully during PDF export (show error placeholder)
- **FR-013**: Diagram operations (insert, edit) MUST support undo/redo functionality
- **FR-014**: System MUST maintain diagram positioning and formatting when document is edited around it
- **FR-015**: Modal editor SHOULD provide syntax highlighting for Mermaid code (enhancement)

### Key Entities

- **Diagram Node**: Represents a Mermaid.js diagram embedded in the document
  - Contains: Raw Mermaid code (string), diagram type (flowchart, sequence, etc. - derived from code), creation timestamp
  - Relationships: Belongs to a document, positioned within document content flow
  - Behavior: Stored as custom node in document structure, renders differently in editor vs PDF

- **Diagram Modal**: Temporary UI component for diagram code editing
  - Contains: Text editor content (Mermaid code), validation state, error messages
  - Behavior: Opens with empty state for new diagrams, pre-populated for existing diagrams, validates on accept action

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can insert a new Mermaid diagram and see the placeholder appear in under 5 seconds
- **SC-002**: Users can edit an existing diagram with the modal reopening in under 2 seconds
- **SC-003**: System validates Mermaid syntax and displays error messages within 1 second of clicking "Accept"
- **SC-004**: 95% of standard Mermaid diagram types (flowchart, sequence, class, state, gantt) render correctly in PDF exports
- **SC-005**: Users can successfully insert and edit diagrams without requiring external documentation (intuitive UI)
- **SC-006**: Diagram code is preserved across 100% of save/reload cycles
- **SC-007**: PDF exports containing diagrams complete without crashing or hanging the application
- **SC-008**: Users can insert at least 20 diagrams in a single document without performance degradation

## Scope

### In Scope

- Insert new Mermaid.js diagrams via toolbar button
- Edit existing diagrams via click interaction
- Modal editor with basic text editing capabilities
- Syntax validation for Mermaid code
- Visual diagram placeholders in editor view
- Diagram rendering in PDF exports
- Save/load diagram code with document persistence
- Undo/redo support for diagram operations
- Support for common Mermaid diagram types (flowchart, sequence, class, state, gantt, pie)

### Out of Scope

- Advanced code editor features (auto-complete, linting, real-time preview in modal)
- Diagram templates or wizards
- Collaborative real-time editing of diagrams
- Version history for individual diagrams
- Export diagrams as standalone image files
- Import diagrams from external sources
- Custom theming or styling of diagrams beyond Mermaid defaults
- Diagram search or filtering capabilities
- Mobile or tablet optimizations for diagram editing

## Assumptions

1. **Mermaid.js Library**: Application will use the standard Mermaid.js library (assumed latest stable version) for rendering
2. **Modal Implementation**: Modal windows are technically feasible within the existing editor architecture
3. **PDF Rendering**: PDF generation library supports embedding rendered images from Mermaid diagrams
4. **Storage Format**: Document storage format can accommodate custom node types for diagrams
5. **User Expertise**: Users have basic understanding of Mermaid.js syntax or can reference external documentation
6. **Browser/Desktop Support**: Target platform supports JavaScript libraries required for Mermaid rendering
7. **Performance**: Rendering up to 20 diagrams per document is within acceptable performance parameters
8. **Error Handling**: Invalid Mermaid syntax can be detected client-side without server validation

## Dependencies

- **External**: Mermaid.js library (npm package or CDN)
- **Internal**: Existing editor framework (Tiptap.js based on context)
- **Internal**: PDF export functionality must support custom image insertion
- **Internal**: Document persistence layer must support custom node types
- **Internal**: Modal/dialog component system for UI

## Constraints

- Diagram rendering performance may be limited by Mermaid.js library capabilities
- Large or complex diagrams may impact editor performance
- PDF export quality depends on Mermaid's rendering output resolution
- Modal editor limited to basic text editing (no advanced IDE features)
- Diagram syntax errors must be caught before insertion to avoid document corruption

## Open Questions

*All questions should be resolved before implementation planning*

[No open questions at this time - all aspects of the feature are clearly defined based on user description]
