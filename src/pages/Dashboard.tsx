import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe } from '@/api/user';
import { useAuth } from '@/auth/AuthContext';

interface MeResponse {
	message: string;
	user: {
		userId: string;
		iat: number;
		exp: number;
	};
}

export default function Dashboard() {
	const [data, setData] = useState<MeResponse | null>(null);
	const navigate = useNavigate();
	const { logout } = useAuth();

	useEffect(() => {
		getMe().then(setData).catch(console.error);
	}, []);

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<div>
			<h1>Dashboard</h1>
			<button onClick={handleLogout}>Logout</button>
			{data && <pre>{JSON.stringify(data, null, 2)}</pre>}
		</div>
	);
}
