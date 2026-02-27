import { omkraftToast } from '@/lib/toast';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { CircleCheck, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { processSyncQueue } from '@/lib/processSyncQueue';
import { retryFailedServices } from '@/lib/retryFailedServices';

export function useConnectionToast() {
	const offlineToastId = useRef<string | number | null>(null);

	useEffect(() => {
		const handleOffline = () => {
			// prevent duplicate offline toast
			if (offlineToastId.current) return;

			offlineToastId.current = omkraftToast.error('You are offline', {
				description: 'Some features may not work.',
				duration: Infinity,
				icon: <WifiOff size={18} strokeWidth={2.5} />,
			});
		};

		const handleOnline = async () => {
			if (offlineToastId.current) {
				toast.dismiss(offlineToastId.current);

				offlineToastId.current = null;
			}

			// check if anything to sync
			const queueCount = await processSyncQueue();

			if (queueCount === 0) {
				// nothing to sync
				omkraftToast.success('Back online', {
					description: 'Connection restored.',
					icon: <Wifi size={18} strokeWidth={2.5} />,
				});

				retryFailedServices();
				return;
			}

			// show syncing toast only if needed
			const syncingToastId = omkraftToast.info('Back online', {
				description: 'Syncing your data...',
				icon: <RefreshCw size={18} className="animate-spin" />,
				duration: Infinity,
			});

			await processSyncQueue();
			retryFailedServices();

			toast.dismiss(syncingToastId);

			omkraftToast.success('Synced successfully', {
				icon: <CircleCheck size={18} strokeWidth={2.5} />,
				description: 'Your data is up to date.',
			});
		};

		window.addEventListener('offline', handleOffline);
		window.addEventListener('online', handleOnline);

		// show initial offline state if needed
		if (!navigator.onLine) {
			handleOffline();
		}

		return () => {
			window.removeEventListener('offline', handleOffline);
			window.removeEventListener('online', handleOnline);
		};
	}, []);
}
