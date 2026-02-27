import { fetchLatestVersion } from '@/lib/version';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function FooterPublic() {
	const [version, setVersion] = useState<string | null>(null);
	useEffect(() => {
		fetchLatestVersion().then((v) => {
			if (v) setVersion(v);
		});
	}, []);
	const year = new Date().getFullYear();
	const logo = 'https://raw.githubusercontent.com/Omkraft/.github/main/brand/logo-small.svg';

	return (
		<footer className="border-t border-border bg-background text-foreground">
			<div className="app-container py-4 flex flex-col gap-3 lg:flex-row items-center justify-around">
				{/* Left */}
				<img src={logo} alt="Omkraft Inc." className="footer__logo" />
				<p className="text-sm text-muted-foreground">
					&copy; {year} <span className="font-bold">Omkraft</span> Inc.{' '}
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
				{version && <p className="text-xs text-muted-foreground">{version}</p>}
			</div>
		</footer>
	);
}
