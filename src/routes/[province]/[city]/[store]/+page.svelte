<script lang="ts">
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime.js';
	import SEOTags from '$lib/components/SEOTags.svelte';
	import BreadcrumbSchema from '$lib/components/BreadcrumbSchema.svelte';
	import LocalBusinessSchema from '$lib/components/LocalBusinessSchema.svelte';
	import { validateWebsiteUrl } from '$lib/utils/sanitize';

	let { data }: { data: PageData } = $props();
	const { store, provinceSlug, citySlug } = data;

	const locale = getLocale();
	const baseUrl = 'https://thrifter.be';
	const currentUrl = `${baseUrl}${localizeHref(`/${provinceSlug}/${citySlug}/${store.slug}`, locale)}`;
	const pageTitle = `${store.name} - ${store.city}, ${store.province} - Thrifter.be`;
	const pageDescription = store.description || `${store.category} in ${store.city}, ${store.province}. ${store.address}`;

	// Validate website URL to prevent XSS
	const safeWebsiteUrl = validateWebsiteUrl(store.website);
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
	type="article"
/>

<BreadcrumbSchema
	items={[
		{ name: 'Home', url: `${baseUrl}${localizeHref('/', locale)}` },
		{ name: store.province, url: `${baseUrl}${localizeHref(`/${provinceSlug}`, locale)}` },
		{ name: store.city, url: `${baseUrl}${localizeHref(`/${provinceSlug}/${citySlug}`, locale)}` },
		{ name: store.name, url: currentUrl }
	]}
/>

<LocalBusinessSchema {store} url={currentUrl} />

<div class="container">
	<nav class="breadcrumb">
		<a href={localizeHref('/', getLocale())}>{m.home()}</a> /
		<a href={localizeHref(`/${provinceSlug}`, getLocale())}>{store.province}</a> /
		<a href={localizeHref(`/${provinceSlug}/${citySlug}`, getLocale())}>{store.city}</a> /
		<span>{store.name}</span>
	</nav>

	<article class="store-detail">
		<header>
			<h1>{store.name}</h1>
			<p class="category">{store.category}</p>
			{#if store.stars}
				<p class="rating">⭐ {store.stars} ({store.review_count})</p>
			{/if}
		</header>

		<section class="info-section">
			<h2>{m.contact_info()}</h2>
			<div class="info-grid">
				<div class="info-item">
					<strong>📍 {m.address()}</strong>
					<p>{store.address}</p>
				</div>

				{#if store.phone}
					<div class="info-item">
						<strong>📞 {m.phone()}</strong>
						<p>
							<a href="tel:{store.phone.replace(/\s+/g, '')}">{store.phone}</a>
						</p>
					</div>
				{/if}

				{#if safeWebsiteUrl}
					<div class="info-item">
						<strong>🌐 {m.website()}</strong>
						<p>
							<a
								href={safeWebsiteUrl}
								target="_blank"
								rel="noopener noreferrer">{store.website}</a
							>
						</p>
					</div>
				{/if}

				{#if store.email}
					<div class="info-item">
						<strong>✉️ {m.email()}</strong>
						<p><a href="mailto:{store.email}">{store.email}</a></p>
					</div>
				{/if}
			</div>
		</section>

		{#if store.description}
			<section class="description-section">
				<h2>{m.description()}</h2>
				<p>{store.description}</p>
			</section>
		{/if}

		{#if store.openingHours}
			<section class="hours-section">
				<h2>{m.opening_hours()}</h2>
				<p>{store.openingHours}</p>
			</section>
		{/if}

		{#if store.specialties && store.specialties.length > 0}
			<section class="specialties-section">
				<h2>{m.specialties()}</h2>
				<div class="tags">
					{#each store.specialties as specialty}
						<span class="tag">{specialty}</span>
					{/each}
				</div>
			</section>
		{/if}

		<section class="actions">
			<a
				href={store.google_maps_url}
				target="_blank"
				rel="noopener noreferrer"
				class="btn btn-primary"
			>
				{m.view_on_maps()}
			</a>
		</section>
	</article>
</div>

<style>
	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
	}

	.breadcrumb {
		margin-bottom: 2rem;
		color: #7f8c8d;
		font-size: 0.95rem;
	}

	.breadcrumb a {
		color: #3498db;
		text-decoration: none;
	}

	.breadcrumb a:hover {
		text-decoration: underline;
	}

	.store-detail {
		background: #fff;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	header {
		border-bottom: 2px solid #ecf0f1;
		padding-bottom: 1.5rem;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		color: #2c3e50;
	}

	.category {
		font-size: 1.1rem;
		color: #3498db;
		font-weight: 500;
		margin-bottom: 0.5rem;
	}

	.rating {
		font-size: 1.1rem;
		color: #f39c12;
		font-weight: 500;
	}

	.info-section,
	.description-section,
	.hours-section,
	.specialties-section {
		margin-bottom: 2rem;
	}

	h2 {
		font-size: 1.5rem;
		color: #34495e;
		margin-bottom: 1rem;
	}

	.info-grid {
		display: grid;
		gap: 1.5rem;
	}

	.info-item {
		padding: 1rem;
		background: #f8f9fa;
		border-radius: 8px;
	}

	.info-item strong {
		display: block;
		color: #2c3e50;
		margin-bottom: 0.5rem;
		font-size: 1rem;
	}

	.info-item p {
		margin: 0;
		color: #555;
	}

	.info-item a {
		color: #3498db;
		text-decoration: none;
	}

	.info-item a:hover {
		text-decoration: underline;
	}

	.description-section p {
		line-height: 1.6;
		color: #555;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag {
		background: #3498db;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-size: 0.9rem;
	}

	.actions {
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 2px solid #ecf0f1;
	}

	.btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 500;
		transition: all 0.2s;
	}

	.btn-primary {
		background: #3498db;
		color: white;
	}

	.btn-primary:hover {
		background: #2980b9;
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}
</style>
