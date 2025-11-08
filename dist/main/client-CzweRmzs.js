import { createClient } from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import { app } from "electron";
import fs from "fs";
import path from "path";
function getAppDataPath() {
  const platform = process.platform;
  const home = app.getPath("home");
  switch (platform) {
    case "darwin":
      return path.join(home, "Library", "Application Support", "InkForge");
    case "win32":
      return path.join(
        process.env.APPDATA || path.join(home, "AppData", "Roaming"),
        "InkForge"
      );
    default:
      return path.join(
        process.env.XDG_CONFIG_HOME || path.join(home, ".config"),
        "inkforge"
      );
  }
}
const appDataPath = getAppDataPath();
if (!fs.existsSync(appDataPath)) {
  fs.mkdirSync(appDataPath, { recursive: true });
}
const dbPath = path.join(appDataPath, "inkforge.db");
const libsql = createClient({
  url: `file:${dbPath}`
});
const adapter = new PrismaLibSQL({
  url: `file:${dbPath}`
});
const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});
process.on("beforeExit", async () => {
  await prisma.$disconnect();
  libsql.close();
});
export {
  appDataPath,
  dbPath,
  prisma
};
