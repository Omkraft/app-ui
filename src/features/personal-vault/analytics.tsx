import { useMemo } from 'react';
import { ChevronDown, IndianRupee } from 'lucide-react';
import {
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	XAxis,
	YAxis,
} from 'recharts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import OmkraftAlert from '@/components/ui/omkraft-alert';
import {
	ChartContainer,
	ChartLegend,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from '@/components/ui/chart';
import { LockedVaultState } from './components';
import type { InvestmentRecord } from './types';
import { formatCurrencyNumber, parseFormDate } from './utils';

const chartConfig = {
	invested: {
		label: 'Amount invested',
		color: 'var(--omkraft-mint-600)',
	},
	interest: {
		label: 'Interest earned',
		color: 'var(--omkraft-indigo-500)',
	},
	maturityValue: {
		label: 'Maturity value',
		color: 'var(--omkraft-blue-700)',
	},
} satisfies ChartConfig;

type VaultCompositionKey = 'invested' | 'interest';

type VaultAnalyticsSectionProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	records: InvestmentRecord[];
	loading: boolean;
	vaultUnlocked: boolean;
	onUnlock: () => void;
};

export function VaultAnalyticsSection({
	open,
	onOpenChange,
	records,
	loading,
	vaultUnlocked,
	onUnlock,
}: VaultAnalyticsSectionProps) {
	const donutData = useMemo(
		(): {
			key: VaultCompositionKey;
			label?: string;
			value: number;
			fill?: string;
		}[] => [
			{
				key: 'invested',
				label: chartConfig.invested.label,
				value: records.reduce((sum, record) => sum + record.amountInvested, 0),
				fill: chartConfig.invested.color,
			},
			{
				key: 'interest',
				label: chartConfig.interest.label,
				value: records.reduce((sum, record) => sum + record.interestEarned, 0),
				fill: chartConfig.interest.color,
			},
		],
		[records]
	);

	const maturityTrendData = useMemo(() => buildMaturityTrendData(records), [records]);

	return (
		<section className="py-6 bg-primary">
			<div className="app-container grid gap-6 items-center">
				<Collapsible
					open={open}
					onOpenChange={onOpenChange}
					className="w-full text-foreground"
				>
					<CollapsibleTrigger asChild>
						<button className="w-full flex items-center justify-between rounded-xl border border-background bg-foreground p-6 gap-2 text-left transition-colors hover:bg-[var(--omkraft-blue-50)]">
							<div className="flex flex-col gap-2">
								<h2 className="text-2xl font-semibold text-background">
									Vault insights
								</h2>
								<span className="text-[var(--omkraft-navy-700)]">
									See invested vs earned value and how maturities are spread over
									time.
								</span>
							</div>

							<ChevronDown
								className={`size-6 transition-transform duration-200 text-background ${
									open ? 'rotate-180' : ''
								}`}
							/>
						</button>
					</CollapsibleTrigger>

					<CollapsibleContent className="mt-2 border-t border-muted-foreground pt-4">
						{!vaultUnlocked ? (
							<LockedVaultState onUnlock={onUnlock} btnClassName="bg-background" />
						) : loading ? (
							<OmkraftAlert
								error="Vault insights will appear after your records finish loading."
								severity="info"
								fallbackTitle="Loading insights"
							/>
						) : !records.length ? (
							<OmkraftAlert
								error="Add at least one investment to see charts and maturity trends."
								severity="info"
								fallbackTitle="No insights yet"
							/>
						) : (
							<div className="grid gap-6 lg:grid-cols-2 min-w-0">
								<VaultCompositionChart data={donutData} />
								<VaultMaturityTrendChart data={maturityTrendData} />
							</div>
						)}
					</CollapsibleContent>
				</Collapsible>
			</div>
		</section>
	);
}

function VaultCompositionChart({
	data,
}: {
	data: { key: VaultCompositionKey; label?: string; value: number; fill?: string }[];
}) {
	return (
		<Card className="border-background min-w-0 bg-foreground">
			<CardHeader>
				<CardTitle>
					<h4 className="text-xl font-semibold text-background">Value mix</h4>
				</CardTitle>
				<CardDescription className="text-[var(--omkraft-navy-700)]">
					Compare current principal against projected interest earned.
				</CardDescription>
			</CardHeader>
			<CardContent className="p-4 sm:p-6">
				<ChartContainer config={chartConfig} className="w-full min-w-0 h-[320px]">
					<PieChart>
						<Pie
							data={data}
							dataKey="value"
							nameKey="key"
							innerRadius="55%"
							outerRadius="80%"
							paddingAngle={4}
						>
							{data.map((entry) => (
								<Cell key={entry.key} fill={entry.fill} />
							))}
						</Pie>
						<ChartTooltip
							content={
								<ChartTooltipContent
									formatter={(value, name) => (
										<div className="flex w-full items-center justify-between gap-4">
											<span className="text-muted-foreground">
												{getChartLabel(name)}
											</span>
											<span className="inline-flex items-center gap-1 font-medium text-foreground">
												<IndianRupee size={14} strokeWidth={2.5} />
												{formatCurrencyNumber(Number(value))}
											</span>
										</div>
									)}
								/>
							}
						/>
						<ChartLegend />
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function VaultMaturityTrendChart({
	data,
}: {
	data: { month: string; maturityValue: number; invested: number }[];
}) {
	return (
		<Card className="border-background min-w-0 bg-foreground">
			<CardHeader>
				<CardTitle>
					<h4 className="text-xl font-semibold text-background">Maturity outlook</h4>
				</CardTitle>
				<CardDescription className="text-[var(--omkraft-navy-700)]">
					Track how invested value and maturity value are distributed by month.
				</CardDescription>
			</CardHeader>
			<CardContent className="p-4 sm:p-6 overflow-visible">
				<ChartContainer config={chartConfig} className="w-full min-w-0 h-[320px]">
					<LineChart data={data}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="month" />
						<YAxis />
						<ChartTooltip
							cursor={{
								stroke: 'var(--omkraft-primary)',
								strokeWidth: 2,
							}}
							content={
								<ChartTooltipContent
									formatter={(value, name) => (
										<div className="flex w-full items-center justify-between gap-4">
											<span className="text-muted-foreground">
												{getChartLabel(name)}
											</span>
											<span className="inline-flex items-center gap-1 font-medium text-foreground">
												<IndianRupee size={14} strokeWidth={2.5} />
												{formatCurrencyNumber(Number(value))}
											</span>
										</div>
									)}
								/>
							}
						/>
						<Legend formatter={(value) => getChartLabel(String(value))} />
						<Line
							type="monotone"
							dataKey="invested"
							stroke="var(--color-invested)"
							strokeWidth={3}
							dot={{
								r: 4,
								fill: 'var(--color-invested)',
								stroke: 'var(--color-background)',
								strokeWidth: 2,
							}}
							activeDot={{
								r: 6,
								fill: 'var(--color-invested)',
								stroke: 'var(--color-background)',
								strokeWidth: 2,
							}}
						/>
						<Line
							type="monotone"
							dataKey="maturityValue"
							stroke="var(--color-maturityValue)"
							strokeWidth={3}
							dot={{
								r: 4,
								fill: 'var(--color-maturityValue)',
								stroke: 'var(--color-background)',
								strokeWidth: 2,
							}}
							activeDot={{
								r: 6,
								fill: 'var(--color-maturityValue)',
								stroke: 'var(--color-background)',
								strokeWidth: 2,
							}}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function buildMaturityTrendData(records: InvestmentRecord[]) {
	const grouped = new Map<
		string,
		{ month: string; date: Date; invested: number; maturityValue: number }
	>();

	for (const record of records) {
		const date = parseFormDate(record.maturityDate);
		if (!date || Number.isNaN(date.getTime())) {
			continue;
		}

		const bucketDate = new Date(date.getFullYear(), date.getMonth(), 1);
		const key = `${bucketDate.getFullYear()}-${String(bucketDate.getMonth() + 1).padStart(2, '0')}`;
		const existing = grouped.get(key) ?? {
			month: bucketDate.toLocaleDateString('en-IN', {
				month: 'short',
				year: '2-digit',
			}),
			date: bucketDate,
			invested: 0,
			maturityValue: 0,
		};

		existing.invested += record.amountInvested;
		existing.maturityValue += record.maturityAmount;
		grouped.set(key, existing);
	}

	return Array.from(grouped.values())
		.sort((left, right) => left.date.getTime() - right.date.getTime())
		.map(({ month, invested, maturityValue }) => ({
			month,
			invested,
			maturityValue,
		}));
}

function getChartLabel(name: string) {
	if (name in chartConfig) {
		return chartConfig[name as keyof typeof chartConfig].label ?? name;
	}

	return name;
}
