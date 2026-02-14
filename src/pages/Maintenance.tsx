import maintenanceIllustration from '@/assets/maintenance-illustration.svg';

export default function Maintenance() {
	return (
		<div className="min-h-[calc(100vh-145px)] bg-background text-foreground flex items-center">
			<div className="app-container grid gap-12 items-center py-6 justify-items-center">
				<div className="text-center space-y-4">
					<div className="flex justify-center">
						<img
							src={maintenanceIllustration}
							alt="Maintenance illustration"
							className="opacity-90"
						/>
					</div>

					{/* Heading */}
					<h1 className="text-2xl font-semibold">
						We're working on this
					</h1>

					{/* Sub Heading */}
					<p className="text-muted-foreground">
						This section is currently being improved.
						Please check back again soon.
					</p>
				</div>
			</div>
		</div>
	);
}
