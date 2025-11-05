<script lang="ts">
	import type { PageData } from './$types';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime.js';
	import SEOTags from '$lib/components/SEOTags.svelte';
	import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';

	let { data }: { data: PageData } = $props();

	const locale = getLocale();
	const baseUrl = 'https://thrifter.be';
	const currentUrl = `${baseUrl}${localizeHref('/categories', locale)}`;
	const pageTitle = 'Categorieën - Tweedehands & Kringwinkels - Thrifter.be';
	const pageDescription =
		'Browse alle categorieën tweedehands spullen: vintage kleding, designer merken, meubels, boeken, elektronica en speelgoed bij kringwinkels in België.';

	// Get category name based on locale
	function getCategoryName(category: any): string {
		if (locale === 'fr') return category.nameFR;
		if (locale === 'en') return category.nameEN;
		return category.nameNL;
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta
		name="keywords"
		content="kringwinkel categorieën, tweedehands belgië, vintage kleding, designer merken, meubels tweedehands, boeken kringwinkel"
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
		{ name: 'Categorieën', url: currentUrl }
	]}
/>

<div class="container">
	<h1>🏷️ Categorieën</h1>
	<p class="subtitle">
		Vind tweedehands spullen per categorie in kringwinkels en tweedehandswinkels door heel België
	</p>

	<section class="categories">
		<div class="category-grid">
			{#each data.categories as category}
				<a href={localizeHref(`/categories/${category.slug}`, getLocale())} class="category-card">
					<div class="category-header">
						<h3>{getCategoryName(category)}</h3>
					</div>
					<p class="store-count">{category.storeCount} winkels</p>
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

	.categories {
		margin-top: 2rem;
	}

	.category-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.category-card {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-radius: 12px;
		padding: 2rem;
		text-decoration: none;
		color: white;
		transition: all 0.3s;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.category-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
	}

	.category-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.category-card h3 {
		font-size: 1.5rem;
		margin: 0;
		color: white;
	}

	.store-count {
		font-size: 1rem;
		opacity: 0.9;
		margin: 0;
	}
</style>
