import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import emailVerifiedIllustration from '@/assets/email-verified-illustration.svg';
import emailVerifyFailedIllustration from '@/assets/email-verify-failed-illustration.svg';
import Loading from '../components/Loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function VerifyEmail() {
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');

	const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
	const [message, setMessage] = useState('');

	useEffect(() => {
		if (!token) {
			setStatus('error');
			setMessage('This verification link is invalid or incomplete.');
			return;
		}

		fetch(`${API_BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`)
			.then(async (res) => {
				const data = await res.json().catch(() => ({}));
				if (!res.ok) throw new Error(data.message);
				setStatus('success');
				setMessage(
					typeof data?.message === 'string' && data.message
						? data.message
						: 'Your email has been verified successfully.'
				);
			})
			.catch((err) => {
				setStatus('error');
				setMessage(
					err instanceof Error && err.message
						? err.message
						: 'We could not verify your email with this link.'
				);
			});
	}, [token]);

	if (status === 'loading') {
		return <Loading />;
	}

	return (
		<div className="min-h-[calc(100vh-178px)] bg-background text-foreground flex items-center">
			<div className="app-container grid gap-12 lg:grid-cols-2 items-center py-6">
				<Card className="w-full">
					<CardHeader className="space-y-3">
						<CardTitle>
							<h1
								className={`text-3xl sm:text-4xl font-semibold leading-tight ${
									status === 'success' ? 'text-accent' : 'text-destructive'
								}`}
							>
								{status === 'success'
									? 'Email verification complete'
									: 'Email verification failed'}
							</h1>
						</CardTitle>
						<CardDescription className="text-base">
							{status === 'success'
								? 'Your Omkraft account is now active and ready to use.'
								: 'This link may be expired or already used.'}
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-4 gap-4 grid">
						{status === 'success' ? (
							<Alert variant="success">
								<AlertDescription>
									<p className="text-sm">{message}</p>
								</AlertDescription>
							</Alert>
						) : (
							<Alert variant="destructive">
								<AlertDescription>
									<p className="text-sm">{message}</p>
								</AlertDescription>
							</Alert>
						)}

						<div className="flex flex-wrap gap-3">
							<Button asChild className="text-sm w-full lg:w-auto">
								<Link to="/login">Go to Login</Link>
							</Button>

							{status === 'error' && (
								<Button
									variant="outline"
									asChild
									className="text-sm w-full lg:w-auto"
								>
									<Link to="/register">Create account again</Link>
								</Button>
							)}
						</div>
					</CardContent>
				</Card>

				<div className="hidden lg:flex justify-center">
					<img
						src={
							status === 'error'
								? emailVerifyFailedIllustration
								: emailVerifiedIllustration
						}
						alt={
							status === 'error'
								? 'Email verification failed'
								: 'Email verification success'
						}
						className="w-full max-w-md mx-auto opacity-90"
					/>
				</div>
			</div>
		</div>
	);
}
