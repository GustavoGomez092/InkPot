/**
 * Anchor Utilities for PDF Hyperlinks
 * Utilities for generating URL-safe, unique anchor IDs from heading text
 */

/**
 * Generate a URL-safe anchor ID from heading text
 *
 * Converts heading text to a URL-safe slug:
 * - Converts to lowercase
 * - Replaces spaces with hyphens
 * - Removes special characters (keeps alphanumeric, hyphens, and unicode letters)
 * - Normalizes unicode characters
 *
 * @param text - The heading text to convert
 * @returns URL-safe anchor ID
 *
 * @example
 * generateAnchorId('My Heading') // => 'my-heading'
 * generateAnchorId('Hello, World!') // => 'hello-world'
 * generateAnchorId('Café au Lait') // => 'café-au-lait'
 */
export function generateAnchorId(text: string): string {
	// Normalize unicode to decomposed form, then lowercase
	let slug = text.normalize('NFD').toLowerCase();

	// Replace spaces and underscores with hyphens
	slug = slug.replace(/[\s_]+/g, '-');

	// Remove special characters, keeping:
	// - alphanumeric characters (including unicode letters)
	// - hyphens
	// - accented/diacritical marks (unicode combining marks)
	slug = slug.replace(/[^\p{L}\p{N}\p{M}-]/gu, '');

	// Compose unicode back to composed form (é instead of e + ́)
	slug = slug.normalize('NFC');

	// Remove multiple consecutive hyphens
	slug = slug.replace(/-+/g, '-');

	// Remove leading and trailing hyphens
	slug = slug.replace(/^-+|-+$/g, '');

	// If the slug is empty after all transformations, use a default
	if (slug === '') {
		slug = 'heading';
	}

	return slug;
}

/**
 * Generate a unique anchor ID, handling duplicates by appending numbers
 *
 * Tracks used IDs and appends a number suffix if the ID has been used before.
 * This ensures each heading gets a unique anchor ID within the document.
 *
 * @param text - The heading text to convert
 * @param usedIds - Set of anchor IDs already used in the document
 * @returns Unique URL-safe anchor ID
 *
 * @example
 * const usedIds = new Set<string>();
 * generateUniqueAnchorId('My Heading', usedIds) // => 'my-heading'
 * generateUniqueAnchorId('My Heading', usedIds) // => 'my-heading-1'
 * generateUniqueAnchorId('My Heading', usedIds) // => 'my-heading-2'
 */
export function generateUniqueAnchorId(text: string, usedIds: Set<string>): string {
	const baseId = generateAnchorId(text);
	let anchorId = baseId;
	let counter = 1;

	// Keep appending numbers until we find an unused ID
	while (usedIds.has(anchorId)) {
		anchorId = `${baseId}-${counter}`;
		counter++;
	}

	// Mark this ID as used
	usedIds.add(anchorId);

	return anchorId;
}

/**
 * Resolve an internal link href to a valid anchor ID
 *
 * Takes a link href (e.g., "#My Heading" or "#my-heading") and matches it
 * against a collection of valid anchor IDs in the document.
 * Performs case-insensitive matching and normalizes the href format.
 *
 * @param href - The link href to resolve (should start with #)
 * @param validAnchorIds - Set or array of valid anchor IDs in the document
 * @returns The matched anchor ID, or null if no match found
 *
 * @example
 * const anchors = new Set(['my-heading', 'introduction', 'conclusion']);
 * resolveAnchorLink('#My Heading', anchors) // => 'my-heading'
 * resolveAnchorLink('#my-heading', anchors) // => 'my-heading'
 * resolveAnchorLink('#unknown', anchors) // => null
 */
export function resolveAnchorLink(
	href: string,
	validAnchorIds: Set<string> | string[],
): string | null {
	// Remove leading # if present
	const cleanHref = href.startsWith('#') ? href.slice(1) : href;

	// If the href is empty after removing #, return null
	if (cleanHref === '') {
		return null;
	}

	// Convert array to Set for efficient lookup if needed
	const anchorSet =
		validAnchorIds instanceof Set ? validAnchorIds : new Set(validAnchorIds);

	// Generate the expected anchor ID from the href text
	// This handles cases like "#My Heading" -> "my-heading"
	const expectedAnchorId = generateAnchorId(cleanHref);

	// First, try exact match (case-sensitive)
	if (anchorSet.has(expectedAnchorId)) {
		return expectedAnchorId;
	}

	// If no exact match, try case-insensitive matching
	// This handles cases where the href might already be in anchor format
	// but with different casing
	const expectedLower = expectedAnchorId.toLowerCase();
	for (const anchorId of anchorSet) {
		if (anchorId.toLowerCase() === expectedLower) {
			return anchorId;
		}
	}

	// No match found
	return null;
}
