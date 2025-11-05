import { getStoresByProvince, getCitiesForProvince, getProvinces } from '$lib/data/loader';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const stores = await getStoresByProvince(params.province);
	const cities = await getCitiesForProvince(params.province);

	if (stores.length === 0) {
		throw error(404, 'Province not found');
	}

	const provinceName = stores[0]?.province || params.province;

	return {
		province: {
			name: provinceName,
			slug: params.province
		},
		stores,
		cities
	};
};

// For SSG: generate pages for all provinces
export const entries: EntryGenerator = async () => {
	const provinces = await getProvinces();
	return provinces.map((province) => ({
		province: province.slug
	}));
};

export const prerender = true;
