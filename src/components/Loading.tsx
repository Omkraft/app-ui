import { Spinner } from './ui/spinner';

export default function Loading() {
	return (
		<div className="min-h-[calc(100vh-178px)] bg-background text-foreground flex items-center">
			<div className="app-container grid gap-12 items-center py-6 justify-items-center">
				<div className="text-center space-y-4">
					{/* Spinner */}
					<div className="flex justify-center">
						<Spinner className="size-12 text-primary" />
					</div>

					{/* Heading */}
					<h1 className="text-2xl font-semibold">Just a moment…</h1>

					{/* Sub Heading */}
					<p className="text-muted-foreground">
						Please wait while we get everything ready for you.
					</p>
				</div>
			</div>
		</div>
	);
}
