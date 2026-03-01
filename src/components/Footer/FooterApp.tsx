import { useAuth } from '@/context/auth/AuthContext';
import { getBuildVersionLabel } from '@/lib/version';

export function FooterApp() {
	const version = getBuildVersionLabel();

	const { user } = useAuth();
	const year = new Date().getFullYear();
	const logo = 'https://raw.githubusercontent.com/Omkraft/.github/main/brand/logo-small.svg';

	return (
		<footer className="border-t border-border bg-background text-foreground">
			<div className="app-container py-4 grid gap-8 lg:grid-cols-3">
				{/* Brand / About */}
				<div className="space-y-3">
					<h4 className="text-muted-foreground font-semibold">Omkraft</h4>
					<p className="text-sm text-muted-foreground">
						A growing collection of thoughtfully crafted tools designed to simplify
						everyday life. Built with care, experimentation, and community feedback.
					</p>
					<p className="text-xs text-muted-foreground">{version}</p>
				</div>

				{/* Contact */}
				<div className="space-y-3">
					<h4 className="text-muted-foreground font-semibold">Contact Us</h4>
					<p className="text-sm text-muted-foreground">
						Have feedback, suggestions, or found a bug?
					</p>
					<span className="text-sm text-muted-foreground">
						Send an email to{' '}
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
					<h4 className="text-muted-foreground font-semibold">Account</h4>
					<p className="text-sm text-muted-foreground">Logged in as:</p>
					<p className="text-sm text-foreground font-semibold">
						{user?.firstName} {user?.lastName}
					</p>
					<span className="text-xs text-muted-foreground">{user?.email}</span>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-border">
				<div className="app-container py-4 text-xs text-muted-foreground flex flex-col lg:flex-row gap-2 items-center">
					<img src={logo} alt="Omkraft Inc." className="footer__logo" />
					<p>
						&copy; {year} <span className="font-bold">Omkraft</span> Inc.
					</p>
					<p>
						<em>Systems, Crafted.</em>
					</p>
					<p>Demo project — built for learning, feedback, and future possibilities.</p>
				</div>
			</div>
		</footer>
	);
}
