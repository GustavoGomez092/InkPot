// Zod Validation Schemas for IPC Requests
// These schemas validate data sent between renderer and main processes

import { z } from "zod";

// ============================================================================
// SHARED SCHEMAS
// ============================================================================

const uuidSchema = z.string().uuid();
const filePathSchema = z.string().min(1);
const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

// ============================================================================
// PROJECTS CHANNEL SCHEMAS
// ============================================================================

export const listRecentProjectsSchema = z.object({
	limit: z.number().int().positive().max(100).optional(),
});

export const createProjectSchema = z.object({
	name: z.string().min(1).max(255),
	filePath: filePathSchema,
	themeId: uuidSchema.optional(),
	subtitle: z.string().max(500).optional(),
});

export const loadProjectSchema = z.object({
	filePath: filePathSchema,
});

export const saveProjectSchema = z.object({
	id: uuidSchema,
	content: z.string(),
	themeId: uuidSchema.optional(),
	coverPage: z
		.object({
			enabled: z.boolean().optional(),
			templateId: z.string().optional(),
			title: z.string().nullable().optional(),
			subtitle: z.string().nullable().optional(),
			author: z.string().nullable().optional(),
			date: z.string().nullable().optional(),
		})
		.optional(),
	toc: z
		.object({
			enabled: z.boolean().optional(),
			minLevel: z.number().int().min(1).max(6).optional(),
			maxLevel: z.number().int().min(1).max(6).optional(),
		})
		.optional(),
});

export const deleteProjectSchema = z.object({
	id: uuidSchema,
	deleteFile: z.boolean(),
});

// ============================================================================
// THEMES CHANNEL SCHEMAS
// ============================================================================

export const listThemesSchema = z.object({
	includeBuiltIn: z.boolean().optional(),
});

export const getThemeSchema = z.object({
	id: uuidSchema,
});

export const createThemeSchema = z.object({
	name: z.string().min(1).max(100),
	headingFont: z.string().min(1),
	bodyFont: z.string().min(1),
	h1Size: z.number().positive().max(200),
	h2Size: z.number().positive().max(200),
	h3Size: z.number().positive().max(200),
	h4Size: z.number().positive().max(200),
	h5Size: z.number().positive().max(200),
	h6Size: z.number().positive().max(200),
	bodySize: z.number().positive().max(200),
	kerning: z.number().min(-1).max(1),
	leading: z.number().positive().max(5),
	pageWidth: z.number().positive().max(50),
	pageHeight: z.number().positive().max(50),
	marginTop: z.number().nonnegative().max(10),
	marginBottom: z.number().nonnegative().max(10),
	marginLeft: z.number().nonnegative().max(10),
	marginRight: z.number().nonnegative().max(10),
	backgroundColor: hexColorSchema,
	textColor: hexColorSchema,
	headingColor: hexColorSchema,
	linkColor: hexColorSchema,
	linkUnderline: z.boolean().default(true),
	codeBackground: hexColorSchema,
});

export const updateThemeSchema = z.object({
	id: uuidSchema,
	updates: createThemeSchema.omit({ name: true }).partial(),
});

export const deleteThemeSchema = z.object({
	id: uuidSchema,
});

// ============================================================================
// FONTS CHANNEL SCHEMAS
// ============================================================================

export const searchFontsSchema = z.object({
	query: z.string().min(1).max(100),
	limit: z.number().int().positive().max(100).optional(),
});

export const downloadFontSchema = z.object({
	family: z.string().min(1),
	variants: z.array(z.string()).optional(),
});

export const isFontCachedSchema = z.object({
	family: z.string().min(1),
});

// ============================================================================
// PDF CHANNEL SCHEMAS
// ============================================================================

export const saveMermaidImageSchema = z.object({
	projectId: uuidSchema,
	diagramCode: z.string(),
	svgString: z.string(), // SVG will be converted to PNG in main process
});

export const exportPDFSchema = z.object({
	projectId: uuidSchema,
	outputPath: filePathSchema,
	openAfterExport: z.boolean().optional(),
	mermaidDiagrams: z.record(z.string(), z.string()).optional(), // Map of diagram code -> file path
	tocConfig: z
		.object({
			enabled: z.boolean(),
			minLevel: z.number().int().min(1).max(6),
			maxLevel: z.number().int().min(1).max(6),
		})
		.optional(),
});

export const previewPDFSchema = z.object({
	projectId: uuidSchema,
	content: z.string().optional(), // Optional live content for real-time preview
	mermaidDiagrams: z.record(z.string(), z.string()).optional(), // Map of diagram code -> file path
	tocConfig: z
		.object({
			enabled: z.boolean(),
			minLevel: z.number().int().min(1).max(6),
			maxLevel: z.number().int().min(1).max(6),
		})
		.optional(),
});

// ============================================================================
// DOCX CHANNEL SCHEMAS
// ============================================================================

export const exportDocxSchema = z.object({
	projectId: uuidSchema,
	outputPath: filePathSchema,
	openAfterExport: z.boolean().optional(),
	mermaidDiagrams: z.record(z.string(), z.string()).optional(), // Map of diagram code -> file path
});

// ============================================================================
// COVER CHANNEL SCHEMAS
// ============================================================================

export const listCoverTemplatesSchema = z.object({
	includeBuiltIn: z.boolean().optional(),
});

export const getCoverTemplateSchema = z.object({
	id: uuidSchema,
});

export const createCoverTemplateSchema = z.object({
	name: z.string().min(1).max(100),
	layoutJson: z.string().min(1),
	hasLogoSlot: z.boolean(),
	hasBackgroundSlot: z.boolean(),
});

export const updateCoverTemplateSchema = z.object({
	id: uuidSchema,
	updates: createCoverTemplateSchema.omit({ name: true }).partial(),
});

export const deleteCoverTemplateSchema = z.object({
	id: uuidSchema,
});

export const uploadCoverAssetSchema = z.object({
	projectId: uuidSchema,
	assetType: z.enum(["logo", "background"]),
	filePath: filePathSchema,
});

export const deleteCoverAssetSchema = z.object({
	projectId: uuidSchema,
	assetId: uuidSchema,
});

// ============================================================================
// FILE CHANNEL SCHEMAS
// ============================================================================

export const selectFileSchema = z.object({
	title: z.string().optional(),
	filters: z
		.array(
			z.object({
				name: z.string(),
				extensions: z.array(z.string()),
			}),
		)
		.optional(),
	defaultPath: z.string().optional(),
});

export const selectDirectorySchema = z.object({
	title: z.string().optional(),
	defaultPath: z.string().optional(),
});

export const saveFileDialogSchema = z.object({
	title: z.string().optional(),
	defaultPath: z.string().optional(),
	filters: z
		.array(
			z.object({
				name: z.string(),
				extensions: z.array(z.string()),
			}),
		)
		.optional(),
});

export const readFileSchema = z.object({
	filePath: filePathSchema,
	encoding: z.enum(["utf-8", "utf8", "base64", "binary"]).optional(),
});

export const writeFileSchema = z.object({
	filePath: filePathSchema,
	content: z.string(),
	encoding: z.enum(["utf-8", "utf8", "base64", "binary"]).optional(),
});

export const deleteFileSchema = z.object({
	filePath: filePathSchema,
});

export const fileExistsSchema = z.object({
	filePath: filePathSchema,
});

export const saveImageSchema = z.object({
	projectId: uuidSchema,
	imageDataUrl: z.string().min(1), // base64 data URL
	fileName: z.string().optional(),
});

export const getProjectAssetsPathSchema = z.object({
	projectId: uuidSchema,
});

// ============================================================================
// APP CHANNEL SCHEMAS
// ============================================================================

export const getAppVersionSchema = z.object({});

export const getAppPathSchema = z.object({
	// Empty object - this endpoint returns all paths at once
});

export const openExternalSchema = z.object({
	url: z.string().url(),
});

export const showItemInFolderSchema = z.object({
	filePath: filePathSchema,
});

// ============================================================================
// TYPE EXPORTS FOR INFERENCE
// ============================================================================

export type ListRecentProjectsInput = z.infer<typeof listRecentProjectsSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type LoadProjectInput = z.infer<typeof loadProjectSchema>;
export type SaveProjectInput = z.infer<typeof saveProjectSchema>;
export type DeleteProjectInput = z.infer<typeof deleteProjectSchema>;

export type ListThemesInput = z.infer<typeof listThemesSchema>;
export type GetThemeInput = z.infer<typeof getThemeSchema>;
export type CreateThemeInput = z.infer<typeof createThemeSchema>;
export type UpdateThemeInput = z.infer<typeof updateThemeSchema>;
export type DeleteThemeInput = z.infer<typeof deleteThemeSchema>;

export type SearchFontsInput = z.infer<typeof searchFontsSchema>;
export type DownloadFontInput = z.infer<typeof downloadFontSchema>;
export type IsFontCachedInput = z.infer<typeof isFontCachedSchema>;

export type SaveMermaidImageInput = z.infer<typeof saveMermaidImageSchema>;
export type ExportPDFInput = z.infer<typeof exportPDFSchema>;
export type PreviewPDFInput = z.infer<typeof previewPDFSchema>;

export type ExportDocxInput = z.infer<typeof exportDocxSchema>;

export type ListCoverTemplatesInput = z.infer<typeof listCoverTemplatesSchema>;
export type GetCoverTemplateInput = z.infer<typeof getCoverTemplateSchema>;
export type CreateCoverTemplateInput = z.infer<
	typeof createCoverTemplateSchema
>;
export type UpdateCoverTemplateInput = z.infer<
	typeof updateCoverTemplateSchema
>;
export type DeleteCoverTemplateInput = z.infer<
	typeof deleteCoverTemplateSchema
>;
export type UploadCoverAssetInput = z.infer<typeof uploadCoverAssetSchema>;
export type DeleteCoverAssetInput = z.infer<typeof deleteCoverAssetSchema>;

export type SelectFileInput = z.infer<typeof selectFileSchema>;
export type SelectDirectoryInput = z.infer<typeof selectDirectorySchema>;
export type SaveFileDialogInput = z.infer<typeof saveFileDialogSchema>;
export type ReadFileInput = z.infer<typeof readFileSchema>;
export type WriteFileInput = z.infer<typeof writeFileSchema>;
export type DeleteFileInput = z.infer<typeof deleteFileSchema>;
export type FileExistsInput = z.infer<typeof fileExistsSchema>;
export type SaveImageInput = z.infer<typeof saveImageSchema>;
export type GetProjectAssetsPathInput = z.infer<
	typeof getProjectAssetsPathSchema
>;

export type GetAppVersionInput = z.infer<typeof getAppVersionSchema>;
export type GetAppPathInput = z.infer<typeof getAppPathSchema>;
export type OpenExternalInput = z.infer<typeof openExternalSchema>;
export type ShowItemInFolderInput = z.infer<typeof showItemInFolderSchema>;