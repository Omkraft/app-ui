import { useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function usePWAUpdate() {
	const [updateAvailable, setUpdateAvailable] = useState(false);

	const [updateSW] = useState(() =>
		registerSW({
			onNeedRefresh() {
				setUpdateAvailable(true);
			},
		})
	);

	const updateApp = () => {
		updateSW(true);
	};

	return { updateAvailable, updateApp };
}
