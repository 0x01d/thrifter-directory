<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Group stores by city for display
	const storesByCity = new Map<string, typeof data.stores>();
	for (const store of data.stores) {
		if (!storesByCity.has(store.city)) {
			storesByCity.set(store.city, []);
		}
		storesByCity.get(store.city)!.push(store);
	}
</script>

<svelte:head>
	<title>{data.province.name} - Tweedehandswinkels - Thrifter.be</title>
	<meta
		name="description"
		content="Vind alle {data.stores.length} kringwinkels en tweedehandswinkels in {data.province
			.name}"
	/>
</svelte:head>

<div class="container">
	<nav class="breadcrumb">
		<a href="/">Home</a> / <span>{data.province.name}</span>
	</nav>

	<h1>{data.province.name}</h1>
	<p class="stats">
		{data.stores.length} tweedehandswinkels in {data.cities.length} steden
	</p>

	<section class="cities">
		<h2>Steden</h2>
		<div class="city-grid">
			{#each data.cities as city}
				<a href="/{data.province.slug}/{city.slug}" class="city-card">
					<h3>{city.name}</h3>
					<p>{city.storeCount} winkels</p>
				</a>
			{/each}
		</div>
	</section>

	<section class="stores">
		<h2>Alle winkels</h2>
		{#each Array.from(storesByCity.entries()) as [cityName, cityStores]}
			<div class="city-section">
				<h3>
					<a href="/{data.province.slug}/{cityStores[0].slug.split('-').pop()}"
						>{cityName}</a
					>
				</h3>
				<div class="store-list">
					{#each cityStores as store}
						<a
							href="/{data.province.slug}/{store.city
								.toLowerCase()
								.replace(/\s+/g, '-')}/{store.slug}"
							class="store-card"
						>
							<h4>{store.name}</h4>
							<p class="category">{store.category}</p>
							<p class="address">{store.address}</p>
							{#if store.stars}
								<p class="rating">⭐ {store.stars} ({store.review_count})</p>
							{/if}
						</a>
					{/each}
				</div>
			</div>
		{/each}
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

	.cities,
	.stores {
		margin-top: 3rem;
	}

	h2 {
		font-size: 1.8rem;
		margin-bottom: 1.5rem;
		color: #34495e;
	}

	.city-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.city-card {
		background: #fff;
		border: 2px solid #ecf0f1;
		border-radius: 8px;
		padding: 1rem;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
	}

	.city-card:hover {
		border-color: #3498db;
		transform: translateY(-2px);
	}

	.city-card h3 {
		font-size: 1.2rem;
		margin-bottom: 0.25rem;
		color: #2c3e50;
	}

	.city-card p {
		margin: 0;
		color: #7f8c8d;
		font-size: 0.9rem;
	}

	.city-section {
		margin-bottom: 3rem;
	}

	.city-section h3 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: #2c3e50;
	}

	.city-section h3 a {
		color: inherit;
		text-decoration: none;
	}

	.city-section h3 a:hover {
		color: #3498db;
	}

	.store-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}

	.store-card {
		background: #fff;
		border: 1px solid #ecf0f1;
		border-radius: 8px;
		padding: 1.25rem;
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
	}

	.store-card:hover {
		border-color: #3498db;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.store-card h4 {
		font-size: 1.1rem;
		margin-bottom: 0.5rem;
		color: #2c3e50;
	}

	.category {
		font-size: 0.9rem;
		color: #3498db;
		margin-bottom: 0.5rem;
	}

	.address {
		font-size: 0.9rem;
		color: #7f8c8d;
		margin-bottom: 0.5rem;
	}

	.rating {
		font-size: 0.9rem;
		color: #f39c12;
		margin-top: 0.5rem;
	}
</style>
