/**
 * Internationalization helper utilities for language switching
 */

/**
 * Valid locale codes for the application
 */
const VALID_LOCALES = ['nl', 'fr', 'en'] as const;

/**
 * Locales that use URL prefixes
 * Note: 'nl' is the base locale and has no prefix
 */
const PREFIXED_LOCALES = ['fr', 'en'] as const;

/**
 * Strip the locale prefix from a localized URL to get the canonical path
 *
 * Examples:
 * - `/fr/antwerpen` → `/antwerpen`
 * - `/en/cities` → `/cities`
 * - `/antwerpen` → `/antwerpen` (NL has no prefix)
 * - `/fr` → `/` (home page)
 * - `/friendly` → `/friendly` (not a locale prefix)
 *
 * This is critical for language switching to prevent accumulating prefixes
 * like /fr/fr/antwerpen when clicking language buttons multiple times.
 *
 * @param path - The localized path (e.g., from $page.url.pathname)
 * @param currentLocale - Optional current locale for validation
 * @returns The canonical (non-localized) path
 */
export function stripLocalePrefix(path: string, currentLocale?: string): string {
	// Handle empty or root paths
	if (!path || path === '/') {
		return '/';
	}

	// Ensure path starts with /
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;

	// Check each prefixed locale
	for (const locale of PREFIXED_LOCALES) {
		const prefix = `/${locale}`;

		// Exact match: /fr or /en (home page for that locale)
		if (normalizedPath === prefix) {
			return '/';
		}

		// Path starts with /fr/ or /en/
		if (normalizedPath.startsWith(`${prefix}/`)) {
			// Strip the prefix to get canonical path
			return normalizedPath.slice(prefix.length);
		}
	}

	// Path doesn't have a locale prefix (either NL or not a valid locale path)
	return normalizedPath;
}

/**
 * Get the canonical path for language switching
 *
 * This ensures that when switching languages, we always start from the
 * canonical (non-localized) path to prevent prefix accumulation.
 *
 * Also preserves query parameters and hash fragments.
 *
 * @param fullPath - The full path including query and hash (e.g., from $page.url)
 * @param currentLocale - The current locale
 * @returns Object with canonical path, search params, and hash
 */
export function getCanonicalPathForSwitching(fullPath: string, currentLocale?: string): {
	pathname: string;
	search: string;
	hash: string;
} {
	try {
		// Parse the URL to separate pathname, search, and hash
		const url = new URL(fullPath, 'http://dummy.com');

		return {
			pathname: stripLocalePrefix(url.pathname, currentLocale),
			search: url.search,
			hash: url.hash
		};
	} catch {
		// If URL parsing fails, just strip prefix from the path
		return {
			pathname: stripLocalePrefix(fullPath, currentLocale),
			search: '',
			hash: ''
		};
	}
}

/**
 * Detect if a path has a locale prefix
 *
 * @param path - The path to check
 * @returns The detected locale or null if no prefix found
 */
export function detectLocalePrefix(path: string): 'fr' | 'en' | null {
	if (!path) {
		return null;
	}

	const normalizedPath = path.startsWith('/') ? path : `/${path}`;

	for (const locale of PREFIXED_LOCALES) {
		const prefix = `/${locale}`;
		if (normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)) {
			return locale;
		}
	}

	return null;
}

/**
 * Validate that a path doesn't have double locale prefixes (bug detection)
 *
 * @param path - The path to validate
 * @returns true if path is valid, false if it has double prefixes
 */
export function validateNoDoublePrefix(path: string): boolean {
	if (!path) {
		return true;
	}

	// Check for patterns like /fr/fr, /en/en, /fr/en, /en/fr, etc.
	const doublePrefixPattern = /^\/(nl|fr|en)\/(nl|fr|en)/;
	return !doublePrefixPattern.test(path);
}

/**
 * Get the locale from a path (either from prefix or assume base locale)
 *
 * @param path - The path to check
 * @returns The locale code ('nl', 'fr', or 'en')
 */
export function getLocaleFromPath(path: string): 'nl' | 'fr' | 'en' {
	const detected = detectLocalePrefix(path);
	return detected || 'nl'; // NL is base locale (no prefix)
}
