import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404s for language-prefixed routes during prerendering
				// These routes are handled by Paraglide middleware at runtime
				if (path === '/fr' || path === '/en' || path.startsWith('/fr/') || path.startsWith('/en/')) {
					return;
				}
				// Throw error for any other 404s
				throw new Error(message);
			}
		}
	}
};

export default config;
