<script lang="ts">
	interface Props {
		title: string;
		description: string;
		url: string;
		image?: string;
		type?: 'website' | 'article';
		canonical?: string;
	}

	let {
		title,
		description,
		url,
		image = 'https://thrifter.be/og-image.png',
		type = 'website',
		canonical
	}: Props = $props();
</script>

<svelte:head>
	<!-- Canonical URL -->
	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:site_name" content="Thrifter.be" />
	<meta property="og:locale" content="nl_BE" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
</svelte:head>
