// Electron Main Process Entry Point
import { app, BrowserWindow } from "electron";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as appData from "./services/app-data.js";
import { setMainWindow } from "./services/window-manager.js";

// Vite environment variables set by Electron Forge
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
	// Preload script path - Electron Forge Vite plugin builds to .vite/build directory
	// In development, check both .vite/build and dist/main locations
	const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

	let preloadPath: string;
	if (isDev) {
		// Development: Forge Vite plugin builds to .vite/build/
		preloadPath = path.join(process.cwd(), ".vite", "build", "preload.cjs");
	} else {
		// Production: Built files are in dist/main/
		preloadPath = path.join(__dirname, "preload.cjs");
	}

	console.log("Using preload path:", preloadPath);
	console.log("Preload file exists:", existsSync(preloadPath));

	// Set icon path - use PNG for BrowserWindow (works cross-platform in dev mode)
	// The packagerConfig.icon in forge.config.ts handles packaged apps automatically
	const iconPath = path.join(process.cwd(), "Assets", "PNG", "App-logo-1024.png");

	const mainWindow = new BrowserWindow({
		width: 1280,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		webPreferences: {
			preload: preloadPath,
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false,
		},
		title: "InkPot",
		icon: iconPath,
		show: false, // Don't show until ready-to-show event
		backgroundColor: "#ffffff", // Prevent flash of unstyled content
	});

	// Register with window manager
	setMainWindow(mainWindow);

	// Add comprehensive error logging
	mainWindow.webContents.on(
		"did-fail-load",
		(_event, errorCode, errorDescription) => {
			console.error("❌ Failed to load page:", errorCode, errorDescription);
		},
	);

	mainWindow.on("unresponsive", () => {
		console.error("⚠️ Window became unresponsive");
	});

	mainWindow.webContents.on("render-process-gone", (_event, details) => {
		console.error("❌ Render process gone:", details);
		console.error("Reason:", details.reason);
		console.error("Exit code:", details.exitCode);
	});

	mainWindow.webContents.on("console-message", (_event, level, message) => {
		console.log(`[Renderer ${level}]:`, message);
	});

	mainWindow.on("closed", () => {
		console.log("🔴 Window closed");
	});

	// Show window when ready
	mainWindow.once("ready-to-show", () => {
		console.log("✅ Window ready to show");
		mainWindow.show();
	});

	// Load renderer
	// Electron Forge sets MAIN_WINDOW_VITE_DEV_SERVER_URL in dev mode
	// and MAIN_WINDOW_VITE_NAME in production mode
	if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
		// Development mode - load from Vite dev server
		console.log("Loading from dev server:", MAIN_WINDOW_VITE_DEV_SERVER_URL);
		mainWindow
			.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
			.then(() => {
				console.log("✅ Dev server loaded successfully");
				mainWindow.webContents.openDevTools();
			})
			.catch((err) => {
				console.error("❌ Failed to load dev server:", err);
			});
	} else {
		// Production mode - load from built renderer files
		// With asar disabled, files are in app/.vite/renderer/{MAIN_WINDOW_VITE_NAME}/
		const rendererPath = path.join(
			process.resourcesPath,
			"app",
			".vite",
			"renderer",
			MAIN_WINDOW_VITE_NAME,
			"index.html",
		);
		console.log("Loading renderer from:", rendererPath);
		mainWindow
			.loadFile(rendererPath)
			.then(() => {
				console.log("✅ Production renderer loaded");
			})
			.catch((err) => {
				console.error("❌ Failed to load renderer:", err);
				console.error("Tried path:", rendererPath);
			});
	}
}

// App lifecycle
app.whenReady().then(async () => {
	console.log("🚀 App is ready, starting initialization...");

	// Initialize app data directories FIRST (required for IPC handlers)
	try {
		await appData.initialize();
		console.log("✅ App data directories initialized");
	} catch (error) {
		console.error("❌ App data initialization failed:", error);
		app.quit();
		return;
	}

	// Initialize database SECOND (required for IPC handlers)
	try {
		const { applyMigrations } = await import("./database/migrate.js");
		await applyMigrations();

		const { seedDatabase } = await import("./database/seed.js");
		await seedDatabase();

		const { prisma } = await import("./database/client.js");
		console.log("✅ Database ready");

		// Test query - count all projects
		const projectCount = await prisma.project.count();
		console.log(`📊 Projects in database: ${projectCount}`);
	} catch (error) {
		console.error("❌ Database initialization failed:", error);
		app.quit();
		return;
	}

	// Register IPC handlers THIRD (requires appData and database to be ready)
	try {
		const { registerIPCHandlers } = await import("./ipc/handlers.js");
		registerIPCHandlers();
		console.log("✅ IPC handlers registered");
	} catch (error) {
		console.error("❌ IPC handlers registration failed:", error);
		app.quit();
		return;
	}

	// Create window LAST (after all initialization is complete)
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
