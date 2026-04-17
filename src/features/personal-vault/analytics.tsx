import { useMemo } from 'react';
import { ChartNoAxesCombined, ChevronDown, IndianRupee } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, XAxis, YAxis } from 'recharts';
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
	fd: {
		label: 'FD',
		color: 'var(--omkraft-blue-700)',
	},
	rd: {
		label: 'RD',
		color: 'var(--omkraft-red-500)',
	},
} satisfies ChartConfig;

const OMKRAFT_COLORS = [
	'var(--omkraft-blue-500)',
	'var(--omkraft-mint-500)',
	'var(--omkraft-amber-500)',
	'var(--omkraft-indigo-500)',
	'var(--omkraft-orange-500)',
	'var(--omkraft-red-500)',
	'var(--omkraft-blue-400)',
	'var(--omkraft-mint-400)',
	'var(--omkraft-yellow-500)',
	'var(--omkraft-indigo-400)',
	'var(--omkraft-blue-600)',
	'var(--omkraft-mint-600)',
];

const getColor = (index: number) => {
	return OMKRAFT_COLORS[index % OMKRAFT_COLORS.length];
};

type VaultCompositionKey = string;

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

	const instDonutData = useMemo(() => {
		const map: Record<string, number> = {};

		records.forEach((record) => {
			const key = record.institutionName;

			if (!map[key]) {
				map[key] = 0;
			}

			map[key] += record.amountInvested || 0;
		});

		return Object.entries(map)
			.map(([key, value], index) => ({
				key,
				label: key,
				value,
				fill: getColor(index), // stable color per institution
			}))
			.sort((a, b) => b.value - a.value);
	}, [records]);

	const maturityTrendData = useMemo(() => buildMaturityTrendData(records), [records]);
	const typeBreakdownData = useMemo(() => buildInvestmentTypeData(records), [records]);
	const firstHolderData = useMemo(() => buildFirstHolderData(records), [records]);
	const visibleCharts = useMemo(
		() => ({
			valueMix: donutData.filter((item) => item.value > 0).length >= 2,
			institutionSpread: instDonutData.length >= 2,
			fdRdSplit: typeBreakdownData.length >= 2,
			firstHolderSplit: firstHolderData.length >= 2,
			maturitySchedule: maturityTrendData.length >= 2,
		}),
		[donutData, firstHolderData, instDonutData, maturityTrendData, typeBreakdownData]
	);
	const hasAnyVisibleChart = Object.values(visibleCharts).some(Boolean);

	return (
		<section className="py-6 bg-primary">
			<div className="app-container grid gap-6 items-center">
				<Collapsible
					open={open}
					onOpenChange={onOpenChange}
					className="w-full text-foreground"
				>
					<CollapsibleTrigger asChild>
						<button className="w-full flex items-center justify-between rounded-xl border border-background bg-foreground p-4 lg:p-6 gap-2 text-left transition-colors hover:bg-[var(--omkraft-blue-50)]">
							<div className="flex flex-col gap-2">
								<h2 className="flex gap-2 text-2xl font-semibold text-background">
									<ChartNoAxesCombined className="size-8 text-primary" /> Vault
									insights
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
						) : !hasAnyVisibleChart ? (
							<OmkraftAlert
								error="More variety in your records will unlock richer vault insights here. Add another holder, institution, type, or maturity month to see charts."
								severity="info"
								fallbackTitle="Not enough data for charts yet"
							/>
						) : (
							<div className="grid gap-6">
								<div className="grid gap-6 lg:grid-cols-2 min-w-0">
									{visibleCharts.valueMix ? (
										<VaultCompositionChart
											data={donutData}
											title="Value mix"
											description="Compare current principal against projected interest earned."
											isDonut={true}
										/>
									) : null}

									{visibleCharts.institutionSpread ? (
										<VaultCompositionChart
											data={instDonutData}
											title="Institution spread"
											description="See how your total investments are distributed across institutions."
											isDonut={false}
										/>
									) : null}
									{visibleCharts.fdRdSplit ? (
										<VaultCompositionChart
											data={typeBreakdownData}
											title="FD and RD split"
											description="Compare the total invested amount across fixed and recurring deposits."
											isDonut={true}
											legendLabelTransform="uppercase"
										/>
									) : null}
									{visibleCharts.firstHolderSplit ? (
										<VaultCompositionChart
											data={firstHolderData}
											title="First holder split"
											description="See how invested amounts are distributed across first holders. Names are grouped in uppercase to avoid duplicates from casing."
											isDonut={false}
										/>
									) : null}
								</div>
								{visibleCharts.maturitySchedule ? (
									<div className="min-w-0">
										<VaultMaturityScheduleChart data={maturityTrendData} />
									</div>
								) : null}
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
	title,
	description,
	isDonut = true,
	legendLabelTransform = 'none',
}: {
	data: { key: VaultCompositionKey; label?: string; value: number; fill?: string }[];
	title?: string;
	description?: string;
	isDonut?: boolean;
	legendLabelTransform?: 'none' | 'uppercase';
}) {
	const localChartConfig = useMemo(
		() =>
			data.reduce((config, item) => {
				config[item.key] = {
					label: item.label ?? item.key,
					color: item.fill ?? getColor(0),
				};
				return config;
			}, {} as ChartConfig),
		[data]
	);

	return (
		<Card className="border-background min-w-0 bg-foreground">
			<CardHeader className="p-4 lg:p-6">
				<CardTitle>
					<h4 className="text-xl font-semibold text-background">{title}</h4>
				</CardTitle>
				<CardDescription className="text-[var(--omkraft-navy-700)]">
					{description}
				</CardDescription>
			</CardHeader>
			<CardContent className="p-4 lg:p-6">
				<ChartContainer config={localChartConfig} className="w-full min-w-0 h-[320px]">
					<PieChart>
						<Pie
							data={data}
							dataKey="value"
							nameKey="key"
							fill="fill"
							innerRadius={isDonut ? 70 : 0}
							paddingAngle={4}
						/>
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
						<ChartLegend
							formatter={(value) => {
								const label = String(
									getChartLabel(String(value), localChartConfig)
								);
								return legendLabelTransform === 'uppercase'
									? label.toUpperCase()
									: label;
							}}
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

function VaultMaturityScheduleChart({
	data,
}: {
	data: { month: string; maturityValue: number; invested: number }[];
}) {
	return (
		<Card className="border-background min-w-0 bg-foreground">
			<CardHeader className="p-4 lg:p-6">
				<CardTitle>
					<h4 className="text-xl font-semibold text-background">Maturity schedule</h4>
				</CardTitle>
				<CardDescription className="text-[var(--omkraft-navy-700)]">
					For each maturity month, compare the total invested amount and the total
					maturity value of deposits closing in that month.
				</CardDescription>
			</CardHeader>
			<CardContent className="p-4 lg:p-6 overflow-visible">
				<ChartContainer config={chartConfig} className="w-full min-w-0 h-[320px]">
					<BarChart data={data} barGap={10}>
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
						<Bar
							dataKey="invested"
							stroke="var(--color-invested)"
							fill="var(--color-invested)"
							radius={[6, 6, 0, 0]}
						/>
						<Bar
							dataKey="maturityValue"
							stroke="var(--color-maturityValue)"
							fill="var(--color-maturityValue)"
							radius={[6, 6, 0, 0]}
						/>
					</BarChart>
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

function buildInvestmentTypeData(records: InvestmentRecord[]) {
	const totals = records.reduce(
		(accumulator, record) => {
			if (record.type === 'FD') {
				accumulator.fd += record.amountInvested;
			} else {
				accumulator.rd += record.amountInvested;
			}

			return accumulator;
		},
		{ fd: 0, rd: 0 }
	);

	return [
		{
			key: 'fd',
			label: 'FD',
			value: totals.fd,
			fill: chartConfig.fd.color,
		},
		{
			key: 'rd',
			label: 'RD',
			value: totals.rd,
			fill: chartConfig.rd.color,
		},
	].filter((item) => item.value > 0);
}

function buildFirstHolderData(records: InvestmentRecord[]) {
	const grouped = new Map<string, number>();

	for (const record of records) {
		const normalizedHolder = record.firstHolder.trim().toUpperCase();
		if (!normalizedHolder) {
			continue;
		}

		grouped.set(normalizedHolder, (grouped.get(normalizedHolder) ?? 0) + record.amountInvested);
	}

	return Array.from(grouped.entries())
		.sort((left, right) => right[1] - left[1])
		.map(([key, value], index) => ({
			key,
			label: key,
			value,
			fill: getColor(index),
		}));
}

function getChartLabel(name: string, config: ChartConfig = chartConfig) {
	if (name in config) {
		return config[name as keyof typeof config].label ?? name;
	}

	return name;
}
