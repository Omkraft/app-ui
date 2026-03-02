import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { AlertCircleIcon, Trash } from 'lucide-react';
import { useState } from 'react';
import { deleteSubscription } from '@/api/subscription';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type RemovalMode = 'mistake' | 'inactive';

export default function DeleteSubscriptionDialog({
	id,
	onSuccess,
}: {
	id: string;
	onSuccess: () => void;
}) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [mode, setMode] = useState<RemovalMode>('inactive');
	const [error, setError] = useState<string | null>(null);

	async function handleDelete() {
		setError(null);

		const reason =
			mode === 'mistake'
				? 'Added by mistake'
				: 'No longer subscribed / actively using this service';

		try {
			setLoading(true);

			await deleteSubscription(id, { mode, reason });

			setOpen(false);
			onSuccess();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to remove subscription');
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive" size="sm" className="flex items-center gap-1">
					<Trash size={16} />
					<span className="hidden lg:block">Remove</span>
				</Button>
			</DialogTrigger>

			<DialogContent className="text-foreground">
				<DialogHeader>
					<DialogTitle>Remove Subscription</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<p className="text-sm text-muted-foreground">
						Why are you removing this subscription?
					</p>

					<RadioGroup
						value={mode}
						onValueChange={(value: string) => setMode(value as RemovalMode)}
						className="grid gap-3"
					>
						<div
							className={`flex items-start gap-3 rounded-md border p-3 ${
								mode === 'mistake' ? 'border-primary bg-muted/50' : 'border-border'
							}`}
						>
							<RadioGroupItem
								value="mistake"
								id={`remove-${id}-mistake`}
								className="mt-1 border-foreground"
							/>
							<label htmlFor={`remove-${id}-mistake`} className="cursor-pointer">
								<p className="font-medium">Added by mistake</p>
								<p className="text-xs text-muted-foreground">
									This will permanently remove the subscription and all its
									payment history.
								</p>
							</label>
						</div>

						<div
							className={`flex items-start gap-3 rounded-md border p-3 ${
								mode === 'inactive' ? 'border-primary bg-muted/50' : 'border-border'
							}`}
						>
							<RadioGroupItem
								value="inactive"
								id={`remove-${id}-inactive`}
								className="mt-1 border-foreground"
							/>
							<label htmlFor={`remove-${id}-inactive`} className="cursor-pointer">
								<p className="font-medium">No longer active</p>
								<p className="text-xs text-muted-foreground">
									This will move the subscription to Inactive while retaining
									payment history.
								</p>
							</label>
						</div>
					</RadioGroup>

					{error && (
						<Alert variant="destructive" className="flex flex-col gap-2">
							<AlertTitle className="flex gap-2 items-center">
								<AlertCircleIcon />
								Error occured
							</AlertTitle>
							<AlertDescription className="text-sm">{error}</AlertDescription>
						</Alert>
					)}

					<div className="flex gap-4">
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>

						{loading ? (
							<div className="flex gap-2">
								<Button
									variant="destructive"
									className="flex items-center gap-1"
									disabled
								>
									<Spinner data-icon="inline-start" /> Removing...
								</Button>
							</div>
						) : (
							<Button variant="destructive" onClick={handleDelete}>
								Remove
							</Button>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
