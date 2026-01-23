import { useAuth } from '../auth/AuthContext';
import { Button } from '@/components/ui/button';

import './Header.scss';

export function Header() {
	const { user, isAuthenticated, logout } = useAuth();
	const logo =
		'https://raw.githubusercontent.com/Omkraft/.github/main/brand/logo-secondary.svg';

	return (
		<header className="header">
			<div className="app-container header__inner">
				<img src={logo} alt="Omkraft Inc." className="header__logo" />

				<div className="header__right">
					{isAuthenticated ? (
						<>
							<span className="header__user">{user?.email}</span>
							<Button variant="outline" size="sm" onClick={logout}>
								Logout
							</Button>
						</>
					) : (
						<Button size="sm">Login</Button>
					)}
				</div>
			</div>
		</header>
	);
}
