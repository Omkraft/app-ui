import { getSyncQueue, removeSyncTask } from './syncQueue';
import { omkraftToast } from './toast';
import { RefreshCw } from 'lucide-react';

export async function processSyncQueue() {
	const tasks = await getSyncQueue();

	if (!tasks.length) return;

	omkraftToast.info('Back online', {
		description: 'Syncing your data...',
		duration: 5000,
		icon: <RefreshCw size={18} strokeWidth={2.5} className="animate-spin" />,
	});

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
			// stop on first failure
			break;
		}
	}

	omkraftToast.success('Sync complete');
}
