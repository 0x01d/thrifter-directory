import { getStoresByCategoryAndCity, loadDirectoryData } from '$lib/data/loader';
import { getCategoryBySlug } from '$lib/data/categories';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const categoryConfig = getCategoryBySlug(params.category);

	if (!categoryConfig) {
		throw error(404, 'Category not found');
	}

	const stores = await getStoresByCategoryAndCity(
		params.category,
		params.province,
		params.city
	);

	if (stores.length === 0) {
		throw error(404, 'No stores found for this category in this city');
	}

	const cityName = stores[0]?.city || params.city;
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
		city: {
			name: cityName,
			slug: params.city
		},
		province: {
			name: provinceName,
			slug: params.province
		},
		stores
	};
};

// For SSG: generate pages for all city+category combinations
export const entries: EntryGenerator = async () => {
	const data = await loadDirectoryData();
	const entries: { province: string; city: string; category: string }[] = [];

	// Generate entries for each city+category combination that has stores
	for (const city of data.cities) {
		for (const category of data.categories) {
			const key = `${category.slug}/${city.provinceSlug}/${city.slug}`;
			const stores = data.storesByCategoryAndCity.get(key);
			if (stores && stores.length > 0) {
				entries.push({
					province: city.provinceSlug,
					city: city.slug,
					category: category.slug
				});
			}
		}
	}

	return entries;
};

export const prerender = true;
