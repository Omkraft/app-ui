import { toast } from 'sonner';
import { Info, CircleAlert, CircleCheckBig } from 'lucide-react';

interface OmkraftToastOptions {
	description?: string;
	action?: {
		label: string;
		onClick: () => void;
	};
	duration?: number | 'infinity';
	icon?: React.ReactNode;
}

export const omkraftToast = {
	success(message: string, options?: OmkraftToastOptions) {
		return toast.success(message, {
			description: options?.description,
			action: options?.action,
			icon: options?.icon ?? <CircleCheckBig size={18} strokeWidth={2.5} />,
			classNames: {
				description: 'text-[var(--omkraft-mint-800)]',
				actionButton: 'bg-[var(--omkraft-mint-800)] text-foreground',
			},
			duration: options?.duration === 'infinity' ? Infinity : options?.duration,
		});
	},

	error(message: string, options?: OmkraftToastOptions) {
		return toast.error(message, {
			description: options?.description,
			action: options?.action,
			icon: options?.icon ?? <CircleAlert size={18} strokeWidth={2.5} />,
			classNames: {
				description: 'text-[var(--omkraft-red-800)]',
				actionButton: 'bg-[var(--omkraft-red-800)] text-destructive-foreground',
			},
			duration: options?.duration === 'infinity' ? Infinity : options?.duration,
		});
	},

	info(message: string, options?: OmkraftToastOptions) {
		return toast.info(message, {
			description: options?.description,
			action: options?.action,
			icon: options?.icon ?? <Info size={18} strokeWidth={2.5} />,
			classNames: {
				description: 'text-[var(--omkraft-blue-800)]',
				actionButton: 'bg-[var(--omkraft-blue-800)] text-primary-foreground',
			},
			duration: options?.duration === 'infinity' ? Infinity : options?.duration,
		});
	},
};
