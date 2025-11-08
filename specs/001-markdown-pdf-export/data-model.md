# Data Model: Markdown to PDF Export

**Feature**: 001-markdown-pdf-export  
**Date**: 2025-11-07  
**Status**: Complete

## Overview

This document defines the data model for InkForge's local-first architecture using SQLite with Prisma ORM. The database stores structured metadata while project content is stored as files on the local file system.

---

## Design Principles

1. **Local-First**: All data stored on user's file system, no cloud dependencies
2. **Separation of Concerns**: Database stores metadata, file system stores content/assets
3. **Type Safety**: Prisma generates TypeScript client from schema
4. **Referential Integrity**: Foreign keys enforce relationships
5. **Audit Trail**: Created/updated timestamps on all entities

---

## Database Schema (Prisma)

### Location

Database file: `~/.config/inkforge/inkforge.db` (Linux), `~/Library/Application Support/InkForge/inkforge.db` (macOS), `%APPDATA%/InkForge/inkforge.db` (Windows)

### Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./inkforge.db"
}

// ============================================================================
// PROJECTS
// ============================================================================

model Project {
  id          String   @id @default(uuid())
  name        String
  filePath    String   @unique  // Absolute path to .inkforge project file
  themeId     String?
  
  // Cover page configuration
  hasCoverPage Boolean  @default(false)
  coverTitle   String?
  coverSubtitle String?
  coverAuthor  String?
  coverDate    String?
  coverTemplateId String?
  
  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  lastOpenedAt DateTime @default(now())
  
  // Relationships
  theme       Theme?   @relation(fields: [themeId], references: [id], onDelete: SetNull)
  coverTemplate CoverTemplate? @relation(fields: [coverTemplateId], references: [id], onDelete: SetNull)
  coverAssets ProjectCoverAsset[]
  
  @@index([lastOpenedAt])
}

// ============================================================================
// THEMES
// ============================================================================

model Theme {
  id          String   @id @default(uuid())
  name        String   @unique
  isBuiltIn   Boolean  @default(false)  // True for bundled themes
  
  // Typography
  headingFont String   // Google Font family name
  bodyFont    String   // Google Font family name
  h1Size      Float    @default(32)     // points
  h2Size      Float    @default(24)
  h3Size      Float    @default(20)
  h4Size      Float    @default(16)
  h5Size      Float    @default(14)
  h6Size      Float    @default(12)
  bodySize    Float    @default(11)
  
  // Spacing
  kerning     Float    @default(0)      // letter-spacing in em
  leading     Float    @default(1.5)    // line-height multiplier
  
  // Layout
  pageWidth   Float    @default(8.5)    // inches
  pageHeight  Float    @default(11)     // inches
  marginTop   Float    @default(1)      // inches
  marginBottom Float   @default(1)
  marginLeft  Float    @default(1)
  marginRight Float    @default(1)
  
  // Colors (hex format)
  backgroundColor String @default("#FFFFFF")
  textColor       String @default("#000000")
  headingColor    String @default("#000000")
  linkColor       String @default("#0066CC")
  codeBackground  String @default("#F5F5F5")
  
  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relationships
  projects    Project[]
  
  @@index([name])
}

// ============================================================================
// COVER TEMPLATES
// ============================================================================

model CoverTemplate {
  id          String   @id @default(uuid())
  name        String   @unique
  isBuiltIn   Boolean  @default(false)
  
  // Layout definition (JSON structure defining element positions)
  layoutJson  String   // Serialized layout configuration
  
  // Asset slots
  hasLogoSlot Boolean  @default(false)
  hasBackgroundSlot Boolean @default(false)
  
  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relationships
  projects    Project[]
  
  @@index([name])
}

// ============================================================================
// PROJECT COVER ASSETS
// ============================================================================

model ProjectCoverAsset {
  id          String   @id @default(uuid())
  projectId   String
  assetType   String   // 'logo' | 'background'
  
  // File information
  originalFileName String
  filePath    String   // Absolute path to asset file
  fileSize    Int      // bytes
  mimeType    String   // 'image/png' | 'image/jpeg' | 'image/svg+xml'
  width       Int?     // pixels
  height      Int?     // pixels
  
  // Metadata
  createdAt   DateTime @default(now())
  
  // Relationships
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  @@index([projectId, assetType])
}

// ============================================================================
// RECENT PROJECTS (For quick access list)
// ============================================================================

model RecentProject {
  id          String   @id @default(uuid())
  projectId   String   @unique
  position    Int      // Order in recent list (0 = most recent)
  
  // Metadata
  accessedAt  DateTime @default(now())
  
  @@index([position])
}

// ============================================================================
// APPLICATION SETTINGS
// ============================================================================

model AppSetting {
  key         String   @id
  value       String   // JSON-serialized value
  
  // Metadata
  updatedAt   DateTime @updatedAt
}

// ============================================================================
// FONT CACHE (Track downloaded Google Fonts)
// ============================================================================

model CachedFont {
  id          String   @id @default(uuid())
  family      String   @unique  // Google Font family name
  filePath    String   // Path to cached .woff2 file
  fileSize    Int      // bytes
  
  // Metadata
  downloadedAt DateTime @default(now())
  lastUsedAt   DateTime @default(now())
  
  @@index([family])
  @@index([lastUsedAt])
}
```

---

## Entity Descriptions

### Project

Represents a user's document project with all associated settings.

**Key Fields**:
- `filePath`: Absolute path to `.inkforge` project file containing markdown content
- `themeId`: Reference to selected theme (null = default theme)
- `hasCoverPage`: Boolean flag indicating cover page inclusion
- `lastOpenedAt`: Used for sorting recent projects list

**Storage**:
- Metadata in database
- Content in `.inkforge` file (JSON structure with markdown text, settings)
- Cover assets as separate image files referenced by `ProjectCoverAsset`

### Theme

Defines visual styling for PDF output.

**Key Fields**:
- `isBuiltIn`: Distinguishes bundled themes from user-created
- Typography fields: Font families, sizes for each heading level
- `kerning`/`leading`: CSS letter-spacing and line-height equivalents
- Layout dimensions in inches (convertible to PDF points: 1 inch = 72 points)
- Color values in hex format for CSS/React PDF

**Built-in Themes** (seeded on first run):
1. Professional (Serif)
2. Modern (Sans-serif)
3. Minimal (Clean, high contrast)

### CoverTemplate

Defines layout structure for cover pages.

**Key Fields**:
- `layoutJson`: JSON structure defining text/image element positions
- `hasLogoSlot`/`hasBackgroundSlot`: Indicates supported asset types

**Layout JSON Structure**:
```json
{
  "title": { "x": 50, "y": 200, "fontSize": 48, "align": "center" },
  "subtitle": { "x": 50, "y": 260, "fontSize": 24, "align": "center" },
  "author": { "x": 50, "y": 700, "fontSize": 14, "align": "left" },
  "date": { "x": 500, "y": 700, "fontSize": 14, "align": "right" },
  "logo": { "x": 250, "y": 100, "maxWidth": 100, "maxHeight": 100 },
  "background": { "x": 0, "y": 0, "width": 612, "height": 792, "opacity": 0.1 }
}
```

### ProjectCoverAsset

Tracks image assets (logos, backgrounds) for project cover pages.

**Key Fields**:
- `assetType`: Enum-like string ('logo' | 'background')
- `filePath`: Absolute path to asset file (stored in project assets directory)
- `mimeType`: Validates supported formats (PNG, JPEG, SVG)
- `width`/`height`: Cached dimensions for layout calculations

**Cascade Delete**: Assets deleted when parent project is deleted

### RecentProject

Maintains ordered list of recently accessed projects.

**Key Fields**:
- `position`: Integer order (0 = most recent)
- `accessedAt`: Timestamp for sorting/cleanup

**Maintenance**:
- Max 10 entries (configurable via AppSetting)
- Oldest entries removed when limit exceeded
- Reordered on project open

### AppSetting

Key-value store for application preferences.

**Common Keys**:
- `recentProjectsLimit`: Number (default 10)
- `autoSaveInterval`: Number in milliseconds (default 60000)
- `defaultThemeId`: String (UUID)
- `windowBounds`: JSON (x, y, width, height)

### CachedFont

Tracks downloaded Google Fonts for offline usage.

**Key Fields**:
- `family`: Unique Google Font family name
- `filePath`: Path to cached `.woff2` file in app data directory
- `lastUsedAt`: For cache eviction (remove unused fonts after 90 days)

---

## File System Structure

### Project Files

```
~/Documents/InkForge Projects/
├── MyReport.inkforge          # Project file (JSON)
├── MyReport_assets/           # Project assets directory
│   ├── cover_logo.png
│   └── cover_background.jpg
└── OtherProject.inkforge
```

**Project File Format** (`.inkforge`):
```json
{
  "version": "1.0",
  "content": "# Markdown content here...",
  "projectId": "uuid-from-database",
  "themeId": "uuid-from-database",
  "coverPage": {
    "enabled": true,
    "templateId": "uuid",
    "title": "My Report",
    "subtitle": "2025 Q4 Analysis",
    "author": "John Doe",
    "date": "2025-11-07",
    "assets": {
      "logo": "MyReport_assets/cover_logo.png",
      "background": "MyReport_assets/cover_background.jpg"
    }
  },
  "autoSave": {
    "timestamp": "2025-11-07T12:34:56Z",
    "content": "# Auto-saved content..."
  }
}
```

### Application Data Directory

```
# macOS
~/Library/Application Support/InkForge/
├── inkforge.db              # SQLite database
├── fonts/                   # Cached Google Fonts
│   ├── Roboto.woff2
│   ├── OpenSans.woff2
│   └── Merriweather.woff2
└── themes/                  # User-created themes (exported)
    └── MyCustomTheme.json
```

---

## Migrations Strategy

### Initial Migration

Creates all tables with seed data:
- 3 built-in themes (Professional, Modern, Minimal)
- 3 built-in cover templates (Business, Academic, Creative)
- Default app settings

### Future Migrations

- Use Prisma Migrate for schema changes
- Version `.inkforge` project file format
- Implement migration logic for project file format changes

---

## Validation Rules

### Project
- `name`: Required, 1-255 characters
- `filePath`: Must be absolute path, must exist on file system
- `coverTitle`/`coverSubtitle`/`coverAuthor`: Max 255 characters
- `coverDate`: ISO date string format

### Theme
- `name`: Required, unique, 1-100 characters
- Font fields: Must be valid Google Font family names
- Size fields: Positive numbers, reasonable ranges (6-72 points)
- `kerning`: -0.5 to 0.5 em
- `leading`: 1.0 to 3.0
- Colors: Valid hex format (#RRGGBB)

### ProjectCoverAsset
- `filePath`: Must exist on file system
- `fileSize`: Max 10MB (10,485,760 bytes)
- `mimeType`: Must be 'image/png', 'image/jpeg', or 'image/svg+xml'

### CachedFont
- `family`: Must match Google Fonts API family name
- `filePath`: Must exist in fonts cache directory

---

## Queries & Indexes

### Common Queries

1. **Get recent projects** (used on project selector screen):
   ```typescript
   const recent = await prisma.recentProject.findMany({
     take: 10,
     orderBy: { position: 'asc' },
     include: { 
       project: {
         include: { theme: true }
       }
     }
   });
   ```

2. **Load project with full details**:
   ```typescript
   const project = await prisma.project.findUnique({
     where: { id },
     include: {
       theme: true,
       coverTemplate: true,
       coverAssets: true
     }
   });
   ```

3. **Get all themes**:
   ```typescript
   const themes = await prisma.theme.findMany({
     orderBy: [
       { isBuiltIn: 'desc' },  // Built-in first
       { name: 'asc' }
     ]
   });
   ```

4. **Check if font is cached**:
   ```typescript
   const cached = await prisma.cachedFont.findUnique({
     where: { family: 'Roboto' }
   });
   ```

### Index Strategy

- `Project.lastOpenedAt`: Fast recent projects query
- `Theme.name`: Fast theme lookup by name
- `CoverTemplate.name`: Fast template lookup
- `RecentProject.position`: Ordered list retrieval
- `CachedFont.family`: Font existence check
- `CachedFont.lastUsedAt`: Cache eviction queries

---

## Data Integrity

### Foreign Key Constraints

- `Project.themeId` → `Theme.id` (ON DELETE SET NULL)
- `Project.coverTemplateId` → `CoverTemplate.id` (ON DELETE SET NULL)
- `ProjectCoverAsset.projectId` → `Project.id` (ON DELETE CASCADE)

### Orphan Cleanup

Periodic maintenance tasks:
1. Remove `RecentProject` entries for deleted projects
2. Delete `ProjectCoverAsset` files when project is deleted
3. Remove `CachedFont` entries for missing files
4. Evict unused fonts (lastUsedAt > 90 days)

---

## Seed Data

### Built-in Themes

**Professional Theme**:
- Heading: Merriweather (serif)
- Body: Open Sans (sans-serif)
- Conservative spacing, traditional colors

**Modern Theme**:
- Heading: Montserrat (geometric sans)
- Body: Roboto (humanist sans)
- Tighter spacing, vibrant accent colors

**Minimal Theme**:
- Heading: Inter (neutral sans)
- Body: Inter
- Maximum whitespace, monochrome palette

### Built-in Cover Templates

**Business Template**:
- Clean layout with logo at top
- Centered title/subtitle
- Footer with author/date

**Academic Template**:
- Traditional academic paper layout
- University logo slot
- Author affiliations support

**Creative Template**:
- Background image support
- Asymmetric layout
- Larger title, artistic fonts

---

## Performance Considerations

1. **Database Size**: Metadata only, minimal growth (MBs not GBs)
2. **Query Performance**: All critical paths indexed
3. **File System**: Project files independent, no database bottleneck
4. **Cache Strategy**: Google Fonts cached indefinitely (manual cleanup only)

---

## Security Considerations

1. **Path Validation**: All file paths validated before file system access
2. **SQL Injection**: Prisma ORM prevents SQL injection
3. **File Size Limits**: Enforced at application layer before database insert
4. **Sanitization**: User input sanitized for file names and paths

---

## Next Steps

1. Implement Prisma migration for initial schema
2. Create seed script for built-in themes and templates
3. Define IPC contracts for database operations
4. Implement Prisma client wrapper with error handling
