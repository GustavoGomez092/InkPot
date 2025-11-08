import fs from "fs";
import path from "path";
import { prisma } from "./client-CzweRmzs.js";
async function applyMigrations() {
  try {
    console.log("🔄 Checking database migrations...");
    const tables = await prisma.$queryRawUnsafe(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='_prisma_migrations'"
    );
    const needsInit = tables.length === 0;
    if (needsInit) {
      console.log("📦 Initializing database schema...");
      const appRoot = process.cwd();
      const migrationPath = path.join(
        appRoot,
        "src",
        "main",
        "database",
        "prisma",
        "migrations",
        "20251108005516_init",
        "migration.sql"
      );
      const migrationSQL = fs.readFileSync(migrationPath, "utf-8");
      const lines = migrationSQL.split("\n");
      const sqlLines = [];
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("--") || trimmed.length === 0) {
          continue;
        }
        sqlLines.push(line);
      }
      const cleanSQL = sqlLines.join("\n");
      const statements = cleanSQL.split(";").map((s) => s.trim()).filter((s) => s.length > 0);
      console.log(`  Executing ${statements.length} SQL statements...`);
      for (const statement of statements) {
        try {
          await prisma.$executeRawUnsafe(statement + ";");
        } catch (error) {
          console.error(
            "  Failed to execute statement:",
            statement.substring(0, 100)
          );
          throw error;
        }
      }
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
          "id"                    TEXT PRIMARY KEY NOT NULL,
          "checksum"              TEXT NOT NULL,
          "finished_at"           DATETIME,
          "migration_name"        TEXT NOT NULL,
          "logs"                  TEXT,
          "rolled_back_at"        DATETIME,
          "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
          "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
        )
      `);
      await prisma.$executeRawUnsafe(`
        INSERT INTO "_prisma_migrations" (id, checksum, migration_name, finished_at, applied_steps_count)
        VALUES (
          '${crypto.randomUUID()}',
          '${generateChecksum(migrationSQL)}',
          '20251108005516_init',
          datetime('now'),
          1
        )
      `);
      console.log("✅ Database schema initialized successfully");
    } else {
      console.log("✅ Database schema is up to date");
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}
function generateChecksum(content) {
  return Buffer.from(content).toString("base64").slice(0, 64);
}
export {
  applyMigrations
};
