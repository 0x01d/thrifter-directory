import type { Handle, Reroute } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

export const handle: Handle = handleParaglide;

// Reroute language-prefixed URLs to base routes
export const reroute: Reroute = ({ url }) => {
	// Handle /fr/* routes - map to base canonical routes
	if (url.pathname.startsWith('/fr/') || url.pathname === '/fr') {
		const path = url.pathname.replace(/^\/fr/, '') || '/';

		// Map French URL patterns back to canonical route files
		return path
			.replace(/^\/villes/, '/cities') // /fr/villes → /cities
			.replace(/^\/categories/, '/categories'); // /fr/categories → /categories (no change)
	}

	// Handle /en/* routes - map to base canonical routes
	if (url.pathname.startsWith('/en/') || url.pathname === '/en') {
		const path = url.pathname.replace(/^\/en/, '') || '/';

		// Map English URL patterns back to canonical route files
		return path
			.replace(/^\/cities/, '/cities') // /en/cities → /cities (no change)
			.replace(/^\/categories/, '/categories'); // /en/categories → /categories (no change)
	}

	// Handle Dutch localized URLs - map to canonical routes
	if (url.pathname.startsWith('/categorieen')) {
		return url.pathname.replace(/^\/categorieen/, '/categories');
	}
	if (url.pathname.startsWith('/steden')) {
		return url.pathname.replace(/^\/steden/, '/cities');
	}
};
