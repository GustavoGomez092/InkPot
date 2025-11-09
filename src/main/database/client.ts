// Prisma Client Singleton for Electron Main Process
// Using Prisma with libsql (no native dependencies)

import { createClient } from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import { app } from "electron";
import fs from "fs";
import path from "path";

// Get platform-specific app data directory
function getAppDataPath(): string {
	const platform = process.platform;
	const home = app.getPath("home");

	switch (platform) {
		case "darwin":
			return path.join(home, "Library", "Application Support", "InkForge");
		case "win32":
			return path.join(
				process.env.APPDATA || path.join(home, "AppData", "Roaming"),
				"InkForge",
			);
		default: // linux
			return path.join(
				process.env.XDG_CONFIG_HOME || path.join(home, ".config"),
				"inkforge",
			);
	}
}

// Ensure app data directory exists
const appDataPath = getAppDataPath();
if (!fs.existsSync(appDataPath)) {
	fs.mkdirSync(appDataPath, { recursive: true });
}

// Database file location
const dbPath = path.join(appDataPath, "inkforge.db");

// Create libsql client
const libsql = createClient({
	url: `file:${dbPath}`,
});

// Create Prisma adapter
const adapter = new PrismaLibSQL({
	url: `file:${dbPath}`,
});

// Create Prisma client with libsql adapter
const prisma = new PrismaClient({
	adapter,
	log: ["error"],
});

// Graceful shutdown
process.on("beforeExit", async () => {
	await prisma.$disconnect();
	libsql.close();
});

export { prisma, appDataPath, dbPath };
