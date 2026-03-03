import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee } from 'lucide-react';

type Props = {
	data: { month: string; total: number }[];
};

export default function MonthlyTrendChart({ data }: Props) {
	return (
		<Card className="border-foreground min-w-0">
			<CardHeader>
				<CardTitle>
					<h4 className="text-xl font-semibold">Monthly Spending Trend</h4>
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4 sm:p-6">
				<ChartContainer config={{}} className="w-full min-w-0 h-[320px]">
					<ResponsiveContainer width="100%" height={320}>
						<LineChart data={data}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" />
							<YAxis />
							<ChartTooltip
								content={({ active, payload }) => {
									if (!active || !payload?.length) return null;

									const item = payload[0];
									const row = item.payload as { month?: string; total?: number };
									const monthLabel = row.month || 'Month';

									return (
										<div
											className="
											bg-foreground
											text-background
											px-3
											py-2
											rounded-lg
											shadow-lg
											border
											border-background
											text-sm
										"
										>
											<div className="font-semibold">{monthLabel}</div>

											<div className="flex items-center gap-1">
												<span className="font-medium mr-1">Total</span>
												<IndianRupee size={14} strokeWidth={2.5} />
												{Number(item.value).toFixed(2)}
											</div>
										</div>
									);
								}}
							/>
							<Line
								type="monotone"
								dataKey="total"
								stroke="var(--omkraft-primary)"
								strokeWidth={3}
								dot={{
									r: 4,
									fill: 'var(--omkraft-primary)',
									stroke: 'var(--color-background)',
									strokeWidth: 2,
								}}
								activeDot={{
									r: 6,
									fill: 'var(--omkraft-accent)',
									stroke: 'var(--color-background)',
									strokeWidth: 2,
								}}
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
