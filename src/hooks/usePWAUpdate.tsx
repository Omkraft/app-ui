import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function usePWAUpdate() {
	const [updateAvailable, setUpdateAvailable] = useState(false);

	const [updateSW] = useState(() =>
		registerSW({
			immediate: true, // IMPORTANT FIX

			onNeedRefresh() {
				setUpdateAvailable(true);
			},
		})
	);

	// 🔥 Automatically check for updates every 60 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			updateSW(false);
		}, 60 * 1000);

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
