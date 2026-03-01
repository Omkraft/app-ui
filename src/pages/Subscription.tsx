import { useEffect, useState } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { Badge } from '@/components/ui/badge';
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import AddSubscriptionDialog from '@/components/subscription/AddSubscriptionDialog';
import EditSubscriptionDialog from '@/components/subscription/EditSubscriptionDialog';
import DeleteSubscriptionDialog from '@/components/subscription/DeleteSubscriptionDialog';
import {
	confirmSubscriptionPayment,
	getSubscriptions,
	type Subscription,
} from '@/api/subscription';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon, CircleCheckBig, ChevronDown } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { resolveLogo } from '@/utils/subscriptionBrand';
import { Button } from '@/components/ui/button';

import { getDashboardAnalytics, type DashboardAnalytics } from '@/api/analytics';

import CategoryDonutChart from '@/components/analytics/CategoryDonutChart';
import MonthlyTrendChart from '@/components/analytics/MonthlyTrendChart';
import AnalyticsKpis from '@/components/analytics/AnalyticsKpis';
import UpcomingRenewals from '@/components/analytics/UpcomingRenewals';

export default function Subscription() {
	const [subs, setSubs] = useState<Subscription[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [subsError, setSubsError] = useState<string | null>(null);
	const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
	const [analyticsLoading, setAnalyticsLoading] = useState(false);
	const [analyticsError, setAnalyticsError] = useState<string | null>(null);
	const [analyticsOpen, setAnalyticsOpen] = useState(window.innerWidth >= 1024);
	const { refreshNotifications } = useNotifications();

	useEffect(() => {
		fetchSubscriptions();
		fetchAnalytics();
	}, []);

	async function fetchSubscriptions() {
		setSubs(null);
		let error = null;
		try {
			setLoading(true);
			const data = await getSubscriptions();
			setSubs(data);
		} catch (err) {
			console.error(err);
			error = err instanceof Error ? err.message : 'Failed to get subscriptions';
			setSubsError(error);
		} finally {
			setLoading(false);
		}
	}

	async function fetchAnalytics() {
		setAnalytics(null);
		try {
			setAnalyticsLoading(true);
			const data = await getDashboardAnalytics();

			setAnalytics(data);
		} catch (err) {
			setAnalyticsError(err instanceof Error ? err.message : 'Failed to get analytics');
			console.error('Analytics fetch failed:', err);
		} finally {
			setAnalyticsLoading(false);
		}
	}

	return (
		<main className="min-h-[calc(100vh-178px)] bg-[var(--omkraft-blue-200)]">
			<section className="flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink
									asChild
									className="text-[var(--omkraft-blue-700)] hover:text-background"
								>
									<Link to="/dashboard">Dashboard</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="text-background" />
							<BreadcrumbItem>
								<BreadcrumbPage className="text-background">
									Subscription Tracker
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</section>
			<section className="flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					{/* ========================= */}
					{/* Page Header */}
					{/* ========================= */}
					<header className="space-y-4">
						<h1 className="text-4xl font-semibold">
							Subscription <span className="text-primary">Tracker</span>
						</h1>
						<p className="text-background">
							Track all your prepaid plans and subscriptions
						</p>
						{!loading && !subsError && (
							<AddSubscriptionDialog
								onSuccess={() => {
									fetchSubscriptions();
									fetchAnalytics();
								}}
							/>
						)}
					</header>
				</div>
			</section>
			{/* ========================= */}
			{/* Analytics Charts */}
			{/* ========================= */}

			{analytics && !analyticsLoading && !analyticsError && (
				<section className="flex items-center py-6 bg-accent text-accent-foreground">
					<div className="app-container grid gap-6 items-center">
						<h2 className="text-3xl font-semibold">Summary</h2>

						<div className="grid lg:grid-cols-2 gap-6 min-w-0">
							{/* KPI Cards */}

							<AnalyticsKpis
								totalMonthly={analytics.totalMonthly}
								yearlyProjection={analytics.yearlyProjection}
							/>
						</div>
						<div>
							{/* Upcoming Renewals */}
							<UpcomingRenewals data={analytics.upcomingRenewals} />
						</div>
						<Collapsible
							open={analyticsOpen}
							onOpenChange={setAnalyticsOpen}
							className="w-full text-foreground"
						>
							{/* Trigger */}

							<CollapsibleTrigger asChild>
								<button
									className="
										w-full
										flex
										items-center
										justify-between
										bg-background
										border
										border-foreground
										rounded-xl
										p-6
										gap-2
										text-left
										hover:bg-muted/50
										transition-colors
									"
								>
									<div className="flex flex-col gap-6">
										<h3 className="text-2xl font-semibold">
											Spending Insights
										</h3>

										<span className="text-muted-foreground">
											See trends, projections, and category breakdown
										</span>
									</div>

									<ChevronDown
										className={`
											size-6
											transition-transform
											duration-200
											${analyticsOpen ? 'rotate-180' : ''}
										`}
									/>
								</button>
							</CollapsibleTrigger>

							{/* Content */}

							<CollapsibleContent className="mt-2 border-t border-accent-foreground pt-4">
								<div className="grid lg:grid-cols-2 gap-6 min-w-0">
									<CategoryDonutChart data={analytics.categoryBreakdown} />

									<MonthlyTrendChart data={analytics.monthlyTrend} />
								</div>
							</CollapsibleContent>
						</Collapsible>
					</div>
				</section>
			)}
			{analyticsError && (
				<section className="flex items-center py-6 bg-accent text-accent-foreground">
					<div className="app-container grid gap-6 items-center">
						<h2 className="text-3xl font-semibold">Summary</h2>
						<Alert variant="destructive" className="flex flex-col gap-2">
							<AlertTitle className="flex gap-2 items-center">
								<AlertCircleIcon />
								Error while fetching analytics
							</AlertTitle>
							<AlertDescription className="text-sm">
								{analyticsError}
							</AlertDescription>
						</Alert>
					</div>
				</section>
			)}
			<section className="flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					<h2 className="text-3xl font-semibold">Current Subscriptions</h2>
					{/* List */}
					<div className="grid gap-6">
						{loading && (
							<p className="text-sm text-background">
								<Spinner className="inline size-6" /> Loading subscriptions...
							</p>
						)}

						{subsError && (
							<Alert variant="destructive" className="flex flex-col gap-2">
								<AlertTitle className="flex gap-2 items-center">
									<AlertCircleIcon />
									Error occured
								</AlertTitle>
								<AlertDescription className="text-sm">{subsError}</AlertDescription>
							</Alert>
						)}

						{subs && subs.length ? (
							subs.map((sub) => {
								const logo = resolveLogo(sub.category, sub.provider);

								return (
									<Card
										key={sub._id}
										className="bg-foreground border-background text-background"
									>
										<CardHeader>
											<div className="flex justify-between items-start gap-4">
												{/* LEFT SIDE */}
												<div className="flex items-center gap-4">
													{/* LOGO */}
													{logo.type === 'image' ? (
														<img
															src={logo.src}
															alt={logo.alt}
															className="w-10 h-10 object-contain"
														/>
													) : (
														logo.Icon && (
															<logo.Icon className="w-8 h-8 text-primary" />
														)
													)}

													{/* NAME + DATE */}
													<div className="flex flex-col gap-1">
														<CardTitle>
															<h3>{sub.name.toUpperCase()}</h3>
														</CardTitle>

														<CardDescription className="text-primary">
															Renews on{' '}
															{formatDate(sub.nextBillingDate)}
														</CardDescription>
													</div>
												</div>

												{/* STATUS BADGE */}
												<Badge className={getBadgeVariant(sub.status)}>
													{sub.status}
												</Badge>
											</div>
										</CardHeader>

										<CardFooter>
											<div className="flex w-full justify-between items-center">
												<div className="font-semibold flex flex-col gap-2">
													&#8377; {sub.amount}
													{sub.status !== 'ACTIVE' && (
														<Button
															onClick={async () => {
																await confirmSubscriptionPayment(
																	sub._id
																);
																await fetchSubscriptions();
																await fetchAnalytics();
																await refreshNotifications();
															}}
															className="btn-primary flex gap-2"
														>
															<CircleCheckBig size={20} /> Mark as
															Paid
														</Button>
													)}
												</div>

												<div className="flex gap-2">
													<EditSubscriptionDialog
														subscription={sub}
														onSuccess={() => {
															fetchSubscriptions();
															fetchAnalytics();
														}}
													/>

													<DeleteSubscriptionDialog
														id={sub._id}
														onSuccess={() => {
															fetchSubscriptions();
															fetchAnalytics();
														}}
													/>
												</div>
											</div>
										</CardFooter>
									</Card>
								);
							})
						) : (
							<>
								{!subsError && !loading && (
									<div className="flex flex-col gap-4 text-background">
										<p className="text-lg font-semibold">
											No active subscriptions yet
										</p>
										<p>
											Click on Add Subscription to add your first subscription
											to monitor billing cycles, renewal dates, and spending —
											all in one place.
										</p>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</section>
		</main>
	);
}

function formatDate(date: string) {
	const d = new Date(date);

	return d.toLocaleDateString('en-IN', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
}

function getBadgeVariant(status: string) {
	switch (status) {
		case 'ACTIVE':
			return 'bg-[var(--omkraft-mint-700)] text-foreground';

		case 'DUE':
			return 'bg-yellow-500 text-black';

		case 'OVERDUE':
			return 'bg-destructive text-destructive-foreground';

		default:
			return 'bg-gray-500';
	}
}
