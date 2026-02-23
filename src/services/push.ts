export async function registerPush() {
	const registration = await navigator.serviceWorker.register('/sw.js');
	const permission = await Notification.requestPermission();

	if (permission !== 'granted') return;

	const subscription = await registration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
	});

	await fetch('/api/push/subscribe', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
		body: JSON.stringify(subscription),
	});
}
