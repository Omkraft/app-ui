import { useAuth } from '@/context/auth/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import './Header.scss';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/NotificationBell';
import { InstallButton } from '@/components/pwa/InstallButton';

export function Header() {
	const location = useLocation();
	const { user, isAuthenticated, logout } = useAuth();
	const pathname = location.pathname;
	const logo = 'https://raw.githubusercontent.com/Omkraft/.github/main/brand/logo-secondary.svg';
	const navigate = useNavigate();
	function logoutUser() {
		logout();
		navigate('/welcome', { replace: true });
	}

	return (
		<header className="header bg-background text-foreground border-b border-border">
			<div className="app-container py-2 flex justify-between">
				<a href="https://omkraft.vercel.app" aria-label="Open Omkraft website">
					<img src={logo} alt="Omkraft Inc." className="header__logo" />
				</a>

				<div className="flex items-center gap-3">
					<InstallButton />
					{!isAuthenticated && pathname === '/login' && (
						<Link to="/register" className="btn-primary">
							Register
						</Link>
					)}

					{!isAuthenticated && pathname === '/register' && (
						<Link to="/login" className="btn-primary">
							Login
						</Link>
					)}

					{!isAuthenticated && pathname === '/forgot-password' && (
						<Link to="/login" className="btn-primary">
							Login
						</Link>
					)}

					{isAuthenticated && (
						<div className="flex gap-4 items-center">
							<span className="hidden md:inline text-sm text-muted-foreground">
								{user?.email}
							</span>
							<NotificationBell />
							<Button className="w-full" onClick={logoutUser}>
								Logout
							</Button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
