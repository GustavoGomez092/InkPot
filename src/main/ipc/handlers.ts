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
	 * Read file
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
	 * Write file
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
	 * Get app path
	 */
	ipcMain.handle(
		"app:get-path",
		wrapIPCHandler(async (args) => {
			const { name } = getAppPathSchema.parse(args);

			const appPath = appData.getAppPath(name);

			return { path: appPath };
		}),
	);

	/**
	 * Get app version
	 */
	ipcMain.handle(
		"app:get-version",
		wrapIPCHandler(async (args) => {
			getAppVersionSchema.parse(args);

			const version = appData.getAppVersion();

			return { version };
		}),
	);

	// ==================== PDF Channel ====================

	/**
	 * Generate PDF for preview
	 */
	ipcMain.handle(
		"pdf:preview",
		wrapIPCHandler(async (args) => {
			const { projectId, content, themeId, coverPage, toc } =
				previewPDFSchema.parse(args);

			const theme = themeId
				? await prisma.theme.findUnique({
						where: { id: themeId },
				  })
				: null;

			const pdf = await generatePDF(content, {
				theme: theme ?? undefined,
				coverPage: coverPage ?? undefined,
				toc: toc ?? undefined,
			});

			return { pdf: pdf.toString("base64") };
		}),
	);

	/**
	 * Calculate page breaks
	 */
	ipcMain.handle(
		"pdf:calculate-page-breaks",
		wrapIPCHandler(async (args) => {
			const { content } = z.object({ content: z.string() }).parse(args);

			const pageBreaks = calculatePageBreaks(content);

			return { pageBreaks };
		}),
	);

	/**
	 * Export PDF
	 */
	ipcMain.handle(
		"pdf:export",
		wrapIPCHandler(async (args) => {
			const { projectId, content, filePath, themeId, coverPage, toc } =
				exportPDFSchema.parse(args);

			const theme = themeId
				? await prisma.theme.findUnique({
						where: { id: themeId },
				  })
				: null;

			const pdf = await generatePDF(content, {
				theme: theme ?? undefined,
				coverPage: coverPage ?? undefined,
				toc: toc ?? undefined,
			});

			await fileSystem.writeFile(filePath, pdf);

			// Open the PDF file in the default viewer
			shell.openPath(filePath);

			return { success: true };
		}),
	);

	/**
	 * Save mermaid image
	 */
	ipcMain.handle(
		"mermaid:save-image",
		wrapIPCHandler(async (args) => {
			const { content, filePath, width, height } =
				saveMermaidImageSchema.parse(args);

			// This would require a mermaid rendering service
			// For now, we'll just create a placeholder
			await fileSystem.writeFile(filePath, content);

			return { success: true };
		}),
	);

	// ==================== DOCX Channel ====================

	/**
	 * Generate DOCX for preview
	 */
	ipcMain.handle(
		"docx:generate",
		wrapIPCHandler(async (args) => {
			const { content, themeId, coverPage, toc } = z
				.object({
					content: z.string(),
					themeId: z.string().optional(),
					coverPage: z.any().optional(),
					toc: z.any().optional(),
				})
				.parse(args);

			const theme = themeId
				? await prisma.theme.findUnique({
						where: { id: themeId },
				  })
				: null;

			const docx = await generateDocx(content, {
				theme: theme ?? undefined,
				coverPage: coverPage ?? undefined,
				toc: toc ?? undefined,
			});

			return { docx: docx.toString("base64") };
		}),
	);

	/**
	 * Export DOCX
	 */
	ipcMain.handle(
		"docx:export",
		wrapIPCHandler(async (args) => {
			const { content, filePath, themeId, coverPage, toc } =
				exportDocxSchema.parse(args);

			const theme = themeId
				? await prisma.theme.findUnique({
						where: { id: themeId },
				  })
				: null;

			const docx = await generateDocx(content, {
				theme: theme ?? undefined,
				coverPage: coverPage ?? undefined,
				toc: toc ?? undefined,
			});

			await fileSystem.writeFile(filePath, docx);

			return { success: true };
		}),
	);

	// ==================== Window Channel ====================

	/**
	 * Check if main window is maximized
	 */
	ipcMain.handle(
		"window:is-maximized",
		wrapIPCHandler(async (args) => {
			z.object({}).parse(args);

			const maximized = isMainWindowMaximized();

			return { maximized };
		}),
	);

	/**
	 * Get main window bounds
	 */
	ipcMain.handle(
		"window:get-bounds",
		wrapIPCHandler(async (args) => {
			z.object({}).parse(args);

			const mainWindow = getMainWindow();
			if (!mainWindow) {
				throw new Error("Main window not found");
			}

			const bounds = mainWindow.getBounds();

			return { bounds };
		}),
	);
}