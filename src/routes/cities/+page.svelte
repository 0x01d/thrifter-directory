<script lang="ts">
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime.js';
	import SEOTags from '$lib/components/SEOTags.svelte';
	import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';

	let { data }: { data: PageData } = $props();

	const locale = getLocale();
	const baseUrl = 'https://thrifter.be';
	const currentUrl = `${baseUrl}${localizeHref('/cities', locale)}`;
	const pageTitle = `${m.cities()} - Thrifter.be`;
	const pageDescription = 'Browse all cities in Belgium with thrift stores and second-hand shops';
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
</svelte:head>

<SEOTags
	title={pageTitle}
	description={pageDescription}
	url={currentUrl}
	canonical={currentUrl}
	type="website"
/>

<BreadcrumbSchema
	items={[
		{ name: 'Home', url: `${baseUrl}${localizeHref('/', locale)}` },
		{ name: m.cities(), url: currentUrl }
	]}
/>

<div class="container">
	<h1>{m.cities()}</h1>
	<p class="subtitle">Browse all cities in Belgium with thrift stores</p>

	<section class="cities">
		<div class="city-grid">
			{#each data.cities as city}
				<a
					href={localizeHref(`/${city.provinceSlug}/${city.slug}`, getLocale())}
					class="city-card"
				>
					<h3>{city.name}</h3>
					<p class="province">{city.province}</p>
					<p>{m.store_count({ count: city.storeCount })}</p>
				</a>
			{/each}
		</div>
	</section>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: 0.5rem;
		color: #2c3e50;
	}

	.subtitle {
		font-size: 1.25rem;
		color: #7f8c8d;
		margin-bottom: 3rem;
	}

	.cities {
		margin-top: 2rem;
	}

	.city-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.city-card {
		background: #fff;
		border: 2px solid #ecf0f1;
		border-radius: 8px;
		padding: 1.5rem;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
	}

	.city-card:hover {
		border-color: #3498db;
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.city-card h3 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		color: #2c3e50;
	}

	.city-card p {
		margin: 0.25rem 0;
		color: #7f8c8d;
	}

	.province {
		font-size: 0.95rem;
		font-weight: 500;
		color: #95a5a6;
	}
</style>
