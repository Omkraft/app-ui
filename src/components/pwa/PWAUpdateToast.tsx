import { useEffect } from 'react';
import { usePWAUpdate } from '@/hooks/usePWAUpdate';
import { omkraftToast } from '@/lib/toast';

export function PWAUpdateToast() {
	const { updateAvailable, updateApp } = usePWAUpdate();

	useEffect(() => {
		if (updateAvailable) {
			omkraftToast.info('New version available', {
				description: 'Click to update Omkraft',
				action: {
					label: 'Update',
					onClick: updateApp,
				},
				duration: 'infinity',
			});
		}
	}, [updateAvailable]);

	return null;
}
