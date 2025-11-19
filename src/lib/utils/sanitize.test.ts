import { describe, it, expect } from 'vitest';
import { safeJsonLdSerialize, validateWebsiteUrl, sanitizeStoreData } from './sanitize';

describe('safeJsonLdSerialize', () => {
	describe('XSS prevention', () => {
		it('should escape < characters to prevent script tag injection', () => {
			const malicious = { name: '</script><script>alert("XSS")</script>' };
			const result = safeJsonLdSerialize(malicious);

			expect(result).not.toContain('</script>');
			expect(result).not.toContain('<script>');
			expect(result).toContain('\\u003c');
		});

		it('should escape > characters to prevent script tag injection', () => {
			const malicious = { name: '</script><script>alert("XSS")</script>' };
			const result = safeJsonLdSerialize(malicious);

			expect(result).not.toContain('</script>');
			expect(result).toContain('\\u003e');
		});

		it('should prevent HTML comment injection', () => {
			const malicious = { name: '--></script><script>alert("XSS")</script><!--' };
			const result = safeJsonLdSerialize(malicious);

			expect(result).not.toContain('-->');
			expect(result).not.toContain('</script>');
			expect(result).toContain('\\u003e');
		});

		it('should handle multiple < and > characters', () => {
			const data = { text: '<div><span>test</span></div>' };
			const result = safeJsonLdSerialize(data);

			expect(result).not.toContain('<');
			expect(result).not.toContain('>');
			// Should contain 8 escaped characters (4 < and 4 >)
			expect((result.match(/\\u003c/g) || []).length).toBe(4);
			expect((result.match(/\\u003e/g) || []).length).toBe(4);
		});
	});

	describe('legitimate data preservation', () => {
		it('should preserve Belgian store names with accents', () => {
			const data = { name: "L'Armée du Salut - Liège" };
			const result = safeJsonLdSerialize(data);

			expect(result).toContain("L'Armée du Salut - Liège");
		});

		it('should preserve quotes properly', () => {
			const data = { name: 'Store "Best" Shop' };
			const result = safeJsonLdSerialize(data);

			expect(result).toContain('\\"Best\\"');
		});

		it('should preserve addresses with special characters', () => {
			const data = { address: 'Rue de l\'Église 123' };
			const result = safeJsonLdSerialize(data);

			expect(result).toContain('Église');
		});

		it('should handle nested objects', () => {
			const data = {
				name: 'Store',
				address: {
					street: 'Main St',
					city: 'Brussels'
				}
			};
			const result = safeJsonLdSerialize(data);

			expect(result).toContain('Main St');
			expect(result).toContain('Brussels');
		});

		it('should handle arrays', () => {
			const data = {
				items: ['Item 1', 'Item 2', 'Item 3']
			};
			const result = safeJsonLdSerialize(data);

			expect(result).toContain('Item 1');
			expect(result).toContain('Item 2');
			expect(result).toContain('Item 3');
		});
	});

	describe('valid JSON output', () => {
		it('should produce valid JSON that can be parsed', () => {
			const data = { name: '</script><script>alert("XSS")</script>', value: 123 };
			const result = safeJsonLdSerialize(data);

			// Should be valid JSON
			const parsed = JSON.parse(result);
			expect(parsed.value).toBe(123);
		});

		it('should maintain data integrity after parse', () => {
			const data = { name: 'Test<>Store', id: 42, active: true };
			const result = safeJsonLdSerialize(data);
			const parsed = JSON.parse(result);

			expect(parsed.id).toBe(42);
			expect(parsed.active).toBe(true);
			// After parsing, Unicode escapes are converted back
			expect(parsed.name).toBe('Test<>Store');
		});
	});
});

describe('validateWebsiteUrl', () => {
	describe('valid URLs', () => {
		it('should accept domain without protocol', () => {
			expect(validateWebsiteUrl('example.com')).toBe('https://example.com');
			expect(validateWebsiteUrl('www.example.com')).toBe('https://www.example.com');
			expect(validateWebsiteUrl('kringwinkel.be')).toBe('https://kringwinkel.be');
		});

		it('should accept domain with subdomains', () => {
			expect(validateWebsiteUrl('shop.example.com')).toBe('https://shop.example.com');
			expect(validateWebsiteUrl('www.shop.example.be')).toBe('https://www.shop.example.be');
		});

		it('should accept URLs with https://', () => {
			expect(validateWebsiteUrl('https://example.com')).toBe('https://example.com');
			expect(validateWebsiteUrl('https://www.example.com')).toBe('https://www.example.com');
		});

		it('should accept URLs with http:// (for backward compatibility)', () => {
			expect(validateWebsiteUrl('http://example.com')).toBe('http://example.com');
		});

		it('should handle domains with hyphens', () => {
			expect(validateWebsiteUrl('my-store.example.com')).toBe('https://my-store.example.com');
		});

		it('should handle various TLDs', () => {
			expect(validateWebsiteUrl('example.be')).toBe('https://example.be');
			expect(validateWebsiteUrl('example.fr')).toBe('https://example.fr');
			expect(validateWebsiteUrl('example.co.uk')).toBe('https://example.co.uk');
		});
	});

	describe('dangerous URLs (should be rejected)', () => {
		it('should reject javascript: protocol', () => {
			expect(validateWebsiteUrl('javascript:alert("XSS")')).toBeNull();
		});

		it('should reject data: protocol', () => {
			expect(validateWebsiteUrl('data:text/html,<script>alert("XSS")</script>')).toBeNull();
		});

		it('should reject file: protocol', () => {
			expect(validateWebsiteUrl('file:///etc/passwd')).toBeNull();
		});

		it('should reject vbscript: protocol', () => {
			expect(validateWebsiteUrl('vbscript:alert("XSS")')).toBeNull();
		});

		it('should reject about: protocol', () => {
			expect(validateWebsiteUrl('about:blank')).toBeNull();
		});
	});

	describe('invalid input', () => {
		it('should return null for empty string', () => {
			expect(validateWebsiteUrl('')).toBeNull();
		});

		it('should return null for whitespace', () => {
			expect(validateWebsiteUrl('   ')).toBeNull();
		});

		it('should return null for null', () => {
			expect(validateWebsiteUrl(null)).toBeNull();
		});

		it('should return null for undefined', () => {
			expect(validateWebsiteUrl(undefined)).toBeNull();
		});

		it('should return null for invalid domain format', () => {
			expect(validateWebsiteUrl('not a domain')).toBeNull();
			expect(validateWebsiteUrl('no-tld')).toBeNull();
			expect(validateWebsiteUrl('...')).toBeNull();
		});
	});

	describe('edge cases', () => {
		it('should trim whitespace', () => {
			expect(validateWebsiteUrl('  example.com  ')).toBe('https://example.com');
		});

		it('should handle mixed case', () => {
			expect(validateWebsiteUrl('Example.COM')).toBe('https://Example.COM');
		});
	});
});

describe('sanitizeStoreData', () => {
	it('should validate website URLs', () => {
		const store = {
			name: 'Test Store',
			website: 'example.com'
		};

		const sanitized = sanitizeStoreData(store);

		expect(sanitized.website).toBe('https://example.com');
	});

	it('should remove dangerous website URLs', () => {
		const store = {
			name: 'Test Store',
			website: 'javascript:alert("XSS")'
		};

		const sanitized = sanitizeStoreData(store);

		expect(sanitized.website).toBeUndefined();
	});

	it('should preserve other fields', () => {
		const store = {
			name: 'Test Store',
			city: 'Brussels',
			website: 'example.com'
		};

		const sanitized = sanitizeStoreData(store);

		expect(sanitized.name).toBe('Test Store');
		expect(sanitized.city).toBe('Brussels');
		expect(sanitized.website).toBe('https://example.com');
	});

	it('should handle missing website field', () => {
		const store = {
			name: 'Test Store',
			city: 'Brussels'
		};

		const sanitized = sanitizeStoreData(store);

		expect(sanitized.name).toBe('Test Store');
		expect(sanitized.city).toBe('Brussels');
	});

	it('should not mutate original data', () => {
		const store = {
			name: 'Test Store',
			website: 'example.com'
		};

		const sanitized = sanitizeStoreData(store);

		expect(store.website).toBe('example.com'); // Original unchanged
		expect(sanitized.website).toBe('https://example.com'); // Sanitized version
	});
});
