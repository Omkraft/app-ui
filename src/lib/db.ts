import { openDB } from 'idb';

export const dbPromise = openDB('omkraft-db', 1, {
	upgrade(db) {
		if (!db.objectStoreNames.contains('sync-queue')) {
			db.createObjectStore('sync-queue', {
				keyPath: 'id',
				autoIncrement: true,
			});
		}
	},
});
