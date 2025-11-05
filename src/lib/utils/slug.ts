/**
 * Generate URL-friendly slug from text
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
		.replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
		.replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate unique slug for a store
 */
export function generateStoreSlug(store: { name: string; city: string }): string {
	return `${slugify(store.name)}-${slugify(store.city)}`;
}
