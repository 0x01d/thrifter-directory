import { getProvinces } from '$lib/data/loader';
import type { PageServerLoad, EntryGenerator } from './$types';

export const load: PageServerLoad = async () => {
	const provinces = await getProvinces();

	return {
		provinces
	};
};

export const entries: EntryGenerator = () => {
	// Tell SvelteKit to prerender all language variants of the home page
	return [{}];
};
