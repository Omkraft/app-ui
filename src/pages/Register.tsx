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
import { register } from '@/api/auth';
import { COUNTRIES } from '@/utils/countries';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Loading from '../components/Loading';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

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
	const [countryIso, setCountryIso] = useState('in'); // default India
	const selectedCountry = COUNTRIES.find((c) => c.iso === countryIso)!;
	const isPositiveNumeric = (value: number) => !isNaN(value) && isFinite(value) && value > 0;

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		let error = null;

		if (
			!firstName.trim() ||
			!lastName.trim() ||
			!email.trim() ||
			!phone.trim()
		) {
			setError('All fields are required');
			return;
		}

		if (phone.length != 10) {
			setError('Phone number must be 10 digits');
			return;
		} else if (!isPositiveNumeric(Number(phone))) {
			setError('Phone number is not valid');
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
			const phoneNumber = `${selectedCountry.code}${phone}`;
			await register(firstName, lastName, email, phoneNumber, password);
		} catch (err) {
			error = err instanceof Error
				? err.message
				: 'Registration failed. Please try again.';
			setError(error);
		} finally {
			setLoading(false);
			if (!error) {
				setSubmitted(true);
			}
		}
	};

	return (
		<>
			{!loading ? (
				<div className="min-h-[calc(100vh-145px)] bg-background text-foreground flex items-center">
					<div className="app-container grid gap-12 py-6 lg:grid-cols-2 items-center justify-items-center">
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
													This will be used to sign in and account recovery purposes.
												</p>
											</div>

											<div className="space-y-2">
												<Label htmlFor="phone">Phone number</Label>
												<div className="flex gap-2">
													{/* Country code dropdown */}
													<Select
														value={countryIso}
														onValueChange={setCountryIso}
													>
														<SelectTrigger className="text-foreground px-3">
															<SelectValue>
																<span className="flex items-center gap-2">
																	<span
																		className={`fi fi-${selectedCountry.iso} leading-none`}
																	></span>
																	<span className="text-sm">{selectedCountry.code}</span>
																</span>
															</SelectValue>
														</SelectTrigger>
														<SelectContent>
															{COUNTRIES.map((country) => (
																<SelectItem key={country.code} value={country.iso}>
																	<span className="flex items-center gap-3">
																		<span
																			className={`fi fi-${country.iso} leading-none`}
																		></span>
																		<span className="flex-1">{country.label}</span>
																		<span className="text-muted-foreground text-sm">
																			{country.code}
																		</span>
																	</span>
																</SelectItem>
															))}
														</SelectContent>
													</Select>

													{/* Phone number input */}
													<Input
														type="tel"
														placeholder="9876543210"
														value={phone}
														onChange={(e) => setPhone(e.target.value)}
														required
													/>
												</div>
												<p className="text-xs text-muted-foreground">
													Stored for account records. Not used for login or verification.
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
												<Alert variant="destructive" className="max-w-md">
													<AlertCircleIcon />
													<AlertTitle>Registration failed</AlertTitle>
													<AlertDescription className="text-sm">
														{error}
													</AlertDescription>
												</Alert>
											)}

											<Button
												type="submit"
												className="w-full"
											>
												Create account
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
									<CardHeader className="text-center sapce-y-2">
										<CardTitle>
											<h2 className="text-accent">Welcome to Omkraft 🎉</h2>
										</CardTitle>
										<CardDescription className="mt-2">
											Your account has been created successfully.
										</CardDescription>
									</CardHeader>

									<CardContent className="text-center space-y-3">
										<p className="text-sm text-muted-foreground">
											We’ve sent a verification email to your registered address.
											Please confirm your email to activate your account.
										</p>

										<p className="text-xs text-muted-foreground">
											Didn’t receive the email? Be sure to check your <strong>Spam</strong> or <strong>Junk</strong> folder.
										</p>

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
			) : (
				<Loading />
			)}
		</>
	);
}
