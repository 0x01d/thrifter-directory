<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	const currentYear = new Date().getFullYear();

	const socialLinks = [
		{
			name: 'GitHub',
			url: '#',
			icon: 'github'
		},
		{
			name: 'Twitter',
			url: '#',
			icon: 'twitter'
		},
		{
			name: 'Instagram',
			url: '#',
			icon: 'instagram'
		}
	];
</script>

<footer class="site-footer">
	<div class="footer-container">
		<div class="footer-grid">
			<div class="footer-section">
				<h3 class="footer-heading">Thrifter.be</h3>
				<p class="footer-description">{m.footer_text()}</p>
			</div>

			<div class="footer-section">
				<h3 class="footer-heading">Quick Links</h3>
				<ul class="footer-links">
					<li><a href="/">{m.provinces()}</a></li>
					<li><a href="/">Home</a></li>
					<li><a href="#about">About</a></li>
					<li><a href="#contact">Contact</a></li>
				</ul>
			</div>

			<div class="footer-section">
				<h3 class="footer-heading">Connect</h3>
				<div class="social-links">
					{#each socialLinks as social}
						<a
							href={social.url}
							class="social-link"
							aria-label={social.name}
							target="_blank"
							rel="noopener noreferrer"
						>
							{#if social.icon === 'github'}
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
									/>
								</svg>
							{:else if social.icon === 'twitter'}
								<svg viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
									/>
								</svg>
							{:else if social.icon === 'instagram'}
								<svg viewBox="0 0 24 24" fill="currentColor">
									<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
									<path
										d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"
										stroke="white"
										stroke-width="2"
										fill="none"
									/>
								</svg>
							{/if}
						</a>
					{/each}
				</div>
			</div>
		</div>

		<div class="footer-bottom">
			<p class="copyright">&copy; {currentYear} Thrifter.be. All rights reserved.</p>
			<div class="footer-meta">
				<a href="#privacy">Privacy Policy</a>
				<span class="separator">•</span>
				<a href="#terms">Terms of Service</a>
			</div>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		background: linear-gradient(135deg, #1a252f 0%, #2c3e50 100%);
		color: white;
		padding: 3rem 0 1.5rem;
		margin-top: 4rem;
		position: relative;
		overflow: hidden;
	}

	.site-footer::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(
			90deg,
			#3498db 0%,
			#2ecc71 33%,
			#f39c12 66%,
			#e74c3c 100%
		);
	}

	.footer-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 3rem;
		margin-bottom: 3rem;
	}

	.footer-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.footer-heading {
		font-size: 1.2rem;
		font-weight: 700;
		margin: 0;
		color: #3498db;
		letter-spacing: -0.5px;
	}

	.footer-description {
		margin: 0;
		opacity: 0.8;
		line-height: 1.6;
		font-size: 0.95rem;
	}

	.footer-links {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.footer-links a {
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
		transition: all 0.3s ease;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.95rem;
	}

	.footer-links a::before {
		content: '→';
		opacity: 0;
		transform: translateX(-10px);
		transition: all 0.3s ease;
	}

	.footer-links a:hover {
		color: #3498db;
		padding-left: 0.5rem;
	}

	.footer-links a:hover::before {
		opacity: 1;
		transform: translateX(0);
	}

	.social-links {
		display: flex;
		gap: 1rem;
	}

	.social-link {
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		color: white;
		transition: all 0.3s ease;
		border: 2px solid transparent;
	}

	.social-link svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	.social-link:hover {
		background: #3498db;
		transform: translateY(-3px);
		box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
		border-color: #5dade2;
	}

	.footer-bottom {
		padding-top: 2rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.copyright {
		margin: 0;
		opacity: 0.7;
		font-size: 0.9rem;
	}

	.footer-meta {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.footer-meta a {
		color: rgba(255, 255, 255, 0.7);
		text-decoration: none;
		font-size: 0.9rem;
		transition: color 0.3s ease;
	}

	.footer-meta a:hover {
		color: #3498db;
	}

	.separator {
		opacity: 0.5;
	}

	@media (max-width: 768px) {
		.site-footer {
			padding: 2rem 0 1rem;
		}

		.footer-container {
			padding: 0 1rem;
		}

		.footer-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
			margin-bottom: 2rem;
		}

		.footer-bottom {
			flex-direction: column;
			text-align: center;
			gap: 1rem;
		}

		.social-links {
			justify-content: center;
		}
	}
</style>
