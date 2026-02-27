const STORAGE_KEY = 'omkraft-app-version';

export function getStoredVersion(): string | null {
	return localStorage.getItem(STORAGE_KEY);
}

export function setStoredVersion(version: string) {
	localStorage.setItem(STORAGE_KEY, version);
}
