import { Card, CardContent } from '@/components/ui/card';
import { IndianRupee, TrendingUp, Wallet } from 'lucide-react';

type Props = {
	totalMonthly: number;
	yearlyProjection: number;
};

export default function AnalyticsKpis({ totalMonthly, yearlyProjection }: Props) {
	return (
		<>
			<Card className="border-foreground min-w-0 bg-foreground text-background">
				<CardContent className="flex items-start justify-between gap-4 p-4 lg:p-6">
					<div className="space-y-2">
						<p className="text-sm text-[var(--omkraft-navy-700)]">
							Total monthly spend
						</p>
						<p className="text-2xl font-semibold text-background flex items-center gap-1">
							<IndianRupee size={18} strokeWidth={2.5} />
							{totalMonthly.toFixed(2)}
						</p>
						<p className="text-xs text-[var(--omkraft-navy-700)]">
							Recurring spend due across active subscriptions
						</p>
					</div>
					<div className="rounded-2xl bg-[var(--omkraft-mint-100)] p-3 text-accent">
						<Wallet className="size-6" />
					</div>
				</CardContent>
			</Card>

			<Card className="border-foreground min-w-0 bg-foreground text-background">
				<CardContent className="flex items-start justify-between gap-4 p-4 lg:p-6">
					<div className="space-y-2">
						<p className="text-sm text-[var(--omkraft-navy-700)]">Yearly projection</p>
						<p className="text-2xl font-semibold text-background flex items-center gap-1">
							<IndianRupee size={18} strokeWidth={2.5} />
							{yearlyProjection.toFixed(2)}
						</p>
						<p className="text-xs text-[var(--omkraft-navy-700)]">
							Estimated yearly total based on the current active plan mix
						</p>
					</div>
					<div className="rounded-2xl bg-[var(--omkraft-mint-100)] p-3 text-accent">
						<TrendingUp className="size-6" />
					</div>
				</CardContent>
			</Card>
		</>
	);
}
