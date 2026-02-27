import { getSyncQueue, removeSyncTask } from './syncQueue';

export async function processSyncQueue(): Promise<number> {
	const tasks = await getSyncQueue();

	if (!tasks.length) return 0;

	for (const task of tasks) {
		try {
			await fetch(task.url, {
				method: task.method,
				headers: {
					'Content-Type': 'application/json',
					...task.headers,
				},

				body: task.body ? JSON.stringify(task.body) : undefined,
			});

			await removeSyncTask(task.id!);
		} catch {
			break;
		}
	}

	return tasks.length;
}
