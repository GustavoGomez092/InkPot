// Electron Main Process Entry Point
import { app, BrowserWindow } from "electron";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as appData from "./services/app-data.js";
import { setMainWindow } from "./services/window-manager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
	// Preload script path - Electron Forge Vite plugin handles this
	// During development, the built files are in a temp location managed by Forge
	const preloadPath = path.join(__dirname, "preload.js");

	console.log("Using preload path:", preloadPath);
	console.log("__dirname:", __dirname);
	console.log("Preload file exists:", existsSync(preloadPath));

	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		webPreferences: {
			preload: preloadPath,
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false, // Temporarily disable sandbox for testing
		},
		title: "InkForge",
		show: true, // Show immediately to debug
	});

	// Register with window manager
	setMainWindow(mainWindow);

	// Load the app based on environment
	const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

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
	});

	mainWindow.webContents.on("console-message", (_event, level, message) => {
		console.log(`[Renderer ${level}]:`, message);
	});

	if (isDev) {
		// Development mode - load from Vite dev server
		// Try multiple ports as Vite may use a different port if 5173 is taken
		const devServerUrl =
			process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";
		console.log("Loading from dev server:", devServerUrl);

		mainWindow.loadURL(devServerUrl).catch((err) => {
			console.error("❌ Failed to load dev server URL:", err);
			// Show window anyway so user can see the error
			mainWindow.show();
		});
		mainWindow.webContents.openDevTools();
	} else {
		// Production mode - load from built files
		mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
	}

	// Show window when ready
	mainWindow.once("ready-to-show", () => {
		console.log("✅ Window ready to show");
		mainWindow.show();
	});

	// Fallback: show window after 3 seconds if not shown yet
	setTimeout(() => {
		if (!mainWindow.isVisible()) {
			console.log("⚠️ Window not shown after 3s, forcing show");
			mainWindow.show();
		}
	}, 3000);
}

// App lifecycle
app.whenReady().then(async () => {
	console.log("🚀 App is ready, starting initialization...");

	// Create window FIRST so user can see something
	createWindow();

	// Initialize app data directories
	try {
		await appData.initialize();
		console.log("✅ App data directories initialized");
	} catch (error) {
		console.error("❌ App data initialization failed:", error);
	}

	// Initialize database
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
	}

	// Register IPC handlers
	try {
		const { registerIPCHandlers } = await import("./ipc/handlers.js");
		registerIPCHandlers();
		console.log("✅ IPC handlers registered");
	} catch (error) {
		console.error("❌ IPC handlers registration failed:", error);
	}

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
