const STORAGE_KEY = 'omkraft-version';

export async function fetchLatestVersion(): Promise<string | null> {
	try {
		const res = await fetch('https://api.github.com/repos/Omkraft/app-ui/releases/latest', {
			cache: 'no-store',
			headers: {
				Accept: 'application/vnd.github+json',
			},
		});

		if (!res.ok) return null;

		const data = await res.json();

		return data.tag_name ?? null;
	} catch {
		return null;
	}
}

export function getStoredVersion(): string | null {
	return localStorage.getItem(STORAGE_KEY);
}

export function setStoredVersion(version: string) {
	localStorage.setItem(STORAGE_KEY, version);
}
