# InkPot

**Professional Markdown to PDF Desktop Application**

InkPot is a modern, local-first Electron application that transforms your Markdown content into beautifully formatted PDF documents. With a rich text editor powered by Tiptap, customizable themes, cover page templates, and real-time page break indicators, InkPot makes professional document creation effortless.

Built with React 19's new compiler for automatic optimizations, TypeScript strict mode for type safety, and Tailwind CSS v4 for modern styling—all following a comprehensive constitutional framework that ensures code quality, performance, and maintainability.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Electron](https://img.shields.io/badge/Electron-39.x-blue.svg)
![React](https://img.shields.io/badge/React-19.0.0--rc-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x_strict-blue.svg)

## ✨ Features

### 🎨 **Professional PDF Export**
- Convert Markdown to PDF with pixel-perfect formatting
- Real-time page break indicators in the editor
- Support for all standard Markdown syntax (headings, lists, links, images, code blocks, tables)
- Multiple pre-built professional themes
- High-quality typography using Google Fonts

### 📝 **Rich Text Editor**
- Powered by [Tiptap 2.x](https://tiptap.dev/) (ProseMirror-based) with live markdown rendering
- Modular extension system with custom nodes and marks
- Syntax highlighting for code blocks
- Image embedding and management
- Table support with cell editing
- Task lists and checkboxes
- Atomic undo/redo operations with full document integrity
- Handles documents up to 10,000 nodes without perceptible lag

### 🎭 **Customizable Themes**
- Choose from multiple built-in professional themes
- Create custom themes with your own fonts and styling
- Configure typography (kerning, leading, font sizes)
- Set page dimensions and margins
- Define color schemes for text, headings, links, and code blocks
- Themes persist across projects

### 📄 **Cover Page Templates**
- Add professional cover pages to your documents
- Multiple built-in templates
- Customize title, subtitle, author, and date
- Upload custom logos and background images
- Support for PNG, JPEG, and SVG formats

### 💾 **Project Management**
- Save projects locally with all content and settings
- Quick access to recently opened projects
- Auto-save functionality to prevent data loss
- Portable project files (.inkpot format)
- No cloud services required - 100% local and private

### 🌓 **Modern Interface**
- Beautiful light and dark modes with sub-300ms switching performance
- OKLCH color space for perceptual uniformity (Chromium 111+ native support)
- Custom design system with Tailwind CSS v4 and semantic design tokens
- WCAG AA accessibility standards (4.5:1 contrast for text, 3:1 for UI)
- Three carefully selected font families via @fontsource:
  - **Inter** - Clean UI elements
  - **Source Serif 4** - Readable content
  - **JetBrains Mono** - Clear code blocks

## 🏗️ Architecture

InkPot is built with modern web technologies for desktop, following a comprehensive [constitutional framework](.specify/memory/constitution.md) that ensures code quality, performance, and security.

### **Tech Stack**

#### Frontend (Renderer Process)
- **React 19.0.0-rc** - UI framework with new compiler for automatic optimizations
- **TypeScript 5.x** - Type-safe development with strict mode enabled
- **Tiptap 2.x** - ProseMirror-based extensible rich text editor
- **TanStack Router** - Type-safe routing with hash history for file:// protocol
- **Tailwind CSS v4.0.0** - Utility-first styling with custom design tokens
- **@fontsource** - Self-hosted fonts (Inter, Source Serif 4, JetBrains Mono)

#### Backend (Electron Main Process)
- **Electron 39.x** - Cross-platform desktop framework with security features enabled
  - Context isolation: `true`
  - Node integration: `false`
  - Sandbox: `true`
- **Prisma 6.x** - Type-safe database ORM with libSQL adapter
- **SQLite** - Local-first database via @libsql/client
- **@react-pdf/renderer** - PDF generation with React components
- **Marked** - Markdown parsing and rendering
- **Zod** - Runtime validation at process boundaries

#### Build & Development Tools
- **Vite 7.x** - Fast build tool with HMR support
- **Electron Forge 7.x** - Packaging and cross-platform distribution
- **TypeScript** - Compilation and type checking with zero-error policy
- **ESLint + Prettier** - Code quality and consistent formatting
- **Vitest** - Unit testing with React Testing Library
- **Playwright** - End-to-end testing

### **Project Structure**

```
InkPot/
├── src/
│   ├── main/                    # Electron main process
│   │   ├── index.ts             # Main entry point
│   │   ├── preload.ts           # Preload script for IPC bridge
│   │   ├── database/            # Prisma database layer
│   │   │   ├── client.ts        # Database client
│   │   │   ├── schema.prisma    # Database schema
│   │   │   └── generated/       # Prisma generated client
│   │   ├── ipc/                 # IPC handlers
│   │   │   ├── handlers.ts      # IPC method implementations
│   │   │   └── error-handler.ts # Error handling middleware
│   │   ├── pdf/                 # PDF generation
│   │   │   ├── Document.tsx     # React PDF document template
│   │   │   ├── markdown-parser.ts # Markdown to React PDF
│   │   │   └── components/      # PDF-specific components
│   │   └── services/            # Business logic
│   │       ├── pdf-service.ts   # PDF export service
│   │       ├── theme-service.ts # Theme management
│   │       ├── file-system.ts   # File operations
│   │       └── window-manager.ts # Window management
│   ├── renderer/                # React frontend
│   │   ├── App.tsx              # Root component
│   │   ├── index.tsx            # Entry point
│   │   ├── router.tsx           # Route definitions
│   │   ├── components/          # UI components
│   │   │   ├── editor/          # Editor components
│   │   │   │   └── TiptapEditor.tsx
│   │   │   └── ui/              # Design system components
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       ├── Dialog.tsx
│   │   │       ├── Input.tsx
│   │   │       └── Select.tsx
│   │   ├── contexts/            # React contexts
│   │   │   └── ThemeContext.tsx # Light/dark mode
│   │   ├── editor/              # Editor extensions
│   │   │   ├── image-extension.ts
│   │   │   ├── page-break-extension.ts
│   │   │   └── markdown-serializer.ts
│   │   ├── hooks/               # Custom hooks
│   │   │   └── useIPC.ts        # IPC communication hook
│   │   ├── styles/              # Global styles
│   │   │   ├── global.css       # Design tokens & Tailwind
│   │   │   └── tokens.ts        # TypeScript design tokens
│   │   └── views/               # Page components
│   │       ├── HomeView.tsx     # Project selector
│   │       ├── EditorView.tsx   # Markdown editor
│   │       └── SettingsView.tsx # Settings page
│   └── shared/                  # Shared types
│       ├── types/               # TypeScript types
│       │   └── ipc-contracts.ts # IPC type definitions
│       └── validation/          # Validation schemas
│           └── schemas.ts       # Zod schemas
├── tests/
│   ├── unit/                    # Unit tests (Vitest)
│   ├── integration/             # Integration tests
│   └── e2e/                     # End-to-end tests (Playwright)
├── specs/                       # Feature specifications
│   ├── 001-markdown-pdf-export/ # PDF export feature
│   └── 002-interface-styling/   # Design system implementation
├── Assets/                      # Application assets
│   ├── icon/                    # App icons
│   ├── PNG/                     # PNG assets
│   └── SVG/                     # SVG assets
└── scripts/                     # Utility scripts
    ├── test-all-themes.ts
    └── test-pdf.ts
```

### **Data Model**

InkPot uses SQLite via Prisma for local data persistence. Database location:
- **macOS**: `~/Library/Application Support/InkPot/inkpot.db`
- **Linux**: `~/.config/InkPot/inkpot.db`
- **Windows**: `%APPDATA%/InkPot/inkpot.db`

**Core Entities:**
- **Projects** - Document metadata, settings, and references to .inkpot files
- **Themes** - Typography (Google Fonts), spacing (kerning/leading), layout, and colors
- **CoverTemplates** - Cover page layout definitions with JSON structure
- **ProjectCoverAssets** - Uploaded images (PNG/JPEG/SVG, max 10MB)
- **RecentProjects** - Quick access list ordered by position
- **AppSettings** - Application preferences (JSON-serialized)
- **CachedFonts** - Downloaded Google Fonts (.woff2 files)

## 🎯 Constitutional Principles

InkPot development follows five core principles defined in the [project constitution](.specify/memory/constitution.md):

| Principle | Description | Why It Matters |
|-----------|-------------|----------------|
| **Component Isolation** | React components must be modular, composable, and independently testable with single responsibility | Ensures maintainability, testability, and enables component reuse. Isolation from Electron APIs allows testing in standard browsers |
| **Type Safety** | TypeScript strict mode throughout, typed IPC contracts, runtime validation at process boundaries | Catches errors at compile time, prevents runtime failures, documents data shapes. Critical for safe IPC communication |
| **Performance First** | React 19 compiler optimizations, code-splitting, <1s initial render, handles 10K+ Tiptap nodes | Desktop apps compete with native performance expectations. Users need instant responsiveness |
| **Content Model Integrity** | ProseMirror schema validation, atomic undo/redo, lossless serialization | Rich text editors are data-critical. Schema violations cause corruption. Users expect reliable save/undo behavior |
| **Cross-Process Communication** | Typed IPC via contextBridge, no Node.js in renderer, main process security checks | Electron security model requires strict isolation. Prevents renderer compromise from escalating to system access |

**Version**: 1.0.0 | **Ratified**: 2025-11-07 | **Last Amended**: 2025-11-07

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git**

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/InkPot.git
   cd InkPot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will launch in development mode with hot reload enabled.

## 📦 Building

### **Development Build**
```bash
npm run build
```

### **Package for Distribution**

**All platforms:**
```bash
npm run package
```

**Create installers:**
```bash
npm run make
```

This generates platform-specific installers in the `out/` directory:
- **macOS**: `.zip` file and `.app` bundle (DMG)
- **Windows**: Squirrel installer (`.exe` via NSIS)
- **Linux**: `.deb` (Debian/Ubuntu), `.rpm` (Fedora/RHEL), AppImage

### **Security Configuration**

InkPot follows Electron security best practices (Constitution requirement):

```typescript
// Required security settings in BrowserWindow
{
  webPreferences: {
    contextIsolation: true,    // Isolate renderer from main process
    nodeIntegration: false,     // Disable Node.js in renderer
    sandbox: true,              // Enable OS-level sandboxing
    preload: path.join(__dirname, 'preload.js') // Safe IPC bridge
  }
}
```

All renderer-to-main communication uses the `contextBridge` API in the preload script, ensuring the renderer process cannot directly access Node.js APIs or the file system.

## 🧪 Testing

InkPot follows strict quality gates (Constitution: Development Standards):

```bash
# Run unit tests (Vitest + React Testing Library)
npm test

# Run linter (must pass with zero errors)
npm run lint

# Run E2E tests (Playwright)
npm run test:e2e

# Format code (Prettier auto-format on save)
npm run format

# Combined quality check
npm test && npm run lint
```

**Test Coverage Requirements:**
- Unit tests MUST cover critical business logic
- Integration tests MUST verify main/renderer IPC contracts
- All code MUST pass ESLint and TypeScript compiler with zero errors before commit

## 🔧 Development

### **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Electron in development mode with HMR |
| `npm run build` | Build TypeScript and Vite bundles |
| `npm run lint` | Run ESLint on TypeScript files |
| `npm run format` | Format code with Prettier |
| `npm test` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with initial data |
| `npm run package` | Package the application |
| `npm run make` | Create distribution installers |

### **Database Migrations**

When modifying the Prisma schema:

```bash
# Create a new migration
npm run db:migrate

# Generate Prisma client
npm run db:generate
```

### **IPC Communication**

InkPot follows strict cross-process communication principles (Constitution Principle V):

- **Context Bridge**: Renderer process accesses main process ONLY via `contextBridge` in preload script
- **Type Safety**: All IPC contracts defined in `src/shared/types/ipc-contracts.ts` with TypeScript interfaces
- **Security**: Renderer cannot access Node.js APIs directly; all sensitive operations (file I/O, system calls) occur in main process
- **Validation**: IPC handlers validate inputs with Zod schemas, handle errors gracefully, return structured responses

**Available APIs via `window.electronAPI`:**
- **App**: Version info, platform detection
- **Projects**: CRUD operations, recent projects list
- **Themes**: List, create, update, delete custom themes
- **PDF**: Export, preview generation with theme application
- **File System**: Open/save dialogs, file operations with security checks

Example usage in renderer:
```typescript
const result = await window.electronAPI.themes.list({});
if (result.success) {
  console.log('Themes:', result.themes);
} else {
  console.error('Error:', result.error);
}
```

### **Design System**

InkPot uses a comprehensive design system with OKLCH colors (see [Feature 002 Spec](specs/002-interface-styling/spec.md)):

**Design Tokens** (defined in `src/renderer/styles/global.css`):
- **Colors**: Semantic OKLCH tokens (`--primary`, `--secondary`, `--accent`, `--destructive`, `--muted`) with light/dark variants
- **Typography**: Three font families with system fallbacks
  - `--font-sans`: Inter, sans-serif
  - `--font-serif`: Source Serif 4, serif
  - `--font-mono`: JetBrains Mono, monospace
- **Spacing**: Consistent 0.25rem (`--spacing`) base scale with multipliers
- **Shadows**: Eight elevation levels (`--shadow-2xs` to `--shadow-2xl`)
- **Radius**: Configurable border radius based on `--radius` base value

**Integration**: Tailwind CSS v4 with `@theme inline` directive ensures all components use design tokens exclusively (zero hardcoded values). Theme preference persists via Electron Store.

## 🎨 Creating Custom Themes

1. Navigate to Settings → Themes
2. Click "Create Custom Theme"
3. Configure:
   - **Fonts**: Select from Google Fonts
   - **Typography**: Set sizes, kerning, leading
   - **Layout**: Configure page dimensions and margins
   - **Colors**: Define text, heading, and accent colors
4. Save with a descriptive name
5. Select your theme in the editor

Themes are stored locally and can be exported/imported as JSON.

## � Spec Kit Development Methodology

InkPot uses [Spec Kit](.github/prompts/) for specification-driven development. This ensures:

- **Comprehensive Planning**: Features are fully specified before implementation
- **User-Centered Design**: User stories and acceptance scenarios drive requirements
- **Constitutional Compliance**: All features align with [core principles](.specify/memory/constitution.md)
- **Quality Assurance**: Edge cases and success criteria defined upfront

**Spec Kit Workflow:**
1. **Clarify** - Gather requirements and ask clarifying questions
2. **Specify** - Write detailed feature specifications with user stories
3. **Plan** - Create implementation plans with tasks and dependencies
4. **Implement** - Build following constitutional principles
5. **Verify** - Test against success criteria and acceptance scenarios

See [specs/](specs/) for completed feature specifications.

## �📄 Exporting PDFs

1. **Write your content** in the Markdown editor
2. **Select a theme** from the theme dropdown
3. **(Optional)** Add a cover page and customize it
4. **Preview** your PDF using the preview button
5. **Export** to save the PDF file

### **Page Breaks**

InkPot displays visual indicators in the editor showing where page breaks will occur based on:
- Current theme settings (margins, spacing, font sizes)
- Content length
- Typography (kerning, leading, font family)
- Page dimensions (default: US Letter 8.5" x 11")

## 🗺️ Roadmap

Development follows the [Spec Kit methodology](.github/prompts/) with detailed feature specifications:

### **Feature 001: Markdown PDF Export** ✅ (Spec Complete)
- [x] Project selector and management ([spec](specs/001-markdown-pdf-export/spec.md))
- [x] Tiptap rich text editor with markdown support
- [x] Real-time page break indicators
- [x] PDF export with multiple themes
- [x] Project save/load functionality
- [x] Auto-save and data loss prevention
- [x] SQLite database with Prisma ORM
- [ ] Cover page templates (Priority P3)
- [ ] Custom theme editor (Priority P4)
- [ ] PDF preview window (Priority P2)

### **Feature 002: Interface Styling** ✅ (Implemented)
- [x] OKLCH color system ([spec](specs/002-interface-styling/spec.md))
- [x] Light/dark mode with sub-300ms switching
- [x] @fontsource integration (Inter, Source Serif 4, JetBrains Mono)
- [x] Tailwind CSS v4 with design tokens
- [x] WCAG AA accessibility compliance
- [x] Focus states and keyboard navigation

### **Future Features** �
- Google Fonts integration for custom themes
- Cover page image asset management
- Advanced export options (page orientation, quality settings)
- Keyboard shortcut customization
- Theme import/export functionality

## 🤝 Contributing

Contributions are welcome! InkPot follows a specification-driven development process using [Spec Kit](.github/prompts/).

### **Development Process**

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow Spec Kit methodology**:
   - Read the [constitution](.specify/memory/constitution.md) for core principles
   - Review existing [feature specs](specs/) for examples
   - Create a feature spec if adding major functionality
   - Implement following constitutional requirements
4. **Ensure quality gates pass**:
   ```bash
   npm test && npm run lint
   ```
5. **Commit your changes** with descriptive messages
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request** with:
   - Description of changes
   - Link to feature spec (if applicable)
   - Constitutional principle compliance verification
   - Test coverage details

### **Code Style**

InkPot follows the [project constitution](.specify/memory/constitution.md) which defines five core principles:

1. **Component Isolation** - Modular React components with single responsibility, no direct Electron API access
2. **Type Safety** - TypeScript strict mode, typed IPC contracts, no `any` types without justification
3. **Performance First** - React 19 compiler optimizations, bundle size monitoring, <1s initial render
4. **Content Model Integrity** - ProseMirror schema contracts, atomic undo/redo, data loss prevention
5. **Cross-Process Communication** - Explicit typed IPC channels, contextBridge only, main process security checks

**Requirements:**
- TypeScript strict mode enabled (`strict: true`)
- ESLint + TypeScript ESLint (zero errors before commit)
- Prettier auto-format on save (consistent style non-negotiable)
- All PRs must pass CI: lint, type-check, tests, build
- No direct commits to main branch (PR-only workflow)

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version)

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with these amazing open-source projects:

**Core Technologies:**
- [Electron](https://www.electronjs.org/) - Cross-platform desktop framework
- [React 19](https://react.dev/) - UI library with new compiler
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript superset
- [Tiptap](https://tiptap.dev/) - Headless ProseMirror editor framework
- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework

**Database & State:**
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [libSQL](https://github.com/libsql/libsql) - SQLite for modern applications
- [Electron Store](https://github.com/sindresorhus/electron-store) - Persistent user preferences

**PDF & Fonts:**
- [@react-pdf/renderer](https://react-pdf.org/) - React components for PDF generation
- [Marked](https://marked.js.org/) - Fast markdown parser
- [@fontsource](https://fontsource.org/) - Self-hosted open source fonts

**Build & Development:**
- [Vite](https://vitejs.dev/) - Next generation build tool
- [Electron Forge](https://www.electronforge.io/) - Complete toolchain for Electron apps
- [Vitest](https://vitest.dev/) - Blazing fast unit testing
- [Playwright](https://playwright.dev/) - Reliable end-to-end testing

**Development Methodology:**
- Spec Kit - Specification-driven development framework (prompts in `.github/prompts/`)

## 📧 Contact

**InkPot Team** - gustavogomez092@gmail.com

Project Link: [https://github.com/GustavoGomez092/InkPot](https://github.com/GustavoGomez092/InkPot)

---

<p align="center">Made with ❤️ by the InkPot Team</p>
