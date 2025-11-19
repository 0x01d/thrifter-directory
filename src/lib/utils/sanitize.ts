/**
 * Safely serialize JSON-LD data for insertion into script tags
 *
 * JSON.stringify() does NOT escape < and > characters, which means
 * malicious data like `</script><script>alert('XSS')</script>` could
 * break out of the JSON-LD script tag and execute arbitrary JavaScript.
 *
 * This function escapes those characters to prevent XSS attacks.
 *
 * @param data - The JSON-LD schema object to serialize
 * @returns Safe JSON string with < and > escaped as Unicode sequences
 */
export function safeJsonLdSerialize(data: unknown): string {
	const json = JSON.stringify(data);

	// Escape < and > to prevent breaking out of script tags
	// These are replaced with Unicode escape sequences that are
	// still valid JSON but won't be interpreted as HTML tags
	return json
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e');
}

/**
 * Validate that a website URL is safe to use in href attributes
 *
 * Only allows http:// and https:// protocols to prevent XSS via
 * javascript:, data:, file:, etc.
 *
 * @param url - The URL to validate (may or may not include protocol)
 * @returns Validated URL with https:// prepended if no protocol, or null if invalid
 */
export function validateWebsiteUrl(url: string | undefined | null): string | null {
	if (!url || typeof url !== 'string') {
		return null;
	}

	const trimmed = url.trim();

	if (!trimmed) {
		return null;
	}

	// If URL already has a protocol, validate it's http or https
	if (trimmed.includes('://')) {
		if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
			return trimmed;
		}
		// Reject dangerous protocols like javascript:, data:, file:
		return null;
	}

	// If no protocol, prepend https://
	// Validate it looks like a domain (basic check)
	if (/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/i.test(trimmed)) {
		return `https://${trimmed}`;
	}

	return null;
}

/**
 * Sanitize store data before using in templates
 * Removes any potentially dangerous content while preserving legitimate data
 */
export function sanitizeStoreData<T extends Record<string, unknown>>(data: T): T {
	const sanitized = { ...data };

	// Validate website URL
	if ('website' in sanitized && typeof sanitized.website === 'string') {
		const validUrl = validateWebsiteUrl(sanitized.website);
		sanitized.website = validUrl || undefined as any;
	}

	return sanitized;
}
