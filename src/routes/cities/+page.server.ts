import { getCities } from '$lib/data/loader';
import type { PageServerLoad, EntryGenerator } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const cities = await getCities();

	return {
		cities
	};
};

export const entries: EntryGenerator = () => {
	// Tell SvelteKit to prerender all language variants
	return [{}];
};
