# IPC Contracts: Markdown to PDF Export

**Feature**: 001-markdown-pdf-export  
**Date**: 2025-11-07  
**Status**: Complete

## Overview

This document defines typed IPC (Inter-Process Communication) contracts between Electron's main and renderer processes. All contracts are enforced through TypeScript interfaces and Zod validation schemas.

---

## Contract Principles

1. **Type Safety**: All channels typed with request/response interfaces
2. **Validation**: Zod schemas validate data at process boundaries
3. **Error Handling**: Structured error responses with codes and messages
4. **No Direct Access**: Renderer cannot access Node.js/Electron APIs
5. **Atomic Operations**: Each IPC call performs single, well-defined operation

---

## Global Types

### Common Response Types

```typescript
// Success response wrapper
interface SuccessResponse<T> {
  success: true;
  data: T;
}

// Error response wrapper
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

type IPCResponse<T> = SuccessResponse<T> | ErrorResponse;
```

### Error Codes

```typescript
enum IPCErrorCode {
  // General
  INVALID_INPUT = 'INVALID_INPUT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  
  // File system
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_ALREADY_EXISTS = 'FILE_ALREADY_EXISTS',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  DISK_FULL = 'DISK_FULL',
  
  // Database
  DATABASE_ERROR = 'DATABASE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  
  // Network
  NETWORK_ERROR = 'NETWORK_ERROR',
  FONT_DOWNLOAD_FAILED = 'FONT_DOWNLOAD_FAILED',
}
```

---

## Channel: `projects`

### `projects:list-recent`

Get list of recently opened projects.

**Request**:
```typescript
interface ListRecentProjectsRequest {
  limit?: number; // Default: 10, Max: 20
}
```

**Response**:
```typescript
interface RecentProject {
  id: string;
  name: string;
  filePath: string;
  themeName: string | null;
  lastOpenedAt: string; // ISO 8601
  hasCoverPage: boolean;
}

type ListRecentProjectsResponse = IPCResponse<RecentProject[]>;
```

**Validation**:
```typescript
const ListRecentProjectsSchema = z.object({
  limit: z.number().int().min(1).max(20).optional(),
});
```

---

### `projects:create`

Create a new project.

**Request**:
```typescript
interface CreateProjectRequest {
  name: string;
  filePath: string; // User-selected save location
  themeId?: string; // Optional: use default if not specified
}
```

**Response**:
```typescript
interface CreateProjectResponse {
  id: string;
  name: string;
  filePath: string;
  themeId: string;
  createdAt: string;
}

type CreateProjectResult = IPCResponse<CreateProjectResponse>;
```

**Validation**:
```typescript
const CreateProjectSchema = z.object({
  name: z.string().min(1).max(255),
  filePath: z.string().min(1), // Absolute path
  themeId: z.string().uuid().optional(),
});
```

---

### `projects:load`

Load an existing project.

**Request**:
```typescript
interface LoadProjectRequest {
  filePath: string; // Absolute path to .inkforge file
}
```

**Response**:
```typescript
interface LoadProjectResponse {
  id: string;
  name: string;
  content: string; // Markdown content
  themeId: string;
  theme: ThemeData;
  coverPage: CoverPageData | null;
  coverAssets: CoverAssetData[];
  lastOpenedAt: string;
}

interface ThemeData {
  id: string;
  name: string;
  headingFont: string;
  bodyFont: string;
  h1Size: number;
  h2Size: number;
  h3Size: number;
  bodySize: number;
  kerning: number;
  leading: number;
  // ... all theme properties
}

interface CoverPageData {
  enabled: boolean;
  templateId: string;
  title: string | null;
  subtitle: string | null;
  author: string | null;
  date: string | null;
}

interface CoverAssetData {
  id: string;
  type: 'logo' | 'background';
  filePath: string;
  width: number | null;
  height: number | null;
}

type LoadProjectResult = IPCResponse<LoadProjectResponse>;
```

**Validation**:
```typescript
const LoadProjectSchema = z.object({
  filePath: z.string().min(1),
});
```

---

### `projects:save`

Save project content and settings.

**Request**:
```typescript
interface SaveProjectRequest {
  id: string;
  content: string; // Markdown content
  themeId?: string;
  coverPage?: Partial<CoverPageData>;
}
```

**Response**:
```typescript
interface SaveProjectResponse {
  success: true;
  savedAt: string; // ISO 8601 timestamp
  filePath: string;
}

type SaveProjectResult = IPCResponse<SaveProjectResponse>;
```

**Validation**:
```typescript
const SaveProjectSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  themeId: z.string().uuid().optional(),
  coverPage: z.object({
    enabled: z.boolean().optional(),
    title: z.string().max(255).nullable().optional(),
    subtitle: z.string().max(255).nullable().optional(),
    author: z.string().max(255).nullable().optional(),
    date: z.string().nullable().optional(),
  }).optional(),
});
```

---

### `projects:delete`

Delete a project.

**Request**:
```typescript
interface DeleteProjectRequest {
  id: string;
  deleteFile: boolean; // Also delete .inkforge file from disk
}
```

**Response**:
```typescript
interface DeleteProjectResponse {
  success: true;
}

type DeleteProjectResult = IPCResponse<DeleteProjectResponse>;
```

**Validation**:
```typescript
const DeleteProjectSchema = z.object({
  id: z.string().uuid(),
  deleteFile: z.boolean(),
});
```

---

## Channel: `themes`

### `themes:list`

Get all available themes.

**Request**:
```typescript
interface ListThemesRequest {
  includeBuiltIn?: boolean; // Default: true
}
```

**Response**:
```typescript
interface ThemeSummary {
  id: string;
  name: string;
  isBuiltIn: boolean;
  headingFont: string;
  bodyFont: string;
}

type ListThemesResponse = IPCResponse<ThemeSummary[]>;
```

**Validation**:
```typescript
const ListThemesSchema = z.object({
  includeBuiltIn: z.boolean().optional(),
});
```

---

### `themes:get`

Get full theme details.

**Request**:
```typescript
interface GetThemeRequest {
  id: string;
}
```

**Response**:
```typescript
type GetThemeResponse = IPCResponse<ThemeData>;
```

**Validation**:
```typescript
const GetThemeSchema = z.object({
  id: z.string().uuid(),
});
```

---

### `themes:create`

Create a custom theme.

**Request**:
```typescript
interface CreateThemeRequest {
  name: string;
  headingFont: string;
  bodyFont: string;
  h1Size: number;
  h2Size: number;
  h3Size: number;
  h4Size: number;
  h5Size: number;
  h6Size: number;
  bodySize: number;
  kerning: number;
  leading: number;
  pageWidth: number;
  pageHeight: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  linkColor: string;
  codeBackground: string;
}
```

**Response**:
```typescript
interface CreateThemeResponse {
  id: string;
  name: string;
  createdAt: string;
}

type CreateThemeResult = IPCResponse<CreateThemeResponse>;
```

**Validation**:
```typescript
const CreateThemeSchema = z.object({
  name: z.string().min(1).max(100),
  headingFont: z.string().min(1),
  bodyFont: z.string().min(1),
  h1Size: z.number().min(6).max(72),
  h2Size: z.number().min(6).max(72),
  h3Size: z.number().min(6).max(72),
  h4Size: z.number().min(6).max(72),
  h5Size: z.number().min(6).max(72),
  h6Size: z.number().min(6).max(72),
  bodySize: z.number().min(6).max(24),
  kerning: z.number().min(-0.5).max(0.5),
  leading: z.number().min(1.0).max(3.0),
  pageWidth: z.number().positive(),
  pageHeight: z.number().positive(),
  marginTop: z.number().nonnegative(),
  marginBottom: z.number().nonnegative(),
  marginLeft: z.number().nonnegative(),
  marginRight: z.number().nonnegative(),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  headingColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  linkColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  codeBackground: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});
```

---

### `themes:update`

Update a custom theme (not allowed for built-in themes).

**Request**:
```typescript
interface UpdateThemeRequest {
  id: string;
  updates: Partial<Omit<CreateThemeRequest, 'name'>>;
}
```

**Response**:
```typescript
type UpdateThemeResponse = IPCResponse<ThemeData>;
```

**Validation**:
```typescript
const UpdateThemeSchema = z.object({
  id: z.string().uuid(),
  updates: CreateThemeSchema.partial().omit({ name: true }),
});
```

---

### `themes:delete`

Delete a custom theme.

**Request**:
```typescript
interface DeleteThemeRequest {
  id: string;
}
```

**Response**:
```typescript
type DeleteThemeResponse = IPCResponse<{ success: true }>;
```

**Validation**:
```typescript
const DeleteThemeSchema = z.object({
  id: z.string().uuid(),
});
```

---

## Channel: `fonts`

### `fonts:search`

Search Google Fonts by family name.

**Request**:
```typescript
interface SearchFontsRequest {
  query: string; // Search term
  limit?: number; // Default: 20
}
```

**Response**:
```typescript
interface FontResult {
  family: string;
  category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
  variants: string[]; // ['regular', 'italic', '700', '700italic', ...]
  subsets: string[]; // ['latin', 'latin-ext', ...]
}

type SearchFontsResponse = IPCResponse<FontResult[]>;
```

**Validation**:
```typescript
const SearchFontsSchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(50).optional(),
});
```

---

### `fonts:download`

Download and cache a Google Font.

**Request**:
```typescript
interface DownloadFontRequest {
  family: string;
  variants?: string[]; // Default: ['regular']
}
```

**Response**:
```typescript
interface DownloadFontResponse {
  family: string;
  cachedPath: string; // Local path to .woff2 file
  fileSize: number; // bytes
}

type DownloadFontResult = IPCResponse<DownloadFontResponse>;
```

**Validation**:
```typescript
const DownloadFontSchema = z.object({
  family: z.string().min(1),
  variants: z.array(z.string()).optional(),
});
```

---

### `fonts:is-cached`

Check if a font is already cached locally.

**Request**:
```typescript
interface IsFontCachedRequest {
  family: string;
}
```

**Response**:
```typescript
interface IsFontCachedResponse {
  isCached: boolean;
  cachedPath: string | null;
}

type IsFontCachedResult = IPCResponse<IsFontCachedResponse>;
```

**Validation**:
```typescript
const IsFontCachedSchema = z.object({
  family: z.string().min(1),
});
```

---

## Channel: `pdf`

### `pdf:preview`

Generate PDF preview without saving to disk.

**Request**:
```typescript
interface PreviewPDFRequest {
  projectId: string;
}
```

**Response**:
```typescript
interface PreviewPDFResponse {
  pdfDataUrl: string; // Base64 data URL for PDF
  pageCount: number;
  fileSize: number; // bytes
}

type PreviewPDFResult = IPCResponse<PreviewPDFResponse>;
```

**Validation**:
```typescript
const PreviewPDFSchema = z.object({
  projectId: z.string().uuid(),
});
```

---

### `pdf:export`

Export PDF to user-specified location.

**Request**:
```typescript
interface ExportPDFRequest {
  projectId: string;
  outputPath: string; // User-selected file path
}
```

**Response**:
```typescript
interface ExportPDFResponse {
  filePath: string;
  fileSize: number; // bytes
  pageCount: number;
}

type ExportPDFResult = IPCResponse<ExportPDFResponse>;
```

**Validation**:
```typescript
const ExportPDFSchema = z.object({
  projectId: z.string().uuid(),
  outputPath: z.string().min(1),
});
```

---

### `pdf:calculate-page-breaks`

Calculate page break positions for current theme and content.

**Request**:
```typescript
interface CalculatePageBreaksRequest {
  content: string; // Markdown content
  themeId: string;
}
```

**Response**:
```typescript
interface PageBreak {
  nodeIndex: number; // Position in Tiptap document
  estimatedPageNumber: number;
  characterOffset: number; // Character position in markdown
}

type CalculatePageBreaksResponse = IPCResponse<PageBreak[]>;
```

**Validation**:
```typescript
const CalculatePageBreaksSchema = z.object({
  content: z.string(),
  themeId: z.string().uuid(),
});
```

---

## Channel: `cover`

### `cover:list-templates`

Get all available cover page templates.

**Request**:
```typescript
interface ListCoverTemplatesRequest {
  includeBuiltIn?: boolean; // Default: true
}
```

**Response**:
```typescript
interface CoverTemplateSummary {
  id: string;
  name: string;
  isBuiltIn: boolean;
  hasLogoSlot: boolean;
  hasBackgroundSlot: boolean;
}

type ListCoverTemplatesResponse = IPCResponse<CoverTemplateSummary[]>;
```

**Validation**:
```typescript
const ListCoverTemplatesSchema = z.object({
  includeBuiltIn: z.boolean().optional(),
});
```

---

### `cover:upload-asset`

Upload an image asset for cover page.

**Request**:
```typescript
interface UploadCoverAssetRequest {
  projectId: string;
  assetType: 'logo' | 'background';
  filePath: string; // User-selected image file
}
```

**Response**:
```typescript
interface UploadCoverAssetResponse {
  id: string;
  assetType: 'logo' | 'background';
  storedPath: string; // Path in project assets directory
  originalFileName: string;
  width: number;
  height: number;
  fileSize: number;
}

type UploadCoverAssetResult = IPCResponse<UploadCoverAssetResponse>;
```

**Validation**:
```typescript
const UploadCoverAssetSchema = z.object({
  projectId: z.string().uuid(),
  assetType: z.enum(['logo', 'background']),
  filePath: z.string().min(1),
});
```

---

## Channel: `file`

### `file:open-dialog`

Show native file picker dialog.

**Request**:
```typescript
interface OpenDialogRequest {
  title?: string;
  defaultPath?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
  properties?: Array<'openFile' | 'openDirectory' | 'multiSelections'>;
}
```

**Response**:
```typescript
interface OpenDialogResponse {
  canceled: boolean;
  filePaths: string[];
}

type OpenDialogResult = IPCResponse<OpenDialogResponse>;
```

**Validation**:
```typescript
const OpenDialogSchema = z.object({
  title: z.string().optional(),
  defaultPath: z.string().optional(),
  filters: z.array(z.object({
    name: z.string(),
    extensions: z.array(z.string()),
  })).optional(),
  properties: z.array(z.enum(['openFile', 'openDirectory', 'multiSelections'])).optional(),
});
```

---

### `file:save-dialog`

Show native save file dialog.

**Request**:
```typescript
interface SaveDialogRequest {
  title?: string;
  defaultPath?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
}
```

**Response**:
```typescript
interface SaveDialogResponse {
  canceled: boolean;
  filePath: string | null;
}

type SaveDialogResult = IPCResponse<SaveDialogResponse>;
```

**Validation**:
```typescript
const SaveDialogSchema = z.object({
  title: z.string().optional(),
  defaultPath: z.string().optional(),
  filters: z.array(z.object({
    name: z.string(),
    extensions: z.array(z.string()),
  })).optional(),
});
```

---

## Channel: `app`

### `app:get-version`

Get application version.

**Request**: None

**Response**:
```typescript
interface AppVersionResponse {
  version: string; // Semantic version
  electronVersion: string;
  nodeVersion: string;
}

type AppVersionResult = IPCResponse<AppVersionResponse>;
```

---

### `app:set-title`

Set window title.

**Request**:
```typescript
interface SetTitleRequest {
  title: string;
}
```

**Response**:
```typescript
type SetTitleResponse = IPCResponse<{ success: true }>;
```

**Validation**:
```typescript
const SetTitleSchema = z.object({
  title: z.string().min(1).max(255),
});
```

---

## Implementation Example

### Preload Script

```typescript
// src/main/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

const electronAPI = {
  projects: {
    listRecent: (req: ListRecentProjectsRequest) =>
      ipcRenderer.invoke('projects:list-recent', req),
    create: (req: CreateProjectRequest) =>
      ipcRenderer.invoke('projects:create', req),
    load: (req: LoadProjectRequest) =>
      ipcRenderer.invoke('projects:load', req),
    save: (req: SaveProjectRequest) =>
      ipcRenderer.invoke('projects:save', req),
    delete: (req: DeleteProjectRequest) =>
      ipcRenderer.invoke('projects:delete', req),
  },
  themes: {
    list: (req: ListThemesRequest) =>
      ipcRenderer.invoke('themes:list', req),
    get: (req: GetThemeRequest) =>
      ipcRenderer.invoke('themes:get', req),
    create: (req: CreateThemeRequest) =>
      ipcRenderer.invoke('themes:create', req),
    update: (req: UpdateThemeRequest) =>
      ipcRenderer.invoke('themes:update', req),
    delete: (req: DeleteThemeRequest) =>
      ipcRenderer.invoke('themes:delete', req),
  },
  // ... other channels
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
```

### Main Process Handler

```typescript
// src/main/ipc/projects.ts
import { ipcMain } from 'electron';
import { prisma } from '../database';

ipcMain.handle('projects:list-recent', async (event, req) => {
  try {
    // Validate with Zod
    const validated = ListRecentProjectsSchema.parse(req);
    
    // Query database
    const projects = await prisma.recentProject.findMany({
      take: validated.limit ?? 10,
      orderBy: { position: 'asc' },
      include: { project: { include: { theme: true } } },
    });
    
    return {
      success: true,
      data: projects.map(rp => ({
        id: rp.project.id,
        name: rp.project.name,
        filePath: rp.project.filePath,
        themeName: rp.project.theme?.name ?? null,
        lastOpenedAt: rp.project.lastOpenedAt.toISOString(),
        hasCoverPage: rp.project.hasCoverPage,
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message,
      },
    };
  }
});
```

### Renderer Usage

```typescript
// src/renderer/hooks/useRecentProjects.ts
export function useRecentProjects() {
  const [projects, setProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadRecent() {
      const result = await window.electronAPI.projects.listRecent({ limit: 10 });
      
      if (result.success) {
        setProjects(result.data);
      } else {
        console.error('Failed to load recent projects:', result.error);
      }
      
      setLoading(false);
    }
    
    loadRecent();
  }, []);
  
  return { projects, loading };
}
```

---

## Security Considerations

1. **Path Validation**: All file paths validated as absolute paths before file system access
2. **SQL Injection**: Prisma ORM prevents SQL injection
3. **Input Sanitization**: Zod schemas reject malformed input at IPC boundary
4. **File Size Limits**: Enforced before processing (max 10MB for images)
5. **No Dynamic Channels**: All IPC channels defined statically, no runtime registration

---

## Testing Strategy

1. **Unit Tests**: Test Zod schemas validate/reject correctly
2. **Integration Tests**: Test IPC round-trip (renderer → main → renderer)
3. **E2E Tests**: Test full workflows through Playwright

---

## Performance Considerations

1. **Async Operations**: All IPC handlers use async/await for non-blocking
2. **Progress Reporting**: Long operations (PDF generation) emit progress events
3. **Batch Operations**: Prefer batch APIs over multiple individual calls
4. **Caching**: Font cache checks avoid redundant network requests

---

## Next Steps

1. Implement TypeScript interfaces in `src/shared/types/ipc-contracts.ts`
2. Implement Zod schemas in `src/shared/validation/schemas.ts`
3. Implement IPC handlers in `src/main/ipc/` (one file per channel)
4. Implement preload script with contextBridge
5. Create React hooks for IPC calls in renderer
