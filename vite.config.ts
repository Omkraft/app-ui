import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

function resolveAppVersion(): string {
	const releaseVersion = process.env.APP_RELEASE_VERSION?.trim();
	if (releaseVersion) return releaseVersion;

	const commitSha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA;
	if (commitSha) return commitSha.slice(0, 12);

	const pkgVersion = process.env.npm_package_version;
	if (pkgVersion) return `v${pkgVersion}`;

	return 'dev';
}

const appVersion = resolveAppVersion();

export default defineConfig({
	define: {
		'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion),
	},
	plugins: [
		react(),
		VitePWA({
			registerType: 'prompt',
			injectRegister: 'auto',
			includeAssets: ['favicon.svg', 'icons/pwa-192.png', 'icons/pwa-512.png'],
			manifest: {
				name: 'Omkraft Inc.',
				short_name: 'Omkraft',
				description: 'Systems, Crafted.',
				theme_color: '#041459',
				background_color: '#041459',
				display: 'standalone',
				orientation: 'portrait',
				scope: '/',
				start_url: '/',
				icons: [
					{
						src: '/icons/pwa-192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/icons/pwa-512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: '/icons/pwa-512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
			},
			workbox: {
				clientsClaim: false,
				skipWaiting: false,
				cleanupOutdatedCaches: true,
				navigateFallback: '/index.html',
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/app-api\.fly\.dev\/api\/.*/i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'omkraft-api-cache',
							networkTimeoutSeconds: 10,
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 60 * 24,
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
							backgroundSync: {
								name: 'omkraft-api-sync',
								options: {
									maxRetentionTime: 24 * 60,
								},
							},
						},
					},
				],
			},
			devOptions: {
				enabled: true,
			},
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
