# InkPot v0.1 Release Notes

> **Professional Markdown to PDF Conversion for Desktop**

We're excited to announce the initial release of InkPot, a beautiful and powerful desktop application for converting Markdown documents into professionally formatted PDFs.

---

## 🎉 What is InkPot?

InkPot is a native macOS/Windows/Linux desktop application built with Electron that provides a seamless writing experience with live Markdown editing and instant PDF preview. Perfect for writers, researchers, and anyone who needs to create polished documents from Markdown.

---

## ✨ Key Features

### 📝 Rich Markdown Editor
- **Powered by Tiptap**: Professional WYSIWYG Markdown editor with live formatting
- **Full Markdown Support**: Headings, lists, tables, code blocks, images, and more
- **Task Lists**: Interactive checkboxes for to-do lists
- **Tables**: Full table support with add/remove rows and columns
- **Image Support**:
  - Drag & drop images directly into your document
  - Paste images from clipboard
  - Local asset management per project
- **Page Breaks**: Insert manual page breaks for precise PDF layout control
- **Emoji Picker**: Quick emoji insertion with categorized browser
- **Consistent Toolbar**: Lucide icons throughout for a polished UI

### 🎨 Professional PDF Export
- **Theme System**: Built-in professional themes with customizable fonts and styling
  - Academic
  - Modern Minimal
  - Professional Report
  - Classic Serif
  - Creative Bold
- **Custom Fonts**: Support for Google Fonts integration
  - Heading and body font customization
  - Font size controls for all heading levels
  - Kerning and leading adjustments
- **Page Layout Control**:
  - Configurable page dimensions (A4, Letter, custom)
  - Adjustable margins
  - Custom background and text colors
- **Cover Page Support**:
  - Optional cover pages with templates
  - Custom title, subtitle, and author
  - Logo and background image support

### 🖥️ Native Desktop Experience
- **Custom Title Bar**: Beautiful macOS-inspired window chrome
  - Traffic light controls (red, yellow, green)
  - Frameless window with glass morphism effect
  - Draggable title bar region
  - Full window controls (minimize, maximize, close)
- **Modern UI**: Built with shadcn/ui and Tailwind CSS
  - Amber Minimal theme for consistent aesthetics
  - Light and dark mode support
  - Responsive layout
  - Glass morphism and backdrop blur effects

### 💾 Project Management
- **Local-First**: All data stored locally on your machine
- **SQLite Database**: Fast, reliable project and settings storage
- **Recent Projects**: Quick access to recently opened documents
- **Asset Organization**: Automatic image asset management per project
- **Auto-Save**: Never lose your work with automatic saving

### 🔄 Live Preview
- **Real-time PDF Preview**: See your PDF as you type
- **Page Break Visualization**: Visual indicators for page breaks in the editor
- **Theme Switching**: Preview different themes instantly
- **Export & Preview**: Quick export to PDF with optional auto-open

---

## 🏗️ Technical Architecture

### Frontend
- **Electron**: Cross-platform desktop framework
- **React 19 RC**: Latest React features with concurrent rendering
- **TanStack Router**: Type-safe routing with hash history
- **Tiptap**: Extensible rich-text editor built on ProseMirror
- **Tailwind CSS 4.0**: Utility-first styling with OKLCH color space
- **Vite**: Lightning-fast build tool and dev server

### Backend
- **Prisma ORM**: Type-safe database access with SQLite
- **IPC Architecture**: Secure main-renderer communication
- **Zod Validation**: Runtime type checking for all IPC calls
- **PDF Generation**: Custom PDF engine with @react-pdf/renderer

### Developer Experience
- **TypeScript**: Full type safety across the entire stack
- **ESLint & Prettier**: Code quality and formatting
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing
- **Hot Module Replacement**: Instant dev server updates

---

## 🚀 Getting Started

### Installation

**macOS (Apple Silicon)**
```bash
# Download the latest .dmg from releases
# Or build from source:
npm install
npm run package
```

**Windows**
```bash
# Download the latest installer from releases
# Or build from source:
npm install
npm run make
```

**Linux**
```bash
# Download the latest .deb or .rpm from releases
# Or build from source:
npm install
npm run make
```

### First Steps

1. **Create a Project**: Click "New Project" on the home screen
2. **Start Writing**: Use the rich Markdown editor with live formatting
3. **Preview PDF**: Click the preview button to see your PDF in real-time
4. **Export**: Export to PDF when ready, with optional auto-open

---

## 📋 System Requirements

- **macOS**: 10.15 (Catalina) or later
- **Windows**: Windows 10 or later
- **Linux**: Ubuntu 20.04 or equivalent
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 200MB for application + space for projects

---

## 🎯 Use Cases

- **Academic Writing**: Research papers, theses, dissertations
- **Technical Documentation**: API docs, user guides, manuals
- **Reports**: Business reports, white papers, case studies
- **Books & eBooks**: Manuscripts, novellas, technical books
- **Presentations**: Speaker notes, handouts
- **Personal**: Journal entries, notes, documentation

---

## 🔒 Privacy & Security

- **100% Local**: All data stays on your machine
- **No Cloud**: No account required, no data sent to servers
- **No Telemetry**: We don't track your usage
- **Context Isolation**: Secure Electron architecture with context bridge
- **Sandboxed Renderer**: Security-first design

---

## 🗺️ Roadmap

### Planned Features
- [ ] Template system for common document types
- [ ] Export to additional formats (DOCX, HTML, EPUB)
- [ ] Collaborative editing (local network)
- [ ] Plugin system for custom extensions
- [ ] Advanced table of contents generation
- [ ] Bibliography and citation management
- [ ] Version control integration
- [ ] Presentation mode
- [ ] Mobile companion app

---

## 🐛 Known Issues

1. **Font Loading**: Some Google Fonts may require manual download
2. **Large Images**: Very large images (>10MB) may impact performance
3. **Table Editing**: Complex nested tables may have formatting quirks
4. **PDF Preview**: Initial preview generation may take a few seconds for long documents

---

## 🙏 Credits

### Technologies
- [Electron](https://www.electronjs.org/) - Cross-platform desktop framework
- [React](https://react.dev/) - UI library
- [Tiptap](https://tiptap.dev/) - Rich text editor
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Lucide](https://lucide.dev/) - Icon library
- [TanStack Router](https://tanstack.com/router) - Type-safe routing

### Fonts
- [Inter](https://rsms.me/inter/) - UI font
- [Source Serif 4](https://github.com/adobe-fonts/source-serif) - Serif font
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) - Monospace font

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🤝 Contributing

We welcome contributions! Please see CONTRIBUTING.md for guidelines.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/inkpot.git
cd inkpot

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run package
```

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/inkpot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/inkpot/discussions)
- **Email**: gustavogomez092@gmail.com

---

## 📊 Statistics

- **Codebase**: ~15,000 lines of TypeScript/React
- **Components**: 25+ reusable UI components
- **Database Tables**: 6 (Projects, Themes, RecentProjects, CoverAssets, etc.)
- **IPC Channels**: 40+ secure communication handlers
- **Test Coverage**: Unit and E2E tests included

---

## 🎊 Release Highlights

### What Makes InkPot Special?

1. **True WYSIWYG Markdown**: Unlike traditional Markdown editors, InkPot shows you exactly how your content will look in the PDF
2. **Professional Output**: Built-in themes designed by typography experts
3. **Local-First**: Your data is yours, stored securely on your machine
4. **Beautiful UI**: Modern, polished interface that's a joy to use
5. **Fast & Responsive**: Optimized performance even for large documents
6. **Open Source**: Transparent, auditable code you can trust

---

Thank you for trying InkPot! We're excited to see what you create.

**Happy Writing! ✍️**
