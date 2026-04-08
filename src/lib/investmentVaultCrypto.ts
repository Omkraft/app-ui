const VAULT_KEY_PREFIX = 'omkraft:vault-key:';
const PBKDF2_ITERATIONS = 250_000;

function getVaultStorageKey(userId: string) {
	return `${VAULT_KEY_PREFIX}${userId}`;
}

function bytesToBase64(bytes: Uint8Array) {
	let binary = '';
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary);
}

function base64ToBytes(value: string) {
	const binary = atob(value);
	const bytes = new Uint8Array(binary.length);
	for (let index = 0; index < binary.length; index += 1) {
		bytes[index] = binary.charCodeAt(index);
	}
	return bytes;
}

async function deriveVaultKey(password: string, userId: string) {
	const keyMaterial = await window.crypto.subtle.importKey(
		'raw',
		new TextEncoder().encode(password),
		'PBKDF2',
		false,
		['deriveKey']
	);

	return window.crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: new TextEncoder().encode(`omkraft-personal-vault:${userId}`),
			iterations: PBKDF2_ITERATIONS,
			hash: 'SHA-256',
		},
		keyMaterial,
		{
			name: 'AES-GCM',
			length: 256,
		},
		true,
		['encrypt', 'decrypt']
	);
}

async function exportVaultKey(key: CryptoKey) {
	const raw = await window.crypto.subtle.exportKey('raw', key);
	return bytesToBase64(new Uint8Array(raw));
}

async function importVaultKey(base64: string) {
	return window.crypto.subtle.importKey(
		'raw',
		base64ToBytes(base64),
		{
			name: 'AES-GCM',
		},
		false,
		['encrypt', 'decrypt']
	);
}

async function getStoredVaultKey(userId: string) {
	const encodedKey = window.sessionStorage.getItem(getVaultStorageKey(userId));
	if (!encodedKey) {
		return null;
	}

	return importVaultKey(encodedKey);
}

export async function storeVaultSessionKey(password: string, userId: string) {
	const key = await deriveVaultKey(password, userId);
	const exported = await exportVaultKey(key);
	window.sessionStorage.setItem(getVaultStorageKey(userId), exported);
}

export function clearVaultSessionKey(userId: string) {
	window.sessionStorage.removeItem(getVaultStorageKey(userId));
}

export function hasVaultSessionKey(userId: string) {
	return Boolean(window.sessionStorage.getItem(getVaultStorageKey(userId)));
}

export async function encryptInvestmentRecord<T extends object>(userId: string, record: T) {
	const key = await getStoredVaultKey(userId);
	if (!key) {
		throw new Error('Vault is locked. Please unlock it with your password.');
	}

	const iv = window.crypto.getRandomValues(new Uint8Array(12));
	const plaintext = new TextEncoder().encode(JSON.stringify(record));
	const encrypted = await window.crypto.subtle.encrypt(
		{
			name: 'AES-GCM',
			iv,
		},
		key,
		plaintext
	);

	return {
		encryptedPayload: bytesToBase64(new Uint8Array(encrypted)),
		iv: bytesToBase64(iv),
		encryptionAlgorithm: 'AES-GCM',
		keyDerivation: 'PBKDF2-SHA-256',
		encryptionVersion: 1,
	};
}

export async function decryptInvestmentRecord<T>(
	userId: string,
	payload: {
		encryptedPayload: string;
		iv: string;
	}
) {
	const key = await getStoredVaultKey(userId);
	if (!key) {
		throw new Error('Vault is locked. Please unlock it with your password.');
	}

	const decrypted = await window.crypto.subtle.decrypt(
		{
			name: 'AES-GCM',
			iv: base64ToBytes(payload.iv),
		},
		key,
		base64ToBytes(payload.encryptedPayload)
	);

	return JSON.parse(new TextDecoder().decode(decrypted)) as T;
}
