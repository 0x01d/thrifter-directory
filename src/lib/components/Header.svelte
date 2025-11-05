<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { locales, getLocale } from '$lib/paraglide/runtime.js';
	import { page } from '$app/stores';

	let mobileMenuOpen = $state(false);

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

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<header class="site-header">
	<div class="header-container">
		<a href="/" class="logo" onclick={closeMobileMenu}>
			<svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M12 22V12"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M12 12L2 7"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M12 12L22 7"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<div class="logo-text">
				<span class="logo-title">Thrifter.be</span>
				<span class="logo-subtitle">{m.footer_text()}</span>
			</div>
		</a>

		<button class="mobile-menu-toggle" onclick={toggleMobileMenu} aria-label="Toggle menu">
			<span class="hamburger" class:open={mobileMenuOpen}></span>
		</button>

		<nav class="main-nav" class:open={mobileMenuOpen}>
			<a href="/" onclick={closeMobileMenu}>{m.provinces()}</a>
			<div class="language-switcher">
				<span class="lang-label">Language:</span>
				{#each locales as lang}
					<a
						href={getLocalizedUrl(lang, $page.url.pathname)}
						class="lang-link"
						class:active={lang === getLocale()}
						onclick={closeMobileMenu}
					>
						{languageNames[lang]}
					</a>
				{/each}
			</div>
		</nav>
	</div>
</header>

<style>
	.site-header {
		background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
		color: white;
		padding: 1rem 0;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		position: sticky;
		top: 0;
		z-index: 1000;
		backdrop-filter: blur(10px);
	}

	.header-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 1rem;
		text-decoration: none;
		color: white;
		transition: transform 0.3s ease;
	}

	.logo:hover {
		transform: translateY(-2px);
	}

	.logo-icon {
		width: 2.5rem;
		height: 2.5rem;
		color: #3498db;
		filter: drop-shadow(0 2px 4px rgba(52, 152, 219, 0.3));
	}

	.logo-text {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.logo-title {
		font-size: 1.5rem;
		font-weight: 700;
		letter-spacing: -0.5px;
	}

	.logo-subtitle {
		font-size: 0.75rem;
		opacity: 0.8;
		font-weight: 400;
	}

	.mobile-menu-toggle {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		z-index: 1001;
	}

	.hamburger {
		display: block;
		width: 24px;
		height: 2px;
		background: white;
		position: relative;
		transition: background 0.3s ease;
	}

	.hamburger::before,
	.hamburger::after {
		content: '';
		position: absolute;
		width: 24px;
		height: 2px;
		background: white;
		transition: transform 0.3s ease;
	}

	.hamburger::before {
		top: -8px;
	}

	.hamburger::after {
		bottom: -8px;
	}

	.hamburger.open {
		background: transparent;
	}

	.hamburger.open::before {
		transform: rotate(45deg) translateY(8px);
	}

	.hamburger.open::after {
		transform: rotate(-45deg) translateY(-8px);
	}

	.main-nav {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.main-nav > a {
		color: white;
		text-decoration: none;
		font-weight: 500;
		font-size: 1rem;
		transition: all 0.3s ease;
		position: relative;
		padding: 0.5rem 0;
	}

	.main-nav > a::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 0;
		height: 2px;
		background: #3498db;
		transition: width 0.3s ease;
	}

	.main-nav > a:hover::after {
		width: 100%;
	}

	.main-nav > a:hover {
		color: #3498db;
	}

	.language-switcher {
		display: flex;
		gap: 0.5rem;
		padding-left: 1.5rem;
		border-left: 2px solid rgba(255, 255, 255, 0.2);
		align-items: center;
	}

	.lang-label {
		font-size: 0.85rem;
		opacity: 0.7;
		margin-right: 0.25rem;
	}

	.lang-link {
		color: rgba(255, 255, 255, 0.7);
		text-decoration: none;
		font-weight: 600;
		padding: 0.4rem 0.75rem;
		border-radius: 6px;
		transition: all 0.3s ease;
		font-size: 0.9rem;
		border: 1px solid transparent;
	}

	.lang-link:hover {
		color: white;
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.lang-link.active {
		color: white;
		background: #3498db;
		box-shadow: 0 2px 8px rgba(52, 152, 219, 0.4);
		border-color: #3498db;
	}

	@media (max-width: 768px) {
		.header-container {
			padding: 0 1rem;
		}

		.mobile-menu-toggle {
			display: block;
		}

		.logo-icon {
			width: 2rem;
			height: 2rem;
		}

		.logo-text {
			gap: 0;
		}

		.logo-title {
			font-size: 1.25rem;
		}

		.logo-subtitle {
			font-size: 0.65rem;
		}

		.main-nav {
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
			flex-direction: column;
			gap: 0;
			padding: 1rem 0;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
			transform: translateY(-100%);
			opacity: 0;
			pointer-events: none;
			transition:
				transform 0.3s ease,
				opacity 0.3s ease;
		}

		.main-nav.open {
			transform: translateY(0);
			opacity: 1;
			pointer-events: all;
		}

		.main-nav > a {
			width: 100%;
			padding: 1rem 2rem;
			border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		}

		.main-nav > a::after {
			display: none;
		}

		.language-switcher {
			width: 100%;
			padding: 1rem 2rem;
			border-left: none;
			border-top: 2px solid rgba(255, 255, 255, 0.2);
			justify-content: center;
		}

		.lang-label {
			display: none;
		}
	}
</style>
