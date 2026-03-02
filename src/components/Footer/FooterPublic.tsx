import { getBuildVersionLabel } from '@/lib/version';
import { Copyright } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FooterPublic() {
	const version = getBuildVersionLabel();
	const year = new Date().getFullYear();
	const logo = 'https://raw.githubusercontent.com/Omkraft/.github/main/brand/logo-small.svg';

	return (
		<footer className="border-t border-border bg-background text-foreground">
			<div className="app-container py-4 flex flex-col gap-3 lg:flex-row items-center justify-around">
				{/* Left */}
				<a href="https://omkraft.vercel.app" aria-label="Open Omkraft website">
					<img src={logo} alt="Omkraft Inc." className="footer__logo" />
				</a>
				<p className="text-sm text-muted-foreground flex items-center gap-1">
					<Copyright size={14} strokeWidth={2.5} />
					{year} <span className="font-semibold">Omkraft</span> Inc.{' '}
					<em>Systems, Crafted.</em>
				</p>

				<p className="text-sm text-muted-foreground">All rights reserved.</p>

				{/* Center */}
				<p className="text-sm text-muted-foreground">
					A personal demo project — built for learning, feedback, and fun.
				</p>

				{/* Right */}
				<div className="flex gap-4 text-sm">
					<Link
						to="/login"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						Login
					</Link>

					<Link
						to="/register"
						className="text-muted-foreground hover:text-foreground transition-colors"
					>
						Sign up
					</Link>
				</div>
				<p className="text-xs text-muted-foreground">{version}</p>
			</div>
		</footer>
	);
}
