import { useEffect } from 'react';
import { fetchLatestVersion, getStoredVersion, setStoredVersion } from '@/lib/version';
import { omkraftToast } from '@/lib/toast';
import { CircleArrowUp } from 'lucide-react';

export function useAppVersion() {
	useEffect(() => {
		checkVersion();
	}, []);

	async function checkVersion() {
		const latestVersion = await fetchLatestVersion();

		if (!latestVersion) return;

		const storedVersion = getStoredVersion();

		if (!storedVersion) {
			setStoredVersion(latestVersion);
			return;
		}

		if (storedVersion !== latestVersion) {
			omkraftToast.success(`Updated to ${latestVersion}`, {
				description: 'A new version is available.',
				icon: <CircleArrowUp size={18} strokeWidth={2.5} />,
				duration: 10000,
			});

			setStoredVersion(latestVersion);
		}
	}
}
