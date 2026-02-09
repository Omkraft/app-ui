import { useAuth } from '@/auth/AuthContext';
import maintenanceIllustration from '@/assets/maintenance-illustration.svg';

export default function Dashboard() {
	const { user } = useAuth();

	return (
		<div className="app-container py-16 text-center space-y-6">
			<h1 className="text-3xl font-semibold">
				Welcome,{' '}
				<span className="text-primary">{user?.firstName
					? `${user.firstName} ${user.lastName ?? ''}`.trim()
					: 'Guest'}
				!</span>
			</h1>

			<h2 className="text-2xl font-medium text-foreground">
				Your Omkraft Workspace is Taking Shape
			</h2>

			<p className="text-muted-foreground max-w-xl mx-auto">
				We're crafting powerful tools and workflows to help you build,
				scale, and move faster. This dashboard will soon be your command
				center — stay tuned.
			</p>

			<p className="text-sm text-muted-foreground">
				New features are actively under development 🚀
			</p>
			<img
				src={maintenanceIllustration}
				alt="Coming soon"
				className="mx-auto max-w-lg opacity-90"
			/>
		</div>
	);
}
