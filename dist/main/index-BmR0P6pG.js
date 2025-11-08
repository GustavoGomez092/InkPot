import { dialog, app, BrowserWindow } from "electron";
import { existsSync } from "fs";
import path$1 from "path";
import { fileURLToPath } from "url";
import path from "node:path";
import fs from "node:fs/promises";
let mainWindow = null;
function setMainWindow(window) {
  mainWindow = window;
  window.on("closed", () => {
    mainWindow = null;
  });
}
function getMainWindow() {
  return mainWindow;
}
async function readFile(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    throw new Error(`Failed to read file: ${filePath}`, { cause: error });
  }
}
async function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  const tempPath = path.join(dir, `.${path.basename(filePath)}.tmp`);
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(tempPath, content, "utf-8");
    await fs.rename(tempPath, filePath);
  } catch (error) {
    try {
      await fs.unlink(tempPath);
    } catch {
    }
    throw new Error(`Failed to write file: ${filePath}`, { cause: error });
  }
}
async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    throw new Error(`Failed to delete file: ${filePath}`, { cause: error });
  }
}
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
async function createDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    throw new Error(`Failed to create directory: ${dirPath}`, { cause: error });
  }
}
async function showOpenDialog(options) {
  const mainWindow2 = getMainWindow();
  if (!mainWindow2) {
    throw new Error("Main window not available");
  }
  const result = await dialog.showOpenDialog(mainWindow2, {
    title: options.title || "Open File",
    defaultPath: options.defaultPath,
    filters: options.filters,
    properties: options.properties || ["openFile"]
  });
  return result.canceled ? [] : result.filePaths;
}
async function showSaveDialog(options) {
  const mainWindow2 = getMainWindow();
  if (!mainWindow2) {
    throw new Error("Main window not available");
  }
  const result = await dialog.showSaveDialog(mainWindow2, {
    title: options.title || "Save File",
    defaultPath: options.defaultPath,
    filters: options.filters
  });
  return result.canceled ? null : result.filePath ?? null;
}
function ensureExtension(filePath, extension) {
  const ext = extension.startsWith(".") ? extension : `.${extension}`;
  if (!filePath.endsWith(ext)) {
    return filePath + ext;
  }
  return filePath;
}
let appDataPath;
let projectsPath;
let themesPath;
let fontsPath;
let cachePath;
async function initialize() {
  appDataPath = app.getPath("userData");
  projectsPath = path.join(appDataPath, "projects");
  themesPath = path.join(appDataPath, "themes");
  fontsPath = path.join(appDataPath, "fonts");
  cachePath = path.join(appDataPath, "cache");
  await Promise.all([
    createDirectory(projectsPath),
    createDirectory(themesPath),
    createDirectory(fontsPath),
    createDirectory(cachePath)
  ]);
}
function getAppDataPath() {
  if (!appDataPath) {
    throw new Error("App data not initialized. Call initialize() first.");
  }
  return appDataPath;
}
function getProjectsPath() {
  if (!projectsPath) {
    throw new Error("App data not initialized. Call initialize() first.");
  }
  return projectsPath;
}
function getThemesPath() {
  if (!themesPath) {
    throw new Error("App data not initialized. Call initialize() first.");
  }
  return themesPath;
}
function getFontsPath() {
  if (!fontsPath) {
    throw new Error("App data not initialized. Call initialize() first.");
  }
  return fontsPath;
}
function isPathInProjects(filePath) {
  const resolved = path.resolve(filePath);
  return resolved.startsWith(projectsPath);
}
function getAppVersion() {
  return app.getVersion();
}
function getAppName() {
  return app.getName();
}
function getSystemPaths() {
  return {
    home: app.getPath("home"),
    documents: app.getPath("documents"),
    downloads: app.getPath("downloads"),
    desktop: app.getPath("desktop"),
    temp: app.getPath("temp")
  };
}
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path$1.dirname(__filename$1);
function createWindow() {
  const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
  let preloadPath;
  if (isDev) {
    preloadPath = path$1.join(process.cwd(), ".vite", "build", "preload.cjs");
  } else {
    preloadPath = path$1.join(__dirname$1, "preload.cjs");
  }
  console.log("Using preload path:", preloadPath);
  console.log("Preload file exists:", existsSync(preloadPath));
  const mainWindow2 = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    title: "InkForge",
    show: false,
    // Don't show until ready-to-show event
    backgroundColor: "#ffffff"
    // Prevent flash of unstyled content
  });
  setMainWindow(mainWindow2);
  mainWindow2.webContents.on(
    "did-fail-load",
    (_event, errorCode, errorDescription) => {
      console.error("❌ Failed to load page:", errorCode, errorDescription);
    }
  );
  mainWindow2.on("unresponsive", () => {
    console.error("⚠️ Window became unresponsive");
  });
  mainWindow2.webContents.on("render-process-gone", (_event, details) => {
    console.error("❌ Render process gone:", details);
    console.error("Reason:", details.reason);
    console.error("Exit code:", details.exitCode);
  });
  mainWindow2.webContents.on("console-message", (_event, level, message) => {
    console.log(`[Renderer ${level}]:`, message);
  });
  mainWindow2.on("closed", () => {
    console.log("🔴 Window closed");
  });
  mainWindow2.once("ready-to-show", () => {
    console.log("✅ Window ready to show");
    mainWindow2.show();
  });
  if (isDev) {
    const devServerUrl = process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";
    console.log("Loading from dev server:", devServerUrl);
    setTimeout(async () => {
      try {
        await mainWindow2.loadURL(devServerUrl);
        console.log("✅ Dev server loaded successfully");
        mainWindow2.webContents.openDevTools();
      } catch (err) {
        console.error("❌ Failed to load dev server URL:", err);
        mainWindow2.show();
      }
    }, 1e3);
  } else {
    mainWindow2.loadFile(path$1.join(__dirname$1, "../renderer/index.html")).catch((err) => {
      console.error("❌ Failed to load index.html:", err);
      mainWindow2.show();
    });
  }
}
app.whenReady().then(async () => {
  console.log("🚀 App is ready, starting initialization...");
  try {
    await initialize();
    console.log("✅ App data directories initialized");
  } catch (error) {
    console.error("❌ App data initialization failed:", error);
    app.quit();
    return;
  }
  try {
    const { applyMigrations } = await import("./migrate-H6M7GUsl.js");
    await applyMigrations();
    const { seedDatabase } = await import("./seed-CC_LeyDk.js");
    await seedDatabase();
    const { prisma } = await import("./client-CzweRmzs.js");
    console.log("✅ Database ready");
    const projectCount = await prisma.project.count();
    console.log(`📊 Projects in database: ${projectCount}`);
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    app.quit();
    return;
  }
  try {
    const { registerIPCHandlers } = await import("./handlers-e6SIxSWc.js");
    registerIPCHandlers();
    console.log("✅ IPC handlers registered");
  } catch (error) {
    console.error("❌ IPC handlers registration failed:", error);
    app.quit();
    return;
  }
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
export {
  showSaveDialog as a,
  getAppVersion as b,
  getSystemPaths as c,
  deleteFile as d,
  ensureExtension as e,
  fileExists as f,
  getAppName as g,
  getFontsPath as h,
  isPathInProjects as i,
  getThemesPath as j,
  getProjectsPath as k,
  getAppDataPath as l,
  readFile as r,
  showOpenDialog as s,
  writeFile as w
};
