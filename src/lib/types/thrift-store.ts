/**
 * Core thrift store data structure
 */
export interface ThriftStore {
	// Required fields
	city: string;
	province: string;
	name: string;
	category: string;
	address: string;
	phone: string;
	website: string;
	stars: string;
	review_count: string;
	google_maps_url: string;

	// Optional fields (to be added in future)
	email?: string;
	instagram?: string;
	facebook?: string;
	openingHours?: string;
	specialties?: string[];
	priceRange?: string;
	hasDesigner?: boolean;
	description?: string;
	picturesUrlList?: string[];
}

/**
 * Normalized store data with generated slug
 */
export interface ThriftStoreWithSlug extends ThriftStore {
	slug: string;
}

/**
 * Province data structure
 */
export interface Province {
	name: string;
	slug: string;
	storeCount: number;
	cities: string[];
}

/**
 * City data structure
 */
export interface City {
	name: string;
	slug: string;
	province: string;
	provinceSlug: string;
	storeCount: number;
}

/**
 * Category data structure
 */
export interface Category {
	slug: string;
	nameNL: string;
	nameFR: string;
	nameEN: string;
	storeCount: number;
}

/**
 * Aggregated directory data
 */
export interface DirectoryData {
	stores: ThriftStoreWithSlug[];
	provinces: Province[];
	cities: City[];
	categories: Category[];
	storesByProvince: Map<string, ThriftStoreWithSlug[]>;
	storesByCity: Map<string, ThriftStoreWithSlug[]>;
	storesByCategory: Map<string, ThriftStoreWithSlug[]>;
	storesByCategoryAndProvince: Map<string, ThriftStoreWithSlug[]>;
	storesByCategoryAndCity: Map<string, ThriftStoreWithSlug[]>;
}
