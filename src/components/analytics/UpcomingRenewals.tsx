import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dot, IndianRupee } from 'lucide-react';
import React from 'react';

type Props = {
	data: {
		name: string;
		amount: number;
		nextBillingDate: string;
		status: 'ACTIVE' | 'DUE' | 'OVERDUE';
	}[];
};

function isDueToday(dateLike: string) {
	const target = new Date(dateLike);
	const now = new Date();

	return (
		target.getFullYear() === now.getFullYear() &&
		target.getMonth() === now.getMonth() &&
		target.getDate() === now.getDate()
	);
}

function getRenewalBadge(status: Props['data'][number]['status'], nextBillingDate: string) {
	if (status === 'OVERDUE') {
		return {
			label: 'Overdue',
			className:
				'border-[var(--destructive)] bg-[var(--omkraft-red-100)] text-[var(--destructive)]',
		};
	}

	if (status === 'DUE' && isDueToday(nextBillingDate)) {
		return {
			label: 'Due today',
			className:
				'border-[var(--warning-border)] bg-[var(--warning-bg)] text-[var(--warning-foreground)]',
		};
	}

	if (status === 'DUE') {
		return {
			label: 'Due',
			className:
				'border-[var(--warning-border)] bg-[var(--warning-bg)] text-[var(--warning-foreground)]',
		};
	}

	return null;
}

export default function UpcomingRenewals({ data }: Props) {
	return (
		<Card className="border-foreground">
			<CardHeader>
				<CardTitle>
					<h3 className="text-2xl font-semibold flex flex-col lg:flex-row gap-2 items-start lg:items-center">
						Upcoming Renewals<p className="text-xl">(Next 7 Days)</p>
					</h3>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{data && data.length > 0 ? (
					<ul className="space-y-3">
						{data.map((item, index) => (
							<React.Fragment key={`${item.name}-${item.nextBillingDate}`}>
								<li className="flex justify-between flex-col gap-3 sm:flex-row sm:items-center">
									<div className="flex flex-wrap items-center gap-2">
										<span className="text-foreground">{item.name}</span>
										{getRenewalBadge(item.status, item.nextBillingDate) ? (
											<Badge
												className={
													getRenewalBadge(
														item.status,
														item.nextBillingDate
													)!.className
												}
											>
												{
													getRenewalBadge(
														item.status,
														item.nextBillingDate
													)!.label
												}
											</Badge>
										) : null}
									</div>
									<span className="text-muted-foreground flex items-center">
										<IndianRupee size={14} strokeWidth={2.5} />
										{item.amount} <Dot size={26} />
										{new Date(item.nextBillingDate).toLocaleDateString()}
									</span>
								</li>
								{index !== data.length - 1 && <Separator />}
							</React.Fragment>
						))}
					</ul>
				) : (
					<div className="text-muted-foreground">No upcoming renewals</div>
				)}
			</CardContent>
		</Card>
	);
}
