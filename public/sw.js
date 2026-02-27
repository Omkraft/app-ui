/* global self */

import { processSyncQueue } from '../src/lib/processSyncQueue';

self.addEventListener('push', function (event) {
	const data = event.data.json();

	self.registration.showNotification(data.title, {
		body: data.body,
		icon: '/logo.png',
		badge: '/badge.png',
	});
});

self.addEventListener(
	'sync',
		event => {
		if (event.tag === 'omkraft-sync') {
			event.waitUntil(
				processSyncQueue()
			);
		}
	}
);