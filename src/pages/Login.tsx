import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login } from '../api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const data = await login(email, password);
			localStorage.setItem('token', data.token);
			navigate('/dashboard');
		} catch (err) {
			setError((err as Error).message || 'Login failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-[calc(100vh-72px)] bg-background text-foreground flex items-center">
			<div className="app-container grid gap-12 lg:grid-cols-2 items-center">
				{/* Left visual panel */}
				<div className="hidden lg:block relative">
					{/* Omkraft glow */}
					<div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
					<div className="absolute top-32 left-32 h-64 w-64 rounded-full bg-accent/25 blur-3xl" />

					<div className="relative space-y-6">
						<h1 className="text-4xl font-semibold text-foreground leading-tight">
							Welcome to<br />
							<span className="text-primary">Omkraft</span>
						</h1>

						<p className="text-muted-foreground max-w-md">
							Sign in to access your workspace and continue building
							with a clean, scalable foundation.
						</p>

						{/* Lightweight inline SVG */}
						<svg
							viewBox="0 0 400 200"
							className="w-full max-w-md text-primary/80"
							fill="none"
						>
							{/* Door frame */}
							<rect
								x="140"
								y="30"
								width="120"
								height="140"
								rx="12"
								stroke="currentColor"
								strokeWidth="3"
								opacity="0.6"
							/>

							{/* Arrow entering */}
							<path
								d="M80 100 H190"
								stroke="currentColor"
								strokeWidth="3"
								strokeLinecap="round"
							/>

							<path
								d="M175 85 L195 100 L175 115"
								stroke="currentColor"
								strokeWidth="3"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>

							{/* Door knob */}
							<circle
								cx="245"
								cy="100"
								r="4"
								fill="currentColor"
								opacity="0.8"
							/>
						</svg>

					</div>
				</div>

				{/* Login card */}
				<div className="flex justify-center">
					<div className="w-full max-w-sm rounded-xl border border-border bg-background/95 backdrop-blur-sm p-8 shadow-xl">
						<div className="mb-6 space-y-2">
							<h2 className="text-2xl font-semibold text-foreground">
								Sign in
							</h2>
							<p className="text-sm text-muted-foreground">
								Access your Omkraft workspace
							</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="you@omkraft.io"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>

							{error && (
								<p className="text-sm text-destructive">
									{error}
								</p>
							)}

							<Button
								type="submit"
								className="w-full"
								disabled={loading}
							>
								{loading ? 'Signing in…' : 'Login'}
							</Button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
