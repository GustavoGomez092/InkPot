// IPC Contract Types for Electron Main <-> Renderer Communication

// ============================================================================
// GLOBAL TYPES
// ============================================================================

export interface SuccessResponse<T> {
	success: true;
	data: T;
}

export interface ErrorResponse {
	success: false;
	error: {
		code: string;
		message: string;
		details?: unknown;
	};
}

export type IPCResponse<T> = SuccessResponse<T> | ErrorResponse;

export enum IPCErrorCode {
	// General
	INVALID_INPUT = "INVALID_INPUT",
	INTERNAL_ERROR = "INTERNAL_ERROR",

	// File system
	FILE_NOT_FOUND = "FILE_NOT_FOUND",
	FILE_ALREADY_EXISTS = "FILE_ALREADY_EXISTS",
	PERMISSION_DENIED = "PERMISSION_DENIED",
	DISK_FULL = "DISK_FULL",

	// Database
	DATABASE_ERROR = "DATABASE_ERROR",
	NOT_FOUND = "NOT_FOUND",
	DUPLICATE_ENTRY = "DUPLICATE_ENTRY",

	// Network
	NETWORK_ERROR = "NETWORK_ERROR",
	FONT_DOWNLOAD_FAILED = "FONT_DOWNLOAD_FAILED",
}

// ============================================================================
// PROJECTS CHANNEL
// ============================================================================

export interface ListRecentProjectsRequest {
	limit?: number;
}

export interface RecentProject {
	id: string;
	name: string;
	filePath: string;
	themeName: string | null;
	lastOpenedAt: string;
	hasCoverPage: boolean;
}

export interface CreateProjectRequest {
	name: string;
	filePath: string;
	themeId?: string;
}

export interface CreateProjectResponse {
	id: string;
	name: string;
	filePath: string;
	themeId: string;
	createdAt: string;
}

export interface LoadProjectRequest {
	filePath: string;
}

export interface ThemeData {
	id: string;
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

export interface CoverPageData {
	enabled: boolean;
	templateId: string;
	title: string | null;
	subtitle: string | null;
	author: string | null;
	date: string | null;
}

export interface CoverAssetData {
	id: string;
	type: "logo" | "background";
	filePath: string;
	width: number | null;
	height: number | null;
}

export interface LoadProjectResponse {
	id: string;
	name: string;
	content: string;
	themeId: string;
	theme: ThemeData;
	coverPage: CoverPageData | null;
	coverAssets: CoverAssetData[];
	lastOpenedAt: string;
}

export interface SaveProjectRequest {
	id: string;
	content: string;
	themeId?: string;
	coverPage?: Partial<CoverPageData>;
}

export interface SaveProjectResponse {
	success: true;
	savedAt: string;
	filePath: string;
}

export interface DeleteProjectRequest {
	id: string;
	deleteFile: boolean;
}

// ============================================================================
// THEMES CHANNEL
// ============================================================================

export interface ListThemesRequest {
	includeBuiltIn?: boolean;
}

export interface ThemeSummary {
	id: string;
	name: string;
	isBuiltIn: boolean;
	headingFont: string;
	bodyFont: string;
}

export interface GetThemeRequest {
	id: string;
}

export interface CreateThemeRequest {
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

export interface CreateThemeResponse {
	id: string;
	name: string;
	createdAt: string;
}

export interface UpdateThemeRequest {
	id: string;
	updates: Partial<Omit<CreateThemeRequest, "name">>;
}

export interface DeleteThemeRequest {
	id: string;
}

// ============================================================================
// FONTS CHANNEL
// ============================================================================

export interface SearchFontsRequest {
	query: string;
	limit?: number;
}

export interface FontResult {
	family: string;
	category: "serif" | "sans-serif" | "display" | "handwriting" | "monospace";
	variants: string[];
	subsets: string[];
}

export interface DownloadFontRequest {
	family: string;
	variants?: string[];
}

export interface DownloadFontResponse {
	family: string;
	cachedPath: string;
	fileSize: number;
}

export interface IsFontCachedRequest {
	family: string;
}

export interface IsFontCachedResponse {
	isCached: boolean;
	cachedPath: string | null;
}

// ============================================================================
// PDF CHANNEL
// ============================================================================

export interface PreviewPDFRequest {
	projectId: string;
}

export interface PreviewPDFResponse {
	pdfDataUrl: string;
	pageCount: number;
	fileSize: number;
}

export interface ExportPDFRequest {
	projectId: string;
	outputPath: string;
}

export interface ExportPDFResponse {
	filePath: string;
	fileSize: number;
	pageCount: number;
}

export interface CalculatePageBreaksRequest {
	content: string;
	themeId: string;
}

export interface PageBreak {
	nodeIndex: number;
	estimatedPageNumber: number;
	characterOffset: number;
}

// ============================================================================
// COVER CHANNEL
// ============================================================================

export interface ListCoverTemplatesRequest {
	includeBuiltIn?: boolean;
}

export interface CoverTemplateSummary {
	id: string;
	name: string;
	isBuiltIn: boolean;
	hasLogoSlot: boolean;
	hasBackgroundSlot: boolean;
}

export interface UploadCoverAssetRequest {
	projectId: string;
	assetType: "logo" | "background";
	filePath: string;
}

export interface UploadCoverAssetResponse {
	id: string;
	assetType: "logo" | "background";
	storedPath: string;
	originalFileName: string;
	width: number;
	height: number;
	fileSize: number;
}

// ============================================================================
// FILE CHANNEL
// ============================================================================

export interface OpenDialogRequest {
	title?: string;
	defaultPath?: string;
	filters?: Array<{ name: string; extensions: string[] }>;
	properties?: Array<"openFile" | "openDirectory" | "multiSelections">;
}

export interface OpenDialogResponse {
	canceled: boolean;
	filePaths: string[];
}

export interface SaveDialogRequest {
	title?: string;
	defaultPath?: string;
	filters?: Array<{ name: string; extensions: string[] }>;
}

export interface SaveDialogResponse {
	canceled: boolean;
	filePath: string | null;
}

export interface SelectFileRequest {
	title?: string;
	defaultPath?: string;
	filters?: Array<{ name: string; extensions: string[] }>;
}

export interface SelectFileResponse {
	canceled: boolean;
	filePath: string | null;
}

export interface ReadFileRequest {
	filePath: string;
	encoding?: string;
}

export interface ReadFileResponse {
	content: string;
}

export interface WriteFileRequest {
	filePath: string;
	content: string;
	encoding?: string;
}

export interface DeleteFileRequest {
	filePath: string;
}

export interface FileExistsRequest {
	filePath: string;
}

export interface FileExistsResponse {
	exists: boolean;
}

// ============================================================================
// APP CHANNEL
// ============================================================================

export interface AppVersionResponse {
	version: string;
	name: string;
}

export interface GetAppPathRequest {
	name?: string;
}

export interface AppPathsResponse {
	appData: string;
	projects: string;
	themes: string;
	fonts: string;
	home: string;
	desktop: string;
	documents: string;
	downloads: string;
}

// ============================================================================
// ELECTRON API (Exposed to Renderer via contextBridge)
// ============================================================================

export interface ElectronAPI {
	projects: {
		listRecent: (
			req: ListRecentProjectsRequest,
		) => Promise<IPCResponse<RecentProject[]>>;
		create: (
			req: CreateProjectRequest,
		) => Promise<IPCResponse<CreateProjectResponse>>;
		load: (
			req: LoadProjectRequest,
		) => Promise<IPCResponse<LoadProjectResponse>>;
		save: (
			req: SaveProjectRequest,
		) => Promise<IPCResponse<SaveProjectResponse>>;
		delete: (
			req: DeleteProjectRequest,
		) => Promise<IPCResponse<{ success: true }>>;
	};
	themes: {
		list: (req: ListThemesRequest) => Promise<IPCResponse<ThemeSummary[]>>;
		get: (req: GetThemeRequest) => Promise<IPCResponse<ThemeData>>;
		create: (
			req: CreateThemeRequest,
		) => Promise<IPCResponse<CreateThemeResponse>>;
		update: (req: UpdateThemeRequest) => Promise<IPCResponse<ThemeData>>;
		delete: (
			req: DeleteThemeRequest,
		) => Promise<IPCResponse<{ success: true }>>;
	};
	fonts: {
		search: (req: SearchFontsRequest) => Promise<IPCResponse<FontResult[]>>;
		download: (
			req: DownloadFontRequest,
		) => Promise<IPCResponse<DownloadFontResponse>>;
		isCached: (
			req: IsFontCachedRequest,
		) => Promise<IPCResponse<IsFontCachedResponse>>;
	};
	pdf: {
		preview: (
			req: PreviewPDFRequest,
		) => Promise<IPCResponse<PreviewPDFResponse>>;
		export: (req: ExportPDFRequest) => Promise<IPCResponse<ExportPDFResponse>>;
		calculatePageBreaks: (
			req: CalculatePageBreaksRequest,
		) => Promise<IPCResponse<PageBreak[]>>;
	};
	cover: {
		listTemplates: (
			req: ListCoverTemplatesRequest,
		) => Promise<IPCResponse<CoverTemplateSummary[]>>;
		uploadAsset: (
			req: UploadCoverAssetRequest,
		) => Promise<IPCResponse<UploadCoverAssetResponse>>;
	};
	file: {
		selectFile: (
			req: SelectFileRequest,
		) => Promise<IPCResponse<SelectFileResponse>>;
		saveDialog: (
			req: SaveDialogRequest,
		) => Promise<IPCResponse<SaveDialogResponse>>;
		read: (req: ReadFileRequest) => Promise<IPCResponse<ReadFileResponse>>;
		write: (req: WriteFileRequest) => Promise<IPCResponse<{ success: true }>>;
		delete: (req: DeleteFileRequest) => Promise<IPCResponse<{ success: true }>>;
		exists: (
			req: FileExistsRequest,
		) => Promise<IPCResponse<FileExistsResponse>>;
	};
	app: {
		version: () => Promise<IPCResponse<AppVersionResponse>>;
		paths: (req: GetAppPathRequest) => Promise<IPCResponse<AppPathsResponse>>;
	};
}

declare global {
	interface Window {
		electronAPI: ElectronAPI;
	}
}
