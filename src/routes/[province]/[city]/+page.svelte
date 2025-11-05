<script lang="ts">
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime.js';
	import SEOTags from '$lib/components/SEOTags.svelte';
	import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';

	let { data }: { data: PageData } = $props();

	const locale = getLocale();
	const baseUrl = 'https://thrifter.be';
	const currentUrl = `${baseUrl}${localizeHref(`/${data.province.slug}/${data.city.slug}`, locale)}`;
	const pageTitle = `${data.city.name}, ${data.province.name} - ${m.thrift_stores_in({ location: 'België' })} - Thrifter.be`;
	const pageDescription = m.find_all_stores_in({
		count: data.stores.length,
		location: `${data.city.name}, ${data.province.name}`
	});
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
		{ name: data.province.name, url: `${baseUrl}${localizeHref(`/${data.province.slug}`, locale)}` },
		{ name: data.city.name, url: currentUrl }
	]}
/>

<div class="container">
	<nav class="breadcrumb">
		<a href={localizeHref('/', getLocale())}>{m.home()}</a> /
		<a href={localizeHref(`/${data.province.slug}`, getLocale())}>{data.province.name}</a> /
		<span>{data.city.name}</span>
	</nav>

	<h1>{data.city.name}</h1>
	<p class="stats">{m.stores_count_only({ count: data.stores.length })}</p>

	<section class="stores">
		<div class="store-list">
			{#each data.stores as store}
				<a
					href={localizeHref(`/${data.province.slug}/${data.city.slug}/${store.slug}`, getLocale())}
					class="store-card"
				>
					<h3>{store.name}</h3>
					<p class="category">{store.category}</p>
					<p class="address">{store.address}</p>
					<div class="info">
						{#if store.phone}
							<p class="phone">📞 {store.phone}</p>
						{/if}
						{#if store.website}
							<p class="website">🌐 {store.website}</p>
						{/if}
					</div>
					{#if store.stars}
						<p class="rating">⭐ {store.stars} ({store.review_count})</p>
					{/if}
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

	.breadcrumb {
		margin-bottom: 1rem;
		color: #7f8c8d;
	}

	.breadcrumb a {
		color: #3498db;
		text-decoration: none;
	}

	.breadcrumb a:hover {
		text-decoration: underline;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		color: #2c3e50;
	}

	.stats {
		font-size: 1.1rem;
		color: #7f8c8d;
		margin-bottom: 3rem;
	}

	.store-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 1.5rem;
	}

	.store-card {
		background: #fff;
		border: 2px solid #ecf0f1;
		border-radius: 8px;
		padding: 1.5rem;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
	}

	.store-card:hover {
		border-color: #3498db;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.store-card h3 {
		font-size: 1.3rem;
		margin-bottom: 0.5rem;
		color: #2c3e50;
	}

	.category {
		font-size: 0.9rem;
		color: #3498db;
		margin-bottom: 0.75rem;
		font-weight: 500;
	}

	.address {
		font-size: 0.95rem;
		color: #7f8c8d;
		margin-bottom: 0.75rem;
	}

	.info {
		margin: 0.75rem 0;
	}

	.phone,
	.website {
		font-size: 0.9rem;
		color: #7f8c8d;
		margin: 0.25rem 0;
	}

	.rating {
		font-size: 0.95rem;
		color: #f39c12;
		margin-top: 0.75rem;
		font-weight: 500;
	}
</style>
