import { useState } from 'react';
import { CircleCheckBig, IndianRupee } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Spinner } from '@/components/ui/spinner';
import { isPositiveNumeric } from '@/utils/format';
import { confirmSubscriptionPayment, type Subscription } from '@/api/subscription';
import ErrorAlert from '@/components/ui/error-alert';

type PaymentMode = 'total' | 'custom';

export default function ConfirmPaymentPopover({
	subscription,
	onSuccess,
}: {
	subscription: Subscription;
	onSuccess: () => Promise<void> | void;
}) {
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<PaymentMode>('total');
	const [customAmount, setCustomAmount] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<unknown | null>(null);

	async function handleSubmit() {
		setError(null);

		let amount = subscription.amount;
		if (mode === 'custom') {
			amount = Number(customAmount);
			if (!isPositiveNumeric(amount)) {
				setError('Please enter a valid amount greater than zero.');
				return;
			}
		}

		try {
			setLoading(true);
			await confirmSubscriptionPayment(subscription._id, amount);
			setOpen(false);
			setCustomAmount('');
			await onSuccess();
		} catch (err) {
			setError(err instanceof Error ? err : 'Failed to confirm payment');
		} finally {
			setLoading(false);
		}
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button className="btn-primary flex gap-2">
					<CircleCheckBig size={20} /> Mark as Paid
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 space-y-4">
				<div className="space-y-1">
					<h4 className="font-semibold">Confirm Payment</h4>
					<p className="text-xs text-muted-foreground">
						Choose how much was paid for this billing cycle.
					</p>
				</div>

				<RadioGroup
					value={mode}
					onValueChange={(value: string) => setMode(value as PaymentMode)}
				>
					<div className="flex items-start gap-3 rounded-md border p-3">
						<RadioGroupItem value="total" id={`payment-${subscription._id}-total`} />
						<label
							htmlFor={`payment-${subscription._id}-total`}
							className="cursor-pointer"
						>
							<p className="text-sm font-medium">Total amount due</p>
							<p className="text-xs text-muted-foreground">
								Use current subscription amount.
							</p>
						</label>
					</div>
					<div className="flex items-start gap-3 rounded-md border p-3">
						<RadioGroupItem value="custom" id={`payment-${subscription._id}-custom`} />
						<label
							htmlFor={`payment-${subscription._id}-custom`}
							className="cursor-pointer"
						>
							<p className="text-sm font-medium">Other amount</p>
							<p className="text-xs text-muted-foreground">
								Enter a one-time custom payment.
							</p>
						</label>
					</div>
				</RadioGroup>

				<div className="space-y-2">
					<p className="text-xs text-muted-foreground">Amount paid</p>
					<div className="relative">
						<IndianRupee
							size={14}
							strokeWidth={2.5}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
						/>
						<Input
							value={mode === 'total' ? subscription.amount.toFixed(2) : customAmount}
							onChange={(e) => setCustomAmount(e.target.value)}
							readOnly={mode === 'total'}
							placeholder="Enter amount"
							className="pl-8"
						/>
					</div>
				</div>

				<ErrorAlert error={error} fallbackTitle="Could not save payment" />

				<div className="flex justify-end gap-2">
					<Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
						Cancel
					</Button>
					{loading ? (
						<Button className="btn-primary flex gap-1" disabled>
							<Spinner data-icon="inline-start" />
							Saving...
						</Button>
					) : (
						<Button className="btn-primary" onClick={handleSubmit}>
							Submit
						</Button>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
