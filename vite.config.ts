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
				// Most specific patterns first - City + Category
				{
					pattern: '/:province/:city/categories/:category',
					localized: [
						['nl', '/:province/:city/categorieen/:category'],
						['fr', '/:province/:city/categories/:category'],
						['en', '/:province/:city/categories/:category']
					]
				},
				// Province + Category
				{
					pattern: '/:province/categories/:category',
					localized: [
						['nl', '/:province/categorieen/:category'],
						['fr', '/:province/categories/:category'],
						['en', '/:province/categories/:category']
					]
				},
				// Category detail page
				{
					pattern: '/categories/:category',
					localized: [
						['nl', '/categorieen/:category'],
						['fr', '/categories/:category'],
						['en', '/categories/:category']
					]
				},
				// Categories list page
				{
					pattern: '/categories',
					localized: [
						['nl', '/categorieen'],
						['fr', '/categories'],
						['en', '/categories']
					]
				},
				// Cities list page
				{
					pattern: '/cities',
					localized: [
						['nl', '/steden'],
						['fr', '/villes'],
						['en', '/cities']
					]
				},
				// Wildcard pattern for all other untranslated routes
				{
					pattern: '/:path(.*)?',
					localized: [
						['nl', '/:path(.*)?'],
						['fr', '/:path(.*)?'],
						['en', '/:path(.*)?']
					]
				}
			]
		})
	]
});
