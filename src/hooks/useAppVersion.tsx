import { fetchLatestVersion, getStoredVersion, setStoredVersion } from '@/lib/version';

export async function checkAndUpdateVersion(): Promise<string | null> {
	const latestVersion = await fetchLatestVersion();

	if (!latestVersion) return null;

	const storedVersion = getStoredVersion();

	if (!storedVersion) {
		setStoredVersion(latestVersion);
		return null;
	}

	if (storedVersion !== latestVersion) {
		setStoredVersion(latestVersion);
		return latestVersion;
	}

	return null;
}
