<script lang="ts">
	import type { PageData } from './$types';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime.js';
	import SEOTags from '$lib/components/SEOTags.svelte';
	import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';

	let { data }: { data: PageData } = $props();

	const locale = getLocale();
	const baseUrl = 'https://thrifter.be';
	const currentUrl = `${baseUrl}${localizeHref(`/categories/${data.category.slug}`, locale)}`;

	// Get localized content
	function getCategoryName(): string {
		if (locale === 'fr') return data.category.nameFR;
		if (locale === 'en') return data.category.nameEN;
		return data.category.nameNL;
	}

	function getCategoryDescription(): string {
		if (locale === 'fr') return data.category.descriptionFR;
		if (locale === 'en') return data.category.descriptionEN;
		return data.category.descriptionNL;
	}

	const categoryName = getCategoryName();
	const categoryDescription = getCategoryDescription();
	const pageTitle = `${categoryName} - Kringwinkels & Tweedehands - Thrifter.be`;
	const pageDescription = categoryDescription;

	// Group stores by province for better organization
	const storesByProvince = data.stores.reduce(
		(acc, store) => {
			const province = store.province;
			if (!acc[province]) {
				acc[province] = [];
			}
			acc[province].push(store);
			return acc;
		},
		{} as Record<string, typeof data.stores>
	);

	const provinces = Object.keys(storesByProvince).sort();
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta name="keywords" content={data.category.keywords.join(', ')} />
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
		{ name: 'Categorieën', url: `${baseUrl}${localizeHref('/categories', locale)}` },
		{ name: categoryName, url: currentUrl }
	]}
/>

<div class="container">
	<nav class="breadcrumb">
		<a href={localizeHref('/', getLocale())}>Home</a> /
		<a href={localizeHref('/categories', getLocale())}>Categorieën</a> /
		<span>{categoryName}</span>
	</nav>

	<div class="header">
		<h1>{data.category.icon} {categoryName}</h1>
		<p class="description">{categoryDescription}</p>
		<p class="stats">{data.stores.length} winkels gevonden</p>
	</div>

	<section class="stores-by-location">
		{#each provinces as province}
			<div class="province-section">
				<h2>{province}</h2>
				<div class="store-list">
					{#each storesByProvince[province] as store}
						<a
							href={store.google_maps_url}
							target="_blank"
							rel="noopener noreferrer"
							class="store-card"
						>
							<h3>{store.name}</h3>
							<p class="city">{store.city}</p>
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
			</div>
		{/each}
	</section>

	<section class="seo-content">
		<h2>Over {categoryName}</h2>
		<p>{categoryDescription}</p>

		<h3>Populaire zoektermen</h3>
		<ul class="keywords">
			{#each data.category.keywords as keyword}
				<li>{keyword}</li>
			{/each}
		</ul>
	</section>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.breadcrumb {
		font-size: 0.9rem;
		color: #7f8c8d;
		margin-bottom: 1.5rem;
	}

	.breadcrumb a {
		color: #3498db;
		text-decoration: none;
	}

	.breadcrumb a:hover {
		text-decoration: underline;
	}

	.header {
		margin-bottom: 3rem;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
		color: #2c3e50;
	}

	.description {
		font-size: 1.25rem;
		color: #555;
		margin-bottom: 1rem;
		line-height: 1.6;
	}

	.stats {
		font-size: 1.1rem;
		color: #7f8c8d;
		font-weight: 600;
	}

	.province-section {
		margin-bottom: 3rem;
	}

	.province-section h2 {
		font-size: 2rem;
		color: #34495e;
		margin-bottom: 1.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 3px solid #3498db;
	}

	.store-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.store-card {
		background: #fff;
		border: 2px solid #ecf0f1;
		border-radius: 8px;
		padding: 1.5rem;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
		display: block;
	}

	.store-card:hover {
		border-color: #3498db;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.store-card h3 {
		font-size: 1.3rem;
		margin-bottom: 0.5rem;
		color: #2c3e50;
	}

	.city {
		font-size: 1rem;
		color: #3498db;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.category {
		font-size: 0.9rem;
		color: #95a5a6;
		margin-bottom: 0.5rem;
	}

	.address {
		font-size: 0.95rem;
		color: #7f8c8d;
		margin-bottom: 1rem;
	}

	.info {
		margin-bottom: 0.75rem;
	}

	.info p {
		font-size: 0.9rem;
		margin: 0.25rem 0;
		color: #555;
	}

	.rating {
		font-size: 0.95rem;
		color: #f39c12;
		font-weight: 600;
		margin: 0;
	}

	.seo-content {
		background: #f8f9fa;
		border-radius: 8px;
		padding: 2rem;
		margin-top: 4rem;
	}

	.seo-content h2 {
		font-size: 2rem;
		color: #2c3e50;
		margin-bottom: 1rem;
	}

	.seo-content h3 {
		font-size: 1.5rem;
		color: #34495e;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.seo-content p {
		font-size: 1.1rem;
		line-height: 1.7;
		color: #555;
	}

	.keywords {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
		list-style: none;
		padding: 0;
	}

	.keywords li {
		background: white;
		padding: 1rem;
		border-radius: 6px;
		border-left: 4px solid #3498db;
		font-weight: 500;
		color: #555;
	}
</style>
