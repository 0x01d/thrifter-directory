<script lang="ts">
	import type { PageData } from './$types';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime.js';
	import SEOTags from '$lib/components/SEOTags.svelte';
	import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';

	let { data }: { data: PageData } = $props();

	const locale = getLocale();
	const baseUrl = 'https://thrifter.be';
	const currentUrl = `${baseUrl}${localizeHref(`/${data.province.slug}/${data.city.slug}/categorieen/${data.category.slug}`, locale)}`;

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
	const pageTitle = `${categoryName} in ${data.city.name} - Kringwinkels - Thrifter.be`;
	const pageDescription = `Vind ${data.stores.length} ${categoryName.toLowerCase()} winkels in ${data.city.name}, ${data.province.name}. ${categoryDescription}`;
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta
		name="keywords"
		content="{data.category.keywords.join(', ')}, {data.city.name}, {data.province.name}, kringwinkel {data.city.name}"
	/>
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
		{ name: data.city.name, url: `${baseUrl}${localizeHref(`/${data.province.slug}/${data.city.slug}`, locale)}` },
		{ name: 'Categorieën', url: `${baseUrl}${localizeHref('/categorieen', locale)}` },
		{ name: categoryName, url: currentUrl }
	]}
/>

<div class="container">
	<nav class="breadcrumb">
		<a href={localizeHref('/', getLocale())}>Home</a> /
		<a href={localizeHref(`/${data.province.slug}`, getLocale())}>{data.province.name}</a> /
		<a href={localizeHref(`/${data.province.slug}/${data.city.slug}`, getLocale())}
			>{data.city.name}</a
		>
		/
		<a href={localizeHref('/categorieen', getLocale())}>Categorieën</a> /
		<span>{categoryName}</span>
	</nav>

	<div class="header">
		<h1>{data.category.icon} {categoryName} in {data.city.name}</h1>
		<p class="description">{categoryDescription}</p>
		<p class="stats">
			{data.stores.length}
			{data.stores.length === 1 ? 'winkel gevonden' : 'winkels gevonden'} in {data.city.name}
		</p>
	</div>

	<section class="stores">
		<div class="store-list">
			{#each data.stores as store}
				<a
					href={store.google_maps_url}
					target="_blank"
					rel="noopener noreferrer"
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

	<section class="seo-content">
		<h2>{categoryName} in {data.city.name}, {data.province.name}</h2>
		<p>
			Op zoek naar {categoryName.toLowerCase()} in {data.city.name}? We hebben {data.stores.length}
			{data.stores.length === 1 ? 'winkel' : 'winkels'} gevonden waar je {categoryName.toLowerCase()}
			kunt vinden. {categoryDescription}
		</p>

		<h3>Waarom tweedehands {categoryName} in {data.city.name}?</h3>
		<ul>
			<li>Duurzaam en milieuvriendelijk winkelen</li>
			<li>Betaalbare prijzen voor kwaliteitsproducten</li>
			<li>Unieke vondsten die je nergens anders vindt</li>
			<li>Steun lokale kringwinkels en goede doelen</li>
			<li>Draag bij aan de circulaire economie</li>
		</ul>

		<h3>Over kringwinkels in {data.city.name}</h3>
		<p>
			{data.city.name} heeft een mooie selectie aan kringwinkels en tweedehandswinkels waar je
			{categoryName.toLowerCase()} kunt vinden. Deze winkels bieden niet alleen betaalbare producten, maar
			dragen ook bij aan een duurzame samenleving door hergebruik te stimuleren.
		</p>
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
		font-size: 2.5rem;
		margin-bottom: 1rem;
		color: #2c3e50;
	}

	.description {
		font-size: 1.15rem;
		color: #555;
		margin-bottom: 1rem;
		line-height: 1.6;
	}

	.stats {
		font-size: 1.1rem;
		color: #7f8c8d;
		font-weight: 600;
	}

	.stores {
		margin-bottom: 3rem;
	}

	.store-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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
		margin-bottom: 1rem;
	}

	.seo-content ul {
		list-style-position: inside;
		padding-left: 1rem;
	}

	.seo-content li {
		font-size: 1.05rem;
		line-height: 1.8;
		color: #555;
		margin-bottom: 0.5rem;
	}
</style>
