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
import ConfirmPaymentPopover from '@/components/subscription/ConfirmPaymentPopover';
import { getSubscriptions, type Subscription } from '@/api/subscription';
import { ChevronDown, IndianRupee } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { resolveLogo } from '@/utils/subscriptionBrand';

import { getDashboardAnalytics, type DashboardAnalytics } from '@/api/analytics';

import CategoryDonutChart from '@/components/analytics/CategoryDonutChart';
import MonthlyTrendChart from '@/components/analytics/MonthlyTrendChart';
import AnalyticsKpis from '@/components/analytics/AnalyticsKpis';
import UpcomingRenewals from '@/components/analytics/UpcomingRenewals';
import ErrorAlert from '@/components/ui/error-alert';

export default function Subscription() {
	const [subs, setSubs] = useState<Subscription[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [subsError, setSubsError] = useState<unknown | null>(null);
	const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
	const [analyticsLoading, setAnalyticsLoading] = useState(false);
	const [analyticsError, setAnalyticsError] = useState<unknown | null>(null);
	const [analyticsOpen, setAnalyticsOpen] = useState(window.innerWidth >= 1024);
	const [inactiveOpen, setInactiveOpen] = useState(window.innerWidth >= 1024);
	const { refreshNotifications } = useNotifications();
	const activeSubs = (subs ?? []).filter((sub) => sub.status !== 'INACTIVE');
	const inactiveSubs = (subs ?? []).filter((sub) => sub.status === 'INACTIVE');
	const hasSubscriptions = activeSubs.length + inactiveSubs.length > 0;

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
			error = err instanceof Error ? err : 'Failed to get subscriptions';
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
			setAnalyticsError(err instanceof Error ? err : 'Failed to get analytics');
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

			{hasSubscriptions && analytics && !analyticsLoading && !analyticsError && (
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
										hover:bg-[var(--omkraft-navy-600)]
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
			{hasSubscriptions && analyticsError && (
				<section className="flex items-center py-6 bg-accent text-accent-foreground">
					<div className="app-container grid gap-6 items-center">
						<h2 className="text-3xl font-semibold">Summary</h2>
						<ErrorAlert error={analyticsError} fallbackTitle="Could not load summary" />
					</div>
				</section>
			)}
			<section className="flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					<h2 className="text-3xl font-semibold">Active Subscriptions</h2>
					{/* List */}
					<div className="grid gap-6">
						{loading && (
							<p className="text-sm text-background">
								<Spinner className="inline size-6" /> Loading subscriptions...
							</p>
						)}

						<ErrorAlert
							error={subsError}
							fallbackTitle="Could not load subscriptions"
						/>

						{activeSubs.length ? (
							activeSubs.map((sub) => {
								const logo = resolveLogo(sub.category, sub.provider);

								return (
									<Card
										key={sub._id}
										className="bg-foreground border-background text-background transition-all hover:shadow-xl hover:-translate-y-1 duration-300"
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
													<p className="flex items-center gap-1">
														<IndianRupee size={16} strokeWidth={2.5} />
														{sub.amount}
													</p>
													{(sub.status === 'DUE' ||
														sub.status === 'OVERDUE') && (
														<ConfirmPaymentPopover
															subscription={sub}
															onSuccess={async () => {
																await fetchSubscriptions();
																await fetchAnalytics();
																await refreshNotifications();
															}}
														/>
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
			{inactiveSubs.length > 0 && (
				<section className="flex items-center py-6 bg-[var(--omkraft-navy-300)] text-background">
					<div className="app-container grid gap-6 items-center">
						<Collapsible
							open={inactiveOpen}
							onOpenChange={setInactiveOpen}
							className="w-full text-background"
						>
							<CollapsibleTrigger asChild>
								<button
									className="
											w-full
											flex
											items-center
											justify-between
											rounded-xl
											gap-2
											text-left
											transition-colors
											hover:text-foreground
										"
								>
									<div className="flex flex-col gap-2">
										<h2 className="text-3xl font-semibold">
											Inactive Subscriptions
										</h2>
										<span>
											These subscriptions are no longer active, but payment
											history is retained.
										</span>
									</div>

									<ChevronDown
										className={`
												size-6
												transition-transform
												duration-200
												${inactiveOpen ? 'rotate-180' : ''}
											`}
									/>
								</button>
							</CollapsibleTrigger>

							<CollapsibleContent className="mt-2 border-t border-accent-foreground pt-4">
								<div className="grid gap-6">
									{inactiveSubs.map((sub) => {
										const logo = resolveLogo(sub.category, sub.provider);

										return (
											<Card
												key={sub._id}
												className="bg-foreground border-background text-background transition-all hover:shadow-xl hover:-translate-y-1 duration-300"
											>
												<CardHeader>
													<div className="flex justify-between items-start gap-4">
														<div className="flex items-center gap-4">
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

															<div className="flex flex-col gap-1">
																<CardTitle>
																	<h3>
																		{sub.name.toUpperCase()}
																	</h3>
																</CardTitle>

																<CardDescription className="text-primary">
																	Last cycle date{' '}
																	{formatDate(
																		sub.nextBillingDate
																	)}
																</CardDescription>
															</div>
														</div>

														<Badge
															className={getBadgeVariant(sub.status)}
														>
															{sub.status}
														</Badge>
													</div>
												</CardHeader>

												<CardFooter>
													<div className="font-semibold flex flex-col gap-2">
														<p className="flex items-center gap-1">
															<IndianRupee
																size={16}
																strokeWidth={2.5}
															/>
															{sub.amount}
														</p>
														{sub.inactiveReason && (
															<p className="text-xs text-muted-foreground">
																Reason: {sub.inactiveReason}
															</p>
														)}
													</div>
												</CardFooter>
											</Card>
										);
									})}
								</div>
							</CollapsibleContent>
						</Collapsible>
					</div>
				</section>
			)}
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

		case 'INACTIVE':
			return 'bg-gray-600 text-foreground';

		default:
			return 'bg-gray-500';
	}
}
