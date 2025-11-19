<script lang="ts">
	import { safeJsonLdSerialize } from '$lib/utils/sanitize';

	interface BreadcrumbItem {
		name: string;
		url: string;
	}

	interface Props {
		items: BreadcrumbItem[];
	}

	let { items }: Props = $props();

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: item.url
		}))
	};
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${safeJsonLdSerialize(schema)}</script>`}
</svelte:head>
