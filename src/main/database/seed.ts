// Database Seed Script
// Populates the database with built-in themes and cover templates

import { prisma } from "./client.js";

/**
 * Seeds the database with built-in themes and cover templates
 */
export async function seedDatabase(): Promise<void> {
	console.log("🌱 Seeding database...");

	try {
		// Check if already seeded
		const existingThemes = await prisma.theme.count({
			where: { isBuiltIn: true },
		});

		if (existingThemes > 0) {
			console.log("✅ Database already seeded");
			return;
		}

		// Seed built-in themes
		await seedThemes();

		// Seed built-in cover templates
		await seedCoverTemplates();

		console.log("✅ Database seeded successfully");
	} catch (error) {
		console.error("❌ Database seeding failed:", error);
		throw error;
	}
}

/**
 * Seeds built-in themes
 */
async function seedThemes(): Promise<void> {
	const themes = [
		{
			name: "Professional",
			isBuiltIn: true,
			headingFont: "Merriweather",
			bodyFont: "Open Sans",
			h1Size: 32,
			h2Size: 24,
			h3Size: 20,
			h4Size: 16,
			h5Size: 14,
			h6Size: 12,
			bodySize: 11,
			kerning: 0,
			leading: 1.5,
			pageWidth: 8.5,
			pageHeight: 11,
			marginTop: 1,
			marginBottom: 1,
			marginLeft: 1,
			marginRight: 1,
			backgroundColor: "#FFFFFF",
			textColor: "#000000",
			headingColor: "#1a1a1a",
			linkColor: "#0066CC",
			codeBackground: "#F5F5F5",
		},
		{
			name: "Modern",
			isBuiltIn: true,
			headingFont: "Montserrat",
			bodyFont: "Roboto",
			h1Size: 36,
			h2Size: 28,
			h3Size: 22,
			h4Size: 18,
			h5Size: 14,
			h6Size: 12,
			bodySize: 11,
			kerning: 0.02,
			leading: 1.6,
			pageWidth: 8.5,
			pageHeight: 11,
			marginTop: 0.75,
			marginBottom: 0.75,
			marginLeft: 0.75,
			marginRight: 0.75,
			backgroundColor: "#FFFFFF",
			textColor: "#2d2d2d",
			headingColor: "#000000",
			linkColor: "#2563EB",
			codeBackground: "#E5E7EB",
		},
		{
			name: "Classic",
			isBuiltIn: true,
			headingFont: "Playfair Display",
			bodyFont: "Lora",
			h1Size: 30,
			h2Size: 22,
			h3Size: 18,
			h4Size: 16,
			h5Size: 14,
			h6Size: 12,
			bodySize: 12,
			kerning: 0,
			leading: 1.8,
			pageWidth: 8.5,
			pageHeight: 11,
			marginTop: 1.25,
			marginBottom: 1.25,
			marginLeft: 1.25,
			marginRight: 1.25,
			backgroundColor: "#FFFEF9",
			textColor: "#1a1a1a",
			headingColor: "#000000",
			linkColor: "#8B4513",
			codeBackground: "#F0EDE6",
		},
	];

	for (const theme of themes) {
		await prisma.theme.create({
			data: theme,
		});
		console.log(`  Created theme: ${theme.name}`);
	}
}

/**
 * Seeds built-in cover templates
 */
async function seedCoverTemplates(): Promise<void> {
	const templates = [
		{
			name: "Business",
			isBuiltIn: true,
			hasLogoSlot: true,
			hasBackgroundSlot: false,
			layoutJson: JSON.stringify({
				type: "centered",
				elements: [
					{
						type: "logo",
						position: { x: "center", y: 100 },
						maxWidth: 200,
						maxHeight: 100,
					},
					{
						type: "title",
						position: { x: "center", y: 250 },
						fontSize: 48,
						fontWeight: "bold",
						color: "#000000",
					},
					{
						type: "subtitle",
						position: { x: "center", y: 320 },
						fontSize: 24,
						color: "#666666",
					},
					{
						type: "author",
						position: { x: "center", y: 600 },
						fontSize: 16,
						color: "#333333",
					},
					{
						type: "date",
						position: { x: "center", y: 650 },
						fontSize: 14,
						color: "#666666",
					},
				],
			}),
		},
		{
			name: "Academic",
			isBuiltIn: true,
			hasLogoSlot: false,
			hasBackgroundSlot: false,
			layoutJson: JSON.stringify({
				type: "traditional",
				elements: [
					{
						type: "title",
						position: { x: "center", y: 200 },
						fontSize: 36,
						fontWeight: "bold",
						color: "#000000",
						textTransform: "uppercase",
					},
					{
						type: "subtitle",
						position: { x: "center", y: 280 },
						fontSize: 20,
						color: "#333333",
						fontStyle: "italic",
					},
					{
						type: "author",
						position: { x: "center", y: 450 },
						fontSize: 18,
						color: "#000000",
					},
					{
						type: "date",
						position: { x: "center", y: 650 },
						fontSize: 14,
						color: "#666666",
					},
				],
			}),
		},
		{
			name: "Creative",
			isBuiltIn: true,
			hasLogoSlot: true,
			hasBackgroundSlot: true,
			layoutJson: JSON.stringify({
				type: "asymmetric",
				elements: [
					{
						type: "background",
						position: { x: 0, y: 0 },
						width: "100%",
						height: "100%",
						opacity: 0.3,
					},
					{
						type: "logo",
						position: { x: 50, y: 50 },
						maxWidth: 150,
						maxHeight: 75,
					},
					{
						type: "title",
						position: { x: 50, y: 300 },
						fontSize: 54,
						fontWeight: "bold",
						color: "#1a1a1a",
						maxWidth: 500,
						textAlign: "left",
					},
					{
						type: "subtitle",
						position: { x: 50, y: 400 },
						fontSize: 24,
						color: "#666666",
						maxWidth: 500,
						textAlign: "left",
					},
					{
						type: "author",
						position: { x: 50, y: 650 },
						fontSize: 16,
						color: "#333333",
					},
					{
						type: "date",
						position: { x: 50, y: 680 },
						fontSize: 14,
						color: "#666666",
					},
				],
			}),
		},
	];

	for (const template of templates) {
		await prisma.coverTemplate.create({
			data: template,
		});
		console.log(`  Created cover template: ${template.name}`);
	}
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	seedDatabase()
		.then(() => {
			process.exit(0);
		})
		.catch((error) => {
			console.error(error);
			process.exit(1);
		});
}
