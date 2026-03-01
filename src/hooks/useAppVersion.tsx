import { fetchLatestVersion, getCurrentBuildVersion } from '@/lib/version';

export async function getAvailableUpdateVersion(): Promise<string | null> {
	const latestVersion = await fetchLatestVersion();
	if (!latestVersion) return null;

	const currentVersion = getCurrentBuildVersion();
	if (latestVersion === currentVersion) return null;

	return latestVersion;
}
