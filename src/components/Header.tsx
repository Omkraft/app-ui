import { useAuth } from '@/context/auth/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import './Header.scss';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/NotificationBell';
import { InstallButton } from '@/components/pwa/InstallButton';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CircleUser, LogOut, ShieldUser, User } from 'lucide-react';
import { useState } from 'react';

export function Header() {
	const location = useLocation();
	const { user, isAuthenticated, logout } = useAuth();
	const pathname = location.pathname;
	const logo = 'https://raw.githubusercontent.com/Omkraft/.github/main/brand/logo-secondary.svg';
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);
	const [logoutOpen, setLogoutOpen] = useState(false);

	function logoutUser() {
		logout();
		setLogoutOpen(false);
		setMenuOpen(false);
		navigate('/welcome', { replace: true });
	}

	return (
		<header className="header bg-background text-foreground border-b border-border">
			<div className="app-container py-2 flex justify-between">
				<a href="https://omkraft.vercel.app" aria-label="Open Omkraft website">
					<img src={logo} alt="Omkraft Inc." className="header__logo" />
				</a>

				<div className="flex items-center gap-4">
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
							<NotificationBell />

							<DropdownMenu
								open={menuOpen}
								onOpenChange={(open) => {
									setMenuOpen(open);
									if (!open) setLogoutOpen(false);
								}}
							>
								<DropdownMenuTrigger asChild className="hover:bg-muted">
									<Button variant="ghost" size="icon" aria-label="Open user menu">
										<CircleUser />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent
									align="end"
									className="min-w-64 bg-primary border-muted-foreground"
								>
									<DropdownMenuLabel className="truncate">
										{user?.email || 'Profile'}
									</DropdownMenuLabel>
									<DropdownMenuSeparator className="bg-muted-foreground" />
									{user?.role === 'ADMIN' && (
										<DropdownMenuItem
											onSelect={() => {
												setMenuOpen(false);
												navigate('/admin/dashboard');
											}}
											className="cursor-pointer"
										>
											<ShieldUser size={16} />
											Admin dashboard
										</DropdownMenuItem>
									)}
									<DropdownMenuItem
										onSelect={() => {
											setMenuOpen(false);
											navigate('/profile/edit');
										}}
										className="cursor-pointer"
									>
										<User size={16} />
										Edit profile
									</DropdownMenuItem>

									<DropdownMenuItem
										className="cursor-pointer"
										onSelect={(e) => {
											e.preventDefault();
											setMenuOpen(false);
											setLogoutOpen(true);
										}}
									>
										<LogOut size={16} />
										Logout
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>

							<Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
								<DialogContent className="text-foreground">
									<DialogHeader>
										<DialogTitle>Logout</DialogTitle>
									</DialogHeader>
									<div className="space-y-4">
										<p className="text-sm text-muted-foreground">
											Are you sure you want to logout?
										</p>
										<div className="flex justify-end gap-2">
											<Button
												variant="outline"
												onClick={() => setLogoutOpen(false)}
											>
												Cancel
											</Button>
											<Button variant="destructive" onClick={logoutUser}>
												Logout
											</Button>
										</div>
									</div>
								</DialogContent>
							</Dialog>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
