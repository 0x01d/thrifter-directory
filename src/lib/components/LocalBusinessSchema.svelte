<script lang="ts">
	import type { ThriftStoreWithSlug } from '$lib/types/thrift-store';

	interface Props {
		store: ThriftStoreWithSlug;
		url: string;
	}

	let { store, url }: Props = $props();

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		name: store.name,
		description: store.description || `${store.name} - Thrift store in ${store.city}, ${store.province}`,
		address: {
			'@type': 'PostalAddress',
			streetAddress: store.address,
			addressLocality: store.city,
			addressRegion: store.province,
			addressCountry: 'BE'
		},
		telephone: store.phone,
		url: store.website,
		'@id': url,
		sameAs: [
			store.google_maps_url,
			...(store.facebook ? [store.facebook] : []),
			...(store.instagram ? [store.instagram] : [])
		].filter(Boolean),
		aggregateRating: store.stars && parseFloat(store.stars) > 0 ? {
			'@type': 'AggregateRating',
			ratingValue: store.stars,
			reviewCount: store.review_count
		} : undefined,
		openingHours: store.openingHours,
		priceRange: store.priceRange || '€'
	};
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>