<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import * as m from '$lib/paraglide/messages.js';
	import { languageTag, availableLanguageTags } from '$lib/paraglide/runtime.js';
	import { page } from '$app/stores';

	let { children } = $props();

	// Language display names
	const languageNames: Record<string, string> = {
		nl: 'NL',
		fr: 'FR',
		en: 'EN'
	};

	function getLocalizedUrl(lang: string, currentPath: string) {
		// Remove current language prefix if it exists
		const pathWithoutLang = currentPath.replace(/^\/(nl|fr|en)(\/|$)/, '/');
		// Add new language prefix
		return lang === 'nl' ? pathWithoutLang : `/${lang}${pathWithoutLang}`;
	}
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
				<a href="/">{m.provinces()}</a>
				<div class="language-switcher">
					{#each availableLanguageTags as lang}
						<a
							href={getLocalizedUrl(lang, $page.url.pathname)}
							class="lang-link"
							class:active={lang === languageTag()}
						>
							{languageNames[lang]}
						</a>
					{/each}
				</div>
			</nav>
		</div>
	</header>

	<main class="site-main">
		{@render children()}
	</main>

	<footer class="site-footer">
		<div class="footer-container">
			<p>&copy; 2024 {m.footer_text()}</p>
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
		align-items: center;
	}

	.main-nav > a {
		color: white;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.main-nav > a:hover {
		color: #3498db;
	}

	.language-switcher {
		display: flex;
		gap: 0.5rem;
		padding-left: 1rem;
		border-left: 1px solid rgba(255, 255, 255, 0.3);
	}

	.lang-link {
		color: rgba(255, 255, 255, 0.7);
		text-decoration: none;
		font-weight: 500;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		transition: all 0.2s;
		font-size: 0.9rem;
	}

	.lang-link:hover {
		color: white;
		background: rgba(255, 255, 255, 0.1);
	}

	.lang-link.active {
		color: white;
		background: #3498db;
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
