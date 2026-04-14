import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, TrendingUp, Wallet } from 'lucide-react';

type Props = {
	totalMonthly: number;
	yearlyProjection: number;
};

export default function AnalyticsKpis({ totalMonthly, yearlyProjection }: Props) {
	return (
		<>
			<Card className="border-foreground min-w-0">
				<CardHeader className="gap-2 p-4 lg:p-6">
					<CardTitle>
						<h3 className="flex gap-2 text-2xl font-semibold">
							<Wallet className="size-8 text-accent" />
							Total Monthly Spend
						</h3>
					</CardTitle>
				</CardHeader>
				<CardContent className="p-4 lg:p-6 pt-0 lg:pt-0">
					<p className="text-xl font-semibold text-accent flex items-center gap-1">
						<IndianRupee size={18} strokeWidth={2.5} />
						{totalMonthly.toFixed(2)}
					</p>
				</CardContent>
			</Card>

			<Card className="border-foreground min-w-0">
				<CardHeader className="gap-2 p-4 lg:p-6">
					<CardTitle>
						<h3 className="flex gap-2 text-2xl font-semibold">
							<TrendingUp className="size-8 text-accent" />
							Yearly Projection
						</h3>
					</CardTitle>
				</CardHeader>
				<CardContent className="p-4 lg:p-6 pt-0 lg:pt-0">
					<p className="text-xl font-semibold text-accent flex items-center gap-1">
						<IndianRupee size={18} strokeWidth={2.5} />
						{yearlyProjection.toFixed(2)}
					</p>
				</CardContent>
			</Card>
		</>
	);
}
