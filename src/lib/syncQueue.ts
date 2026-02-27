import { dbPromise } from './db';

export interface SyncTask<T = unknown> {
	id?: number;
	url: string;
	method: string;
	body?: T;
	headers?: Record<string, string>;
	createdAt?: number;
}

export async function addToSyncQueue(task: SyncTask) {
	const db = await dbPromise;

	await db.add('sync-queue', {
		...task,
		createdAt: Date.now(),
	});
}

export async function getSyncQueue() {
	const db = await dbPromise;

	return db.getAll('sync-queue');
}

export async function removeSyncTask(id: number) {
	const db = await dbPromise;

	await db.delete('sync-queue', id);
}
