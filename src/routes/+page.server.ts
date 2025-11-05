import { getProvinces } from '$lib/data/loader';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const provinces = await getProvinces();

	return {
		provinces
	};
};
