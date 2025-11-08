-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "themeId" TEXT,
    "hasCoverPage" BOOLEAN NOT NULL DEFAULT false,
    "coverTitle" TEXT,
    "coverSubtitle" TEXT,
    "coverAuthor" TEXT,
    "coverDate" TEXT,
    "coverTemplateId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastOpenedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Project_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Project_coverTemplateId_fkey" FOREIGN KEY ("coverTemplateId") REFERENCES "CoverTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isBuiltIn" BOOLEAN NOT NULL DEFAULT false,
    "headingFont" TEXT NOT NULL,
    "bodyFont" TEXT NOT NULL,
    "h1Size" REAL NOT NULL DEFAULT 32,
    "h2Size" REAL NOT NULL DEFAULT 24,
    "h3Size" REAL NOT NULL DEFAULT 20,
    "h4Size" REAL NOT NULL DEFAULT 16,
    "h5Size" REAL NOT NULL DEFAULT 14,
    "h6Size" REAL NOT NULL DEFAULT 12,
    "bodySize" REAL NOT NULL DEFAULT 11,
    "kerning" REAL NOT NULL DEFAULT 0,
    "leading" REAL NOT NULL DEFAULT 1.5,
    "pageWidth" REAL NOT NULL DEFAULT 8.5,
    "pageHeight" REAL NOT NULL DEFAULT 11,
    "marginTop" REAL NOT NULL DEFAULT 1,
    "marginBottom" REAL NOT NULL DEFAULT 1,
    "marginLeft" REAL NOT NULL DEFAULT 1,
    "marginRight" REAL NOT NULL DEFAULT 1,
    "backgroundColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "textColor" TEXT NOT NULL DEFAULT '#000000',
    "headingColor" TEXT NOT NULL DEFAULT '#000000',
    "linkColor" TEXT NOT NULL DEFAULT '#0066CC',
    "codeBackground" TEXT NOT NULL DEFAULT '#F5F5F5',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CoverTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isBuiltIn" BOOLEAN NOT NULL DEFAULT false,
    "layoutJson" TEXT NOT NULL,
    "hasLogoSlot" BOOLEAN NOT NULL DEFAULT false,
    "hasBackgroundSlot" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProjectCoverAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectCoverAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RecentProject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "accessedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AppSetting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CachedFont" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "family" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "downloadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_filePath_key" ON "Project"("filePath");

-- CreateIndex
CREATE INDEX "Project_lastOpenedAt_idx" ON "Project"("lastOpenedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Theme_name_key" ON "Theme"("name");

-- CreateIndex
CREATE INDEX "Theme_name_idx" ON "Theme"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CoverTemplate_name_key" ON "CoverTemplate"("name");

-- CreateIndex
CREATE INDEX "CoverTemplate_name_idx" ON "CoverTemplate"("name");

-- CreateIndex
CREATE INDEX "ProjectCoverAsset_projectId_assetType_idx" ON "ProjectCoverAsset"("projectId", "assetType");

-- CreateIndex
CREATE UNIQUE INDEX "RecentProject_projectId_key" ON "RecentProject"("projectId");

-- CreateIndex
CREATE INDEX "RecentProject_position_idx" ON "RecentProject"("position");

-- CreateIndex
CREATE UNIQUE INDEX "CachedFont_family_key" ON "CachedFont"("family");

-- CreateIndex
CREATE INDEX "CachedFont_family_idx" ON "CachedFont"("family");
