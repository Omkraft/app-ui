import { useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function usePWAUpdate() {
	const [updateAvailable, setUpdateAvailable] = useState(false);

	const [updateSW] = useState(() =>
		registerSW({
			immediate: true,

			onNeedRefresh() {
				setUpdateAvailable(true);
			},
		})
	);

	const applyUpdate = () => {
		updateSW(true);
	};

	return {
		updateAvailable,
		applyUpdate,
	};
}
