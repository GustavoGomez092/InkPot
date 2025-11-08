# Feature Specification: Markdown to PDF Export

**Feature Branch**: `001-markdown-pdf-export`  
**Created**: 2025-11-07  
**Status**: Draft  
**Input**: User description: "I am building a desktop application that takes markdown content and exports it as a PDF file, the interface should allow to add, edit or remove markdown interactively, it should be able to tell you where pages break and should allow you to pick from different themes for the PDF render. it should also allow you to create cover pages from templates and ask you for logos or image assets to create the cover page, and you should be able to create your own themes where you specify the font (google font) for the headings and text, the kerning and leading, and should also have a preview button that allows you to preview the PDF before exporting the file, the application slould also be able to save project for later export, saving all the content and settings of the file you are working on."

## Clarifications

### Session 2025-11-07

- Q: Is the application local-only or does it require cloud services? → A: Local-only, no cloud/internet except Google Fonts download
- Q: What is the first screen users see when launching the application? → A: Project selector (new or load existing)
- Q: Where should the application store the list of recently opened projects? → A: User application data directory (platform-specific)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Project Selection and Creation (Priority: P1)

A user launches the application and is presented with a project selector screen where they can create a new project or open an existing project from their local file system.

**Why this priority**: Entry point for all application functionality. Without the ability to create or open projects, users cannot access the editor or any other features. This must be implemented first.

**Independent Test**: Can be fully tested by launching the app, verifying the project selector appears, creating a new project with a name, and confirming the editor opens. Then closing and reopening to verify existing project can be loaded.

**Acceptance Scenarios**:

1. **Given** the application is launched for the first time, **When** it opens, **Then** I see a project selector screen with options to "Create New Project" or "Open Existing Project"
2. **Given** I am on the project selector screen, **When** I click "Create New Project" and provide a project name, **Then** a new project is created and the editor opens with an empty document
3. **Given** I am on the project selector screen, **When** I click "Open Existing Project" and browse to a saved project file, **Then** the project loads and the editor opens with all saved content and settings restored
4. **Given** I have previously worked on projects, **When** I am on the project selector screen, **Then** I see a list of recently opened projects for quick access
5. **Given** I am working on a project, **When** I want to switch to a different project, **Then** I can return to the project selector (with unsaved work warning if applicable)

---

### User Story 2 - Basic Markdown Editing and PDF Export (Priority: P1)

A user with an open project types or pastes markdown content into the editor, sees their content formatted in real-time, and exports it as a PDF file to their chosen location.

**Why this priority**: Core value proposition - without the ability to edit markdown and export to PDF, the application has no purpose. This is the minimum viable product that delivers immediate value.

**Independent Test**: Can be fully tested by creating/opening a project, entering "# Hello World" markdown, clicking export, and verifying a valid PDF file is created with the formatted heading.

**Acceptance Scenarios**:

1. **Given** a project is open with an empty editor, **When** I type markdown syntax (headings, lists, bold, italic, links, code blocks), **Then** I see the content formatted correctly in the editor
2. **Given** I have markdown content in the editor, **When** I click the "Export PDF" button and choose a save location, **Then** a PDF file is created at that location with my formatted content
3. **Given** I have a long document, **When** I scroll through the editor, **Then** I can see visual indicators showing where page breaks will occur in the PDF
4. **Given** I have content in the editor, **When** I make edits (add, modify, or delete text), **Then** the page break indicators update automatically to reflect the new pagination

---

### User Story 3 - Theme Selection and Application (Priority: P2)

A user selects from a collection of pre-built PDF themes to change the visual appearance of their exported document, including fonts, colors, spacing, and layout styles.

**Why this priority**: Differentiates the product from basic markdown converters. Professional document appearance is critical for business use cases, but the core editing/export must work first.

**Independent Test**: Can be tested by creating a document, selecting different themes from a dropdown/gallery, previewing each theme, and verifying the PDF output matches the selected theme's styling.

**Acceptance Scenarios**:

1. **Given** I have content in the editor, **When** I open the theme selector, **Then** I see a list of available themes with preview thumbnails or names
2. **Given** I select a different theme, **When** the theme is applied, **Then** the page break indicators update to reflect the new theme's spacing and layout
3. **Given** I have selected a theme, **When** I export to PDF, **Then** the PDF uses the selected theme's fonts, colors, spacing, and styling
4. **Given** multiple themes available, **When** I switch between themes, **Then** the change is reflected immediately without requiring re-export

---

### User Story 4 - Cover Page Creation (Priority: P3)

A user selects a cover page template, provides information like title, author, and date, uploads logo or image assets, and the application generates a professional cover page for the PDF.

**Why this priority**: Enhances professional appearance for reports and documents, but users can create valuable PDFs without this feature. It's a quality-of-life improvement that builds on core functionality.

**Independent Test**: Can be tested by enabling cover page option, selecting a template, filling in title/author fields, uploading a logo, and verifying the exported PDF includes a formatted cover page before the content.

**Acceptance Scenarios**:

1. **Given** I am working on a document, **When** I enable the "Add Cover Page" option and select a template, **Then** I see a cover page configuration panel
2. **Given** the cover page panel is open, **When** I enter text fields (title, subtitle, author, date) and upload image assets (logo, background), **Then** I see a preview of how the cover page will appear
3. **Given** I have configured a cover page, **When** I export to PDF, **Then** the PDF includes the cover page as the first page, followed by my markdown content
4. **Given** I have a cover page enabled, **When** I disable it, **Then** the PDF exports without a cover page

---

### User Story 5 - Custom Theme Creation (Priority: P4)

A user creates a custom theme by specifying Google Fonts for headings and body text, adjusting typography settings (kerning, leading, font sizes), and saves the theme for reuse across projects.

**Why this priority**: Power user feature that provides brand consistency and professional customization. Most users will be satisfied with pre-built themes, but this enables advanced use cases.

**Independent Test**: Can be tested by clicking "Create Custom Theme", selecting fonts from Google Fonts, adjusting spacing values, saving the theme with a name, and verifying it appears in the theme selector and applies correctly to exported PDFs.

**Acceptance Scenarios**:

1. **Given** I want to create a custom theme, **When** I click "Create Custom Theme", **Then** I see a theme editor with options for heading font, body font, kerning, leading, and other typography settings
2. **Given** I am in the theme editor, **When** I search for and select a Google Font, **Then** the font is loaded and available for preview
3. **Given** I have configured all theme settings, **When** I save the theme with a name, **Then** it appears in my theme selector alongside pre-built themes
4. **Given** I adjust kerning or leading values, **When** I preview the document, **Then** I see the spacing changes reflected in the preview

---

### User Story 6 - PDF Preview (Priority: P2)

A user clicks a preview button to see exactly how their PDF will look before exporting, allowing them to verify formatting, page breaks, and theme application without creating unnecessary files.

**Why this priority**: Critical workflow feature that saves time and prevents errors. Users need confidence their document looks correct before exporting. Higher priority than cover pages and custom themes.

**Independent Test**: Can be tested by editing a document, clicking "Preview PDF", and verifying a preview window opens showing the exact PDF output including correct fonts, spacing, and page breaks.

**Acceptance Scenarios**:

1. **Given** I have content in the editor, **When** I click the "Preview PDF" button, **Then** a preview window opens showing how the PDF will render
2. **Given** the preview window is open, **When** I scroll through pages, **Then** I can see all pages with correct formatting and page breaks
3. **Given** I am viewing the preview, **When** I close it and make edits, **Then** I can re-open the preview to see updated changes
4. **Given** I have applied a theme or added a cover page, **When** I preview, **Then** those settings are reflected in the preview

---

### User Story 7 - Project Save and Load (Priority: P2)

A user saves their current work including all content, theme selection, cover page settings, and custom theme configurations as a project file, then can re-open it later to continue editing or export.

**Why this priority**: Essential for real-world usage where documents are created over multiple sessions. Without this, users lose all work when closing the app. Should be implemented early, alongside preview functionality.

**Independent Test**: Can be tested by creating a document with content and settings, saving as a project file, closing the app, reopening the app, loading the project file, and verifying all content and settings are restored exactly as saved.

**Acceptance Scenarios**:

1. **Given** I have content and settings configured, **When** I click "Save Project" and choose a location, **Then** a project file is created containing all my work
2. **Given** I have a saved project file, **When** I open the application and load the project, **Then** all content, selected theme, cover page settings, and custom themes are restored
3. **Given** I am working on a loaded project, **When** I make changes and save again, **Then** the project file is updated with the new state
4. **Given** I have unsaved changes, **When** I attempt to close the app or open a different project, **Then** I am warned about losing unsaved work
5. **Given** the app crashes or is force-quit, **When** I reopen it, **Then** I am offered to recover unsaved work from an auto-save file

---

### Edge Cases

- What happens when a user attempts to open a project file that no longer exists (moved or deleted since last access)?
- How does the system handle a recently accessed projects list that contains invalid or inaccessible file paths?
- What occurs when a user tries to create a new project but provides an empty name or invalid characters?
- What happens when the user attempts to export a PDF but the chosen save location has insufficient disk space or write permissions?
- How does the system handle extremely large markdown documents (e.g., 500+ pages) during editing, preview, and export?
- What occurs when a user selects a Google Font but has no internet connection to download the font for the first time?
- How does the application behave when a Google Font is already cached but the user is offline?
- How does the application behave when a project file is corrupted or from an incompatible version?
- What happens when a user uploads an image asset for a cover page that is extremely large (e.g., 50MB) or in an unsupported format?
- How does the system handle markdown syntax errors or malformed content?
- What occurs when the user attempts to load a project while another project has unsaved changes?
- How does the application respond when the user closes the app during an active PDF export or preview generation?
- What happens when a custom theme references a Google Font that is no longer available or was never successfully downloaded?
- How does the system handle multiple windows or instances of the application running simultaneously?
- What occurs when the user's local storage location for themes, settings, or recent projects becomes corrupted or inaccessible?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a project selector screen as the first screen when the application launches
- **FR-002**: System MUST allow users to create a new project from the project selector by providing a project name
- **FR-003**: System MUST allow users to open an existing project file from the local file system via the project selector
- **FR-004**: System MUST display a list of recently opened projects on the project selector for quick access
- **FR-005**: System MUST store recent projects list, application settings, and custom themes in the platform-specific user application data directory
- **FR-006**: System MUST operate entirely offline except for Google Fonts downloads, with no cloud storage or external APIs required
- **FR-007**: System MUST store all project data, themes, and assets locally on the user's file system
- **FR-007**: System MUST provide a rich text editor that accepts markdown syntax input and displays formatted content in real-time
- **FR-008**: System MUST support standard markdown syntax including headings (H1-H6), bold, italic, lists (ordered and unordered), links, images, code blocks, and blockquotes
- **FR-009**: System MUST display visual indicators in the editor showing where page breaks will occur in the exported PDF based on current theme and content length
- **FR-010**: System MUST allow users to export the current document as a PDF file to a user-specified location on the file system
- **FR-011**: System MUST provide at least 3 pre-built professional themes that users can select for PDF output
- **FR-012**: System MUST allow users to switch between themes and see page break indicators update accordingly
- **FR-013**: System MUST provide at least 3 cover page templates that users can select and customize
- **FR-014**: System MUST allow users to input text fields for cover pages including title, subtitle, author, and date
- **FR-015**: System MUST allow users to upload image assets (logos, backgrounds) for cover page inclusion from local file system
- **FR-016**: System MUST support image formats PNG, JPEG, and SVG for cover page assets with maximum file size of 10MB per image
- **FR-017**: System MUST provide a custom theme editor where users can create and save new themes
- **FR-018**: System MUST integrate with Google Fonts API to allow font selection for custom themes (requires internet only for font download)
- **FR-019**: System MUST cache downloaded Google Fonts locally for offline use after initial download
- **FR-020**: System MUST allow users to specify typography settings in custom themes: heading font, body text font, kerning (letter-spacing), leading (line-height), and font sizes
- **FR-021**: System MUST provide a preview function that shows the exact PDF output without creating a file
- **FR-022**: System MUST allow users to save their work as a project file that includes all content, settings, and configurations
- **FR-023**: System MUST allow users to load previously saved project files and restore all state exactly as saved
- **FR-024**: System MUST auto-save work periodically to prevent data loss from crashes or unexpected quits
- **FR-025**: System MUST warn users when attempting to close the application or open a different project with unsaved changes
- **FR-026**: System MUST validate uploaded image assets for format compatibility and file size limits
- **FR-027**: System MUST handle export errors gracefully and provide clear error messages (e.g., insufficient disk space, permission denied)
- **FR-028**: System MUST maintain theme consistency between editor preview indicators, PDF preview, and final export
- **FR-029**: System MUST save custom themes as reusable assets that persist locally across application sessions
- **FR-030**: System MUST provide keyboard shortcuts for common actions (save, export, preview, new project, return to project selector)
- **FR-031**: System MUST support undo/redo functionality for content editing

### Assumptions

- Application is entirely local with no cloud services or external APIs except Google Fonts
- Users have an internet connection only for initial Google Fonts download; fonts are cached locally for offline use afterward
- All project files, themes, settings, and assets are stored locally on the user's file system
- Recent projects list stores file paths, not project content, to maintain local-only architecture
- Application metadata (recent projects, settings, custom themes) stored in platform-specific directories: `~/.config/inkforge` (Linux), `~/Library/Application Support/InkForge` (macOS), `%APPDATA%/InkForge` (Windows)
- PDF page size defaults to US Letter (8.5" x 11") but can be configured in theme settings
- Auto-save occurs every 60 seconds when content or settings change, saving to local file system
- Project files use a structured format (JSON or similar) for easy versioning and migration
- The editor supports a subset of extended markdown features (tables, task lists) based on common standards
- Maximum document size is 1000 pages for performance considerations
- Cover page templates are bundled with the application and stored locally

### Key Entities

- **Document**: Represents the user's markdown content, including raw markdown text, applied theme reference, cover page configuration, and project metadata (title, last modified, creation date)
- **Theme**: Defines visual styling for PDF output, including heading font, body font, color palette, kerning, leading, margins, font sizes for each heading level, and page layout settings
- **Cover Page Template**: Defines the structure and layout for a cover page, including placeholder positions for text fields (title, subtitle, author, date), image asset positions (logo, background), and styling rules
- **Project File**: Persistent storage of a Document with all associated settings, custom themes, and cover page assets bundled for portability
- **Image Asset**: Uploaded image files (logo, background) with metadata including original filename, file size, dimensions, and format
- **Page Break**: Calculated position in the document where content splits across PDF pages, based on theme typography settings and content length

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a markdown document and export it to PDF in under 2 minutes from application launch
- **SC-002**: The application handles documents up to 100 pages without perceptible lag (editing responses within 100ms, preview generation within 3 seconds)
- **SC-003**: Page break indicators display with 95% accuracy compared to final PDF output
- **SC-004**: Users can switch between themes and see updated page breaks within 1 second
- **SC-005**: PDF preview generation completes within 5 seconds for documents up to 50 pages
- **SC-006**: Custom themes can be created and saved in under 5 minutes including font selection
- **SC-007**: Project save operations complete within 2 seconds for typical documents (under 10MB with assets)
- **SC-008**: Project load operations restore full state within 3 seconds
- **SC-009**: 90% of users successfully export their first PDF without errors or confusion
- **SC-010**: Auto-save prevents data loss in 100% of crash scenarios (testable via forced quit)
- **SC-011**: The application supports documents up to 1000 pages with graceful performance degradation
- **SC-012**: Cover pages render correctly with user-provided assets in 95% of cases (excluding invalid file formats)
