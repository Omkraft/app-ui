import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import emailVerifiedIllustration from '@/assets/email-verified-illustration.svg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function VerifyEmail() {
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');

	const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
	const [message, setMessage] = useState('');

	useEffect(() => {
		if (!token) {
			setStatus('error');
			setMessage('Invalid verification link');
			return;
		}

		fetch(`${API_BASE_URL}/api/auth/verify-email?token=${token}`)
			.then(async (res) => {
				const data = await res.json();
				if (!res.ok) throw new Error(data.message);
				setStatus('success');
				setMessage('Your email has been verified successfully.');
			})
			.catch((err) => {
				setStatus('error');
				setMessage(err.message || 'Verification failed');
			});
	}, [token]);

	if (status === 'loading') {
		return <p>Verifying your email…</p>;
	}

	return (

		<div className="min-h-[calc(100vh-72px)] bg-background text-foreground flex items-center">
			<div className="app-container grid gap-12 items-center justify-items-center">
				<Card className="w-full text-center">
					<CardHeader>
						<CardTitle>
							<h1 className="text-4xl font-semibold leading-tight text-primary">{status === 'success' ? 'Email Verified' : 'Verification Failed'}</h1>
						</CardTitle>
						<CardDescription>
							{message}
							<Link to="/login" className="btn-primary">
								Go to Login
							</Link>
						</CardDescription>
						<CardContent>
							<img
								src={emailVerifiedIllustration}
								alt="Email verified illustration"
								className="w-full max-w-md mx-auto opacity-90"
							/>
						</CardContent>
					</CardHeader>
				</Card>
			</div>
		</div>
	);
}
