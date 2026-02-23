import { useAuth } from '@/context/auth/AuthContext';
import { Link } from 'react-router-dom';
import newsIllustration from '@/assets/news-illustration.svg';
import mediaIllustration from '@/assets/media-illustration.svg';

export default function Dashboard() {
	const { user } = useAuth();

	return (
		<main className="min-h-[calc(100vh-178px)] bg-background">
			<section className="text-foreground flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					{/* ========================= */}
					{/* Page Header */}
					{/* ========================= */}
					<header className="space-y-6">
						<h1 className="text-4xl font-semibold">
							Welcome, <br />
							<span className="text-primary">
								{user?.firstName
									? `${user.firstName} ${user.lastName ?? ''}`.trim()
									: 'Guest'}
								!
							</span>
						</h1>
						<p className="text-muted-foreground">
							Everything you use daily — thoughtfully organized.
						</p>
						<p className="text-muted-foreground">
							Omkraft brings together focused tools that solve real, everyday
							problems. Each app is independent, but connected through a single
							account — so you move seamlessly between them without friction.
						</p>
						<p className="text-muted-foreground">Choose where you’d like to begin.</p>
					</header>
				</div>
			</section>
			<section className="bg-accent text-accent-foreground flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					{/* ========================= */}
					{/* Module 1 — Utility Hub */}
					{/* ========================= */}
					<div className="grid gap-12 lg:grid-cols-2 items-center">
						{/* Text */}
						<div className="space-y-4">
							<h2 className="text-3xl">
								Personal
								<br />
								<span className="text-[var(--omkraft-mint-900)]">Utility Hub</span>
							</h2>
							<p className="text-accent-foreground">
								Daily essentials, in one calm place.
							</p>

							<p>
								The Personal Utility Hub is designed to reduce daily friction.
								Instead of jumping between multiple apps for small but important
								tasks, this space brings everything together in a clean,
								distraction-free experience.
							</p>

							<p>
								Check the weather before stepping out. Stay informed with essential
								news. Glance at what matters today — without noise, ads, or clutter.
							</p>

							<p>
								This is your lightweight, always-ready dashboard for everyday
								awareness.
							</p>

							<ul className="list-disc pl-5 space-y-2 text-accent-foreground">
								<li>Local weather & conditions</li>
								<li>Essential news (curated, not overwhelming)</li>
								<li>Quick daily insights at a glance</li>
								<li>Designed for speed and clarity</li>
							</ul>

							<div className="flex flex-col lg:flex-row gap-4 pt-4">
								<Link to="/utility" className="btn-secondary">
									Open Utility Hub
								</Link>
							</div>
						</div>

						{/* Visual Placeholder */}
						<div className="justify-center hidden lg:flex">
							<img
								src={newsIllustration}
								alt="News illustration"
								className="w-full max-w-md opacity-90"
							/>
						</div>
					</div>
				</div>
			</section>
			<section className="bg-primary text-primary-foreground flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					{/* ========================= */}
					{/* Module 2 — Subscription Tracker */}
					{/* ========================= */}
					<div className="grid gap-12 lg:grid-cols-2 items-center">
						{/* Visual Placeholder */}
						<div className="justify-center hidden lg:flex">
							<img
								src={mediaIllustration}
								alt="Media illustration"
								className="w-full max-w-md opacity-90"
							/>
						</div>
						{/* Text */}
						<div className="space-y-4 lg:text-right lg:justify-items-end">
							<h2 className="text-3xl">
								Subscription
								<br />
								<span className="text-[var(--omkraft-bg)]">Tracker</span>
							</h2>
							<p>Know what you're paying for — always.</p>

							<p>
								Subscriptions are easy to start — and easy to forget. Over time,
								small recurring charges quietly add up.
							</p>

							<p>
								Subscription Tracker gives you a clear view of every service you're
								paying for, how often you’re billed, and what it actually costs you
								over time.
							</p>

							<p>No spreadsheets. No guesswork. Just clarity and control.</p>

							<ul className="list-disc pl-5 space-y-2 lg:justify-items-start">
								<li>Track all active subscriptions</li>
								<li>Monthly and yearly cost breakdown</li>
								<li>Renewal reminders before you're charged</li>
								<li>Spot unused or forgotten services easily</li>
							</ul>

							<div className="flex flex-col lg:flex-row justify-items-end gap-4 pt-4">
								<Link to="/subscription" className="btn-accent">
									Open Subscription Tracker
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* ========================= */}
			{/* Footer Hint */}
			{/* ========================= */}
			<footer className="py-6 border-t border-border bg-muted text-sm text-muted-foreground">
				<div className="app-container grid gap-6 items-center">
					More tools will be added here over time — all accessible through the same
					Omkraft account.
				</div>
			</footer>
		</main>
	);
}
