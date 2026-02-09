import { Link } from 'react-router-dom';

export function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-border">
			<div className="app-container py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				{/* Left */}
				<p className="text-sm text-muted-foreground">
					© {year} Omkraft Inc. All rights reserved.
				</p>

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
			</div>
		</footer>
	);
}
