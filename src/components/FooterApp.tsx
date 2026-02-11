import { useAuth } from '@/auth/AuthContext';

export function FooterApp() {
	const { user } = useAuth();
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-border bg-background text-foreground">
			<div className="app-container py-6 grid gap-8 lg:grid-cols-3">
				
				{/* Brand / About */}
				<div className="space-y-3">
					<h4 className="text-muted-foreground font-semibold">
						Omkraft
					</h4>
					<p className="text-sm text-muted-foreground">
						A growing collection of thoughtfully crafted tools
						designed to simplify everyday life. Built with care,
						experimentation, and community feedback.
					</p>
				</div>

				{/* Contact */}
				<div className="space-y-3">
					<h4 className="text-muted-foreground font-semibold">
						Contact Us
					</h4>
					<p className="text-sm text-muted-foreground">
						Have feedback, suggestions, or found a bug?
					</p>
					<span className="text-sm text-muted-foreground">
						Send an email to {' '}
						<a
							href="mailto:omkraft@outlook.com"
							className="text-accent text-sm hover:underline"
						>
							omkraft@outlook.com
						</a>
					</span>
				</div>

				{/* User Info */}
				<div className="space-y-3">
					<h4 className="text-muted-foreground font-semibold">
						Account
					</h4>
					<p className="text-sm text-muted-foreground">
						Logged in as:
					</p>
					<p className="text-sm text-foreground font-semibold">
						{user?.firstName} {user?.lastName}
					</p>
					<span className="text-xs text-muted-foreground">
						{user?.email}
					</span>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-border">
				<div className="app-container py-4 text-xs text-muted-foreground flex flex-col sm:flex-row sm:justify-between gap-2">
					<p>&copy; {year} Omkraft Inc.</p>
					<p>
						Demo project — built for learning, feedback, and future possibilities.
					</p>
				</div>
			</div>
		</footer>
	);
}
