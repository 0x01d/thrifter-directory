import { describe, it, expect } from 'vitest';
import { slugify, generateStoreSlug } from './slug';

describe('slugify', () => {
	describe('basic functionality', () => {
		it('should convert text to lowercase', () => {
			expect(slugify('HELLO WORLD')).toBe('hello-world');
			expect(slugify('MiXeD CaSe')).toBe('mixed-case');
		});

		it('should replace spaces with hyphens', () => {
			expect(slugify('hello world')).toBe('hello-world');
			expect(slugify('multiple   spaces')).toBe('multiple-spaces');
		});

		it('should handle simple text', () => {
			expect(slugify('kringwinkel')).toBe('kringwinkel');
			expect(slugify('antwerpen')).toBe('antwerpen');
		});
	});

	describe('diacritics handling (critical for Belgian names)', () => {
		it('should remove French diacritics', () => {
			expect(slugify('café')).toBe('cafe');
			expect(slugify('crèche')).toBe('creche');
			expect(slugify('Liège')).toBe('liege');
			expect(slugify('Bruxelles-Brussel')).toBe('bruxelles-brussel');
		});

		it('should remove Dutch diacritics', () => {
			expect(slugify('naïef')).toBe('naief');
			expect(slugify('coöperatie')).toBe('cooperatie');
		});

		it('should handle multiple diacritics in one word', () => {
			expect(slugify('Hôtel-Dieu')).toBe('hotel-dieu');
			expect(slugify('château')).toBe('chateau');
		});

		it('should handle accented characters in Belgian city names', () => {
			expect(slugify('Mons-Bergen')).toBe('mons-bergen');
			expect(slugify('La Louvière')).toBe('la-louviere');
			expect(slugify('Mouscron-Moeskroen')).toBe('mouscron-moeskroen');
		});
	});

	describe('special characters handling', () => {
		it('should replace special characters with hyphens', () => {
			expect(slugify('store & more')).toBe('store-more');
			expect(slugify('50% off')).toBe('50-off');
			expect(slugify('store (main)')).toBe('store-main');
		});

		it('should handle apostrophes', () => {
			expect(slugify("L'Armée du Salut")).toBe('l-armee-du-salut');
			expect(slugify("Ma's Shop")).toBe('ma-s-shop');
		});

		it('should handle slashes', () => {
			expect(slugify('store/shop')).toBe('store-shop');
			expect(slugify('buy/sell/trade')).toBe('buy-sell-trade');
		});

		it('should handle dots', () => {
			expect(slugify('st.niklaas')).toBe('st-niklaas');
			expect(slugify('A.B.C. Store')).toBe('a-b-c-store');
		});

		it('should handle multiple special characters in a row', () => {
			expect(slugify('store!!!shop')).toBe('store-shop');
			expect(slugify('test...case')).toBe('test-case');
			expect(slugify('item&&more')).toBe('item-more');
		});
	});

	describe('edge cases', () => {
		it('should handle empty string', () => {
			expect(slugify('')).toBe('');
		});

		it('should handle string with only spaces', () => {
			expect(slugify('   ')).toBe('');
		});

		it('should handle string with only special characters', () => {
			expect(slugify('!!!###$$$')).toBe('');
			expect(slugify('---')).toBe('');
		});

		it('should remove leading hyphens', () => {
			expect(slugify('-hello')).toBe('hello');
			expect(slugify('---hello')).toBe('hello');
		});

		it('should remove trailing hyphens', () => {
			expect(slugify('hello-')).toBe('hello');
			expect(slugify('hello---')).toBe('hello');
		});

		it('should remove both leading and trailing hyphens', () => {
			expect(slugify('-hello-world-')).toBe('hello-world');
			expect(slugify('---test---')).toBe('test');
		});

		it('should handle very long strings', () => {
			const longText = 'a'.repeat(200);
			const result = slugify(longText);
			expect(result).toBe(longText);
			expect(result.length).toBe(200);
		});

		it('should handle numbers', () => {
			expect(slugify('store 123')).toBe('store-123');
			expect(slugify('2nd hand')).toBe('2nd-hand');
		});

		it('should preserve alphanumeric but hyphenate between', () => {
			expect(slugify('abc123xyz')).toBe('abc123xyz');
			expect(slugify('abc 123 xyz')).toBe('abc-123-xyz');
		});
	});

	describe('Belgian store name examples (real-world)', () => {
		it('should handle common Belgian thrift store names', () => {
			expect(slugify('Kringwinkel')).toBe('kringwinkel');
			expect(slugify('Oxfam Solidariteit')).toBe('oxfam-solidariteit');
			expect(slugify("Les Petits Riens")).toBe('les-petits-riens');
			expect(slugify("De Kringwinkel")).toBe('de-kringwinkel');
		});

		it('should handle Belgian city names with special characters', () => {
			expect(slugify('Sint-Niklaas')).toBe('sint-niklaas');
			expect(slugify('Berchem-Sainte-Agathe')).toBe('berchem-sainte-agathe');
			expect(slugify('Woluwe-Saint-Lambert')).toBe('woluwe-saint-lambert');
		});

		it('should handle bilingual names', () => {
			expect(slugify('Brussel / Bruxelles')).toBe('brussel-bruxelles');
			expect(slugify('Gent - Gand')).toBe('gent-gand');
		});
	});

	describe('consistency and idempotency', () => {
		it('should produce consistent results for same input', () => {
			const input = 'Test Store - Liège';
			const result1 = slugify(input);
			const result2 = slugify(input);
			const result3 = slugify(input);
			expect(result1).toBe(result2);
			expect(result2).toBe(result3);
		});

		it('should be idempotent (running on result produces same result)', () => {
			const input = 'Test Store - Liège';
			const result1 = slugify(input);
			const result2 = slugify(result1);
			expect(result1).toBe(result2);
		});
	});
});

describe('generateStoreSlug', () => {
	describe('basic functionality', () => {
		it('should combine store name and city with hyphen', () => {
			const slug = generateStoreSlug({ name: 'Kringwinkel', city: 'Antwerpen' });
			expect(slug).toBe('kringwinkel-antwerpen');
		});

		it('should slugify both name and city', () => {
			const slug = generateStoreSlug({
				name: 'Oxfam Solidariteit',
				city: 'Sint-Niklaas'
			});
			expect(slug).toBe('oxfam-solidariteit-sint-niklaas');
		});
	});

	describe('diacritics in store slugs', () => {
		it('should handle diacritics in both name and city', () => {
			const slug = generateStoreSlug({
				name: 'Les Petits Riens',
				city: 'Liège'
			});
			expect(slug).toBe('les-petits-riens-liege');
		});

		it('should handle French names and cities', () => {
			const slug = generateStoreSlug({
				name: 'Armée du Salut',
				city: 'La Louvière'
			});
			expect(slug).toBe('armee-du-salut-la-louviere');
		});
	});

	describe('uniqueness concerns', () => {
		it('should generate different slugs for stores with same name in different cities', () => {
			const slug1 = generateStoreSlug({ name: 'Kringwinkel', city: 'Antwerpen' });
			const slug2 = generateStoreSlug({ name: 'Kringwinkel', city: 'Gent' });
			expect(slug1).not.toBe(slug2);
			expect(slug1).toBe('kringwinkel-antwerpen');
			expect(slug2).toBe('kringwinkel-gent');
		});

		it('should generate different slugs for different stores in same city', () => {
			const slug1 = generateStoreSlug({ name: 'Store A', city: 'Antwerpen' });
			const slug2 = generateStoreSlug({ name: 'Store B', city: 'Antwerpen' });
			expect(slug1).not.toBe(slug2);
		});

		it('should handle potential collision cases', () => {
			// Edge case: "Store-City" name in "Name" city vs "Store" name in "City-Name" city
			const slug1 = generateStoreSlug({ name: 'Store-City', city: 'Name' });
			const slug2 = generateStoreSlug({ name: 'Store', city: 'City-Name' });
			// These WILL collide - both produce 'store-city-name'
			// This is a known limitation of the current slug format
			expect(slug1).toBe('store-city-name');
			expect(slug2).toBe('store-city-name');
			// Document that this is expected behavior (collision is possible but unlikely)
		});
	});

	describe('edge cases', () => {
		it('should handle empty name', () => {
			const slug = generateStoreSlug({ name: '', city: 'Antwerpen' });
			// Note: Currently produces '-antwerpen' due to template literal
			// This is unlikely in production as all stores have names
			expect(slug).toBe('-antwerpen');
		});

		it('should handle empty city', () => {
			const slug = generateStoreSlug({ name: 'Store', city: '' });
			// Note: Currently produces 'store-' due to template literal
			// This is unlikely in production as all stores have cities
			expect(slug).toBe('store-');
		});

		it('should handle both empty', () => {
			const slug = generateStoreSlug({ name: '', city: '' });
			// Note: Currently produces '-' due to template literal
			expect(slug).toBe('-');
		});

		it('should handle names/cities with only special characters', () => {
			const slug = generateStoreSlug({ name: '!!!', city: '###' });
			// Both slugify to empty, but template creates a hyphen
			expect(slug).toBe('-');
		});
	});

	describe('real-world Belgian store examples', () => {
		it('should generate correct slugs for actual Belgian stores', () => {
			expect(generateStoreSlug({
				name: 'De Kringwinkel',
				city: 'Antwerpen'
			})).toBe('de-kringwinkel-antwerpen');

			expect(generateStoreSlug({
				name: 'Les Petits Riens',
				city: 'Bruxelles'
			})).toBe('les-petits-riens-bruxelles');

			expect(generateStoreSlug({
				name: 'Oxfam Solidariteit',
				city: 'Gent'
			})).toBe('oxfam-solidariteit-gent');
		});

		it('should handle stores with special characters', () => {
			expect(generateStoreSlug({
				name: "L'Armée du Salut",
				city: 'Liège'
			})).toBe('l-armee-du-salut-liege');

			expect(generateStoreSlug({
				name: 'Re-Store',
				city: 'Sint-Niklaas'
			})).toBe('re-store-sint-niklaas');
		});
	});

	describe('consistency', () => {
		it('should produce consistent results for same input', () => {
			const store = { name: 'Test Store', city: 'Test City' };
			const result1 = generateStoreSlug(store);
			const result2 = generateStoreSlug(store);
			const result3 = generateStoreSlug(store);
			expect(result1).toBe(result2);
			expect(result2).toBe(result3);
		});
	});
});
