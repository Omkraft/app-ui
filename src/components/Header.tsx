import { useAuth } from '@/auth/AuthContext';
import { Link, useLocation } from 'react-router-dom';

import './Header.scss';
import { Button } from '@/components/ui/button';

export function Header() {
	const location = useLocation();
	const { user, isAuthenticated, logout } = useAuth();
	const pathname = location.pathname;
	const logo =
		'https://raw.githubusercontent.com/Omkraft/.github/main/brand/logo-primary.svg';

	return (
		<header className="header">
			<div className="app-container header__inner">
				<img src={logo} alt="Omkraft Inc." className="header__logo" />

				<div className="flex items-center gap-3">
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
						<>
							<span className="text-sm text-muted-foreground">
								{user?.email}
							</span>
							<Button
								className="w-full"
								onClick={logout}
							>
								Logout
							</Button>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
