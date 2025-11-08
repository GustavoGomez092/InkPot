"use strict";
const electron = require("electron");
const electronAPI = {
  projects: {
    listRecent: (req) => electron.ipcRenderer.invoke("projects:list-recent", req),
    create: (req) => electron.ipcRenderer.invoke("projects:create", req),
    load: (req) => electron.ipcRenderer.invoke("projects:load", req),
    save: (req) => electron.ipcRenderer.invoke("projects:save", req),
    delete: (req) => electron.ipcRenderer.invoke("projects:delete", req)
  },
  themes: {
    list: (req) => electron.ipcRenderer.invoke("themes:list", req),
    get: (req) => electron.ipcRenderer.invoke("themes:get", req),
    create: (req) => electron.ipcRenderer.invoke("themes:create", req),
    update: (req) => electron.ipcRenderer.invoke("themes:update", req),
    delete: (req) => electron.ipcRenderer.invoke("themes:delete", req)
  },
  fonts: {
    search: (req) => electron.ipcRenderer.invoke("fonts:search", req),
    download: (req) => electron.ipcRenderer.invoke("fonts:download", req),
    isCached: (req) => electron.ipcRenderer.invoke("fonts:is-cached", req)
  },
  pdf: {
    preview: (req) => electron.ipcRenderer.invoke("pdf:preview", req),
    export: (req) => electron.ipcRenderer.invoke("pdf:export", req),
    calculatePageBreaks: (req) => electron.ipcRenderer.invoke("pdf:calculate-page-breaks", req)
  },
  cover: {
    listTemplates: (req) => electron.ipcRenderer.invoke("cover:list-templates", req),
    uploadAsset: (req) => electron.ipcRenderer.invoke("cover:upload-asset", req)
  },
  file: {
    selectFile: (req) => electron.ipcRenderer.invoke("file:select-file", req),
    saveDialog: (req) => electron.ipcRenderer.invoke("file:save-dialog", req),
    read: (req) => electron.ipcRenderer.invoke("file:read", req),
    write: (req) => electron.ipcRenderer.invoke("file:write", req),
    delete: (req) => electron.ipcRenderer.invoke("file:delete", req),
    exists: (req) => electron.ipcRenderer.invoke("file:exists", req)
  },
  app: {
    version: () => electron.ipcRenderer.invoke("app:version", {}),
    paths: (req) => electron.ipcRenderer.invoke("app:paths", req)
  },
  theme: {
    get: () => electron.ipcRenderer.invoke("theme:get", {}),
    set: (req) => electron.ipcRenderer.invoke("theme:set", req)
  }
};
electron.contextBridge.exposeInMainWorld("electronAPI", electronAPI);
