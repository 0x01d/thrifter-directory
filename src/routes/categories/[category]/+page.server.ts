import { getStoresByCategory, loadDirectoryData } from '$lib/data/loader';
import { getCategoryBySlug } from '$lib/data/categories';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const categoryConfig = getCategoryBySlug(params.category);

	if (!categoryConfig) {
		throw error(404, 'Category not found');
	}

	const stores = await getStoresByCategory(params.category);

	if (stores.length === 0) {
		throw error(404, 'No stores found for this category');
	}

	return {
		category: {
			slug: categoryConfig.slug,
			nameNL: categoryConfig.nameNL,
			nameFR: categoryConfig.nameFR,
			nameEN: categoryConfig.nameEN,
			descriptionNL: categoryConfig.descriptionNL,
			descriptionFR: categoryConfig.descriptionFR,
			descriptionEN: categoryConfig.descriptionEN,
			keywords: categoryConfig.keywords,
			icon: categoryConfig.icon
		},
		stores
	};
};

// For SSG: generate pages for all categories
export const entries: EntryGenerator = async () => {
	const data = await loadDirectoryData();
	return data.categories.map((category) => ({
		category: category.slug
	}));
};

export const prerender = true;
