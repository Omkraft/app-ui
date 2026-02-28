import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
	data: { month: string; total: number }[];
};

export default function MonthlyTrendChart({ data }: Props) {
	return (
		<Card className="border-foreground min-w-0">
			<CardHeader>
				<CardTitle>
					<h3 className="text-2xl font-semibold">Monthly Spending Trend</h3>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex items-center justify-center">
				<ChartContainer config={{}} className="w-full min-w-0 min-h-[320px]">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={data}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" />
							<YAxis />
							<ChartTooltip
								content={({ active, payload }) => {
									if (!active || !payload?.length) return null;

									const item = payload[0];

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
											<div className="font-semibold">{item.name}</div>

											<div>&#8377; {Number(item.value).toFixed(2)}</div>
										</div>
									);
								}}
							/>
							<Line
								type="monotone"
								dataKey="total"
								stroke="var(--omkraft-primary)"
								strokeWidth={3}
								dot={false}
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
