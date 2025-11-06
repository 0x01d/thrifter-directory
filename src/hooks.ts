import { deLocalizeUrl } from '$lib/paraglide/runtime';

export const reroute = ({ url }) => {
	const delocalized = deLocalizeUrl(url);
	return delocalized.pathname;
};
