import { useEffect } from 'react';
import { fetchLatestVersion, getStoredVersion, setStoredVersion } from '@/lib/version';
import { omkraftToast } from '@/lib/toast';
import { CircleArrowUp } from 'lucide-react';

export function useAppVersion() {
	useEffect(() => {
		// Delay execution slightly to allow SW update to complete
		const timer = setTimeout(() => {
			checkVersion();
		}, 1500);

		return () => clearTimeout(timer);
	}, []);

	async function checkVersion() {
		const latestVersion = await fetchLatestVersion();

		if (!latestVersion) return;

		const storedVersion = getStoredVersion();

		// First install
		if (!storedVersion) {
			setStoredVersion(latestVersion);
			return;
		}

		// Version changed → show toast
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
