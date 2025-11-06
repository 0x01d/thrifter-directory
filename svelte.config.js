import adapter from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import fs from 'fs';
import path from 'path';

// Category slugs for generating prerender entries
const CATEGORY_SLUGS = ['vintage-kleding', 'designer-merken', 'meubels', 'boeken', 'elektronica', 'speelgoed'];

// Helper function to slugify strings - matches src/lib/utils/slug.ts
function slugify(text) {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
		.replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
		.replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Generate store slug - matches generateStoreSlug from src/lib/utils/slug.ts
function generateStoreSlug(store) {
	return `${slugify(store.name)}-${slugify(store.city)}`;
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
		storeSlug: generateStoreSlug(store)
	}));

	// Use predefined category slugs instead of deriving from store data
	const categories = CATEGORY_SLUGS;

	// Home page - nl is /, fr is /fr, en is /en
	entries.push('/');
	entries.push('/fr');
	entries.push('/en');

	// Categories list page - base pattern: /categories
	// Localized: nl=/categorieen, fr=/fr/categories, en=/en/categories
	entries.push('/categories');  // Base pattern (actual route)
	entries.push('/categorieen');
	entries.push('/fr/categories');
	entries.push('/en/categories');

	// Cities list page - base pattern: /cities
	// Localized: nl=/steden, fr=/fr/villes, en=/en/cities
	entries.push('/cities');  // Base pattern (actual route)
	entries.push('/steden');
	entries.push('/fr/villes');
	entries.push('/en/cities');

	// Sitemap
	entries.push('/sitemap.xml');

	// Category detail pages - base pattern: /categories/:category
	// Localized: nl=/categorieen/:category, fr=/fr/categories/:category, en=/en/categories/:category
	for (const category of categories) {
		entries.push(`/categories/${category}`);  // Base pattern
		entries.push(`/categorieen/${category}`);
		entries.push(`/fr/categories/${category}`);
		entries.push(`/en/categories/${category}`);
	}

	// Province pages - base pattern: /:province
	// Localized: nl=/:province, fr=/fr/:province, en=/en/:province
	for (const province of provinces) {
		entries.push(`/${province}`);  // nl = base pattern
		entries.push(`/fr/${province}`);
		entries.push(`/en/${province}`);

		// Province + Category pages - base pattern: /:province/categories/:category
		// Localized: nl=/:province/categorieen/:category, fr=/fr/:province/categories/:category, en=/en/:province/categories/:category
		for (const category of categories) {
			entries.push(`/${province}/categories/${category}`);  // Base pattern
			entries.push(`/${province}/categorieen/${category}`);
			entries.push(`/fr/${province}/categories/${category}`);
			entries.push(`/en/${province}/categories/${category}`);
		}
	}

	// City pages - base pattern: /:province/:city
	// Localized: nl=/:province/:city, fr=/fr/:province/:city, en=/en/:province/:city
	for (const city of cities) {
		entries.push(`/${city.provinceSlug}/${city.citySlug}`);  // nl = base pattern
		entries.push(`/fr/${city.provinceSlug}/${city.citySlug}`);
		entries.push(`/en/${city.provinceSlug}/${city.citySlug}`);

		// City + Category pages - base pattern: /:province/:city/categories/:category
		// Localized: nl=/:province/:city/categorieen/:category, fr=/fr/:province/:city/categories/:category, en=/en/:province/:city/categories/:category
		for (const category of categories) {
			entries.push(`/${city.provinceSlug}/${city.citySlug}/categories/${category}`);  // Base pattern
			entries.push(`/${city.provinceSlug}/${city.citySlug}/categorieen/${category}`);
			entries.push(`/fr/${city.provinceSlug}/${city.citySlug}/categories/${category}`);
			entries.push(`/en/${city.provinceSlug}/${city.citySlug}/categories/${category}`);
		}
	}

	// Store pages - base pattern: /:province/:city/:store
	// Localized: nl=/:province/:city/:store, fr=/fr/:province/:city/:store, en=/en/:province/:city/:store
	for (const store of stores) {
		entries.push(`/${store.provinceSlug}/${store.citySlug}/${store.storeSlug}`);  // nl = base pattern
		entries.push(`/fr/${store.provinceSlug}/${store.citySlug}/${store.storeSlug}`);
		entries.push(`/en/${store.provinceSlug}/${store.citySlug}/${store.storeSlug}`);
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
			entries: generatePrerenderEntries(),
			crawl: true,  // Enable crawling to follow invisible anchor tags for language variants
			handleHttpError: ({ status, path, referrer }) => {
				// Ignore 404s for all translated URLs - they're handled by the reroute hook
				// This includes:
				// - Language root pages: /fr, /en
				// - Language-prefixed URLs: /fr/*, /en/*
				// - Translated path names: /categorieen, /steden, /villes, /cities, /categories
				if (status === 404) {
					const isLanguagePrefixed = path.startsWith('/fr') || path.startsWith('/en');
					const isTranslatedPath = path.includes('/categorieen') || path.includes('/steden') ||
						path.includes('/villes') || path.includes('/cities') || path.includes('/categories');

					if (isLanguagePrefixed || isTranslatedPath) {
						console.log(`[Prerender] Ignoring 404 for translated URL: ${path}`);
						return;
					}
				}

				// For other errors, throw
				throw new Error(`${status} ${path}${referrer ? ` (referred by ${referrer})` : ''}`);
			}
		}
	}
};

export default config;
