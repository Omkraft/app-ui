import { useEffect } from 'react';
import { fetchLatestVersion } from '@/lib/version';
import { getStoredVersion, setStoredVersion } from '@/lib/versionStore';
import { omkraftToast } from '@/lib/toast';

export function useAppVersion() {
	useEffect(() => {
		checkVersion();
	}, []);

	async function checkVersion() {
		const storedVersion = getStoredVersion();

		const latestVersion = await fetchLatestVersion();

		if (!latestVersion) return;

		// FIRST TIME INSTALL
		if (!storedVersion) {
			setStoredVersion(latestVersion);

			return;
		}

		// VERSION UPDATED
		if (storedVersion !== latestVersion) {
			omkraftToast.success(`Updated to ${latestVersion}`, {
				duration: 6000,
			});

			setStoredVersion(latestVersion);
		}
	}
}
