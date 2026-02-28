import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dot } from 'lucide-react';
import React from 'react';

type Props = {
	data: {
		name: string;
		amount: number;
		nextBillingDate: string;
	}[];
};

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
							<React.Fragment key={index}>
								<li className="flex justify-between flex-col sm:flex-row gap-2">
									<span className="text-foreground">{item.name}</span>
									<span className="text-muted-foreground flex items-center">
										&#8377; {item.amount} <Dot size={26} />
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
