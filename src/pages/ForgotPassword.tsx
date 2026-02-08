import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from '@/components/ui/card';

import forgotIllustration from '@/assets/forgot-password-illustration.svg';
import resetIllustration from '@/assets/reset-password-illustration.svg';

import { forgotPassword, resetPassword } from '@/api/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loading from '../components/Loading';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

export default function ForgotPassword() {
	const [sent, setSent] = useState(false);
	const [reset, setReset] = useState(false);
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const handleForgotPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		let error = null;
		if (!email.trim()) {
			setError('Email is required');
			return;
		}
		try {
			setLoading(true);
			await forgotPassword(email);
		} catch (err) {
			error = err instanceof Error
				? err.message
				: 'Failed to send OTP. Please try again.';
			setError(error);
		} finally {
			if (!error) {
				setSent(true);
			}
			setLoading(false);
		}
	};

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		let error = null;
		if (!otp.trim()) {
			setError('OTP is required');
			return;
		}
		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		} else if (password.length < 8) {
			setError('Password must be at least 8 characters');
			return;
		}
		try {
			setLoading(true);
			await resetPassword(email, otp, password);
		} catch (err) {
			error = err instanceof Error
				? err.message
				: 'Failed to reset password. Please try again.';
			setError(error);
		} finally {
			if (!error) {
				setReset(true);
			}
			setLoading(false);
		}
	};

	return (
		<>
			{!loading ? (
				<div className="min-h-screen flex items-center justify-center bg-background">
					<div className="app-container grid gap-12 lg:grid-cols-2 items-center justify-items-center">
						{/* Left visual panel */}
						<div className="hidden lg:block relative">
							<div className="relative space-y-6">
								{!sent ? (
									<>
										<h1 className="text-4xl font-semibold text-foreground leading-tight">
											Forgot<br />
											<span className="text-primary">password</span>
										</h1>

										<p className="text-muted-foreground max-w-md">
											Enter your email address and we'll help you securely regain access to your workspace.
										</p>
										<img
											src={forgotIllustration}
											alt="Forgot password illustration"
											className="w-full max-w-md opacity-90"
										/>
									</>
								) : (
									<>
										<h1 className="text-4xl font-semibold text-foreground leading-tight">
											Set a new<br />
											<span className="text-primary">password</span>
										</h1>

										<p className="text-muted-foreground max-w-md">
											Enter the one-time code we sent to your email and choose a new password to secure your account.
										</p>
										<img
											src={resetIllustration}
											alt="Reset password illustration"
											className="w-full max-w-md opacity-90"
										/>
									</>
								)}
							</div>
						</div>
						<Card className="w-full max-w-md">
							<CardHeader>
								{!sent ? (
									<>
										<CardTitle><h2>Forgot password</h2></CardTitle>
										<CardDescription>
											We'll send you a one-time code
										</CardDescription>
									</>
								) : (
									<>
										{!reset ? (
											<>
												<CardTitle><h2>Reset password</h2></CardTitle>
												<CardDescription>
													Please check your email for the OTP to reset your password.
												</CardDescription>
											</>
										) : (
											<>
												<CardTitle>
													<h2 className="text-accent">Password Updated Successfully</h2>
												</CardTitle>
												<CardDescription className="mt-2">
													Your password has been reset.
												</CardDescription>
											</>
										)}
									</>
								)}
							</CardHeader>

							<CardContent>
								{!sent ? (
									<>
										<form onSubmit={handleForgotPassword} className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="email">Registered Email</Label>
												<Input
													id="email"
													type="email"
													placeholder="you@omkraft.io"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													required
												/>
											</div>
											{error && (
												<Alert variant="destructive" className="max-w-md">
													<AlertCircleIcon />
													<AlertTitle>Password reset failed</AlertTitle>
													<AlertDescription className="text-sm">
														{error}
													</AlertDescription>
												</Alert>
											)}
											<Button
												type="submit"
												className="w-full"
											>
												Send OTP
											</Button>
										</form>
									</>
								) : (
									<>
										{!reset ? (
											<form onSubmit={handleResetPassword} className="space-y-4">
												<div className="space-y-2">
													<Label htmlFor="otp">One-Time Code</Label>
													<Input
														id="otp"
														type="password"
														value={otp}
														onChange={(e) => setOtp(e.target.value)}
														required
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
													<Alert variant="destructive" className="max-w-md">
														<AlertCircleIcon />
														<AlertTitle>Password reset failed</AlertTitle>
														<AlertDescription className="text-sm">
															{error}
														</AlertDescription>
													</Alert>
												)}
												<Button
													type="submit"
													className="w-full"
												>
													Submit
												</Button>
											</form>
										) : (
											<>
												<p className="text-sm text-muted-foreground">
													You can now sign in using your new password and continue where you left off.
												</p>

												<p className="text-xs text-muted-foreground mt-4">
													For your security, never share your password with anyone.
												</p>
											</>
										)}
									</>
								)}

								<Link
									to="/login"
									className="block text-sm text-white text-center mt-4 underline"
								>
									Back to Login
								</Link>
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
