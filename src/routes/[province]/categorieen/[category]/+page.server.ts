import { getStoresByCategoryAndProvince, loadDirectoryData } from '$lib/data/loader';
import { getCategoryBySlug } from '$lib/data/categories';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const categoryConfig = getCategoryBySlug(params.category);

	if (!categoryConfig) {
		throw error(404, 'Category not found');
	}

	const stores = await getStoresByCategoryAndProvince(params.category, params.province);

	if (stores.length === 0) {
		throw error(404, 'No stores found for this category in this province');
	}

	const provinceName = stores[0]?.province || params.province;

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
		province: {
			name: provinceName,
			slug: params.province
		},
		stores
	};
};

// For SSG: generate pages for all province+category combinations
export const entries: EntryGenerator = async () => {
	const data = await loadDirectoryData();
	const entries: { province: string; category: string }[] = [];

	// Generate entries for each province+category combination that has stores
	for (const province of data.provinces) {
		for (const category of data.categories) {
			const key = `${category.slug}/${province.slug}`;
			const stores = data.storesByCategoryAndProvince.get(key);
			if (stores && stores.length > 0) {
				entries.push({
					province: province.slug,
					category: category.slug
				});
			}
		}
	}

	return entries;
};

export const prerender = true;
