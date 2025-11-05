import { getStoreBySlug, loadAllStores } from '$lib/data/loader';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const store = await getStoreBySlug(params.store);

	if (!store) {
		throw error(404, 'Store not found');
	}

	return {
		store
	};
};

// For SSG: generate pages for all stores
export const entries: EntryGenerator = async () => {
	const stores = await loadAllStores();
	return stores.map((store) => ({
		province: store.province.toLowerCase().replace(/\s+/g, '-'),
		city: store.city.toLowerCase().replace(/\s+/g, '-'),
		store: store.slug
	}));
};

export const prerender = true;
