import { loadDirectoryData } from '$lib/data/loader';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	const data = await loadDirectoryData();
	const baseUrl = 'https://thrifter.be';

	// Get all supported locales
	const locales = ['nl', 'fr', 'en'];

	const urls: string[] = [];

	// Add home page for each locale
	for (const locale of locales) {
		urls.push(`${baseUrl}/${locale}`);

		// Cities page - translated per locale
		const citiesPath = locale === 'nl' ? 'steden' : locale === 'fr' ? 'villes' : 'cities';
		urls.push(`${baseUrl}/${locale}/${citiesPath}`);

		// Categories page - translated per locale
		const categoriesPath = locale === 'nl' ? 'categorieen' : 'categories';
		urls.push(`${baseUrl}/${locale}/${categoriesPath}`);
	}

	// Add province pages for each locale
	for (const province of data.provinces) {
		for (const locale of locales) {
			urls.push(`${baseUrl}/${locale}/${province.slug}`);
		}
	}

	// Add city pages for each locale
	for (const city of data.cities) {
		for (const locale of locales) {
			urls.push(`${baseUrl}/${locale}/${city.provinceSlug}/${city.slug}`);
		}
	}

	// Add category pages for each locale
	for (const category of data.categories) {
		for (const locale of locales) {
			const categoriesPath = locale === 'nl' ? 'categorieen' : 'categories';
			urls.push(`${baseUrl}/${locale}/${categoriesPath}/${category.slug}`);
		}
	}

	// Add province + category pages for each locale
	for (const province of data.provinces) {
		for (const category of data.categories) {
			const key = `${category.slug}/${province.slug}`;
			const stores = data.storesByCategoryAndProvince.get(key);
			if (stores && stores.length > 0) {
				for (const locale of locales) {
					const categoriesPath = locale === 'nl' ? 'categorieen' : 'categories';
					urls.push(`${baseUrl}/${locale}/${province.slug}/${categoriesPath}/${category.slug}`);
				}
			}
		}
	}

	// Add city + category pages for each locale
	for (const city of data.cities) {
		for (const category of data.categories) {
			const key = `${category.slug}/${city.provinceSlug}/${city.slug}`;
			const stores = data.storesByCategoryAndCity.get(key);
			if (stores && stores.length > 0) {
				for (const locale of locales) {
					const categoriesPath = locale === 'nl' ? 'categorieen' : 'categories';
					urls.push(
						`${baseUrl}/${locale}/${city.provinceSlug}/${city.slug}/${categoriesPath}/${category.slug}`
					);
				}
			}
		}
	}

	// Add store pages for each locale
	for (const store of data.stores) {
		const provinceSlug = store.slug.split('-').slice(0, -2).join('-');
		const citySlug = store.slug.split('-').slice(-2, -1)[0];

		// Use the actual province and city slugs from the store data
		for (const locale of locales) {
			// Find the correct province and city slugs
			const city = data.cities.find(
				(c) =>
					c.name.toLowerCase() === store.city.toLowerCase() &&
					c.province.toLowerCase() === store.province.toLowerCase()
			);

			if (city) {
				urls.push(`${baseUrl}/${locale}/${city.provinceSlug}/${city.slug}/${store.slug}`);
			}
		}
	}

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(url) => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
