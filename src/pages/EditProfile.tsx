import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Eye, EyeOff } from 'lucide-react';
import { getProfile, updateProfile } from '@/api/user';
import Loading from '@/components/Loading';
import OmkraftAlert from '@/components/ui/omkraft-alert';
import { useAuth } from '@/context/auth/AuthContext';

// Placeholder illustration; replace with dedicated profile artwork later.
import profileIllustration from '@/assets/edit-profile-illustration.svg';

type Feedback = {
	type: 'error' | 'success';
	message: string;
};

function normalizePhoneForInput(value: string) {
	const digits = value.replace(/\D/g, '');
	return digits.length > 10 ? digits.slice(-10) : digits;
}

export default function EditProfile() {
	const { user, updateUser } = useAuth();

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [feedback, setFeedback] = useState<Feedback | null>(null);

	useEffect(() => {
		let mounted = true;

		async function bootstrap() {
			try {
				setLoading(true);
				const { user: profile } = await getProfile();
				if (!mounted) return;
				setFirstName(profile.firstName || '');
				setLastName(profile.lastName || '');
				setEmail(profile.email || '');
				setPhone(normalizePhoneForInput(profile.phone || ''));
			} catch (err) {
				if (!mounted) return;
				setFeedback({
					type: 'error',
					message: err instanceof Error ? err.message : 'Failed to load profile details.',
				});

				// Fallback to locally stored user so form still renders.
				if (user) {
					setFirstName(user.firstName || '');
					setLastName(user.lastName || '');
					setEmail(user.email || '');
					setPhone(normalizePhoneForInput(user.phone || ''));
				}
			} finally {
				if (mounted) setLoading(false);
			}
		}

		bootstrap();
		return () => {
			mounted = false;
		};
	}, [user]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setFeedback(null);

		if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
			setFeedback({
				type: 'error',
				message: 'First name, last name, and phone are required.',
			});
			return;
		}

		if (!/^\d{10}$/.test(phone.trim())) {
			setFeedback({
				type: 'error',
				message: 'Phone number must be exactly 10 digits.',
			});
			return;
		}

		if (password || confirmPassword) {
			if (password.length < 8) {
				setFeedback({
					type: 'error',
					message: 'Password must be at least 8 characters.',
				});
				return;
			}

			if (password !== confirmPassword) {
				setFeedback({
					type: 'error',
					message: 'Password and Re-enter Password do not match.',
				});
				return;
			}
		}

		try {
			setSaving(true);
			const { user: updated } = await updateProfile({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				phone: `+91${phone.trim()}`,
				...(password ? { password } : {}),
			});

			updateUser({
				id: updated.id,
				firstName: updated.firstName,
				lastName: updated.lastName,
				email: updated.email,
				phone: updated.phone,
			});

			setFeedback({
				type: 'success',
				message: 'Profile updated successfully.',
			});
			setPassword('');
			setConfirmPassword('');
		} catch (err) {
			setFeedback({
				type: 'error',
				message: err instanceof Error ? err.message : 'Failed to update profile.',
			});
		} finally {
			setSaving(false);
		}
	}

	if (loading) return <Loading />;

	return (
		<div className="min-h-[calc(100vh-178px)] bg-background text-foreground flex items-center">
			<div className="app-container grid gap-12 py-6 lg:grid-cols-2 items-center justify-items-center">
				<div className="hidden lg:block relative">
					<div className="relative space-y-6">
						<h1 className="text-4xl font-semibold text-foreground leading-tight">
							Update your
							<br />
							<span className="text-primary">profile</span>
						</h1>

						<p className="text-muted-foreground max-w-md">
							Review your personal details and keep your Omkraft account profile
							accurate.
						</p>

						<img
							src={profileIllustration}
							alt="Profile illustration"
							className="w-full opacity-90"
						/>
					</div>
				</div>
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>
							<h2>Edit profile</h2>
						</CardTitle>
						<CardDescription>Keep your account details up to date</CardDescription>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleSubmit}>
							<FieldGroup className="gap-5">
								<Field>
									<FieldLabel htmlFor="firstName">
										First name <span className="text-destructive">*</span>
									</FieldLabel>
									<Input
										id="firstName"
										placeholder="First name"
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
										required
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="lastName">
										Last name <span className="text-destructive">*</span>
									</FieldLabel>
									<Input
										id="lastName"
										placeholder="Last name"
										value={lastName}
										onChange={(e) => setLastName(e.target.value)}
										required
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<Input
										id="email"
										type="email"
										value={email}
										readOnly
										disabled
										aria-readonly="true"
									/>
									<FieldDescription className="text-xs">
										Please contact Omkraft support if you need to change your
										email address.
									</FieldDescription>
								</Field>
								<Field>
									<FieldLabel htmlFor="phone">
										Phone number <span className="text-destructive">*</span>
									</FieldLabel>
									<InputGroup className="bg-input border border-border">
										<InputGroupInput
											id="phone"
											type="tel"
											placeholder="9876543210"
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
											required
										/>
										<InputGroupAddon>+91</InputGroupAddon>
									</InputGroup>
								</Field>
								<Field>
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<InputGroup className="bg-input border border-border">
										<InputGroupInput
											id="password"
											type={showPassword ? 'text' : 'password'}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											minLength={8}
											placeholder="Enter new password"
										/>
										<InputGroupAddon align="inline-end">
											<Button
												className="hover:bg-transparent"
												onClick={() => setShowPassword(!showPassword)}
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
										Leave blank to keep your current password.
									</FieldDescription>
								</Field>
								<Field>
									<FieldLabel htmlFor="confirmPassword">
										Re-enter Password
									</FieldLabel>
									<InputGroup className="bg-input border border-border">
										<InputGroupInput
											id="confirmPassword"
											type={showConfirmPassword ? 'text' : 'password'}
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											minLength={8}
											placeholder="Re-enter new password"
										/>
										<InputGroupAddon align="inline-end">
											<Button
												className="hover:bg-transparent"
												onClick={() =>
													setShowConfirmPassword(!showConfirmPassword)
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
								<Field>
									<Button
										type="submit"
										className="w-full btn-primary"
										disabled={saving}
									>
										{saving ? 'Saving...' : 'Save changes'}
									</Button>
								</Field>
							</FieldGroup>

							{feedback && (
								<div className="mt-4">
									<OmkraftAlert
										error={feedback.message}
										severity={feedback.type === 'success' ? 'success' : 'error'}
										fallbackTitle={
											feedback.type === 'success'
												? 'Profile updated'
												: 'Profile update failed'
										}
									/>
								</div>
							)}
						</form>
						<p className="text-sm text-center text-muted-foreground mt-4">
							<Link to="/dashboard" className="text-foreground underline">
								Back to Dashboard
							</Link>
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
