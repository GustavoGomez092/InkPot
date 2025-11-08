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

	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		webPreferences: {
			preload: preloadPath,
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false,
		},
		title: "InkForge",
		show: false, // Don't show until ready-to-show event
		backgroundColor: '#ffffff', // Prevent flash of unstyled content
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

	if (isDev) {
		// Development mode - load from Vite dev server
		const devServerUrl =
			process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";
		console.log("Loading from dev server:", devServerUrl);

		// Wait a bit for Vite to be ready, then load
		setTimeout(async () => {
			try {
				await mainWindow.loadURL(devServerUrl);
				console.log("✅ Dev server loaded successfully");
				mainWindow.webContents.openDevTools();
			} catch (err) {
				console.error("❌ Failed to load dev server URL:", err);
				mainWindow.show(); // Show window with error
			}
		}, 1000); // Give Vite 1 second to start
	} else {
		// Production mode - load from built files
		mainWindow.loadFile(path.join(__dirname, "../renderer/index.html")).catch((err) => {
			console.error("❌ Failed to load index.html:", err);
			mainWindow.show(); // Show window with error
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
