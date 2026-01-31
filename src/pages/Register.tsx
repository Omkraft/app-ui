import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import registerIllustration from '@/assets/register-illustration.svg';

export default function Register() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (
			!firstName.trim() ||
			!lastName.trim() ||
			!email.trim() ||
			!phone.trim()
		) {
			setError('All fields are required');
			return;
		}

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		if (password.length < 8) {
			setError('Password must be at least 8 characters');
			return;
		}

		try {
			setLoading(true);
			// call register API
		} catch {
			setError('Registration failed. Please try again.');
		} finally {
			setLoading(false);
			setSubmitted(true);
		}
	};


	return (
		<div className="min-h-[calc(100vh-72px)] bg-background text-foreground flex items-center">
			<div className="app-container grid gap-12 lg:grid-cols-2 items-center justify-items-center">
				<Card className="w-full max-w-md">
					{!submitted ? (
						<>
							<CardHeader>
								<CardTitle>
									<h2>Create your account</h2>
								</CardTitle>
								<CardDescription>
									Join Omkraft to access your tools
								</CardDescription>
							</CardHeader>

							<CardContent className="space-y-3">
								<form onSubmit={handleRegister} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="firstName">First name</Label>
										<Input
											id="firstName"
											type="text"
											placeholder="First name"
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="lastName">Last name</Label>
										<Input
											id="lastName"
											type="text"
											placeholder="Last name"
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											placeholder="you@omkraft.io"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
										<p className="text-xs text-muted-foreground">
											This will be your login email
										</p>
									</div>

									<div className="space-y-2">
										<Label htmlFor="phone">Phone number</Label>
										<Input
											id="phone"
											type="tel"
											placeholder="+91 98765 43210"
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
											required
										/>
										<p className="text-xs text-muted-foreground">
											Used for account recovery and verification
										</p>
									</div>


									<div className="space-y-2">
										<Label htmlFor="password">Password</Label>
										<Input
											id="password"
											type="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
											minLength={8}
										/>
										<p className="text-xs text-muted-foreground">
											Minimum 8 characters
										</p>
									</div>

									<div className="space-y-2">
										<Label htmlFor="confirmPassword">Confirm password</Label>
										<Input
											id="confirmPassword"
											type="password"
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
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
										{loading ? 'Creating account…' : 'Create account'}
									</Button>
								</form>


								<p className="text-sm text-center text-muted-foreground mt-4">
									Already have an account?{' '}
									<Link to="/login" className="text-white underline">
										Login
									</Link>
								</p>
							</CardContent>
						</>
					) : (
						<>
							<CardHeader className='text-center'>
								<CardTitle><h2 className="text-accent">Registration successful</h2></CardTitle>
								<CardDescription>
									Please verify your email to continue
								</CardDescription>
							</CardHeader>

							<CardContent className="text-center">
								<Link to="/login" className="btn-primary inline-block mt-4">
									Go to Login
								</Link>
							</CardContent>
						</>
					)}
				</Card>
				{/* Right visual panel */}
				<div className="hidden lg:block relative">
					<div className="relative space-y-6">
						<h1 className="text-4xl font-semibold text-foreground leading-tight">
							Create your<br />
							<span className="text-primary">Omkraft</span> account
						</h1>

						<p className="text-muted-foreground max-w-md">
							Join Omkraft to start exploring a clean, scalable foundation designed for modern systems.
						</p>


						<img
							src={registerIllustration}
							alt="Register illustration"
							className="w-full max-w-md opacity-90"
						/>

					</div>
				</div>
			</div>
		</div>
	);
}
