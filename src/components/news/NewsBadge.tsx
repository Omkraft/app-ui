import { cn } from '@/lib/utils';

interface NewsBadgeProps {
	source: string;
}

export function NewsBadge({ source }: NewsBadgeProps) {
	const base =
		'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border';

	const sourceStyles: Record<string, string> = {
		'Times of India':
			'bg-primary/10 text-primary border-primary/30',
		'Indian Express':
			'bg-accent/10 text-accent border-accent/30',
		'The Hindu':
			'bg-secondary text-foreground border-border',
		'BBC News':
			'bg-red-600/10 text-red-500 border-red-500/30',
		'New York Times':
			'bg-black/10 text-black border-black/30 dark:text-white dark:bg-white/10 dark:border-white/30',
	};

	return (
		<span className={cn(base, sourceStyles[source] || 'bg-muted text-muted-foreground border-border')}>
			{source}
		</span>
	);
}
