import type { BrowserWindow } from "electron";

/**
 * Service for managing application windows
 */
let mainWindow: BrowserWindow | null = null;

/**
 * Set the main application window reference
 */
export function setMainWindow(window: BrowserWindow): void {
	mainWindow = window;

	// Clean up reference when window is closed
	window.on("closed", () => {
		mainWindow = null;
	});
}

/**
 * Get the main application window
 */
export function getMainWindow(): BrowserWindow | null {
	return mainWindow;
}

/**
 * Focus the main window
 */
export function focusMainWindow(): void {
	if (mainWindow && !mainWindow.isDestroyed()) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}
		mainWindow.focus();
	}
}

/**
 * Minimize the main window
 */
export function minimizeMainWindow(): void {
	if (mainWindow && !mainWindow.isDestroyed()) {
		mainWindow.minimize();
	}
}

/**
 * Maximize the main window
 */
export function maximizeMainWindow(): void {
	if (mainWindow && !mainWindow.isDestroyed()) {
		if (mainWindow.isMaximized()) {
			mainWindow.unmaximize();
		} else {
			mainWindow.maximize();
		}
	}
}

/**
 * Close the main window
 */
export function closeMainWindow(): void {
	if (mainWindow && !mainWindow.isDestroyed()) {
		mainWindow.close();
	}
}

/**
 * Check if main window is focused
 */
export function isMainWindowFocused(): boolean {
	return mainWindow?.isFocused() ?? false;
}

/**
 * Check if main window is minimized
 */
export function isMainWindowMinimized(): boolean {
	return mainWindow?.isMinimized() ?? false;
}

/**
 * Check if main window is maximized
 */
export function isMainWindowMaximized(): boolean {
	return mainWindow?.isMaximized() ?? false;
}

/**
 * Check if main window is fullscreen
 */
export function isMainWindowFullscreen(): boolean {
	return mainWindow?.isFullScreen() ?? false;
}

/**
 * Set main window fullscreen state
 */
export function setMainWindowFullscreen(fullscreen: boolean): void {
	if (mainWindow && !mainWindow.isDestroyed()) {
		mainWindow.setFullScreen(fullscreen);
	}
}

/**
 * Get main window bounds
 */
export function getMainWindowBounds(): Electron.Rectangle | null {
	if (mainWindow && !mainWindow.isDestroyed()) {
		return mainWindow.getBounds();
	}
	return null;
}

/**
 * Set main window bounds
 */
export function setMainWindowBounds(bounds: Partial<Electron.Rectangle>): void {
	if (mainWindow && !mainWindow.isDestroyed()) {
		mainWindow.setBounds(bounds);
	}
}

/**
 * Reload the main window
 */
export function reloadMainWindow(): void {
	if (mainWindow && !mainWindow.isDestroyed()) {
		mainWindow.reload();
	}
}

/**
 * Open DevTools for the main window
 */
export function openDevTools(): void {
	if (mainWindow && !mainWindow.isDestroyed()) {
		mainWindow.webContents.openDevTools();
	}
}

/**
 * Close DevTools for the main window
 */
export function closeDevTools(): void {
	if (mainWindow && !mainWindow.isDestroyed()) {
		mainWindow.webContents.closeDevTools();
	}
}

/**
 * Check if DevTools are open
 */
export function isDevToolsOpened(): boolean {
	return mainWindow?.webContents.isDevToolsOpened() ?? false;
}
