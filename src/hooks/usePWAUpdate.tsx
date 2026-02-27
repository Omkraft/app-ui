import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function usePWAUpdate() {
	const [updateAvailable, setUpdateAvailable] = useState(false);

	const [updateSW] = useState(() =>
		registerSW({
			immediate: true,

			onRegisteredSW(swUrl) {
				console.log('SW registered:', swUrl);
			},

			onNeedRefresh() {
				console.log('New version detected');

				setUpdateAvailable(true);
			},

			onOfflineReady() {
				console.log('Offline ready');
			},
		})
	);

	// check every 30 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			updateSW(false);
		}, 30000);

		return () => clearInterval(interval);
	}, [updateSW]);

	const updateApp = () => {
		updateSW(true);
	};

	return {
		updateAvailable,

		updateApp,
	};
}
