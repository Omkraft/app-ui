import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import welcomeIllustration from '@/assets/welcome-illustration.svg';

export default function Welcome() {
	return (
		<div className="min-h-[calc(100vh-145px)] bg-background text-foreground flex items-center">
			<div className="app-container max-w-4xl py-6 grid gap-12 lg:grid-cols-2 items-center">
				<div className="space-y-8 text-center lg:text-left">
					{/* Heading */}
					<h1 className="text-4xl font-semibold leading-tight">
						Welcome to <span className="text-primary">Omkraft</span>
					</h1>

					{/* Intro */}
					<p className="text-muted-foreground text-lg">
						Omkraft is a simple, evolving platform designed to make everyday things
						easier — all in one place. It's currently in an early preview phase, and
						your feedback will help shape what it becomes.
					</p>

					{/* What to expect */}
					<div className="space-y-3">
						<p className="text-muted-foreground">
							You can sign up, explore the experience, and try out the current
							features freely. Over time, Omkraft will grow into a practical tool for
							managing different aspects of day-to-day life — without complexity.
						</p>

						<p className="text-muted-foreground">
							This is a personal demo project under the Omkraft name. It is not an
							official product (yet), but it is built with care, security, and real
							users in mind.
						</p>
					</div>

					{/* Reassurance */}
					<div className="rounded-lg border border-border bg-muted/30 p-4">
						<p className="text-sm text-muted-foreground">
							🔒 Your login information is stored securely and will never be misused.
							If you notice anything odd or have suggestions, you’re encouraged to
							reach out directly.
						</p>
					</div>

					{/* CTA */}
					<div className="flex flex-col lg:flex-row gap-4 pt-4">
						<Link to="/login">
							<Button className="w-full lg:w-auto">Login</Button>
						</Link>

						<Link to="/register">
							<Button variant="accent" className="w-full lg:w-auto">
								Create Account
							</Button>
						</Link>
					</div>

					{/* Footer note */}
					<p className="text-sm text-muted-foreground pt-6 lg:hidden">
						For the best experience, try Omkraft on a laptop or desktop if possible.
						Mobile support is improving continuously.
					</p>
				</div>
				<div className="hidden lg:block relative">
					<div className="relative space-y-6">
						<img
							src={welcomeIllustration}
							alt="Welcome illustration"
							className="w-full max-w-md opacity-90"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
