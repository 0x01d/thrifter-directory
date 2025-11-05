<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Thrifter.be - Tweedehandswinkels in België</title>
	<meta
		name="description"
		content="Vind alle kringwinkels en tweedehandswinkels in België"
	/>
</svelte:head>

<div class="container">
	<h1>Thrifter.be</h1>
	<p class="subtitle">Ontdek alle kringwinkels en tweedehandswinkels in België</p>

	<section class="provinces">
		<h2>Provincies</h2>
		<div class="province-grid">
			{#each data.provinces as province}
				<a href="/{province.slug}" class="province-card">
					<h3>{province.name}</h3>
					<p>{province.storeCount} winkels</p>
					<p class="cities-count">{province.cities.length} steden</p>
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
