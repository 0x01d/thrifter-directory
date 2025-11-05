import { getCategories } from '$lib/data/loader';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const categories = await getCategories();

	return {
		categories
	};
};
