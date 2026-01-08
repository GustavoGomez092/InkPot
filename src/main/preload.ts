// Electron Preload Script - Context Bridge

import type { ElectronAPI } from "@shared/types/ipc-contracts";
import { contextBridge, ipcRenderer } from "electron";

const electronAPI: ElectronAPI = {
	projects: {
		listRecent: (req) => ipcRenderer.invoke("projects:list-recent", req),
		create: (req) => ipcRenderer.invoke("projects:create", req),
		load: (req) => ipcRenderer.invoke("projects:load", req),
		save: (req) => ipcRenderer.invoke("projects:save", req),
		rename: (req) => ipcRenderer.invoke("projects:rename", req),
		delete: (req) => ipcRenderer.invoke("projects:delete", req),
	},
	themes: {
		list: (req) => ipcRenderer.invoke("themes:list", req),
		get: (req) => ipcRenderer.invoke("themes:get", req),
		create: (req) => ipcRenderer.invoke("themes:create", req),
		update: (req) => ipcRenderer.invoke("themes:update", req),
		delete: (req) => ipcRenderer.invoke("themes:delete", req),
	},
	fonts: {
		search: (req) => ipcRenderer.invoke("fonts:search", req),
		download: (req) => ipcRenderer.invoke("fonts:download", req),
		isCached: (req) => ipcRenderer.invoke("fonts:is-cached", req),
	},
	pdf: {
		preview: (req) => ipcRenderer.invoke("pdf:preview", req),
		export: (req) => ipcRenderer.invoke("pdf:export", req),
		calculatePageBreaks: (req) =>
			ipcRenderer.invoke("pdf:calculate-page-breaks", req),
		saveMermaidImage: (req) => ipcRenderer.invoke("pdf:saveMermaidImage", req),
	},
	docx: {
		export: (req) => ipcRenderer.invoke("docx:export", req),
	},
	cover: {
		listTemplates: (req) => ipcRenderer.invoke("cover:list-templates", req),
		uploadAsset: (req) => ipcRenderer.invoke("cover:upload-asset", req),
		deleteAsset: (req) => ipcRenderer.invoke("cover:delete-asset", req),
		getAssets: (req) => ipcRenderer.invoke("cover:get-assets", req),
		updateData: (req) => ipcRenderer.invoke("cover:update-data", req),
		getAssetDataUrl: (req) =>
			ipcRenderer.invoke("cover:get-asset-data-url", req),
	},
	file: {
		selectFile: (req) => ipcRenderer.invoke("file:select-file", req),
		saveDialog: (req) => ipcRenderer.invoke("file:save-dialog", req),
		read: (req) => ipcRenderer.invoke("file:read", req),
		write: (req) => ipcRenderer.invoke("file:write", req),
		delete: (req) => ipcRenderer.invoke("file:delete", req),
		exists: (req) => ipcRenderer.invoke("file:exists", req),
		saveImage: (req) => ipcRenderer.invoke("file:save-image", req),
		getProjectAssetsPath: (req) =>
			ipcRenderer.invoke("file:get-project-assets-path", req),
		getImagePath: (req) => ipcRenderer.invoke("file:get-image-path", req),
	},
	app: {
		version: () => ipcRenderer.invoke("app:version", {}),
		paths: (req) => ipcRenderer.invoke("app:paths", req),
	},
	theme: {
		get: () => ipcRenderer.invoke("theme:get", {}),
		set: (req: { theme: "light" | "dark" }) =>
			ipcRenderer.invoke("theme:set", req),
	},
	window: {
		minimize: () => ipcRenderer.invoke("window:minimize"),
		maximize: () => ipcRenderer.invoke("window:maximize"),
		close: () => ipcRenderer.invoke("window:close"),
		isMaximized: () => ipcRenderer.invoke("window:is-maximized"),
		onMaximize: (callback: () => void) => {
			ipcRenderer.on("window:maximized", callback);
			return () => {
				ipcRenderer.removeListener("window:maximized", callback);
			};
		},
		onUnmaximize: (callback: () => void) => {
			ipcRenderer.on("window:unmaximized", callback);
			return () => {
				ipcRenderer.removeListener("window:unmaximized", callback);
			};
		},
	},
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
