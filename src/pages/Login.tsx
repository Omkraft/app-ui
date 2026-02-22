import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/context/auth/AuthContext';
import { login as loginApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import loginIllustration from '@/assets/login-illustration.svg';
import Loading from '../components/Loading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon, Eye, EyeOff } from 'lucide-react';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		let error = null;

		if (!email.trim() || !password.trim()) {
			setError('All fields are required');
			return;
		}

		try {
			setLoading(true);
			const { token, user } = await loginApi(email, password);
			login(token, user);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Login failed. Please try again.';
			setError(error);
		} finally {
			setLoading(false);
			if (!error) {
				navigate('/dashboard', { replace: true });
			}
		}
	};

	return (
		<>
			{!loading ? (
				<div className="min-h-[calc(100vh-145px)] bg-background text-foreground flex items-center">
					<div className="app-container grid gap-12 lg:grid-cols-2 py-6 items-center justify-items-center">
						{/* Left visual panel */}
						<div className="hidden lg:block relative">
							<div className="relative space-y-6">
								<h1 className="text-4xl font-semibold text-foreground leading-tight">
									Welcome to
									<br />
									<span className="text-primary">Omkraft</span>
								</h1>

								<p className="text-muted-foreground max-w-md">
									Sign in to access your workspace and continue exploring a clean,
									scalable foundation.
								</p>

								<img
									src={loginIllustration}
									alt="Login illustration"
									className="w-full max-w-md opacity-90"
								/>
							</div>
						</div>

						{/* Login card */}
						<Card className="w-full max-w-md">
							<CardHeader>
								<CardTitle>
									<h2>Sign in</h2>
								</CardTitle>
								<CardDescription>Access your Omkraft workspace</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} className="space-y-4">
									<FieldGroup className="gap-5">
										<Field>
											<FieldLabel htmlFor="email">
												Email <span className="text-destructive">*</span>
											</FieldLabel>
											<Input
												id="email"
												placeholder="you@omkraft.io"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												required
											/>
										</Field>
										<Field>
											<FieldLabel htmlFor="password">
												Password <span className="text-destructive">*</span>
											</FieldLabel>
											<InputGroup className="bg-input border border-border">
												<InputGroupInput
													id="password"
													type={showPassword ? 'text' : 'password'}
													value={password}
													onChange={(e) => setPassword(e.target.value)}
													required
													minLength={8}
												/>
												<InputGroupAddon align="inline-end">
													<Button
														className="hover:bg-transparent"
														onClick={() =>
															setShowPassword(!showPassword)
														}
														size="icon"
														type="button"
														variant="ghost"
													>
														{showPassword ? (
															<EyeOff className="h-4 w-4 text-muted-foreground" />
														) : (
															<Eye className="h-4 w-4 text-muted-foreground" />
														)}
													</Button>
												</InputGroupAddon>
											</InputGroup>
										</Field>
									</FieldGroup>

									{error && (
										<Alert variant="destructive" className="max-w-md">
											<AlertCircleIcon />
											<AlertTitle>Login failed</AlertTitle>
											<AlertDescription className="text-sm">
												{error}
											</AlertDescription>
										</Alert>
									)}

									<Button type="submit" className="w-full">
										Login
									</Button>
								</form>
								<p className="text-sm text-center text-muted-foreground mt-4">
									<Link
										to="/forgot-password"
										className="text-foreground underline"
									>
										Forgot Password?
									</Link>
								</p>

								<p className="text-sm text-center text-muted-foreground mt-4">
									Don't have an account?{' '}
									<Link to="/register" className="text-foreground underline">
										Sign up
									</Link>
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			) : (
				<Loading />
			)}
		</>
	);
}
