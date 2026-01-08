/**
 * IPC Handlers Registration
 * This file registers all IPC handlers for communication between renderer and main process
 */

import path from "node:path";
// Import validation schemas
import {
	createProjectSchema,
	createThemeSchema,
	deleteFileSchema,
	deleteProjectSchema,
	deleteThemeSchema,
	exportDocxSchema,
	exportPDFSchema,
	fileExistsSchema,
	getAppPathSchema,
	getAppVersionSchema,
	getThemeSchema,
	listRecentProjectsSchema,
	listThemesSchema,
	loadProjectSchema,
	previewPDFSchema,
	readFileSchema,
	saveFileDialogSchema,
	saveMermaidImageSchema,
	saveProjectSchema,
	selectFileSchema,
	updateThemeSchema,
	writeFileSchema,
} from "@shared/validation/schemas.js";
import { ipcMain, shell } from "electron";
import { z } from "zod";
// Import database client
import { prisma } from "../database/client.js";

// Import services
import * as appData from "../services/app-data.js";
import * as fileSystem from "../services/file-system.js";
import { exportDocx, generateDocx } from "../services/docx-service.js";
import {
	calculatePageBreaks,
	exportPDF,
	generatePDF,
	previewPDF,
} from "../services/pdf-service.js";
import {
	getMainWindow,
	isMainWindowMaximized,
} from "../services/window-manager.js";
import { wrapIPCHandler } from "./error-handler.js";

/**
 * Register all IPC handlers
 */
export function registerIPCHandlers(): void {
	// ==================== Projects Channel ====================

	/**
	 * Create a new project
	 */
	ipcMain.handle(
		"projects:create",
		wrapIPCHandler(async (args) => {
			const { name, filePath, themeId, subtitle } =
				createProjectSchema.parse(args);

			console.log("📝 Creating project with subtitle:", subtitle);

			// Validate file path is in app data directory
			if (!appData.isPathInProjects(filePath)) {
				throw new Error("Project file must be in the projects directory");
			}

			// Ensure file has .inkpot extension
			const validFilePath = fileSystem.ensureExtension(filePath, ".inkpot");

			// Check if file already exists
			if (await fileSystem.fileExists(validFilePath)) {
				throw new Error(`Project file already exists: ${validFilePath}`);
			}

			// Validate theme exists if provided
			if (themeId) {
				const theme = await prisma.theme.findUnique({ where: { id: themeId } });
				if (!theme) {
					throw new Error(`Theme not found: ${themeId}`);
				}
			}

			// Create project in database
			const project = await prisma.project.create({
				data: {
					name,
					filePath: validFilePath,
					themeId,
					coverSubtitle: subtitle,
				},
				include: { theme: true },
			});

			console.log(
				"✅ Project created with coverSubtitle:",
				project.coverSubtitle,
			);

			// Create empty project file
			const projectData = {
				id: project.id,
				name: project.name,
				content: "", // Empty markdown content for new project
				createdAt: project.createdAt.toISOString(),
				updatedAt: project.updatedAt.toISOString(),
			};

			await fileSystem.writeFile(
				validFilePath,
				JSON.stringify(projectData, null, 2),
			);

			// Add to recent projects
			await prisma.recentProject.create({
				data: {
					projectId: project.id,
					position: 0,
				},
			});

			// Update positions of other recent projects
			await prisma.$executeRaw`
				UPDATE RecentProject 
				SET position = position + 1 
				WHERE projectId != ${project.id}
			`;

			return {
				project: {
					id: project.id,
					name: project.name,
					filePath: project.filePath,
					themeId: project.themeId,
					themeName: project.theme?.name ?? null,
					createdAt: project.createdAt.toISOString(),
					updatedAt: project.updatedAt.toISOString(),
				},
			};
		}),
	);

	/**
	 * Load project from file
	 */
	ipcMain.handle(
		"projects:load",
		wrapIPCHandler(async (args) => {
			const { filePath } = loadProjectSchema.parse(args);

			// Read project file
			const fileContent = await fileSystem.readFile(filePath);
			const projectData = JSON.parse(fileContent);

			// Get or create project in database
			let project = await prisma.project.findFirst({
				where: { filePath },
				include: { theme: true },
			});

			if (!project) {
				// Create project record if it doesn't exist
				project = await prisma.project.create({
					data: {
						id: projectData.id,
						name: projectData.name || "Untitled Project",
						filePath,
					},
					include: { theme: true },
				});
			}

			// Update recent projects
			const recentProject = await prisma.recentProject.findUnique({
				where: { projectId: project.id },
			});

			if (recentProject) {
				// Update accessed time and move to top
				await prisma.recentProject.update({
					where: { projectId: project.id },
					data: { position: 0, accessedAt: new Date() },
				});

				// Increment positions of other recent projects
				await prisma.$executeRaw`
					UPDATE RecentProject 
					SET position = position + 1 
					WHERE projectId != ${project.id}
				`;
			} else {
				// Add to recent projects
				await prisma.recentProject.create({
					data: { projectId: project.id, position: 0 },
				});

				// Increment positions of other recent projects
				await prisma.$executeRaw`
					UPDATE RecentProject 
					SET position = position + 1 
					WHERE projectId != ${project.id}
				`;
			}

			return {
				project: {
					id: project.id,
					name: project.name,
					filePath: project.filePath,
					content: projectData.content || "",
					themeId: project.themeId,
					themeName: project.theme?.name ?? null,
					coverTitle: project.coverTitle,
					coverSubtitle: project.coverSubtitle,
					coverAuthor: project.coverAuthor,
					coverDate: project.coverDate,
					coverTemplateId: project.coverTemplateId,
					hasToc: project.hasToc,
					tocMinLevel: project.tocMinLevel,
					tocMaxLevel: project.tocMaxLevel,
					createdAt: project.createdAt.toISOString(),
					updatedAt: project.updatedAt.toISOString(),
				},
			};
		}),
	);

	/**
	 * Save project to file
	 */
	ipcMain.handle(
		"projects:save",
		wrapIPCHandler(async (args) => {
			const { id, content, themeId, coverPage, toc } = saveProjectSchema.parse(args);

			// Get project
			const project = await prisma.project.findUnique({
				where: { id },
				include: { theme: true },
			});

			if (!project) {
				throw new Error(`Project not found: ${id}`);
			}

			// Validate theme if provided
			if (themeId) {
				const theme = await prisma.theme.findUnique({ where: { id: themeId } });
				if (!theme) {
					throw new Error(`Theme not found: ${themeId}`);
				}
			}

			// Update project metadata in database
			const updates: {
				themeId?: string;
				hasCoverPage?: boolean;
				coverTitle?: string | null;
				coverSubtitle?: string | null;
				coverAuthor?: string | null;
				coverDate?: string | null;
				coverTemplateId?: string | null;
				hasToc?: boolean;
				tocMinLevel?: number;
				tocMaxLevel?: number;
			} = {};

			if (themeId !== undefined) {
				updates.themeId = themeId;
			}

			if (coverPage) {
				if (coverPage.enabled !== undefined) {
					updates.hasCoverPage = coverPage.enabled;
				}
				if (coverPage.title !== undefined) {
					updates.coverTitle = coverPage.title;
				}
				if (coverPage.subtitle !== undefined) {
					updates.coverSubtitle = coverPage.subtitle;
				}
				if (coverPage.author !== undefined) {
					updates.coverAuthor = coverPage.author;
				}
				if (coverPage.date !== undefined) {
					updates.coverDate = coverPage.date;
				}
				if (coverPage.templateId !== undefined) {
					updates.coverTemplateId = coverPage.templateId;
				}
			}

			if (toc) {
				if (toc.enabled !== undefined) {
					updates.hasToc = toc.enabled;
				}
				if (toc.minLevel !== undefined) {
					updates.tocMinLevel = toc.minLevel;
				}
				if (toc.maxLevel !== undefined) {
					updates.tocMaxLevel = toc.maxLevel;
				}
			}

			const updatedProject = await prisma.project.update({
				where: { id },
				data: updates,
				include: { theme: true },
			});

			// Save content to file
			const projectData = {
				id: updatedProject.id,
				name: updatedProject.name,
				content,
				createdAt: updatedProject.createdAt.toISOString(),
				updatedAt: updatedProject.updatedAt.toISOString(),
			};

			await fileSystem.writeFile(
				updatedProject.filePath,
				JSON.stringify(projectData, null, 2),
			);

			return {
				project: {
					id: updatedProject.id,
					name: updatedProject.name,
					filePath: updatedProject.filePath,
					themeId: updatedProject.themeId,
					themeName: updatedProject.theme?.name ?? null,
					coverTitle: updatedProject.coverTitle,
					coverSubtitle: updatedProject.coverSubtitle,
					coverAuthor: updatedProject.coverAuthor,
					coverDate: updatedProject.coverDate,
					coverTemplateId: updatedProject.coverTemplateId,
					createdAt: updatedProject.createdAt.toISOString(),
					updatedAt: updatedProject.updatedAt.toISOString(),
				},
			};
		}),
	);

	/**
	 * Rename project
	 */
	ipcMain.handle(
		"projects:rename",
		wrapIPCHandler(async (args) => {
			const { id, name } = z
				.object({
					id: z.string().uuid(),
					name: z.string().min(1),
				})
				.parse(args);

			// Get project
			const project = await prisma.project.findUnique({ where: { id } });
			if (!project) {
				throw new Error(`Project not found: ${id}`);
			}

			// Update project name in database
			const updatedProject = await prisma.project.update({
				where: { id },
				data: { name },
			});

			// Update name in the file content
			const fileContent = await fileSystem.readFile(project.filePath);
			const projectData = JSON.parse(fileContent);
			projectData.name = name;
			projectData.updatedAt = updatedProject.updatedAt.toISOString();

			await fileSystem.writeFile(
				project.filePath,
				JSON.stringify(projectData, null, 2),
			);

			return {
				project: {
					id: updatedProject.id,
					name: updatedProject.name,
					filePath: updatedProject.filePath,
					updatedAt: updatedProject.updatedAt.toISOString(),
				},
			};
		}),
	);

	/**
	 * Delete project
	 */
	ipcMain.handle(
		"projects:delete",
		wrapIPCHandler(async (args) => {
			const { id, deleteFile } = deleteProjectSchema.parse(args);

			// Get project
			const project = await prisma.project.findUnique({ where: { id } });
			if (!project) {
				throw new Error(`Project not found: ${id}`);
			}

			// Delete project file if requested
			if (deleteFile && (await fileSystem.fileExists(project.filePath))) {
				await fileSystem.deleteFile(project.filePath);
			}

			// Delete from recent projects
			await prisma.recentProject.deleteMany({
				where: { projectId: id },
			});

			// Delete project from database
			await prisma.project.delete({ where: { id } });

			return { success: true };
		}),
	);

	/**
	 * List recent projects
	 */
	ipcMain.handle(
		"projects:list-recent",
		wrapIPCHandler(async (args) => {
			const { limit = 20 } = listRecentProjectsSchema.parse(args);

			// Get recent project IDs
			const recentProjectIds = await prisma.recentProject.findMany({
				take: limit,
				orderBy: { position: "asc" },
				select: { projectId: true, accessedAt: true },
			});

			// Fetch full project details
			const projects = await prisma.project.findMany({
				where: {
					id: { in: recentProjectIds.map((rp) => rp.projectId) },
				},
				include: {
					theme: true,
				},
			});

			// Map to keep order and add accessedAt
			const projectsMap = new Map(projects.map((p) => [p.id, p]));

			return {
				projects: recentProjectIds.map((rp) => {
					const project = projectsMap.get(rp.projectId);
					if (!project) {
						throw new Error(`Project not found: ${rp.projectId}`);
					}
					return {
						id: project.id,
						title: project.coverTitle ?? project.name,
						subtitle: project.coverSubtitle,
						author: project.coverAuthor,
						filePath: project.filePath,
						lastOpenedAt: rp.accessedAt.toISOString(),
						themeName: project.theme?.name ?? null,
					};
				}),
				total: await prisma.recentProject.count(),
			};
		}),
	);

	// ==================== Themes Channel ====================

	/**
	 * List all themes
	 */
	ipcMain.handle(
		"themes:list",
		wrapIPCHandler(async (args) => {
			listThemesSchema.parse(args);

			const themes = await prisma.theme.findMany({
				orderBy: [{ isBuiltIn: "desc" }, { name: "asc" }],
			});

			return themes.map((theme) => ({
				id: theme.id,
				name: theme.name,
				isBuiltIn: theme.isBuiltIn,
				headingFont: theme.headingFont,
				bodyFont: theme.bodyFont,
			}));
		}),
	);

	/**
	 * Get theme by ID
	 */
	ipcMain.handle(
		"themes:get",
		wrapIPCHandler(async (args) => {
			const { id } = getThemeSchema.parse(args);

			const theme = await prisma.theme.findUnique({
				where: { id },
			});

			if (!theme) {
				throw new Error(`Theme not found: ${id}`);
			}

			return theme;
		}),
	);

	/**
	 * Create a new theme
	 */
	ipcMain.handle(
		"themes:create",
		wrapIPCHandler(async (args) => {
			const data = createThemeSchema.parse(args);

			const theme = await prisma.theme.create({
				data: {
					...data,
					isBuiltIn: false,
				},
			});

			return {
				id: theme.id,
				name: theme.name,
				createdAt: theme.createdAt.toISOString(),
			};
		}),
	);

	/**
	 * Update an existing theme
	 */
	ipcMain.handle(
		"themes:update",
		wrapIPCHandler(async (args) => {
			const { id, updates } = updateThemeSchema.parse(args);

			// Check if theme exists and is not built-in
			const existingTheme = await prisma.theme.findUnique({
				where: { id },
			});

			if (!existingTheme) {
				throw new Error(`Theme not found: ${id}`);
			}

			if (existingTheme.isBuiltIn) {
				throw new Error("Cannot update built-in themes");
			}

			const theme = await prisma.theme.update({
				where: { id },
				data: updates,
			});

			return { theme };
		}),
	);

	/**
	 * Delete a theme
	 */
	ipcMain.handle(
		"themes:delete",
		wrapIPCHandler(async (args) => {
			const { id } = deleteThemeSchema.parse(args);

			// Check if theme exists and is not built-in
			const existingTheme = await prisma.theme.findUnique({
				where: { id },
			});

			if (!existingTheme) {
				throw new Error(`Theme not found: ${id}`);
			}

			if (existingTheme.isBuiltIn) {
				throw new Error("Cannot delete built-in themes");
			}

			await prisma.theme.delete({
				where: { id },
			});

			return { success: true };
		}),
	);

	// ==================== File Channel ====================

	/**
	 * Show open file dialog
	 */
	ipcMain.handle(
		"file:select-file",
		wrapIPCHandler(async (args) => {
			const { title, filters, defaultPath } = selectFileSchema.parse(args);

			const filePaths = await fileSystem.showOpenDialog({
				title,
				filters,
				defaultPath,
				properties: ["openFile"],
			});

			return {
				filePath: filePaths[0] ?? null,
				canceled: filePaths.length === 0,
			};
		}),
	);

	/**
	 * Show save file dialog
	 */
	ipcMain.handle(
		"file:save-dialog",
		wrapIPCHandler(async (args) => {
			const { title, defaultPath, filters } = saveFileDialogSchema.parse(args);

			const filePath = await fileSystem.showSaveDialog({
				title,
				defaultPath,
				filters,
			});

			return {
				filePath: filePath ?? null,
				canceled: !filePath,
			};
		}),
	);

	/**
	 * Read file content
	 */
	ipcMain.handle(
		"file:read",
		wrapIPCHandler(async (args) => {
			const { filePath } = readFileSchema.parse(args);

			const content = await fileSystem.readFile(filePath);

			return { content };
		}),
	);

	/**
	 * Write file content
	 */
	ipcMain.handle(
		"file:write",
		wrapIPCHandler(async (args) => {
			const { filePath, content } = writeFileSchema.parse(args);

			await fileSystem.writeFile(filePath, content);

			return { success: true };
		}),
	);

	/**
	 * Check if file exists
	 */
	ipcMain.handle(
		"file:exists",
		wrapIPCHandler(async (args) => {
			const { filePath } = fileExistsSchema.parse(args);

			const exists = await fileSystem.fileExists(filePath);

			return { exists };
		}),
	);

	/**
	 * Delete file
	 */
	ipcMain.handle(
		"file:delete",
		wrapIPCHandler(async (args) => {
			const { filePath } = deleteFileSchema.parse(args);

			await fileSystem.deleteFile(filePath);

			return { success: true };
		}),
	);

	/**
	 * Get image path and convert to data URL
	 */
	ipcMain.handle(
		"file:get-image-path",
		wrapIPCHandler(async (args) => {
			const { projectId, relativePath } = z
				.object({
					projectId: z.string().uuid(),
					relativePath: z.string(),
				})
				.parse(args);

			// Get project
			const project = await prisma.project.findUnique({
				where: { id: projectId },
			});

			if (!project) {
				throw new Error(`Project not found: ${projectId}`);
			}

			const projectPath = path.dirname(project.filePath);
			const absolutePath = path.join(projectPath, relativePath);

			// Check if file exists
			if (!(await fileSystem.fileExists(absolutePath))) {
				throw new Error(`Image file not found: ${absolutePath}`);
			}

			// Read image and convert to base64 data URL
			const fs = await import("node:fs/promises");
			const imageBuffer = await fs.readFile(absolutePath);
			const extension = path.extname(absolutePath).toLowerCase();
			const mimeTypes: { [key: string]: string } = {
				".png": "image/png",
				".jpg": "image/jpeg",
				".jpeg": "image/jpeg",
				".gif": "image/gif",
				".webp": "image/webp",
				".svg": "image/svg+xml",
			};
			const mimeType = mimeTypes[extension] || "image/png";
			const base64 = imageBuffer.toString("base64");
			const dataUrl = `data:${mimeType};base64,${base64}`;

			return {
				absolutePath,
				dataUrl,
			};
		}),
	);

	// ==================== PDF Channel ====================

	/**
	 * Preview PDF generation
	 */
	ipcMain.handle(
		"pdf:preview",
		wrapIPCHandler(async (args) => {
			console.log("📥 pdf:preview - Received args:", {
				projectId: args.projectId,
				hasContent: !!args.content,
				hasMermaidDiagrams: !!args.mermaidDiagrams,
				mermaidDiagramKeys: args.mermaidDiagrams
					? Object.keys(args.mermaidDiagrams)
					: [],
				mermaidDiagramSample: args.mermaidDiagrams
					? Object.entries(args.mermaidDiagrams)
							.slice(0, 1)
							.map(([k, v]) => ({ key: k, value: v, valueType: typeof v }))
					: [],
			});

			// Try parsing with detailed error
			let projectId: string;
			let liveContent: string | undefined;
			let mermaidDiagrams: Record<string, string> | undefined;
			let tocConfig:
				| { enabled: boolean; minLevel: number; maxLevel: number }
				| undefined;

			try {
				const parsed = previewPDFSchema.parse(args);
				projectId = parsed.projectId;
				liveContent = parsed.content;
				mermaidDiagrams = parsed.mermaidDiagrams;
				tocConfig = parsed.tocConfig;
			} catch (error) {
				console.error("❌ Validation error:", error);
				if (error instanceof Error && "issues" in error) {
					console.error("❌ Zod issues:", (error as any).issues);
				}
				throw error;
			}

			// Get project with theme
			const project = await prisma.project.findUnique({
				where: { id: projectId },
				include: { theme: true },
			});

			if (!project) {
				throw new Error(`Project not found: ${projectId}`);
			}

			// Get theme (use project theme or default to first built-in theme)
			let theme = project.theme;
			if (!theme) {
				theme = await prisma.theme.findFirst({
					where: { isBuiltIn: true },
				});
				if (!theme) {
					throw new Error("No theme available");
				}
			}

			// Use live content if provided, otherwise read from file
			let content: string;
			if (liveContent !== undefined) {
				content = liveContent;
				console.log(
					"🔍 IPC Handler - Using live content, contains mermaid:",
					content.includes("```mermaid"),
				);
			} else {
				const fileContent = await fileSystem.readFile(project.filePath);
				const projectData = JSON.parse(fileContent);
				content = projectData.content || "";
				console.log(
					"🔍 IPC Handler - Using saved content, contains mermaid:",
					content.includes("```mermaid"),
				);
			}
			console.log(
				"🔍 IPC Handler - Content (first 500 chars):",
				content.substring(0, 500),
			);

			// Get project directory for resolving image paths
			const projectDir = path.dirname(project.filePath);

			// Get cover assets if cover page is enabled
			let coverData:
				| {
						hasCoverPage: boolean;
						title?: string | null;
						subtitle?: string | null;
						author?: string | null;
						logoPath?: string | null;
						backgroundPath?: string | null;
				  }
				| undefined;
			if (project.hasCoverPage) {
				const coverAssets = await prisma.projectCoverAsset.findMany({
					where: { projectId },
				});

				const logoAsset = coverAssets.find((a) => a.assetType === "logo");
				const backgroundAsset = coverAssets.find(
					(a) => a.assetType === "background",
				);

				// Convert images to base64 data URLs for PDF generation
				let logoDataUrl: string | undefined;
				let backgroundDataUrl: string | undefined;

				if (logoAsset && (await fileSystem.fileExists(logoAsset.filePath))) {
					const fs = await import("node:fs/promises");
					const buffer = await fs.readFile(logoAsset.filePath);
					const base64 = buffer.toString("base64");
					logoDataUrl = `data:${logoAsset.mimeType};base64,${base64}`;
				}

				if (
					backgroundAsset &&
					(await fileSystem.fileExists(backgroundAsset.filePath))
				) {
					const fs = await import("node:fs/promises");
					const buffer = await fs.readFile(backgroundAsset.filePath);
					const base64 = buffer.toString("base64");
					backgroundDataUrl = `data:${backgroundAsset.mimeType};base64,${base64}`;
				}

				coverData = {
					hasCoverPage: true,
					title: project.coverTitle,
					subtitle: project.coverSubtitle,
					author: project.coverAuthor,
					logoPath: logoDataUrl,
					backgroundPath: backgroundDataUrl,
				};
			}

			// Use TOC config from args if provided, otherwise use project settings
			console.log("📑 TOC from args:", tocConfig);
			console.log("📑 Project TOC settings:", {
				hasToc: project.hasToc,
				tocMinLevel: project.tocMinLevel,
				tocMaxLevel: project.tocMaxLevel,
			});

			const finalTocConfig = tocConfig || {
				enabled: project.hasToc,
				minLevel: project.tocMinLevel,
				maxLevel: project.tocMaxLevel,
			};

			// Generate preview
			console.log(
				"🎨 Generating PDF preview with mermaidDiagrams:",
				mermaidDiagrams,
			);
			console.log("📑 Final TOC Config:", finalTocConfig);
			const pdfDataUrl = await previewPDF(
				content,
				theme,
				projectDir,
				coverData,
				mermaidDiagrams as Record<string, string> | undefined,
				finalTocConfig,
			);

			// For now, we don't have pageCount and fileSize from previewPDF
			// These would require parsing the PDF or tracking during generation
			return {
				pdfDataUrl,
				pageCount: 1, // Placeholder - would need PDF parsing to get actual count
				fileSize: Buffer.from(pdfDataUrl.split(",")[1], "base64").length,
			};
		}),
	);

	/**
	 * Export PDF
	 */
	ipcMain.handle(
		"pdf:export",
		wrapIPCHandler(async (args) => {
			const { projectId, outputPath, openAfterExport, mermaidDiagrams, tocConfig } =
				exportPDFSchema.parse(args);

			// Get project with theme
			const project = await prisma.project.findUnique({
				where: { id: projectId },
				include: { theme: true },
			});

			if (!project) {
				throw new Error(`Project not found: ${projectId}`);
			}

			// Get theme (use project theme or default to first built-in theme)
			let theme = project.theme;
			if (!theme) {
				theme = await prisma.theme.findFirst({
					where: { isBuiltIn: true },
				});
				if (!theme) {
					throw new Error("No theme available");
				}
			}

			// Read project content
			const fileContent = await fileSystem.readFile(project.filePath);
			const projectData = JSON.parse(fileContent);

			// Get project directory for resolving image paths
			const projectDir = path.dirname(project.filePath);

			// Get cover assets if cover page is enabled
			let coverData:
				| {
						hasCoverPage: boolean;
						title?: string | null;
						subtitle?: string | null;
						author?: string | null;
						logoPath?: string | null;
						backgroundPath?: string | null;
				  }
				| undefined;
			if (project.hasCoverPage) {
				const coverAssets = await prisma.projectCoverAsset.findMany({
					where: { projectId },
				});

				const logoAsset = coverAssets.find((a) => a.assetType === "logo");
				const backgroundAsset = coverAssets.find(
					(a) => a.assetType === "background",
				);

				// Convert images to base64 data URLs for PDF generation
				let logoDataUrl: string | undefined;
				let backgroundDataUrl: string | undefined;

				if (logoAsset && (await fileSystem.fileExists(logoAsset.filePath))) {
					const fs = await import("node:fs/promises");
					const buffer = await fs.readFile(logoAsset.filePath);
					const base64 = buffer.toString("base64");
					logoDataUrl = `data:${logoAsset.mimeType};base64,${base64}`;
				}

				if (
					backgroundAsset &&
					(await fileSystem.fileExists(backgroundAsset.filePath))
				) {
					const fs = await import("node:fs/promises");
					const buffer = await fs.readFile(backgroundAsset.filePath);
					const base64 = buffer.toString("base64");
					backgroundDataUrl = `data:${backgroundAsset.mimeType};base64,${base64}`;
				}

				coverData = {
					hasCoverPage: true,
					title: project.coverTitle,
					subtitle: project.coverSubtitle,
					author: project.coverAuthor,
					logoPath: logoDataUrl,
					backgroundPath: backgroundDataUrl,
				};
			}

			// Use TOC config from args if provided, otherwise use project settings
			console.log("📑 TOC from args (export):", tocConfig);
			console.log("📑 Project TOC settings (export):", {
				hasToc: project.hasToc,
				tocMinLevel: project.tocMinLevel,
				tocMaxLevel: project.tocMaxLevel,
			});

			const finalTocConfig = tocConfig || {
				enabled: project.hasToc,
				minLevel: project.tocMinLevel,
				maxLevel: project.tocMaxLevel,
			};

			console.log("📑 Final TOC Config for export:", finalTocConfig);

			// Generate PDF
			const buffer = await generatePDF(
				projectData.content || "",
				theme,
				projectDir,
				coverData,
				mermaidDiagrams as Record<string, string> | undefined,
				finalTocConfig,
			);

			// Export to file
			await exportPDF(buffer, outputPath);

			// Open file after export if requested
			if (openAfterExport) {
				await shell.openPath(outputPath);
			}

			return { success: true, filePath: outputPath };
		}),
	);

	/**
	 * Calculate page breaks for PDF
	 */
	ipcMain.handle(
		"pdf:calculate-page-breaks",
		wrapIPCHandler(async (args) => {
			// This handler receives just projectId similar to preview
			const input = args as unknown as { projectId: string };
			const { projectId } = input;

			// Get project with theme
			const project = await prisma.project.findUnique({
				where: { id: projectId },
				include: { theme: true },
			});

			if (!project) {
				throw new Error(`Project not found: ${projectId}`);
			}

			// Get theme
			let theme = project.theme;
			if (!theme) {
				theme = await prisma.theme.findFirst({
					where: { isBuiltIn: true },
				});
				if (!theme) {
					throw new Error("No theme available");
				}
			}

			// Read project content
			const fileContent = await fileSystem.readFile(project.filePath);
			const projectData = JSON.parse(fileContent);

			// Calculate page breaks
			const pageBreaks = calculatePageBreaks(projectData.content || "", theme);

			return { pageBreaks };
		}),
	);

	/**
	 * Save Mermaid diagram image
	 */
	ipcMain.handle(
		"pdf:saveMermaidImage",
		wrapIPCHandler(async (args) => {
			const { projectId, diagramCode, svgString } =
				saveMermaidImageSchema.parse(args);

			console.log(
				`🎨 Saving mermaid diagram (data length: ${svgString.length} bytes)`,
			);

			// Get project to find its directory
			const project = await prisma.project.findUnique({
				where: { id: projectId },
			});

			if (!project) {
				throw new Error(`Project not found: ${projectId}`);
			}

			const projectDir = path.dirname(project.filePath);
			const assetsDir = path.join(projectDir, ".inkpot", "diagrams");

			// Ensure assets directory exists
			await fileSystem.createDirectory(assetsDir);

			// Create a hash of the diagram code for the filename (matches renderer implementation)
			let hash = 0;
			for (let i = 0; i < diagramCode.length; i++) {
				const char = diagramCode.charCodeAt(i);
				hash = (hash << 5) - hash + char;
				hash = hash & hash; // Convert to 32bit integer
			}
			const hashString = Math.abs(hash).toString(36);
			const fileName = `mermaid-${hashString}.png`;
			const absolutePath = path.join(assetsDir, fileName);

			// Save PNG file from data URL
			// The renderer has already converted SVG to PNG to preserve foreignObject content
			const fs = await import("node:fs/promises");

			// Extract base64 data from data URL
			const base64Data = svgString.replace(/^data:image\/png;base64,/, "");
			const buffer = Buffer.from(base64Data, "base64");

			await fs.writeFile(absolutePath, buffer);

			// Get file size
			const stats = await fs.stat(absolutePath);

			console.log(
				`✅ Saved mermaid diagram: ${fileName} (${stats.size} bytes)`,
			);
			console.log(`📁 Absolute path: ${absolutePath}`);

			// Return absolute file path - Electron can load local files directly
			return {
				filePath: absolutePath,
				fileSize: stats.size,
			};
		}),
	);

	// ==================== DOCX Channel ====================

	/**
	 * Export DOCX
	 */
	ipcMain.handle(
		"docx:export",
		wrapIPCHandler(async (args) => {
			const { projectId, outputPath, openAfterExport, mermaidDiagrams } =
				exportDocxSchema.parse(args);

			// Get project for theme data
			const project = await prisma.project.findUnique({
				where: { id: projectId },
				include: { theme: true },
			});

			if (!project) {
				throw new Error(`Project not found: ${projectId}`);
			}

			// Get theme (use project theme or default to first built-in theme)
			let theme = project.theme;
			if (!theme) {
				theme = await prisma.theme.findFirst({
					where: { isBuiltIn: true },
				});
				if (!theme) {
					throw new Error("No theme available");
				}
			}

			// Read project content
			const fileContent = await fileSystem.readFile(project.filePath);
			const projectData = JSON.parse(fileContent);
			const content = projectData.content || "";

			// Get project directory for resolving image paths
			const projectDir = path.dirname(project.filePath);

			// Get cover assets if cover page is enabled
			let coverData:
				| {
						hasCoverPage: boolean;
						title?: string | null;
						subtitle?: string | null;
						author?: string | null;
						logoPath?: string | null;
						backgroundPath?: string | null;
				  }
				| undefined;
			if (project.hasCoverPage) {
				const coverAssets = await prisma.projectCoverAsset.findMany({
					where: { projectId },
				});

				const logoAsset = coverAssets.find((a) => a.assetType === "logo");
				const backgroundAsset = coverAssets.find(
					(a) => a.assetType === "background",
				);

				// Convert images to base64 data URLs for DOCX embedding
				let logoDataUrl: string | undefined;
				let backgroundDataUrl: string | undefined;

				if (logoAsset && (await fileSystem.fileExists(logoAsset.filePath))) {
					const fs = await import("node:fs/promises");
					const buffer = await fs.readFile(logoAsset.filePath);
					const base64 = buffer.toString("base64");
					logoDataUrl = `data:${logoAsset.mimeType};base64,${base64}`;
				}

				if (
					backgroundAsset &&
					(await fileSystem.fileExists(backgroundAsset.filePath))
				) {
					const fs = await import("node:fs/promises");
					const buffer = await fs.readFile(backgroundAsset.filePath);
					const base64 = buffer.toString("base64");
					backgroundDataUrl = `data:${backgroundAsset.mimeType};base64,${base64}`;
				}

				coverData = {
					hasCoverPage: true,
					title: project.coverTitle,
					subtitle: project.coverSubtitle,
					author: project.coverAuthor,
					logoPath: logoDataUrl,
					backgroundPath: backgroundDataUrl,
				};
			}

			// Get TOC configuration from project settings
			const tocConfig = {
				enabled: project.hasToc,
				minLevel: project.tocMinLevel,
				maxLevel: project.tocMaxLevel,
			};

			console.log("📑 DOCX Export - Cover data:", coverData);
			console.log("📑 DOCX Export - TOC config:", tocConfig);

			// Generate DOCX
			const docxBuffer = await generateDocx(
				content,
				theme,
				projectDir,
				mermaidDiagrams as Record<string, string> | undefined,
				coverData,
				tocConfig,
			);

			// Export DOCX
			await exportDocx(docxBuffer, outputPath);

			// Open file after export if requested
			if (openAfterExport) {
				await shell.openPath(outputPath);
			}

			return { success: true, filePath: outputPath };
		}),
	);

	// ==================== Mermaid Channel ====================

	/**
	 * Save Mermaid image
	 */
	ipcMain.handle(
		"mermaid:save-image",
		wrapIPCHandler(async (args) => {
			const { svg, filePath } = saveMermaidImageSchema.parse(args);

			await fileSystem.writeFile(filePath, svg);

			return { success: true };
		}),
	);

	// ==================== Cover Channel ====================

	/**
	 * Upload a cover asset (logo or background)
	 */
	ipcMain.handle(
		"cover:upload-asset",
		wrapIPCHandler(async (args) => {
			const {
				projectId,
				assetType,
				filePath: sourcePath,
			} = z
				.object({
					projectId: z.string().uuid(),
					assetType: z.enum(["logo", "background"]),
					filePath: z.string(),
				})
				.parse(args);

			// Get project
			const project = await prisma.project.findUnique({
				where: { id: projectId },
			});

			if (!project) {
				throw new Error(`Project not found: ${projectId}`);
			}

			// Validate source file exists
			if (!(await fileSystem.fileExists(sourcePath))) {
				throw new Error(`File not found: ${sourcePath}`);
			}

			// Get file info
			const stats = await fileSystem.getFileStats(sourcePath);
			const extension = path.extname(sourcePath).toLowerCase();

			// Validate file type
			const validExtensions = [".png", ".jpg", ".jpeg", ".svg"];
			if (!validExtensions.includes(extension)) {
				throw new Error(
					`Invalid file type. Allowed: ${validExtensions.join(", ")}`,
				);
			}

			// Validate file size (max 10MB)
			const maxSize = 10 * 1024 * 1024;
			if (stats.size > maxSize) {
				throw new Error(
					`File too large. Maximum size: ${maxSize / 1024 / 1024}MB`,
				);
			}

			// Create assets directory for project
			const projectDir = path.dirname(project.filePath);
			const assetsDir = path.join(projectDir, "assets", "cover");
			await fileSystem.createDirectory(assetsDir);

			// Generate unique filename
			const originalFileName = path.basename(sourcePath);
			const baseName = path.parse(originalFileName).name;
			const safeFileName = fileSystem.getSafeFilename(
				fileSystem.generateUniqueFilename(
					`${assetType}-${baseName}`,
					extension,
				),
			);
			const destinationPath = path.join(assetsDir, safeFileName);

			// Copy file
			const fs = await import("node:fs/promises");
			await fs.copyFile(sourcePath, destinationPath);

			// Get image dimensions if it's an image
			let width: number | null = null;
			let height: number | null = null;

			if ([".png", ".jpg", ".jpeg"].includes(extension)) {
				try {
					const fs = await import("node:fs/promises");
					const buffer = await fs.readFile(destinationPath);
					const sizeOf = (await import("image-size")).default;
					const dimensions = sizeOf(buffer);
					width = dimensions.width ?? null;
					height = dimensions.height ?? null;
				} catch (error) {
					console.warn("Failed to get image dimensions:", error);
				}
			}

			// Determine MIME type
			const mimeTypes: { [key: string]: string } = {
				".png": "image/png",
				".jpg": "image/jpeg",
				".jpeg": "image/jpeg",
				".svg": "image/svg+xml",
			};
			const mimeType = mimeTypes[extension] || "image/png";

			// Delete existing asset of this type for this project
			await prisma.projectCoverAsset.deleteMany({
				where: { projectId, assetType },
			});

			// Create database record
			const asset = await prisma.projectCoverAsset.create({
				data: {
					projectId,
					assetType,
					originalFileName,
					filePath: destinationPath,
					fileSize: stats.size,
					mimeType,
					width,
					height,
				},
			});

			return {
				id: asset.id,
				assetType: asset.assetType as "logo" | "background",
				storedPath: asset.filePath,
				originalFileName: asset.originalFileName,
				width: asset.width ?? 0,
				height: asset.height ?? 0,
				fileSize: asset.fileSize,
			};
		}),
	);

	/**
	 * Delete a cover asset
	 */
	ipcMain.handle(
		"cover:delete-asset",
		wrapIPCHandler(async (args) => {
			const { projectId, assetType } = z
				.object({
					projectId: z.string().uuid(),
					assetType: z.enum(["logo", "background"]),
				})
				.parse(args);

			// Find asset
			const asset = await prisma.projectCoverAsset.findFirst({
				where: { projectId, assetType },
			});

			if (!asset) {
				return { success: true }; // Already deleted
			}

			// Delete file if it exists
			if (await fileSystem.fileExists(asset.filePath)) {
				await fileSystem.deleteFile(asset.filePath);
			}

			// Delete database record
			await prisma.projectCoverAsset.delete({
				where: { id: asset.id },
			});

			return { success: true };
		}),
	);

	/**
	 * Get all cover assets for a project
	 */
	ipcMain.handle(
		"cover:get-assets",
		wrapIPCHandler(async (args) => {
			const { projectId } = z
				.object({
					projectId: z.string().uuid(),
				})
				.parse(args);

			const assets = await prisma.projectCoverAsset.findMany({
				where: { projectId },
			});

			return {
				assets: assets.map((asset) => ({
					id: asset.id,
					type: asset.assetType as "logo" | "background",
					filePath: asset.filePath,
					width: asset.width,
					height: asset.height,
				})),
			};
		}),
	);

	/**
	 * Update cover data (title, subtitle, author) and TOC settings
	 */
	ipcMain.handle(
		"cover:update-data",
		wrapIPCHandler(async (args) => {
			const {
				projectId,
				hasCoverPage,
				coverTitle,
				coverSubtitle,
				coverAuthor,
				hasToc,
				tocMinLevel,
				tocMaxLevel,
			} = z
				.object({
					projectId: z.string().uuid(),
					hasCoverPage: z.boolean(),
					coverTitle: z.string().nullable().optional(),
					coverSubtitle: z.string().nullable().optional(),
					coverAuthor: z.string().nullable().optional(),
					hasToc: z.boolean().optional(),
					tocMinLevel: z.number().int().min(1).max(6).optional(),
					tocMaxLevel: z.number().int().min(1).max(6).optional(),
				})
				.parse(args);

			// Update project
			await prisma.project.update({
				where: { id: projectId },
				data: {
					hasCoverPage,
					coverTitle,
					coverSubtitle,
					coverAuthor,
					...(hasToc !== undefined && { hasToc }),
					...(tocMinLevel !== undefined && { tocMinLevel }),
					...(tocMaxLevel !== undefined && { tocMaxLevel }),
				},
			});

			return { success: true };
		}),
	);

	/**
	 * Get cover asset as data URL for preview
	 */
	ipcMain.handle(
		"cover:get-asset-data-url",
		wrapIPCHandler(async (args) => {
			const { assetId } = z
				.object({
					assetId: z.string().uuid(),
				})
				.parse(args);

			// Get asset from database
			const asset = await prisma.projectCoverAsset.findUnique({
				where: { id: assetId },
			});

			if (!asset) {
				throw new Error(`Asset not found: ${assetId}`);
			}

			// Check if file exists
			if (!(await fileSystem.fileExists(asset.filePath))) {
				throw new Error(`Asset file not found: ${asset.filePath}`);
			}

			// Read file and convert to base64 data URL
			const fs = await import("node:fs/promises");
			const buffer = await fs.readFile(asset.filePath);
			const base64 = buffer.toString("base64");
			const dataUrl = `data:${asset.mimeType};base64,${base64}`;

			return { dataUrl };
		}),
	);

	// ==================== App Channel ====================

	/**
	 * Get app version
	 */
	ipcMain.handle(
		"app:version",
		wrapIPCHandler(async (args) => {
			getAppVersionSchema.parse(args);

			return {
				version: process.env.APP_VERSION ?? "0.0.0",
			};
		}),
	);

	/**
	 * Get app paths
	 */
	ipcMain.handle(
		"app:paths",
		wrapIPCHandler(async (args) => {
			getAppPathSchema.parse(args);

			return {
				appData: appData.getAppDataPath(),
				projects: appData.getProjectsPath(),
				themes: appData.getThemesPath(),
			};
		}),
	);

	/**
	 * Get main window state
	 */
	ipcMain.handle(
		"app:window-state",
		wrapIPCHandler(async (args) => {
			z.object({}).parse(args);

			const mainWindow = getMainWindow();

			return {
				isMaximized: isMainWindowMaximized(),
				bounds: mainWindow?.getBounds(),
			};
		}),
	);

	// ==================== Window Channel ====================

	/**
	 * Minimize window
	 */
	ipcMain.handle("window:minimize", () => {
		const mainWindow = getMainWindow();
		if (mainWindow && !mainWindow.isDestroyed()) {
			mainWindow.minimize();
		}
	});

	/**
	 * Maximize or restore window
	 */
	ipcMain.handle("window:maximize", () => {
		const mainWindow = getMainWindow();
		if (mainWindow && !mainWindow.isDestroyed()) {
			if (mainWindow.isMaximized()) {
				mainWindow.unmaximize();
			} else {
				mainWindow.maximize();
			}
		}
	});

	/**
	 * Close window
	 */
	ipcMain.handle("window:close", () => {
		const mainWindow = getMainWindow();
		if (mainWindow && !mainWindow.isDestroyed()) {
			mainWindow.close();
		}
	});

	/**
	 * Check if window is maximized
	 */
	ipcMain.handle("window:is-maximized", () => {
		return isMainWindowMaximized();
	});
}