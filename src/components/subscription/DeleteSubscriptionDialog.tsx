import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { deleteSubscription } from '@/api/subscription';
import { Spinner } from '@/components/ui/spinner';

export default function DeleteSubscriptionDialog({
	id,
	onSuccess,
}: {
	id: string;
	onSuccess: () => void;
}) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	async function handleDelete() {
		try {
			setLoading(true);

			await deleteSubscription(id);

			setOpen(false);

			onSuccess();
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive" size="sm" className="flex items-center gap-1">
					<Trash size={16} />
					<span className="hidden lg:block">Delete</span>
				</Button>
			</DialogTrigger>

			<DialogContent className="text-foreground">
				<DialogHeader>
					<DialogTitle>Delete Subscription?</DialogTitle>
				</DialogHeader>

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
								<Spinner data-icon="inline-start" /> Deleting...
							</Button>
						</div>
					) : (
						<Button variant="destructive" onClick={handleDelete}>
							Delete
						</Button>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
