import { useAuth } from '@/auth/AuthContext';

export default function Dashboard() {
	const { user } = useAuth();

	return (
		<div className="app-container py-8">
			<h1>
				Welcome, {user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : 'Guest'}!
			</h1>
		</div>
	);
}
