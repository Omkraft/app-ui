import { useEffect } from 'react';
import { usePWAUpdate } from '@/hooks/usePWAUpdate';
import { checkAndUpdateVersion } from '@/hooks/useAppVersion';
import { omkraftToast } from '@/lib/toast';
import { CircleArrowUp } from 'lucide-react';

export function PWAUpdateToast() {
	const { updateAvailable, applyUpdate } = usePWAUpdate();

	useEffect(() => {
		if (!updateAvailable) return;

		handleUpdate();
	}, [updateAvailable]);

	async function handleUpdate() {
		const newVersion = await checkAndUpdateVersion();

		const versionText = newVersion ? `Update available ${newVersion}` : 'Update available';

		omkraftToast.success(versionText, {
			description: 'Please wait while we update the app to the latest version.',
			icon: <CircleArrowUp size={18} strokeWidth={2.5} />,
			duration: 10000,
			action: {
				label: 'Refresh now',
				onClick: applyUpdate,
			},
		});

		setTimeout(() => {
			applyUpdate();
		}, 10000);
	}

	return null;
}
