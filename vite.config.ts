import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
	plugins: [react(),
	VitePWA({
		registerType: 'autoUpdate',

		includeAssets: ['favicon.svg'],

		manifest: {
			name: 'Omkraft',
			short_name: 'Omkraft',
			description: 'Systems, Crafted.',
			theme_color: '#0b1c3d',
			background_color: '#0b1c3d',
			display: 'standalone',
			orientation: 'portrait',
			scope: '/',
			start_url: '/',
			icons: [
			{
				src: '/icons/pwa-192.png',
				sizes: '192x192',
				type: 'image/png'
			},
			{
				src: '/icons/pwa-512.png',
				sizes: '512x512',
				type: 'image/png'
			},
			{
				src: '/icons/pwa-512.png',
				sizes: '512x512',
				type: 'image/png',
				purpose: 'any maskable'
			}
			]
		},

		workbox: {
			runtimeCaching: [{
					urlPattern: /^https:\/\/app-api.fly\.dev\/api\/.*/i,
					handler: 'NetworkFirst',
					options: {
					cacheName: 'api-cache',
					expiration: {
						maxEntries: 50,
						maxAgeSeconds: 60 * 60 * 24
					},
					backgroundSync: {
						name: 'omkraft-api-sync',
						options: {
						maxRetentionTime: 24 * 60
						}
					}
					}
				}
			]}
		})
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});
