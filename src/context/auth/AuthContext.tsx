import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { registerPush } from '@/services/push';
import { getProfile } from '@/api/user';
import { ApiError } from '@/api/client';
import { omkraftToast } from '@/lib/toast';
import { isIos } from '@/utils/isIos';
import { isStandalone } from '@/utils/isStandalone';

export type User = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	role?: 'ADMIN' | 'USER';
	id?: string;
	lastActiveAt?: string | null;
};

type AuthContextType = {
	user: User | null;
	isAuthenticated: boolean;
	login: (token: string, user: User) => void;
	updateUser: (user: User) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function promptForIosPushPermission() {
	if (!isIos() || !isStandalone() || !('Notification' in window)) {
		return;
	}

	if (Notification.permission !== 'default') {
		return;
	}

	omkraftToast.info('Enable notifications', {
		description: 'Tap Enable to allow Omkraft alerts on your iPhone Home Screen app.',
		duration: 12000,
		action: {
			label: 'Enable',
			onClick: () => {
				void registerPush({ requestPermission: true });
			},
		},
	});
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const token = localStorage.getItem('token');
		const storedUser = localStorage.getItem('auth');

		if (!token) return;

		if (storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch {
				localStorage.removeItem('auth');
			}
		}

		void (async () => {
			try {
				const profile = await getProfile();
				localStorage.setItem('auth', JSON.stringify(profile.user));
				setUser(profile.user);
				await registerPush({ requestPermission: false });
				promptForIosPushPermission();
			} catch (error) {
				const isUnauthorized =
					error instanceof ApiError
						? error.status === 401
						: error instanceof Error &&
							error.message.toLowerCase().includes('session expired');

				if (isUnauthorized) {
					localStorage.removeItem('token');
					localStorage.removeItem('auth');
					setUser(null);
				}
			}
		})();
	}, []);

	async function login(token: string, user: User) {
		localStorage.setItem('token', token);
		localStorage.setItem('auth', JSON.stringify(user));
		setUser(user);
		await registerPush({ requestPermission: false });
		promptForIosPushPermission();
	}

	function updateUser(nextUser: User) {
		localStorage.setItem('auth', JSON.stringify(nextUser));
		setUser(nextUser);
	}

	function logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('auth');
		setUser(null);
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: Boolean(user),
				login,
				updateUser,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
}
