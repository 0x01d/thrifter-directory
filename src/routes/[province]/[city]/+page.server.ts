import { getStoresByCity, loadDirectoryData } from '$lib/data/loader';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const stores = await getStoresByCity(params.province, params.city);

	if (stores.length === 0) {
		throw error(404, 'City not found');
	}

	const cityName = stores[0]?.city || params.city;
	const provinceName = stores[0]?.province || params.province;

	return {
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

// For SSG: generate pages for all cities
export const entries: EntryGenerator = async () => {
	const data = await loadDirectoryData();
	return data.cities.map((city) => ({
		province: city.provinceSlug,
		city: city.slug
	}));
};

export const prerender = true;
