/**
 * Category mapping for SEO-friendly URLs and multi-language support
 * Maps URL slugs to actual category values in the store data
 */

export interface CategoryConfig {
	slug: string;
	nameNL: string;
	nameFR: string;
	nameEN: string;
	descriptionNL: string;
	descriptionFR: string;
	descriptionEN: string;
	// Categories in the data that match this category
	matchCategories: string[];
	// Keywords for SEO
	keywords: string[];
	icon: string;
}

export const CATEGORIES: Record<string, CategoryConfig> = {
	'vintage-kleding': {
		slug: 'vintage-kleding',
		nameNL: 'Vintage Kleding',
		nameFR: 'Vêtements Vintage',
		nameEN: 'Vintage Clothing',
		descriptionNL:
			'Ontdek unieke vintage kleding en tweedehands fashion. Van retro jaren 70 tot 90s nostalgie, vind authentieke vintage stukken in kringwinkels door heel België.',
		descriptionFR:
			'Découvrez des vêtements vintage uniques et de la mode seconde main. Des années 70 rétro à la nostalgie des années 90, trouvez des pièces vintage authentiques dans les magasins de seconde main à travers la Belgique.',
		descriptionEN:
			'Discover unique vintage clothing and secondhand fashion. From retro 70s to 90s nostalgia, find authentic vintage pieces in thrift stores across Belgium.',
		matchCategories: ['Vintage clothing store', 'Vintage Clothing Shop'],
		keywords: [
			'vintage kleding kringwinkel belgië',
			'vintage fashion tweedehands',
			'retro kleding',
			'jaren 70 kleding',
			'jaren 90 fashion'
		],
		icon: '👗'
	},
	'designer-merken': {
		slug: 'designer-merken',
		nameNL: 'Designer Merken',
		nameFR: 'Marques de Créateurs',
		nameEN: 'Designer Brands',
		descriptionNL:
			'Luxe designer merken voor betaalbare prijzen. Vind tweedehands designerkleding, tassen en accessoires van topmerken in Belgische kringwinkels.',
		descriptionFR:
			"Marques de créateurs de luxe à des prix abordables. Trouvez des vêtements de créateurs d'occasion, des sacs et des accessoires de grandes marques dans les magasins de seconde main belges.",
		descriptionEN:
			'Luxury designer brands at affordable prices. Find secondhand designer clothing, bags and accessories from top brands in Belgian thrift stores.',
		matchCategories: [
			'Vintage clothing store',
			'Vintage Clothing Shop',
			'Consignment shop',
			'Used clothing store',
			'Clothing store'
		],
		keywords: [
			'designer tweedehands belgië',
			'luxe merken kringwinkel',
			'designer tassen tweedehands',
			'goedkope designer kleding'
		],
		icon: '💎'
	},
	meubels: {
		slug: 'meubels',
		nameNL: 'Meubels',
		nameFR: 'Meubles',
		nameEN: 'Furniture',
		descriptionNL:
			'Betaalbare tweedehands meubels voor elk budget. Van vintage kasten tot moderne design, vind kwalitatieve gebruikte meubels in kringwinkels.',
		descriptionFR:
			"Meubles d'occasion abordables pour tous les budgets. Des armoires vintage au design moderne, trouvez des meubles d'occasion de qualité dans les magasins de seconde main.",
		descriptionEN:
			'Affordable secondhand furniture for every budget. From vintage cabinets to modern design, find quality used furniture in thrift stores.',
		matchCategories: [
			'Used furniture store',
			'Antique furniture store',
			'Used office furniture store',
			'Home goods store',
			'Homewares Store'
		],
		keywords: [
			'goedkope meubels kringwinkel',
			'tweedehands meubels belgië',
			'vintage meubels',
			'gebruikte kasten'
		],
		icon: '🛋️'
	},
	boeken: {
		slug: 'boeken',
		nameNL: 'Boeken',
		nameFR: 'Livres',
		nameEN: 'Books',
		descriptionNL:
			'Tweedehands boeken voor lezers en verzamelaars. Vind romans, studieboeken, strips en meer in kringwinkels door heel België.',
		descriptionFR:
			'Livres d\'occasion pour les lecteurs et les collectionneurs. Trouvez des romans, des manuels scolaires, des bandes dessinées et plus encore dans les magasins de seconde main à travers la Belgique.',
		descriptionEN:
			'Secondhand books for readers and collectors. Find novels, textbooks, comics and more in thrift stores across Belgium.',
		matchCategories: ['Used book store', 'Book store', 'Second-hand Book Shop'],
		keywords: [
			'tweedehands boeken kringwinkel',
			'goedkope boeken belgië',
			'studieboeken tweedehands',
			'strips kringwinkel'
		],
		icon: '📚'
	},
	elektronica: {
		slug: 'elektronica',
		nameNL: 'Elektronica',
		nameFR: 'Électronique',
		nameEN: 'Electronics',
		descriptionNL:
			'Tweedehands elektronica en huishoudapparaten. Vind betaalbare apparaten, gadgets en elektronica in kringwinkels.',
		descriptionFR:
			"Électronique d'occasion et appareils électroménagers. Trouvez des appareils, des gadgets et de l'électronique abordables dans les magasins de seconde main.",
		descriptionEN:
			'Secondhand electronics and household appliances. Find affordable devices, gadgets and electronics in thrift stores.',
		matchCategories: ['Appliance store', 'Store', 'General store'],
		keywords: [
			'tweedehands elektronica belgië',
			'goedkope apparaten kringwinkel',
			'gebruikte gadgets',
			'huishoudapparaten tweedehands'
		],
		icon: '📱'
	},
	speelgoed: {
		slug: 'speelgoed',
		nameNL: 'Speelgoed',
		nameFR: 'Jouets',
		nameEN: 'Toys',
		descriptionNL:
			'Tweedehands speelgoed voor kinderen van alle leeftijden. Vind spelletjes, poppen, puzzels en meer in kringwinkels.',
		descriptionFR:
			"Jouets d'occasion pour les enfants de tous âges. Trouvez des jeux, des poupées, des puzzles et plus encore dans les magasins de seconde main.",
		descriptionEN:
			'Secondhand toys for children of all ages. Find games, dolls, puzzles and more in thrift stores.',
		matchCategories: ['Toy store', 'Hobby store', 'Store', 'General store'],
		keywords: [
			'tweedehands speelgoed kringwinkel',
			'goedkoop speelgoed belgië',
			'gebruikte spelletjes',
			'kinderen speelgoed tweedehands'
		],
		icon: '🧸'
	}
};

/**
 * Get all category configs
 */
export function getAllCategories(): CategoryConfig[] {
	return Object.values(CATEGORIES);
}

/**
 * Get category config by slug
 */
export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
	return CATEGORIES[slug];
}

/**
 * Check if a store matches a category
 */
export function storeMatchesCategory(storeCategory: string, categorySlug: string): boolean {
	const config = CATEGORIES[categorySlug];
	if (!config) return false;

	// Normalize both for comparison
	const normalizedStoreCategory = storeCategory?.toLowerCase().trim() || '';

	return config.matchCategories.some((matchCat) => {
		const normalizedMatchCat = matchCat.toLowerCase().trim();
		return normalizedStoreCategory === normalizedMatchCat;
	});
}
