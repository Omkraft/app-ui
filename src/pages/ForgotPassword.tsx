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

import { forgotPassword } from '@/api/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loading from './Loading';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

export default function ForgotPassword() {
	const [sent, setSent] = useState(false);
	const [email, setEmail] = useState('');
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
			setLoading(false);
			if (!error) {
				setSent(true);
			}
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
										<CardTitle><h2>Reset password</h2></CardTitle>
										<CardDescription>
											Please check your email for the OTP to reset your password.
										</CardDescription>
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
									<p className="text-accent">
										If the email exists, an OTP has been sent.
									</p>
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
