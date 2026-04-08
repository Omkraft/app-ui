import {
	AlertCircleIcon,
	AlertTriangleIcon,
	CheckCircle2Icon,
	InfoIcon,
	type LucideIcon,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getErrorAlertDetails } from '@/lib/errorAlert';
import { cn } from '@/lib/utils';

type AlertSeverity = 'error' | 'warning' | 'info' | 'success';

type Props = {
	error: unknown;
	severity?: AlertSeverity;
	fallbackTitle?: string;
	fallbackMessage?: string;
	icon?: LucideIcon;
};

export default function OmkraftAlert({
	error,
	severity = 'error',
	fallbackTitle,
	fallbackMessage,
	icon: CustomIcon,
}: Props) {
	if (!error) return null;

	const defaultBySeverity: Record<AlertSeverity, { title: string; message: string }> = {
		error: { title: 'Action failed', message: 'Something went wrong. Please try again.' },
		warning: { title: 'Heads up', message: 'Please review this warning before continuing.' },
		info: { title: 'For your information', message: 'Please review this information.' },
		success: { title: 'Success', message: 'The action completed successfully.' },
	};
	const title = fallbackTitle ?? defaultBySeverity[severity].title;
	const message = fallbackMessage ?? defaultBySeverity[severity].message;

	const details =
		severity === 'error'
			? getErrorAlertDetails(error, title, message)
			: {
					title,
					message:
						error instanceof Error
							? error.message
							: typeof error === 'string'
								? error
								: message,
				};

	const icon = CustomIcon ? (
		<CustomIcon />
	) : severity === 'warning' ? (
		<AlertTriangleIcon />
	) : severity === 'info' ? (
		<InfoIcon />
	) : severity === 'success' ? (
		<CheckCircle2Icon />
	) : (
		<AlertCircleIcon />
	);
	const variant =
		severity === 'warning'
			? 'warning'
			: severity === 'info'
				? 'info'
				: severity === 'success'
					? 'success'
					: 'destructive';
	const borderClass =
		severity === 'warning'
			? 'border-[var(--warning-border)]'
			: severity === 'info'
				? 'border-[var(--info-border)]'
				: severity === 'success'
					? 'border-[var(--success-border)]'
					: 'border-[var(--omkraft-red-800)]';

	return (
		<Alert variant={variant} className={cn('flex flex-col gap-2', borderClass)}>
			<AlertTitle className="flex gap-2 items-center">
				{icon}
				{details.title}
			</AlertTitle>
			<AlertDescription className="text-sm">{details.message}</AlertDescription>
		</Alert>
	);
}
