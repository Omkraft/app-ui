const STORAGE_KEY = 'omkraft-app-version';

let cachedVersion: string | null = null;

export function getStoredVersion(): string | null {
	if (cachedVersion) return cachedVersion;

	const stored = localStorage.getItem(STORAGE_KEY);

	cachedVersion = stored;

	return stored;
}

export function setStoredVersion(version: string) {
	cachedVersion = version;

	localStorage.setItem(STORAGE_KEY, version);
}
