import { useEffect, useState } from 'react';
import { apiRequest } from '@/api/client';

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

interface Subscription {
	_id: string;
	name: string;
	amount: number;
	currency: string;
	status: 'active' | 'upcoming' | 'expired';
	nextBillingDate: string;
	cycleDays: number;
	category: string;
}

export default function Subscription() {
	const [subs, setSubs] = useState<Subscription[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		load();
	}, []);

	async function load() {
		try {
			const data = await apiRequest<Subscription[]>('/api/subscription');
			setSubs(data);
		} finally {
			setLoading(false);
		}
	}

	const totalMonthly = subs.reduce((sum, s) => {
		if (s.status !== 'active') return sum;
		return sum + s.amount;
	}, 0);

	const nextRenewal = subs
		.filter(s => s.status === 'active')
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
					</header>
				</div>
			</section>
			<section className="flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					{/* Summary cards */}
					<div className="grid md:grid-cols-2 gap-6">
						<Card>
							<CardHeader>
								<CardTitle>Total Monthly Spend</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-semibold text-primary">
							₹{totalMonthly}
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Next Renewal</CardTitle>
							</CardHeader>
							<CardContent>
								{nextRenewal ? (
									<div>
										<div className="font-semibold">
											{nextRenewal.name}
										</div>
										<div className="opacity-70 text-sm">
									₹{nextRenewal.amount}
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

					{/* List */}

					<div className="grid gap-4">

						{loading && (
							<div className="opacity-70">Loading subscriptions...</div>
						)}

						{subs.map(sub => (
							<Card key={sub._id}
								className="hover:scale-[1.01] transition">
								<CardHeader>
									<div className="flex justify-between items-center">
										<div>
											<CardTitle>
												{sub.name}
											</CardTitle>
											<CardDescription>
										Renews {formatDate(sub.nextBillingDate)}
											</CardDescription>
										</div>
										<Badge variant={getBadgeVariant(sub.status)}>
											{sub.status}
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className="flex justify-between">
										<div>
									₹{sub.amount}
										</div>
										<div className="opacity-60">
											{sub.cycleDays} days
										</div>
									</div>
								</CardContent>
							</Card>
						))}
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

	case 'active':
		return 'default';

	case 'upcoming':
		return 'secondary';

	case 'expired':
		return 'destructive';

	default:
		return 'outline';
	}
}
