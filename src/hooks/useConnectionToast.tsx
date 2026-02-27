import { omkraftToast } from '@/lib/toast';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { RefreshCw, WifiOff } from 'lucide-react';

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

		const handleOnline = () => {
			// close offline toast if exists
			if (offlineToastId.current) {
				toast.dismiss(offlineToastId.current);

				offlineToastId.current = null;
			}

			// show online toast
			omkraftToast.success('Back online', {
				description: 'Syncing your data...',
				duration: 5000,
				icon: <RefreshCw size={18} strokeWidth={2.5} className="animate-spin" />,
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
