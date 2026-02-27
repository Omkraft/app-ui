import { omkraftToast } from '@/lib/toast';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { WifiOff } from 'lucide-react';
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

			await processSyncQueue();
			retryFailedServices();
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
