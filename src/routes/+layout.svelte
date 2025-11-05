<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="app">
	<header class="site-header">
		<div class="header-container">
			<a href="/" class="logo">
				<h1>Thrifter.be</h1>
			</a>
			<nav class="main-nav">
				<a href="/">Provincies</a>
			</nav>
		</div>
	</header>

	<main class="site-main">
		{@render children()}
	</main>

	<footer class="site-footer">
		<div class="footer-container">
			<p>&copy; 2024 Thrifter.be - Tweedehandswinkels en Kringwinkels in België</p>
		</div>
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			sans-serif;
		background: #f5f7fa;
	}

	:global(*) {
		box-sizing: border-box;
	}

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.site-header {
		background: #2c3e50;
		color: white;
		padding: 1rem 0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.header-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		text-decoration: none;
		color: white;
	}

	.logo h1 {
		margin: 0;
		font-size: 1.8rem;
		font-weight: 600;
	}

	.main-nav {
		display: flex;
		gap: 1.5rem;
	}

	.main-nav a {
		color: white;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.main-nav a:hover {
		color: #3498db;
	}

	.site-main {
		flex: 1;
	}

	.site-footer {
		background: #34495e;
		color: white;
		padding: 2rem 0;
		margin-top: 4rem;
	}

	.footer-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
		text-align: center;
	}

	.footer-container p {
		margin: 0;
		opacity: 0.9;
	}
</style>
