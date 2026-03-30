import { reportUiError } from '@/lib/error';
import { isIos } from '@/utils/isIos';
import { isStandalone } from '@/utils/isStandalone';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const normalized = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	const rawData = window.atob(normalized);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}

	return outputArray;
}

type RegisterPushOptions = {
	requestPermission?: boolean;
};

export async function registerPush(options: RegisterPushOptions = {}): Promise<boolean> {
	const { requestPermission = true } = options;

	if (
		!('serviceWorker' in navigator) ||
		!('PushManager' in window) ||
		!('Notification' in window)
	) {
		return false;
	}

	// iOS web push is only available for Home Screen web apps.
	if (isIos() && !isStandalone()) {
		return false;
	}

	const token = localStorage.getItem('token');
	if (!token) return false;

	const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
	if (!vapidPublicKey) {
		reportUiError('push:missing-vapid-key', 'VITE_VAPID_PUBLIC_KEY is not set.');
		return false;
	}

	if (Notification.permission !== 'granted') {
		if (!requestPermission) {
			return false;
		}

		const permission = await Notification.requestPermission();
		if (permission !== 'granted') return false;
	}

	try {
		// Use the currently active SW (managed by vite-plugin-pwa), do not register a second SW.
		const registration = await navigator.serviceWorker.ready;
		let subscription = await registration.pushManager.getSubscription();

		if (!subscription) {
			subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
			});
		}

		const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/push/subscribe`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				subscription,
				timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null,
			}),
		});

		if (!res.ok) {
			reportUiError(
				'push:subscribe',
				new Error(`Push subscribe failed with status ${res.status}`)
			);
			return false;
		}

		return true;
	} catch (error) {
		reportUiError('push:register', error);
		return false;
	}
}
