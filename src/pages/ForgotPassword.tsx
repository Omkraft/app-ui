import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

import forgotIllustration from '@/assets/forgot-password-illustration.svg';
import resetIllustration from '@/assets/reset-password-illustration.svg';

import { forgotPassword, resetPassword } from '@/api/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Loading from '../components/Loading';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon, Eye, EyeOff } from 'lucide-react';
import { Field, FieldLabel, FieldDescription, FieldGroup } from '@/components/ui/field';
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

export default function ForgotPassword() {
	const [sent, setSent] = useState(false);
	const [reset, setReset] = useState(false);
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
			error = err instanceof Error ? err.message : 'Failed to send OTP. Please try again.';
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
			error =
				err instanceof Error ? err.message : 'Failed to reset password. Please try again.';
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
				<div className="min-h-[calc(100vh-145px)] flex items-center justify-center bg-background">
					<div className="app-container grid gap-12 lg:grid-cols-2 py-6 items-center justify-items-center">
						{/* Left visual panel */}
						<div className="hidden lg:block relative">
							<div className="relative space-y-6">
								{!sent ? (
									<>
										<h1 className="text-4xl font-semibold text-foreground leading-tight">
											Forgot
											<br />
											<span className="text-primary">password</span>
										</h1>

										<p className="text-muted-foreground max-w-md">
											Enter your email address and we'll help you securely
											regain access to your workspace.
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
											Set a new
											<br />
											<span className="text-primary">password</span>
										</h1>

										<p className="text-muted-foreground max-w-md">
											Enter the one-time code we sent to your email and choose
											a new password to secure your account.
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
										<CardTitle>
											<h2>Forgot password</h2>
										</CardTitle>
										<CardDescription>
											We'll send you a one-time code
										</CardDescription>
									</>
								) : (
									<>
										{!reset ? (
											<>
												<CardTitle>
													<h2>Reset password</h2>
												</CardTitle>
												<CardDescription>
													Please check your email for the OTP to reset
													your password.
												</CardDescription>
											</>
										) : (
											<>
												<CardTitle>
													<h2 className="text-accent">
														Password Updated Successfully
													</h2>
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
											<Field>
												<FieldLabel htmlFor="email">
													Registered Email{' '}
													<span className="text-destructive">*</span>
												</FieldLabel>
												<Input
													id="email"
													placeholder="you@omkraft.io"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													required
												/>
											</Field>
											{error && (
												<Alert variant="destructive" className="max-w-md">
													<AlertCircleIcon />
													<AlertTitle>Password reset failed</AlertTitle>
													<AlertDescription className="text-sm">
														{error}
													</AlertDescription>
												</Alert>
											)}
											<Button type="submit" className="w-full">
												Send OTP
											</Button>
										</form>
									</>
								) : (
									<>
										{!reset ? (
											<form
												onSubmit={handleResetPassword}
												className="space-y-4"
											>
												<FieldGroup>
													<Field className="w-fit">
														<FieldLabel htmlFor="otp">
															One-Time Code{' '}
															<span className="text-destructive">
																*
															</span>
														</FieldLabel>
														<InputOTP
															id="otp"
															maxLength={6}
															pattern={REGEXP_ONLY_DIGITS}
															onChange={(value) => setOtp(value)}
															required
														>
															<InputOTPGroup>
																<InputOTPSlot
																	className="bg-input border-l-0 border-border"
																	index={0}
																/>
																<InputOTPSlot
																	className="bg-input border-l-0 border-border"
																	index={1}
																/>
																<InputOTPSlot
																	className="bg-input border-l-0 border-border"
																	index={2}
																/>
																<InputOTPSlot
																	className="bg-input border-l-0 border-border"
																	index={3}
																/>
																<InputOTPSlot
																	className="bg-input border-l-0 border-border"
																	index={4}
																/>
																<InputOTPSlot
																	className="bg-input border-l-0 border-border"
																	index={5}
																/>
															</InputOTPGroup>
														</InputOTP>
													</Field>
													<Field>
														<FieldLabel htmlFor="password">
															Password{' '}
															<span className="text-destructive">
																*
															</span>
														</FieldLabel>
														<InputGroup className="bg-input border border-border">
															<InputGroupInput
																id="password"
																type={
																	showPassword
																		? 'text'
																		: 'password'
																}
																value={password}
																onChange={(e) =>
																	setPassword(e.target.value)
																}
																required
																minLength={8}
															/>
															<InputGroupAddon align="inline-end">
																<Button
																	className="hover:bg-transparent"
																	onClick={() =>
																		setShowPassword(
																			!showPassword
																		)
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
														<FieldDescription className="text-xs">
															Minimum 8 characters
														</FieldDescription>
													</Field>
													<Field>
														<FieldLabel htmlFor="confirmPassword">
															Confirm password{' '}
															<span className="text-destructive">
																*
															</span>
														</FieldLabel>
														<InputGroup className="bg-input border border-border">
															<InputGroupInput
																id="confirmPassword"
																type={
																	showConfirmPassword
																		? 'text'
																		: 'password'
																}
																value={confirmPassword}
																onChange={(e) =>
																	setConfirmPassword(
																		e.target.value
																	)
																}
																required
															/>
															<InputGroupAddon align="inline-end">
																<Button
																	className="hover:bg-transparent"
																	onClick={() =>
																		setShowConfirmPassword(
																			!showConfirmPassword
																		)
																	}
																	size="icon"
																	type="button"
																	variant="ghost"
																>
																	{showConfirmPassword ? (
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
													<Alert
														variant="destructive"
														className="max-w-md"
													>
														<AlertCircleIcon />
														<AlertTitle>
															Password reset failed
														</AlertTitle>
														<AlertDescription className="text-sm">
															{error}
														</AlertDescription>
													</Alert>
												)}
												<Button type="submit" className="w-full">
													Submit
												</Button>
											</form>
										) : (
											<>
												<p className="text-sm text-muted-foreground">
													You can now sign in using your new password and
													continue where you left off.
												</p>

												<p className="text-xs text-muted-foreground mt-4">
													For your security, never share your password
													with anyone.
												</p>
											</>
										)}
									</>
								)}

								<Link
									to="/login"
									className="block text-sm text-foreground text-center mt-4 underline"
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
