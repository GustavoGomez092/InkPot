// Database migration utility for applying Prisma migrations at runtime

import fs from "fs";
import path from "path";
import { prisma } from "./client.js";

export async function applyMigrations(): Promise<void> {
	try {
		console.log("🔄 Checking database migrations...");

		// Check if _prisma_migrations table exists
		const tables = await prisma.$queryRawUnsafe<{ name: string }[]>(
			"SELECT name FROM sqlite_master WHERE type='table' AND name='_prisma_migrations'",
		);

		const needsInit = tables.length === 0;

		if (needsInit) {
			console.log("📦 Initializing database schema...");

			// Read the initial migration SQL from source directory
			// In development, __dirname points to dist/main/database
			// In production, we'll need to copy migrations to resources
			const appRoot = process.cwd();
			const migrationPath = path.join(
				appRoot,
				"src",
				"main",
				"database",
				"prisma",
				"migrations",
				"20251108005516_init",
				"migration.sql",
			);

			const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

			// Remove comments and split into statements
			const lines = migrationSQL.split("\n");
			const sqlLines: string[] = [];

			for (const line of lines) {
				const trimmed = line.trim();
				// Skip comment lines
				if (trimmed.startsWith("--") || trimmed.length === 0) {
					continue;
				}
				sqlLines.push(line);
			}

			const cleanSQL = sqlLines.join("\n");
			const statements = cleanSQL
				.split(";")
				.map((s) => s.trim())
				.filter((s) => s.length > 0);

			console.log(`  Executing ${statements.length} SQL statements...`);

			for (const statement of statements) {
				try {
					await prisma.$executeRawUnsafe(statement + ";");
				} catch (error) {
					console.error(
						"  Failed to execute statement:",
						statement.substring(0, 100),
					);
					throw error;
				}
			}

			// Create migration tracking table
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

			// Record the migration
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
		}

		// Apply subsequent migrations
		await applySubsequentMigrations();

		console.log("✅ All migrations applied successfully");
	} catch (error) {
		console.error("❌ Migration failed:", error);
		throw error;
	}
}

async function applySubsequentMigrations(): Promise<void> {
	const appRoot = process.cwd();
	const migrations = [
		"20260107004404_add_link_underline_to_theme",
		"20260108000000_add_toc_to_project",
	];

	for (const migrationName of migrations) {
		// Check if migration has already been applied
		const existingMigrations = await prisma.$queryRawUnsafe<
			{ migration_name: string }[]
		>(
			`SELECT migration_name FROM "_prisma_migrations" WHERE migration_name = '${migrationName}'`,
		);

		if (existingMigrations.length > 0) {
			console.log(`  ⏭️  Skipping ${migrationName} (already applied)`);
			continue;
		}

		console.log(`  🔄 Applying migration: ${migrationName}`);

		const migrationPath = path.join(
			appRoot,
			"src",
			"main",
			"database",
			"prisma",
			"migrations",
			migrationName,
			"migration.sql",
		);

		const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

		// Remove comments and split into statements
		const lines = migrationSQL.split("\n");
		const sqlLines: string[] = [];

		for (const line of lines) {
			const trimmed = line.trim();
			// Skip comment lines
			if (trimmed.startsWith("--") || trimmed.length === 0) {
				continue;
			}
			sqlLines.push(line);
		}

		const cleanSQL = sqlLines.join("\n");
		const statements = cleanSQL
			.split(";")
			.map((s) => s.trim())
			.filter((s) => s.length > 0);

		// Execute each statement
		for (const statement of statements) {
			try {
				await prisma.$executeRawUnsafe(statement + ";");
			} catch (error) {
				console.error(
					"  Failed to execute statement:",
					statement.substring(0, 100),
				);
				throw error;
			}
		}

		// Record the migration
		await prisma.$executeRawUnsafe(`
      INSERT INTO "_prisma_migrations" (id, checksum, migration_name, finished_at, applied_steps_count)
      VALUES (
        '${crypto.randomUUID()}',
        '${generateChecksum(migrationSQL)}',
        '${migrationName}',
        datetime('now'),
        1
      )
    `);

		console.log(`  ✅ Applied ${migrationName}`);
	}
}

function generateChecksum(content: string): string {
	// Simple checksum - in production you'd use crypto.createHash
	return Buffer.from(content).toString("base64").slice(0, 64);
}
