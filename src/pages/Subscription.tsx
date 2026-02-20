import { useEffect, useState } from 'react';

import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import AddSubscriptionDialog from '@/components/subscription/AddSubscriptionDialog';
import { getSubscriptions, type Subscription } from '@/api/subscription';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

export default function Subscription() {
	const [subs, setSubs] = useState<Subscription[] | null>(null);
	const [loading, setLoading] = useState(false);
	const [subsError, setSubsError] = useState<string | null>(null);

	useEffect(() => {
		fetchSubscriptions();
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
			error = err instanceof Error
				? err.message
				: 'Failed to get subscriptions';
			setSubsError(error);
		} finally {
			setLoading(false);
		}
	}

	const totalMonthly = subs?.reduce((sum, s) => {
		if (s.status !== 'ACTIVE') return sum;
		return sum + s.amount;
	}, 0);

	const nextRenewal = subs
		?.filter(s => s.status === 'ACTIVE')
		.sort(
			(a, b) =>
				new Date(a.nextBillingDate).getTime() -
				new Date(b.nextBillingDate).getTime()
		)[0];

	return (
		<main className="min-h-[calc(100vh-135px)] bg-[var(--omkraft-blue-200)]">
			<section className="flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild className="text-[var(--omkraft-blue-700)] hover:text-background">
									<Link to="/dashboard">Dashboard</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="text-background" />
							<BreadcrumbItem>
								<BreadcrumbPage className="text-background">Subscription Tracker</BreadcrumbPage>
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
							Subscription {' '}<span className="text-primary">Tracker</span>
						</h1>
						<p className="text-background">
							Track all your prepaid plans and subscriptions
						</p>
						<AddSubscriptionDialog onSuccess={fetchSubscriptions} />
					</header>
				</div>
			</section>
			<section className="flex items-center py-6 bg-accent">
				<div className="app-container grid gap-6 items-center">
					<h2 className="text-3xl font-semibold">Summary</h2>
					{/* Summary cards */}
					<div className="grid lg:grid-cols-2 gap-6">
						<Card className="border-foreground">
							<CardHeader>
								<CardTitle><h3 className="text-2xl font-semibold">Total Monthly Spend</h3></CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-semibold text-accent">
							&#8377; {totalMonthly}
								</div>
							</CardContent>
						</Card>

						<Card className="border-foreground">
							<CardHeader>
								<CardTitle><h3 className="text-2xl font-semibold">Next Renewal</h3></CardTitle>
							</CardHeader>
							<CardContent>
								{nextRenewal ? (
									<div className="flex flex-col gap-2">
										<div className="text-xl font-semibold">
											{nextRenewal.name.toLocaleUpperCase()}
										</div>
										<div className="text-lg text-accent font-medium">
											&#8377; {nextRenewal.amount}
										</div>
										<div className="text-sm text-muted-foreground">
											{formatDate(nextRenewal.nextBillingDate)}
										</div>
									</div>
								) : (
									<div className="opacity-70">
										No active subscriptions
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
			<section className="flex items-center py-6 bg-[var(--omkraft-blue-300)]">
				<div className="app-container grid gap-6 items-center">
					<h2 className="text-3xl font-semibold">Current Subscriptions</h2>
					{/* List */}
					<div className="grid gap-6">
						{loading && (
							<p className="text-sm text-background"><Spinner className='inline size-6' /> Loading subscriptions...</p>
						)}

						{subsError && (
							<Alert variant="destructive" className="flex flex-col gap-2">
								<AlertTitle className="flex gap-2 items-center"><AlertCircleIcon />Error occured</AlertTitle>
								<AlertDescription className="text-sm">
									{subsError}
								</AlertDescription>
							</Alert>
						)}

						{subs && (
							subs.map(sub => (
								<Card key={sub._id}
									className="bg-foreground border-background text-background">
									<CardHeader>
										<div className="flex justify-between items-start">
											<div className="flex flex-col gap-2">
												<CardTitle>
													<h3>{sub.name.toLocaleUpperCase()}</h3>
												</CardTitle>
												<CardDescription className="text-primary">
													Renews {formatDate(sub.nextBillingDate)}
												</CardDescription>
											</div>
											<Badge className={getBadgeVariant(sub.status)}>
												{sub.status}
											</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<div className="flex justify-between">
											<div className="font-semibold">
												&#8377; {sub.amount}
											</div>
											<div className="text-background">
												{sub.cycleInDays} days
											</div>
										</div>
									</CardContent>
								</Card>
							))
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
		return 'bg-background';

	case 'DUE':
		return 'border-background text-background bg-transparent';

	case 'EXPIRED':
		return 'bg-destructive text-destructive-foreground';
	}
}
