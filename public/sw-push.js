/* eslint-env serviceworker */
/* global self, clients */

self.addEventListener('push', function (event) {
	let data = {};

	try {
		data = event.data ? event.data.json() : {};
	} catch {
		data = {
			title: 'Omkraft',
			body: event.data ? event.data.text() : 'You have a new update.',
		};
	}

	const title = data.title || 'Omkraft';
	const body = data.body || 'You have a new notification.';

	event.waitUntil(
		self.registration.showNotification(title, {
			body,
			icon: '/logo.png',
			badge: '/badge.png',
			data: {
				url: '/',
			},
		})
	);
});

self.addEventListener('notificationclick', function (event) {
	event.notification.close();
	const targetUrl = (event.notification.data && event.notification.data.url) || '/';

	event.waitUntil(
		clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
			for (const client of list) {
				if (client.url.includes(self.location.origin) && 'focus' in client) {
					return client.focus();
				}
			}
			if (clients.openWindow) return clients.openWindow(targetUrl);
			return undefined;
		})
	);
});
