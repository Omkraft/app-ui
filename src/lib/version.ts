const VERSION_ENDPOINT = '/version.json';

interface VersionPayload {
	version?: string;
}

export function getCurrentBuildVersion(): string {
	return import.meta.env.VITE_APP_VERSION || 'dev';
}

export function getBuildVersionLabel(): string {
	const version = getCurrentBuildVersion();
	return version === 'dev' ? 'Version: dev' : version;
}

export async function fetchLatestVersion(): Promise<string | null> {
	try {
		const res = await fetch(`${VERSION_ENDPOINT}?t=${Date.now()}`, {
			cache: 'no-store',
			headers: {
				Accept: 'application/json',
			},
		});

		if (!res.ok) return null;

		const data = (await res.json()) as VersionPayload;
		if (!data.version || typeof data.version !== 'string') return null;

		return data.version;
	} catch {
		return null;
	}
}
