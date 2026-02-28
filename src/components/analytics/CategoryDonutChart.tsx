import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartLegend } from '@/components/ui/chart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CATEGORY_COLORS, FALLBACK_COLORS } from './categoryColors';
import { ResponsiveContainer } from 'recharts';
import { getCategoryLabel } from './categoryLabels';

type Props = {
	data: {
		category: string;
		total: number;
	}[];
};

function getColor(category: string, index: number) {
	return CATEGORY_COLORS[category] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

export default function CategoryDonutChart({ data }: Props) {
	return (
		<Card className="border-foreground min-w-0">
			<CardHeader>
				<CardTitle>
					<h3 className="text-2xl font-semibold">Spending by Category</h3>
				</CardTitle>
			</CardHeader>

			<CardContent className="flex items-center justify-center">
				<ChartContainer config={{}} className="w-full min-w-0 min-h-[320px]">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={data}
								dataKey="total"
								nameKey="category"
								innerRadius="55%"
								outerRadius="80%"
								paddingAngle={4}
							>
								{data.map((entry, index) => (
									<Cell
										key={entry.category}
										fill={getColor(entry.category, index)}
									/>
								))}
							</Pie>

							{/* TOOLTIP */}

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
											<div className="font-semibold">
												{getCategoryLabel(item.name as string)}
											</div>

											<div>₹{Number(item.value).toFixed(2)}</div>
										</div>
									);
								}}
							/>

							{/* LEGEND */}

							<ChartLegend
								content={({ payload }) => (
									<div className="flex flex-wrap gap-2 mt-4 justify-center">
										{payload?.map((entry, index) => (
											<div
												key={index}
												className="flex items-center gap-2 text-foreground text-sm"
											>
												<div
													className="w-3 h-3 rounded-sm"
													style={{
														backgroundColor: entry.color,
													}}
												/>

												{getCategoryLabel(entry.value as string)}
											</div>
										))}
									</div>
								)}
							/>
						</PieChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
