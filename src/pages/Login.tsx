import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const data = await login(email, password);
			localStorage.setItem('token', data.token);
			navigate('/dashboard');
		} catch (err) {
			setError((err as Error).message);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Login</h2>
			<input
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
			/>
			<button type="submit">Login</button>
			{error && <p>{error}</p>}
		</form>
	);
}
