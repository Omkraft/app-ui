import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectItem,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group';
import { StartDatePicker } from './StartDatePicker';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircleIcon, Pencil } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { isPositiveNumeric } from '@/utils/format';
import { updateSubscription } from '@/api/subscription';
import type { Subscription } from '@/api/subscription';

function subtractMonthsSafe(date: Date, months: number) {
	const d = new Date(date);
	const originalDay = d.getDate();

	d.setDate(1);
	d.setMonth(d.getMonth() - months);

	const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

	d.setDate(Math.min(originalDay, lastDay));

	return d;
}

function subtractYearsSafe(date: Date, years: number) {
	const d = new Date(date);
	const originalDay = d.getDate();

	d.setDate(1);
	d.setFullYear(d.getFullYear() - years);

	const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

	d.setDate(Math.min(originalDay, lastDay));

	return d;
}

function calculateLastChargedDate(nextBillingDate: Date, cycleInDays: number) {
	if (cycleInDays === 30) {
		return subtractMonthsSafe(nextBillingDate, 1);
	}

	if (cycleInDays === 365) {
		return subtractYearsSafe(nextBillingDate, 1);
	}

	const prev = new Date(nextBillingDate);
	prev.setDate(prev.getDate() - cycleInDays);
	return prev;
}

export default function EditSubscriptionDialog({
	subscription,
	onSuccess,
}: {
	subscription: Subscription;
	onSuccess: () => void;
}) {
	const [open, setOpen] = useState(false);

	const [name, setName] = useState(subscription.name);
	const [provider, setProvider] = useState(subscription.provider);
	const [price, setPrice] = useState(String(subscription.amount));
	const [billingCycleDays, setBillingCycleDays] = useState(String(subscription.cycleInDays));
	const [category, setCategory] = useState(subscription.category);
	const derivedStartDate = calculateLastChargedDate(
		new Date(subscription.nextBillingDate),
		subscription.cycleInDays
	);

	const [startDate, setStartDate] = useState<Date>(derivedStartDate);

	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		let error = null;

		if (
			!name.trim() ||
			!provider.trim() ||
			!price.trim() ||
			!billingCycleDays ||
			!category ||
			!startDate
		) {
			setError('All fields are required');
			return;
		}

		if (!isPositiveNumeric(Number(price))) {
			setError('Price must be positive number');
			return;
		}

		try {
			setLoading(true);

			await updateSubscription(subscription._id, {
				category,
				name,
				provider,
				amount: price,
				billingCycleDays,
				startDate,
			});
		} catch (err) {
			console.error(err);
			error = err instanceof Error ? err.message : 'Failed to add subscription';
			setError(error);
		} finally {
			setLoading(false);
			if (!error) {
				setOpen(false);
				onSuccess();
			}
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					size="sm"
					className="flex items-center gap-1 bg-transparent border border-primary text-primary"
				>
					<Pencil size={16} />
					<span className="hidden lg:block">Edit</span>
				</Button>
			</DialogTrigger>

			<DialogContent className="text-foreground">
				<DialogHeader>
					<DialogTitle>Edit Subscription</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="category">
								Category <span className="text-destructive">*</span>
							</FieldLabel>
							<Select
								value={category}
								onValueChange={(value) => setCategory(value)}
								required
							>
								<SelectTrigger id="category" className="border-border bg-muted">
									<SelectValue placeholder="Select category" />
								</SelectTrigger>

								<SelectContent className="bg-[var(--omkraft-blue-700)] text-foreground">
									<SelectItem value="OTT" className="focus:text-background">
										OTT / Streaming
									</SelectItem>
									<SelectItem value="MUSIC" className="focus:text-background">
										Music
									</SelectItem>
									<SelectItem
										value="SIM_PREPAID"
										className="focus:text-background"
									>
										Mobile (Prepaid)
									</SelectItem>
									<SelectItem
										value="SIM_POSTPAID"
										className="focus:text-background"
									>
										Mobile (Postpaid)
									</SelectItem>
									<SelectItem value="INTERNET" className="focus:text-background">
										Internet / Broadband
									</SelectItem>
									<SelectItem value="DTH" className="focus:text-background">
										DTH / TV
									</SelectItem>
									<SelectItem value="SOFTWARE" className="focus:text-background">
										Software / SaaS
									</SelectItem>
									<SelectItem value="CLOUD" className="focus:text-background">
										Cloud Storage
									</SelectItem>
									<SelectItem value="GAMING" className="focus:text-background">
										Gaming
									</SelectItem>
									<SelectItem value="OTHER" className="focus:text-background">
										Other
									</SelectItem>
								</SelectContent>
							</Select>
						</Field>
						<Field>
							<FieldLabel htmlFor="name">
								Name <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id="name"
								placeholder="Name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="provider">
								Provider <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id="provider"
								placeholder="Provider"
								value={provider}
								onChange={(e) => setProvider(e.target.value)}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="price">
								Price <span className="text-destructive">*</span>
							</FieldLabel>
							<div className="flex gap-2">
								<InputGroup className="bg-input border border-border">
									{/* Phone number input */}
									<InputGroupInput
										id="price"
										placeholder="Price"
										value={price}
										onChange={(e) => setPrice(e.target.value)}
										required
									/>
									<InputGroupAddon>&#8377;</InputGroupAddon>
								</InputGroup>
							</div>
						</Field>
						<Field>
							<FieldLabel htmlFor="billingCycle">Billing cycle</FieldLabel>
							<Select
								value={billingCycleDays}
								onValueChange={(value) => setBillingCycleDays(value)}
							>
								<SelectTrigger id="billingCycle" className="border-border bg-muted">
									<SelectValue />
								</SelectTrigger>

								<SelectContent className="bg-[var(--omkraft-blue-700)] text-foreground">
									<SelectItem value="28" className="focus:text-background">
										28 calendar days (Mobile)
									</SelectItem>
									<SelectItem value="30" className="focus:text-background">
										30 calendar days
									</SelectItem>
									<SelectItem value="31" className="focus:text-background">
										Monthly
									</SelectItem>
									<SelectItem value="84" className="focus:text-background">
										84 calendar days
									</SelectItem>
									<SelectItem value="90" className="focus:text-background">
										Quarterly
									</SelectItem>
									<SelectItem value="365" className="focus:text-background">
										Yearly
									</SelectItem>
								</SelectContent>
							</Select>
						</Field>
						<Field>
							<FieldLabel htmlFor="startDate">
								Start date <span className="text-destructive">*</span>
							</FieldLabel>
							<StartDatePicker value={startDate} onChange={setStartDate} />
						</Field>
					</FieldGroup>

					{error && (
						<Alert variant="destructive" className="flex flex-col gap-2">
							<AlertTitle className="flex gap-2 items-center">
								<AlertCircleIcon />
								Error occured
							</AlertTitle>
							<AlertDescription className="text-sm">{error}</AlertDescription>
						</Alert>
					)}

					{loading ? (
						<div className="flex gap-2">
							<Button className="w-full btn-primary flex gap-1" disabled>
								<Spinner data-icon="inline-start" />
								Please wait...
							</Button>
						</div>
					) : (
						<Button type="submit" className="w-full btn-primary">
							Save Subscription
						</Button>
					)}
				</form>
			</DialogContent>
		</Dialog>
	);
}
