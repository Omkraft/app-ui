import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartLegend } from '@/components/ui/chart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CATEGORY_COLORS, FALLBACK_COLORS } from './categoryColors';
import { ResponsiveContainer } from 'recharts';
import { getCategoryLabel } from './categoryLabels';
import { IndianRupee } from 'lucide-react';

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
					<h4 className="text-xl font-semibold">Spending by Category</h4>
				</CardTitle>
			</CardHeader>

			<CardContent className="p-4 sm:p-6">
				<ChartContainer config={{}} className="w-full min-w-0 h-[320px]">
					<ResponsiveContainer width="100%" height={320}>
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

											<div className="flex items-center gap-1">
												<IndianRupee size={14} strokeWidth={2.5} />
												{Number(item.value).toFixed(2)}
											</div>
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
