import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['url', 'preferredLanguage', 'baseLocale'],
			urlPatterns: [
				// Most specific patterns first - City + Category + Store
				{
					pattern: '/:province/:city/:store',
					localized: [
						['nl', '/:province/:city/:store'],
						['fr', '/fr/:province/:city/:store'],
						['en', '/en/:province/:city/:store']
					]
				},
				// City + Category
				{
					pattern: '/:province/:city/categories/:category',
					localized: [
						['nl', '/:province/:city/categorieen/:category'],
						['fr', '/fr/:province/:city/categories/:category'],
						['en', '/en/:province/:city/categories/:category']
					]
				},
				// City page
				{
					pattern: '/:province/:city',
					localized: [
						['nl', '/:province/:city'],
						['fr', '/fr/:province/:city'],
						['en', '/en/:province/:city']
					]
				},
				// Province + Category
				{
					pattern: '/:province/categories/:category',
					localized: [
						['nl', '/:province/categorieen/:category'],
						['fr', '/fr/:province/categories/:category'],
						['en', '/en/:province/categories/:category']
					]
				},
				// Province page
				{
					pattern: '/:province',
					localized: [
						['nl', '/:province'],
						['fr', '/fr/:province'],
						['en', '/en/:province']
					]
				},
				// Category detail page
				{
					pattern: '/categories/:category',
					localized: [
						['nl', '/categorieen/:category'],
						['fr', '/fr/categories/:category'],
						['en', '/en/categories/:category']
					]
				},
				// Categories list page
				{
					pattern: '/categories',
					localized: [
						['nl', '/categorieen'],
						['fr', '/fr/categories'],
						['en', '/en/categories']
					]
				},
				// Cities list page
				{
					pattern: '/cities',
					localized: [
						['nl', '/steden'],
						['fr', '/fr/villes'],
						['en', '/en/cities']
					]
				}
			]
		})
	]
});
