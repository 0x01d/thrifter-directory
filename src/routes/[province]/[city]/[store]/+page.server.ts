import { getStoreBySlug, loadDirectoryData } from '$lib/data/loader';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';
import { slugify } from '$lib/utils/slug';

export const load: PageServerLoad = async ({ params }) => {
	const store = await getStoreBySlug(params.store);

	if (!store) {
		throw error(404, 'Store not found');
	}

	// Get proper slugs for province and city
	const data = await loadDirectoryData();
	const province = data.provinces.find((p) => p.slug === params.province);
	const city = data.cities.find((c) => c.slug === params.city && c.provinceSlug === params.province);

	return {
		store,
		provinceSlug: province?.slug || slugify(store.province),
		citySlug: city?.slug || slugify(store.city)
	};
};

// For SSG: generate pages for all stores
export const entries: EntryGenerator = async () => {
	const data = await loadDirectoryData();
	return data.stores.map((store) => {
		const province = data.provinces.find((p) => p.name === store.province);
		const city = data.cities.find((c) => c.name === store.city && c.province === store.province);

		return {
			province: province?.slug || slugify(store.province),
			city: city?.slug || slugify(store.city),
			store: store.slug
		};
	});
};

export const prerender = true;
