import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import type {
	ThriftStore,
	ThriftStoreWithSlug,
	Province,
	City,
	Category,
	DirectoryData
} from '$lib/types/thrift-store';
import { slugify, generateStoreSlug } from '$lib/utils/slug';
import { getAllCategories, storeMatchesCategory } from './categories';

const DATA_DIR = 'data/stores';

/**
 * Load all thrift stores from JSON files
 */
export async function loadAllStores(): Promise<ThriftStoreWithSlug[]> {
	const files = await readdir(DATA_DIR);
	const jsonFiles = files.filter((file) => file.endsWith('.json'));

	const allStores: ThriftStoreWithSlug[] = [];

	for (const file of jsonFiles) {
		const content = await readFile(join(DATA_DIR, file), 'utf-8');
		const stores: ThriftStore[] = JSON.parse(content);

		for (const store of stores) {
			allStores.push({
				...store,
				slug: generateStoreSlug(store)
			});
		}
	}

	return allStores;
}

/**
 * Build complete directory data structure
 */
export async function loadDirectoryData(): Promise<DirectoryData> {
	const stores = await loadAllStores();

	// Group stores by province
	const storesByProvince = new Map<string, ThriftStoreWithSlug[]>();
	const storesByCity = new Map<string, ThriftStoreWithSlug[]>();
	const storesByCategory = new Map<string, ThriftStoreWithSlug[]>();
	const storesByCategoryAndProvince = new Map<string, ThriftStoreWithSlug[]>();
	const storesByCategoryAndCity = new Map<string, ThriftStoreWithSlug[]>();

	// Get all category configs
	const categoryConfigs = getAllCategories();

	for (const store of stores) {
		// By province
		const provinceKey = slugify(store.province);
		if (!storesByProvince.has(provinceKey)) {
			storesByProvince.set(provinceKey, []);
		}
		storesByProvince.get(provinceKey)!.push(store);

		// By city
		const cityKey = `${provinceKey}/${slugify(store.city)}`;
		if (!storesByCity.has(cityKey)) {
			storesByCity.set(cityKey, []);
		}
		storesByCity.get(cityKey)!.push(store);

		// By category
		for (const categoryConfig of categoryConfigs) {
			if (storeMatchesCategory(store.category, categoryConfig.slug)) {
				// Category only
				if (!storesByCategory.has(categoryConfig.slug)) {
					storesByCategory.set(categoryConfig.slug, []);
				}
				storesByCategory.get(categoryConfig.slug)!.push(store);

				// Category + Province
				const categoryProvinceKey = `${categoryConfig.slug}/${provinceKey}`;
				if (!storesByCategoryAndProvince.has(categoryProvinceKey)) {
					storesByCategoryAndProvince.set(categoryProvinceKey, []);
				}
				storesByCategoryAndProvince.get(categoryProvinceKey)!.push(store);

				// Category + City
				const categoryCityKey = `${categoryConfig.slug}/${cityKey}`;
				if (!storesByCategoryAndCity.has(categoryCityKey)) {
					storesByCategoryAndCity.set(categoryCityKey, []);
				}
				storesByCategoryAndCity.get(categoryCityKey)!.push(store);
			}
		}
	}

	// Build provinces list
	const provincesMap = new Map<string, Set<string>>();
	for (const store of stores) {
		const provinceSlug = slugify(store.province);
		if (!provincesMap.has(provinceSlug)) {
			provincesMap.set(provinceSlug, new Set());
		}
		provincesMap.get(provinceSlug)!.add(store.city);
	}

	const provinces: Province[] = Array.from(provincesMap.entries()).map(
		([slug, cities]) => ({
			name:
				stores.find((s) => slugify(s.province) === slug)?.province || slug,
			slug,
			storeCount: storesByProvince.get(slug)?.length || 0,
			cities: Array.from(cities).sort()
		})
	);

	// Build cities list
	const citiesMap = new Map<string, { province: string; provinceSlug: string }>();
	for (const store of stores) {
		const cityKey = `${slugify(store.province)}/${slugify(store.city)}`;
		if (!citiesMap.has(cityKey)) {
			citiesMap.set(cityKey, {
				province: store.province,
				provinceSlug: slugify(store.province)
			});
		}
	}

	const cities: City[] = Array.from(citiesMap.entries()).map(([key, data]) => {
		const citySlug = key.split('/')[1];
		const cityStores = storesByCity.get(key) || [];
		return {
			name: cityStores[0]?.city || citySlug,
			slug: citySlug,
			province: data.province,
			provinceSlug: data.provinceSlug,
			storeCount: cityStores.length
		};
	});

	// Build categories list
	const categories: Category[] = categoryConfigs.map((config) => ({
		slug: config.slug,
		nameNL: config.nameNL,
		nameFR: config.nameFR,
		nameEN: config.nameEN,
		storeCount: storesByCategory.get(config.slug)?.length || 0
	}));

	return {
		stores,
		provinces: provinces.sort((a, b) => a.name.localeCompare(b.name)),
		cities: cities.sort((a, b) => a.name.localeCompare(b.name)),
		categories: categories.filter((c) => c.storeCount > 0),
		storesByProvince,
		storesByCity,
		storesByCategory,
		storesByCategoryAndProvince,
		storesByCategoryAndCity
	};
}

/**
 * Get all stores for a specific province
 */
export async function getStoresByProvince(
	provinceSlug: string
): Promise<ThriftStoreWithSlug[]> {
	const data = await loadDirectoryData();
	return data.storesByProvince.get(provinceSlug) || [];
}

/**
 * Get all stores for a specific city
 */
export async function getStoresByCity(
	provinceSlug: string,
	citySlug: string
): Promise<ThriftStoreWithSlug[]> {
	const data = await loadDirectoryData();
	const cityKey = `${provinceSlug}/${citySlug}`;
	return data.storesByCity.get(cityKey) || [];
}

/**
 * Get a single store by slug
 */
export async function getStoreBySlug(
	storeSlug: string
): Promise<ThriftStoreWithSlug | undefined> {
	const stores = await loadAllStores();
	return stores.find((store) => store.slug === storeSlug);
}

/**
 * Get all provinces
 */
export async function getProvinces(): Promise<Province[]> {
	const data = await loadDirectoryData();
	return data.provinces;
}

/**
 * Get all cities for a province
 */
export async function getCitiesForProvince(provinceSlug: string): Promise<City[]> {
	const data = await loadDirectoryData();
	return data.cities.filter((city) => city.provinceSlug === provinceSlug);
}

/**
 * Get all cities
 */
export async function getCities(): Promise<City[]> {
	const data = await loadDirectoryData();
	return data.cities;
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
	const data = await loadDirectoryData();
	return data.categories;
}

/**
 * Get all stores for a specific category
 */
export async function getStoresByCategory(
	categorySlug: string
): Promise<ThriftStoreWithSlug[]> {
	const data = await loadDirectoryData();
	return data.storesByCategory.get(categorySlug) || [];
}

/**
 * Get all stores for a specific category in a province
 */
export async function getStoresByCategoryAndProvince(
	categorySlug: string,
	provinceSlug: string
): Promise<ThriftStoreWithSlug[]> {
	const data = await loadDirectoryData();
	const key = `${categorySlug}/${provinceSlug}`;
	return data.storesByCategoryAndProvince.get(key) || [];
}

/**
 * Get all stores for a specific category in a city
 */
export async function getStoresByCategoryAndCity(
	categorySlug: string,
	provinceSlug: string,
	citySlug: string
): Promise<ThriftStoreWithSlug[]> {
	const data = await loadDirectoryData();
	const key = `${categorySlug}/${provinceSlug}/${citySlug}`;
	return data.storesByCategoryAndCity.get(key) || [];
}
