import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import fs from 'fs';
import path from 'path';

// Helper function to slugify strings
function slugify(text) {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/[\s_]+/g, '-')
		.replace(/[^\w\-]+/g, '')
		.replace(/\-\-+/g, '-');
}

// Generate prerender entries for all language variants
function generatePrerenderEntries() {
	const entries = [];

	// Read the store data from data/stores directory
	const dataDir = path.join(process.cwd(), 'data', 'stores');
	let allStores = [];

	try {
		const files = fs.readdirSync(dataDir);
		const jsonFiles = files.filter(file => file.endsWith('.json'));

		// In dev mode, only load first 5 files
		const filesToLoad = process.env.BUILD_DEV === 'true'
			? jsonFiles.slice(0, 5)
			: jsonFiles;

		for (const file of filesToLoad) {
			const fileContent = fs.readFileSync(path.join(dataDir, file), 'utf-8');
			const stores = JSON.parse(fileContent);
			allStores = allStores.concat(stores);
		}
	} catch (error) {
		console.warn('Could not read data files for prerender entries:', error.message);
		return ['/', '/fr', '/en'];
	}

	const data = allStores;

	// Extract unique values with proper slugification
	const provinces = [...new Set(data.map(store => slugify(store.province)))];
	const cities = [...new Set(data.map(store => ({
		provinceSlug: slugify(store.province),
		citySlug: slugify(store.city)
	})).map(c => JSON.stringify(c)))].map(c => JSON.parse(c));

	const stores = data.map(store => ({
		provinceSlug: slugify(store.province),
		citySlug: slugify(store.city),
		storeSlug: slugify(`${store.name}-${store.city}`)
	}));

	const categories = [...new Set(data.flatMap(store => {
		if (!store.category) return [];
		// Categories can be comma-separated
		return store.category.split(',').map(c => c.trim().toLowerCase());
	}))];

	// Home page - nl is /, fr is /fr, en is /en
	entries.push('/');
	// TEMP: commenting out language-prefixed URLs to test
	// entries.push('/fr');
	// entries.push('/en');

	// Categories list page - nl is /categorieen, fr is /fr/categories, en is /en/categories
	entries.push('/categorieen');
	// entries.push('/fr/categories');
	// entries.push('/en/categories');

	// Cities list page - nl is /steden, fr is /fr/villes, en is /en/villes
	entries.push('/steden');
	// entries.push('/fr/villes');
	// entries.push('/en/cities');

	// Category detail pages - nl is /categorieen/:category, fr is /fr/categories/:category, en is /en/categories/:category
	for (const category of categories) {
		entries.push(`/categorieen/${category}`);
		// entries.push(`/fr/categories/${category}`);
		// entries.push(`/en/categories/${category}`);
	}

	// Province pages - nl is /:province, fr is /fr/:province, en is /en/:province
	for (const province of provinces) {
		entries.push(`/${province}`);
		// entries.push(`/fr/${province}`);
		// entries.push(`/en/${province}`);

		// Province + Category pages
		for (const category of categories) {
			entries.push(`/${province}/categorieen/${category}`);
			// entries.push(`/fr/${province}/categories/${category}`);
			// entries.push(`/en/${province}/categories/${category}`);
		}
	}

	// City pages - nl is /:province/:city, fr is /fr/:province/:city, en is /en/:province/:city
	for (const city of cities) {
		entries.push(`/${city.provinceSlug}/${city.citySlug}`);
		// entries.push(`/fr/${city.provinceSlug}/${city.citySlug}`);
		// entries.push(`/en/${city.provinceSlug}/${city.citySlug}`);

		// City + Category pages
		for (const category of categories) {
			entries.push(`/${city.provinceSlug}/${city.citySlug}/categorieen/${category}`);
			// entries.push(`/fr/${city.provinceSlug}/${city.citySlug}/categories/${category}`);
			// entries.push(`/en/${city.provinceSlug}/${city.citySlug}/categories/${category}`);
		}
	}

	// Store pages - nl is /:province/:city/:store, fr is /fr/:province/:city/:store, en is /en/:province/:city/:store
	for (const store of stores) {
		entries.push(`/${store.provinceSlug}/${store.citySlug}/${store.storeSlug}`);
		// entries.push(`/fr/${store.provinceSlug}/${store.citySlug}/${store.storeSlug}`);
		// entries.push(`/en/${store.provinceSlug}/${store.citySlug}/${store.storeSlug}`);
	}

	return entries;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		prerender: {
			entries: ['*'],
			crawl: true,
			handleHttpError: ({ status, path, referrer }) => {
				// Ignore 404s for all translated URLs - they're handled by the reroute hook at runtime
				// The prerenderer can't handle them properly, but the files will be generated correctly
				if (status === 404) {
					console.log(`Ignoring 404 during prerender: ${path}`);
					return;
				}
				// For other errors, throw
				throw new Error(`${status} ${path}${referrer ? ` (referred by ${referrer})` : ''}`);
			}
		}
	}
};

export default config;
