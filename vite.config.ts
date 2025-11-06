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
				// City + Store detail page
				{
					pattern: '/:province/:city/:store',
					localized: [
						['nl', '/:province/:city/:store'],
						['fr', '/:province/:city/:store'],
						['en', '/:province/:city/:store']
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
				// Province + City pages
				{
					pattern: '/:province/:city',
					localized: [
						['nl', '/:province/:city'],
						['fr', '/:province/:city'],
						['en', '/:province/:city']
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
				// Province pages
				{
					pattern: '/:province',
					localized: [
						['nl', '/:province'],
						['fr', '/:province'],
						['en', '/:province']
					]
				},
				// Home page
				{
					pattern: '/',
					localized: [
						['nl', '/'],
						['fr', '/'],
						['en', '/']
					]
				}
			]
		})
	]
});
