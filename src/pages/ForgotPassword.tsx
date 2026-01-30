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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword() {
	const [sent, setSent] = useState(false);
	const handleForgotPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		// call forgot password API
		setSent(true);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="app-container grid gap-12 lg:grid-cols-2 items-center justify-items-center">
				{/* Left visual panel */}
				<div className="hidden lg:block relative">
					<div className="relative space-y-6">
						<h1 className="text-4xl font-semibold text-foreground leading-tight">
							Reset your<br />
							<span className="text-primary">password</span>
						</h1>

						<p className="text-muted-foreground max-w-md">
							Enter your email address and we’ll help you securely regain access to your workspace.
						</p>



						<img
							src={forgotIllustration}
							alt="Forgot password illustration"
							className="w-full max-w-md opacity-90"
						/>

					</div>
				</div>
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle><h2>Reset password</h2></CardTitle>
						{!sent ? (
							<>
								<CardDescription>
									We'll send you a one-time code
								</CardDescription>
							</>
						) : (
							<>
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
											required
										/>
									</div>
									<button
										className="btn-primary w-full"
									>
										Send OTP
									</button>
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
	);
}
