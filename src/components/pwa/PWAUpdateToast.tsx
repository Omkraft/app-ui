import { useEffect } from 'react';
import { usePWAUpdate } from '@/hooks/usePWAUpdate';
import { getAvailableUpdateVersion } from '@/hooks/useAppVersion';
import { omkraftToast } from '@/lib/toast';
import { Rocket } from 'lucide-react';

export function PWAUpdateToast() {
	const { updateAvailable, applyUpdate } = usePWAUpdate();

	useEffect(() => {
		if (!updateAvailable) return;

		let timeoutId: ReturnType<typeof setTimeout> | null = null;

		(async () => {
			const newVersion = await getAvailableUpdateVersion();
			const versionText = newVersion ? `Update available ${newVersion}` : 'Update available';

			omkraftToast.success(versionText, {
				description: 'Please wait while we update the app to the latest version.',
				icon: <Rocket size={18} strokeWidth={2.5} className="pwa-update-icon-attention" />,
				duration: 10000,
				action: {
					label: 'Refresh',
					onClick: applyUpdate,
				},
			});

			timeoutId = setTimeout(() => {
				applyUpdate();
			}, 10000);
		})();

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [updateAvailable, applyUpdate]);

	return null;
}
