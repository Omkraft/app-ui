import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
	totalMonthly: number;
	yearlyProjection: number;
};

export default function AnalyticsKpis({ totalMonthly, yearlyProjection }: Props) {
	return (
		<>
			<Card className="border-foreground min-w-0">
				<CardHeader>
					<CardTitle>
						<h3 className="text-2xl font-semibold">Total Monthly Spend</h3>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-xl font-semibold text-accent">
						&#8377; {totalMonthly.toFixed(2)}
					</p>
				</CardContent>
			</Card>

			<Card className="border-foreground min-w-0">
				<CardHeader>
					<CardTitle>
						<h3 className="text-2xl font-semibold">Yearly Projection</h3>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-xl font-semibold text-accent">
						&#8377; {yearlyProjection.toFixed(2)}
					</p>
				</CardContent>
			</Card>
		</>
	);
}
