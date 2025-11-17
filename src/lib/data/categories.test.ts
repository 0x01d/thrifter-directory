import { describe, it, expect } from 'vitest';
import {
	getAllCategories,
	getCategoryBySlug,
	storeMatchesCategory,
	CATEGORIES,
	type CategoryConfig
} from './categories';

describe('getAllCategories', () => {
	it('should return all category configs', () => {
		const categories = getAllCategories();

		expect(Array.isArray(categories)).toBe(true);
		expect(categories.length).toBeGreaterThan(0);
	});

	it('should return categories with all required fields', () => {
		const categories = getAllCategories();

		categories.forEach((category) => {
			expect(category.slug).toBeDefined();
			expect(category.nameNL).toBeDefined();
			expect(category.nameFR).toBeDefined();
			expect(category.nameEN).toBeDefined();
			expect(category.descriptionNL).toBeDefined();
			expect(category.descriptionFR).toBeDefined();
			expect(category.descriptionEN).toBeDefined();
			expect(Array.isArray(category.matchCategories)).toBe(true);
			expect(Array.isArray(category.keywords)).toBe(true);
			expect(category.icon).toBeDefined();
		});
	});

	it('should include expected categories', () => {
		const categories = getAllCategories();
		const slugs = categories.map((c) => c.slug);

		expect(slugs).toContain('vintage-kleding');
		expect(slugs).toContain('designer-merken');
		expect(slugs).toContain('meubels');
		expect(slugs).toContain('boeken');
		expect(slugs).toContain('elektronica');
		expect(slugs).toContain('speelgoed');
	});

	it('should have unique slugs', () => {
		const categories = getAllCategories();
		const slugs = categories.map((c) => c.slug);
		const uniqueSlugs = new Set(slugs);

		expect(slugs.length).toBe(uniqueSlugs.size);
	});
});

describe('getCategoryBySlug', () => {
	it('should return category for valid slug', () => {
		const category = getCategoryBySlug('vintage-kleding');

		expect(category).toBeDefined();
		expect(category?.slug).toBe('vintage-kleding');
		expect(category?.nameNL).toBe('Vintage Kleding');
	});

	it('should return undefined for invalid slug', () => {
		const category = getCategoryBySlug('non-existent-category');

		expect(category).toBeUndefined();
	});

	it('should return correct category for each known slug', () => {
		expect(getCategoryBySlug('vintage-kleding')?.nameNL).toBe('Vintage Kleding');
		expect(getCategoryBySlug('designer-merken')?.nameNL).toBe('Designer Merken');
		expect(getCategoryBySlug('meubels')?.nameNL).toBe('Meubels');
		expect(getCategoryBySlug('boeken')?.nameNL).toBe('Boeken');
		expect(getCategoryBySlug('elektronica')?.nameNL).toBe('Elektronica');
		expect(getCategoryBySlug('speelgoed')?.nameNL).toBe('Speelgoed');
	});

	it('should be case-sensitive for slugs', () => {
		// Slugs should be lowercase
		const category1 = getCategoryBySlug('vintage-kleding');
		const category2 = getCategoryBySlug('VINTAGE-KLEDING');

		expect(category1).toBeDefined();
		expect(category2).toBeUndefined();
	});
});

describe('storeMatchesCategory', () => {
	describe('basic matching', () => {
		it('should match exact category name', () => {
			expect(storeMatchesCategory('Vintage clothing store', 'vintage-kleding')).toBe(true);
			expect(storeMatchesCategory('Used book store', 'boeken')).toBe(true);
			expect(storeMatchesCategory('Used furniture store', 'meubels')).toBe(true);
		});

		it('should not match unrelated categories', () => {
			expect(storeMatchesCategory('Book store', 'meubels')).toBe(false);
			expect(storeMatchesCategory('Clothing store', 'boeken')).toBe(false);
		});

		it('should return false for non-existent category slug', () => {
			expect(storeMatchesCategory('Vintage clothing store', 'non-existent')).toBe(false);
		});
	});

	describe('case insensitivity', () => {
		it('should match regardless of case', () => {
			expect(storeMatchesCategory('VINTAGE CLOTHING STORE', 'vintage-kleding')).toBe(true);
			expect(storeMatchesCategory('vintage clothing store', 'vintage-kleding')).toBe(true);
			expect(storeMatchesCategory('Vintage Clothing Store', 'vintage-kleding')).toBe(true);
		});

		it('should handle mixed case in store category', () => {
			expect(storeMatchesCategory('UsEd BoOk StOrE', 'boeken')).toBe(true);
		});
	});

	describe('whitespace handling', () => {
		it('should handle leading/trailing whitespace', () => {
			expect(storeMatchesCategory('  Vintage clothing store  ', 'vintage-kleding')).toBe(
				true
			);
			expect(storeMatchesCategory('\tUsed book store\t', 'boeken')).toBe(true);
			expect(storeMatchesCategory(' Used furniture store ', 'meubels')).toBe(true);
		});

		it('should handle whitespace-only strings', () => {
			expect(storeMatchesCategory('   ', 'vintage-kleding')).toBe(false);
			expect(storeMatchesCategory('\t\t', 'boeken')).toBe(false);
		});
	});

	describe('null/undefined handling', () => {
		it('should handle empty string', () => {
			expect(storeMatchesCategory('', 'vintage-kleding')).toBe(false);
		});

		it('should handle null as empty string', () => {
			expect(storeMatchesCategory(null as any, 'vintage-kleding')).toBe(false);
		});

		it('should handle undefined as empty string', () => {
			expect(storeMatchesCategory(undefined as any, 'vintage-kleding')).toBe(false);
		});
	});

	describe('multiple match categories', () => {
		it('should match any of the configured categories for vintage-kleding', () => {
			expect(storeMatchesCategory('Vintage clothing store', 'vintage-kleding')).toBe(true);
			expect(storeMatchesCategory('Vintage Clothing Shop', 'vintage-kleding')).toBe(true);
		});

		it('should match any of the configured categories for designer-merken', () => {
			expect(storeMatchesCategory('Vintage clothing store', 'designer-merken')).toBe(true);
			expect(storeMatchesCategory('Vintage Clothing Shop', 'designer-merken')).toBe(true);
			expect(storeMatchesCategory('Consignment shop', 'designer-merken')).toBe(true);
			expect(storeMatchesCategory('Used clothing store', 'designer-merken')).toBe(true);
			expect(storeMatchesCategory('Clothing store', 'designer-merken')).toBe(true);
		});

		it('should match any of the configured categories for meubels', () => {
			expect(storeMatchesCategory('Used furniture store', 'meubels')).toBe(true);
			expect(storeMatchesCategory('Antique furniture store', 'meubels')).toBe(true);
			expect(storeMatchesCategory('Used office furniture store', 'meubels')).toBe(true);
			expect(storeMatchesCategory('Home goods store', 'meubels')).toBe(true);
			expect(storeMatchesCategory('Homewares Store', 'meubels')).toBe(true);
		});

		it('should match any of the configured categories for boeken', () => {
			expect(storeMatchesCategory('Used book store', 'boeken')).toBe(true);
			expect(storeMatchesCategory('Book store', 'boeken')).toBe(true);
			expect(storeMatchesCategory('Second-hand Book Shop', 'boeken')).toBe(true);
		});

		it('should match any of the configured categories for elektronica', () => {
			expect(storeMatchesCategory('Appliance store', 'elektronica')).toBe(true);
			expect(storeMatchesCategory('Store', 'elektronica')).toBe(true);
			expect(storeMatchesCategory('General store', 'elektronica')).toBe(true);
		});

		it('should match any of the configured categories for speelgoed', () => {
			expect(storeMatchesCategory('Toy store', 'speelgoed')).toBe(true);
			expect(storeMatchesCategory('Hobby store', 'speelgoed')).toBe(true);
			expect(storeMatchesCategory('Store', 'speelgoed')).toBe(true);
			expect(storeMatchesCategory('General store', 'speelgoed')).toBe(true);
		});
	});

	describe('exact matching requirement (current limitation)', () => {
		it('should NOT match partial strings', () => {
			// This is a limitation of the current implementation
			expect(storeMatchesCategory('Vintage clothing', 'vintage-kleding')).toBe(false);
			expect(storeMatchesCategory('Used book', 'boeken')).toBe(false);
		});

		it('should NOT match with extra words', () => {
			// This is a limitation - requires exact match
			expect(storeMatchesCategory('Vintage clothing store and more', 'vintage-kleding')).toBe(
				false
			);
		});

		it('should NOT match typos', () => {
			// No fuzzy matching
			expect(storeMatchesCategory('Vintage clohing store', 'vintage-kleding')).toBe(false);
			expect(storeMatchesCategory('Used bok store', 'boeken')).toBe(false);
		});
	});

	describe('real-world Belgian store categories', () => {
		it('should match common thrift store types', () => {
			expect(storeMatchesCategory('Clothing store', 'designer-merken')).toBe(true);
			expect(storeMatchesCategory('Store', 'elektronica')).toBe(true);
			expect(storeMatchesCategory('General store', 'speelgoed')).toBe(true);
		});

		it('should handle hyphens in category names', () => {
			expect(storeMatchesCategory('Second-hand Book Shop', 'boeken')).toBe(true);
		});
	});

	describe('category overlap', () => {
		it('should allow stores to match multiple categories', () => {
			// A "Vintage clothing store" matches both vintage-kleding and designer-merken
			expect(storeMatchesCategory('Vintage clothing store', 'vintage-kleding')).toBe(true);
			expect(storeMatchesCategory('Vintage clothing store', 'designer-merken')).toBe(true);
		});

		it('should allow "Store" to match multiple categories', () => {
			// Generic "Store" matches both elektronica and speelgoed
			expect(storeMatchesCategory('Store', 'elektronica')).toBe(true);
			expect(storeMatchesCategory('Store', 'speelgoed')).toBe(true);
		});

		it('should allow "General store" to match multiple categories', () => {
			expect(storeMatchesCategory('General store', 'elektronica')).toBe(true);
			expect(storeMatchesCategory('General store', 'speelgoed')).toBe(true);
		});
	});
});

describe('Category configuration integrity', () => {
	it('should have no empty matchCategories arrays', () => {
		const categories = getAllCategories();

		categories.forEach((category) => {
			expect(category.matchCategories.length).toBeGreaterThan(0);
		});
	});

	it('should have no empty keywords arrays', () => {
		const categories = getAllCategories();

		categories.forEach((category) => {
			expect(category.keywords.length).toBeGreaterThan(0);
		});
	});

	it('should have non-empty descriptions in all languages', () => {
		const categories = getAllCategories();

		categories.forEach((category) => {
			expect(category.descriptionNL.length).toBeGreaterThan(0);
			expect(category.descriptionFR.length).toBeGreaterThan(0);
			expect(category.descriptionEN.length).toBeGreaterThan(0);
		});
	});

	it('should have non-empty names in all languages', () => {
		const categories = getAllCategories();

		categories.forEach((category) => {
			expect(category.nameNL.length).toBeGreaterThan(0);
			expect(category.nameFR.length).toBeGreaterThan(0);
			expect(category.nameEN.length).toBeGreaterThan(0);
		});
	});

	it('should have emoji icons', () => {
		const categories = getAllCategories();

		categories.forEach((category) => {
			expect(category.icon.length).toBeGreaterThan(0);
			// Check that it's likely an emoji (simple check)
			expect(category.icon.length).toBeLessThan(10);
		});
	});

	it('should have lowercase slugs with hyphens', () => {
		const categories = getAllCategories();

		categories.forEach((category) => {
			expect(category.slug).toBe(category.slug.toLowerCase());
			expect(category.slug).toMatch(/^[a-z-]+$/);
		});
	});

	it('should not have duplicate match categories within same category', () => {
		const categories = getAllCategories();

		categories.forEach((category) => {
			const matches = category.matchCategories;
			const uniqueMatches = new Set(matches.map((m) => m.toLowerCase().trim()));

			expect(matches.length).toBe(uniqueMatches.size);
		});
	});
});

describe('Category matching edge cases', () => {
	it('should be consistent for same input', () => {
		const result1 = storeMatchesCategory('Vintage clothing store', 'vintage-kleding');
		const result2 = storeMatchesCategory('Vintage clothing store', 'vintage-kleding');
		const result3 = storeMatchesCategory('Vintage clothing store', 'vintage-kleding');

		expect(result1).toBe(result2);
		expect(result2).toBe(result3);
	});

	it('should handle special characters in store category', () => {
		// Special characters won't match unless they're in the config
		expect(storeMatchesCategory('Vintage clothing store!', 'vintage-kleding')).toBe(false);
		expect(storeMatchesCategory('Vintage clothing store?', 'vintage-kleding')).toBe(false);
	});

	it('should handle numbers in store category', () => {
		expect(storeMatchesCategory('Vintage clothing store 2', 'vintage-kleding')).toBe(false);
	});
});
