<script lang="ts">
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime.js';
	import SEOTags from '$lib/components/SEOTags.svelte';

	let { data }: { data: PageData } = $props();

	const locale = getLocale();
	const baseUrl = 'https://thrifter.be';
	const currentUrl = `${baseUrl}${localizeHref('/', locale)}`;
</script>

<svelte:head>
	<title>{m.site_title()}</title>
	<meta name="description" content={m.site_description()} />
</svelte:head>

<SEOTags
	title={m.site_title()}
	description={m.site_description()}
	url={currentUrl}
	canonical={currentUrl}
	type="website"
/>

<div class="container">
	<h1>Thrifter.be</h1>
	<p class="subtitle">{m.subtitle()}</p>

	<section class="provinces">
		<h2>{m.provinces()}</h2>
		<div class="province-grid">
			{#each data.provinces as province}
				<a href={localizeHref(`/${province.slug}`, getLocale())} class="province-card">
					<h3>{province.name}</h3>
					<p>{m.store_count({ count: province.storeCount })}</p>
					<p class="cities-count">{m.city_count({ count: province.cities.length })}</p>
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

	.provinces {
		margin-top: 2rem;
	}

	h2 {
		font-size: 2rem;
		margin-bottom: 1.5rem;
		color: #34495e;
	}

	.province-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.province-card {
		background: #fff;
		border: 2px solid #ecf0f1;
		border-radius: 8px;
		padding: 1.5rem;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
	}

	.province-card:hover {
		border-color: #3498db;
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.province-card h3 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		color: #2c3e50;
	}

	.province-card p {
		margin: 0.25rem 0;
		color: #7f8c8d;
	}

	.cities-count {
		font-size: 0.9rem;
	}
</style>
