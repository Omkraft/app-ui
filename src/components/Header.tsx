import { useAuth } from '../auth/AuthContext';

import './Header.scss';

export function Header() {
	const { user, isAuthenticated, logout } = useAuth();
	const logo = 'https://raw.githubusercontent.com/Omkraft/.github/main/brand/logo-secondary.svg';

	return (
		<header className="header">
			<div className="header__left">
				<img src={logo} alt="Omkraft Inc." />
			</div>

			<div className="header__right">
				{isAuthenticated ? (
					<>
						<span className="header__user">{user?.email}</span>
						<button onClick={logout} className="header__logout">
							Logout
						</button>
					</>
				) : (
					<a href="/login" className="header__login">
						Login
					</a>
				)}
			</div>
		</header>
	);
}
