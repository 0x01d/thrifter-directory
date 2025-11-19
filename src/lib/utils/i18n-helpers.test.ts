import { describe, it, expect } from 'vitest';
import {
	stripLocalePrefix,
	getCanonicalPathForSwitching,
	detectLocalePrefix,
	validateNoDoublePrefix,
	getLocaleFromPath
} from './i18n-helpers';

describe('stripLocalePrefix', () => {
	describe('French prefix stripping', () => {
		it('should strip /fr prefix from paths', () => {
			expect(stripLocalePrefix('/fr/antwerpen')).toBe('/antwerpen');
			expect(stripLocalePrefix('/fr/cities')).toBe('/cities');
			expect(stripLocalePrefix('/fr/antwerpen/antwerpen/store')).toBe('/antwerpen/antwerpen/store');
		});

		it('should handle FR home page', () => {
			expect(stripLocalePrefix('/fr')).toBe('/');
		});
	});

	describe('English prefix stripping', () => {
		it('should strip /en prefix from paths', () => {
			expect(stripLocalePrefix('/en/antwerpen')).toBe('/antwerpen');
			expect(stripLocalePrefix('/en/cities')).toBe('/cities');
			expect(stripLocalePrefix('/en/categories/meubels')).toBe('/categories/meubels');
		});

		it('should handle EN home page', () => {
			expect(stripLocalePrefix('/en')).toBe('/');
		});
	});

	describe('Dutch (no prefix) paths', () => {
		it('should leave NL paths unchanged', () => {
			expect(stripLocalePrefix('/antwerpen')).toBe('/antwerpen');
			expect(stripLocalePrefix('/steden')).toBe('/steden');
			expect(stripLocalePrefix('/categorieen')).toBe('/categorieen');
		});

		it('should handle root path', () => {
			expect(stripLocalePrefix('/')).toBe('/');
		});
	});

	describe('Edge cases', () => {
		it('should handle paths that start with locale-like words', () => {
			// 'friendly' starts with 'fr' but is not a locale prefix
			expect(stripLocalePrefix('/friendly')).toBe('/friendly');
			expect(stripLocalePrefix('/french-toast')).toBe('/french-toast');
			expect(stripLocalePrefix('/english-class')).toBe('/english-class');
		});

		it('should handle empty string', () => {
			expect(stripLocalePrefix('')).toBe('/');
		});

		it('should handle paths without leading slash', () => {
			expect(stripLocalePrefix('antwerpen')).toBe('/antwerpen');
			expect(stripLocalePrefix('fr/antwerpen')).toBe('/antwerpen');
		});
	});

	describe('Double prefix detection (bug cases)', () => {
		it('should strip only the first locale prefix from double-prefixed paths', () => {
			// These are BUG cases that shouldn't occur but we handle gracefully
			expect(stripLocalePrefix('/fr/fr/antwerpen')).toBe('/fr/antwerpen');
			expect(stripLocalePrefix('/en/en/cities')).toBe('/en/cities');
			expect(stripLocalePrefix('/fr/en/something')).toBe('/en/something');
		});
	});
});

describe('getCanonicalPathForSwitching', () => {
	it('should extract canonical path, search, and hash', () => {
		const result = getCanonicalPathForSwitching('/fr/antwerpen?search=test#section');

		expect(result.pathname).toBe('/antwerpen');
		expect(result.search).toBe('?search=test');
		expect(result.hash).toBe('#section');
	});

	it('should handle paths without query or hash', () => {
		const result = getCanonicalPathForSwitching('/fr/cities');

		expect(result.pathname).toBe('/cities');
		expect(result.search).toBe('');
		expect(result.hash).toBe('');
	});

	it('should handle paths with only query params', () => {
		const result = getCanonicalPathForSwitching('/en/antwerpen?page=2');

		expect(result.pathname).toBe('/antwerpen');
		expect(result.search).toBe('?page=2');
		expect(result.hash).toBe('');
	});

	it('should handle paths with only hash', () => {
		const result = getCanonicalPathForSwitching('/fr/cities#top');

		expect(result.pathname).toBe('/cities');
		expect(result.search).toBe('');
		expect(result.hash).toBe('#top');
	});

	it('should handle NL (base locale) paths', () => {
		const result = getCanonicalPathForSwitching('/antwerpen?q=test');

		expect(result.pathname).toBe('/antwerpen');
		expect(result.search).toBe('?q=test');
	});

	it('should handle root path with query', () => {
		const result = getCanonicalPathForSwitching('/?welcome=true');

		expect(result.pathname).toBe('/');
		expect(result.search).toBe('?welcome=true');
	});
});

describe('detectLocalePrefix', () => {
	it('should detect FR prefix', () => {
		expect(detectLocalePrefix('/fr/antwerpen')).toBe('fr');
		expect(detectLocalePrefix('/fr')).toBe('fr');
		expect(detectLocalePrefix('/fr/cities/list')).toBe('fr');
	});

	it('should detect EN prefix', () => {
		expect(detectLocalePrefix('/en/antwerpen')).toBe('en');
		expect(detectLocalePrefix('/en')).toBe('en');
		expect(detectLocalePrefix('/en/categories')).toBe('en');
	});

	it('should return null for NL (base locale) paths', () => {
		expect(detectLocalePrefix('/antwerpen')).toBeNull();
		expect(detectLocalePrefix('/steden')).toBeNull();
		expect(detectLocalePrefix('/')).toBeNull();
	});

	it('should return null for non-locale paths', () => {
		expect(detectLocalePrefix('/friendly')).toBeNull();
		expect(detectLocalePrefix('/french-toast')).toBeNull();
		expect(detectLocalePrefix('/english-class')).toBeNull();
	});

	it('should return null for empty or invalid input', () => {
		expect(detectLocalePrefix('')).toBeNull();
		expect(detectLocalePrefix(null as any)).toBeNull();
	});
});

describe('validateNoDoublePrefix', () => {
	it('should return true for valid paths', () => {
		expect(validateNoDoublePrefix('/fr/antwerpen')).toBe(true);
		expect(validateNoDoublePrefix('/en/cities')).toBe(true);
		expect(validateNoDoublePrefix('/antwerpen')).toBe(true);
		expect(validateNoDoublePrefix('/')).toBe(true);
	});

	it('should return false for double-prefixed paths (BUG cases)', () => {
		expect(validateNoDoublePrefix('/fr/fr/antwerpen')).toBe(false);
		expect(validateNoDoublePrefix('/en/en/cities')).toBe(false);
		expect(validateNoDoublePrefix('/nl/nl/test')).toBe(false);
	});

	it('should return false for mixed double prefixes', () => {
		expect(validateNoDoublePrefix('/fr/en/something')).toBe(false);
		expect(validateNoDoublePrefix('/en/fr/something')).toBe(false);
		expect(validateNoDoublePrefix('/nl/fr/test')).toBe(false);
	});

	it('should handle empty or null input', () => {
		expect(validateNoDoublePrefix('')).toBe(true);
		expect(validateNoDoublePrefix(null as any)).toBe(true);
	});
});

describe('getLocaleFromPath', () => {
	it('should return FR for FR-prefixed paths', () => {
		expect(getLocaleFromPath('/fr/antwerpen')).toBe('fr');
		expect(getLocaleFromPath('/fr')).toBe('fr');
		expect(getLocaleFromPath('/fr/cities/list')).toBe('fr');
	});

	it('should return EN for EN-prefixed paths', () => {
		expect(getLocaleFromPath('/en/antwerpen')).toBe('en');
		expect(getLocaleFromPath('/en')).toBe('en');
		expect(getLocaleFromPath('/en/categories')).toBe('en');
	});

	it('should return NL for paths without prefix (base locale)', () => {
		expect(getLocaleFromPath('/antwerpen')).toBe('nl');
		expect(getLocaleFromPath('/steden')).toBe('nl');
		expect(getLocaleFromPath('/')).toBe('nl');
	});

	it('should return NL for non-locale paths', () => {
		expect(getLocaleFromPath('/friendly')).toBe('nl');
		expect(getLocaleFromPath('/french-toast')).toBe('nl');
	});
});

describe('Integration: Language switching scenarios', () => {
	it('should correctly prepare paths for language switching', () => {
		// Scenario: User on /fr/antwerpen wants to switch to NL
		const currentPath = '/fr/antwerpen';
		const canonical = stripLocalePrefix(currentPath);

		expect(canonical).toBe('/antwerpen');
		expect(validateNoDoublePrefix(canonical)).toBe(true);

		// Now localizeHref(canonical, 'nl') would give '/antwerpen' (no prefix for NL)
	});

	it('should handle switching from NL to FR', () => {
		// Scenario: User on /antwerpen wants to switch to FR
		const currentPath = '/antwerpen';
		const canonical = stripLocalePrefix(currentPath);

		expect(canonical).toBe('/antwerpen');
		expect(validateNoDoublePrefix(canonical)).toBe(true);

		// Now localizeHref(canonical, 'fr') would give '/fr/antwerpen'
	});

	it('should handle same-language clicks (idempotent)', () => {
		// Scenario: User on /fr/antwerpen clicks FR again
		const currentPath = '/fr/antwerpen';
		const canonical = stripLocalePrefix(currentPath);

		expect(canonical).toBe('/antwerpen');

		// localizeHref(canonical, 'fr') would give '/fr/antwerpen' again
		// No double prefix created
	});

	it('should preserve complex paths during switching', () => {
		const currentPath = '/fr/antwerpen/antwerpen/store-slug';
		const canonical = stripLocalePrefix(currentPath);

		expect(canonical).toBe('/antwerpen/antwerpen/store-slug');
		expect(validateNoDoublePrefix(canonical)).toBe(true);
	});
});
