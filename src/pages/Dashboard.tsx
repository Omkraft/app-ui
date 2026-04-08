import { useAuth } from '@/context/auth/AuthContext';
import { Link } from 'react-router-dom';
import newsIllustration from '@/assets/news-illustration.svg';
import mediaIllustration from '@/assets/media-illustration.svg';
import dailyPanchangIllustration from '@/assets/daily-panchang-illustration.svg';
import investmentIllustration from '@/assets/investment-illustration.svg';
import { Landmark, Newspaper, ReceiptIndianRupee, ScrollText } from 'lucide-react';

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
							Your everyday essentials, thoughtfully organized.
						</p>
						<p className="text-muted-foreground">
							Omkraft brings together focused tools that solve real, everyday
							problems. Each app is independent, but connected through a single
							account &mdash; so you move seamlessly between them without friction.
						</p>
						<p className="text-muted-foreground">Choose where you'd like to begin.</p>
					</header>
				</div>
			</section>
			<section className="bg-accent text-accent-foreground flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					{/* ========================= */}
					{/* Module 1 - Utility Hub */}
					{/* ========================= */}
					<div className="grid gap-12 lg:grid-cols-2 items-center">
						{/* Text */}
						<div className="space-y-4">
							<div className="flex items-center justify-between gap-4">
								<h2 className="text-3xl">
									Personal
									<br />
									<span className="text-[var(--omkraft-mint-900)]">
										Utility Hub
									</span>
								</h2>
								<Newspaper className="h-12 w-12 shrink-0 text-[var(--omkraft-mint-900)] lg:hidden" />
							</div>
							{/* Mobile copy */}
							<div className="lg:hidden space-y-3">
								<p className="text-accent-foreground">
									Daily essentials, without the noise.
								</p>

								<p>
									Check the weather, catch up on essential news, and stay aware of
									what matters today in one calm space.
								</p>
							</div>

							{/* Desktop copy */}
							<div className="hidden lg:block space-y-4">
								<p className="text-accent-foreground">
									Daily essentials, without the noise.
								</p>

								<p>
									The Personal Utility Hub is designed to reduce daily friction.
									Instead of jumping between multiple apps for small but important
									tasks, this space brings everything together in a clean,
									distraction-free experience.
								</p>

								<p>
									Check the weather before stepping out, stay informed with
									essential news, and glance at what matters today &mdash; without
									noise, ads, or clutter.
								</p>

								<p>
									This is your lightweight, always-ready dashboard for everyday
									awareness.
								</p>
							</div>

							<ul className="list-disc pl-5 space-y-2 text-accent-foreground hidden lg:block">
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
								className="w-full max-w-md"
							/>
						</div>
					</div>
				</div>
			</section>
			<section className="bg-primary text-primary-foreground flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					{/* ========================= */}
					{/* Module 2 - Subscription Tracker */}
					{/* ========================= */}
					<div className="grid gap-12 lg:grid-cols-2 items-center">
						{/* Visual Placeholder */}
						<div className="justify-center hidden lg:flex">
							<img
								src={mediaIllustration}
								alt="Media illustration"
								className="w-full max-w-md"
							/>
						</div>
						{/* Text */}
						<div className="space-y-4">
							<div className="flex items-center justify-between gap-4">
								<h2 className="text-3xl">
									Subscription
									<br />
									<span className="text-[var(--omkraft-bg)]">Tracker</span>
								</h2>
								<ReceiptIndianRupee className="h-12 w-12 shrink-0 text-[var(--omkraft-bg)] lg:hidden" />
							</div>
							{/* Mobile copy */}
							<div className="lg:hidden space-y-3">
								<p>Know exactly what you're paying for.</p>

								<p>
									Track subscriptions, monitor recurring costs, and get reminders
									before the next charge hits.
								</p>
							</div>

							{/* Desktop copy */}
							<div className="hidden lg:block space-y-4">
								<p>Know exactly what you're paying for.</p>

								<p>
									Subscriptions are easy to start &mdash; and easy to forget. Over
									time, small recurring charges quietly add up.
								</p>

								<p>
									Subscription Tracker gives you a clear view of every service
									you're paying for, how often you're billed, and what it actually
									costs you over time.
								</p>

								<p>No spreadsheets. No guesswork. Just clarity.</p>
							</div>

							<ul className="list-disc pl-5 space-y-2 lg:justify-items-start hidden lg:block">
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
			<section className="bg-[var(--omkraft-indigo-400)] text-background flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					<div className="grid gap-12 lg:grid-cols-2 items-center">
						<div className="space-y-4">
							<div className="flex items-center justify-between gap-4">
								<h2 className="text-3xl">
									Daily
									<br />
									<span className="text-[var(--omkraft-indigo-800)]">
										Panchang
									</span>
								</h2>
								<ScrollText className="h-12 w-12 shrink-0 text-background lg:hidden" />
							</div>
							<div className="lg:hidden space-y-3">
								<p>Daily Panchang and horoscope, grounded in local calculations.</p>
								<p>
									View the day&apos;s Tithi, Nakshatra, Yoga, Karana, daily
									horoscope, and key auspicious or avoidable time windows in one
									place.
								</p>
							</div>

							<div className="hidden lg:block space-y-4">
								<p>Daily Panchang and horoscope, grounded in local calculations.</p>
								<p>
									Panchang brings together the essential daily elements you
									actually look for &mdash; Tithi, Nakshatra, Yoga, Karana,
									sunrise, sunset, daily horoscope, and practical time windows for
									the day.
								</p>
								<p>
									It is designed to be quick to read, visually calm, and useful
									without making you sift through clutter.
								</p>
							</div>

							<ul className="list-disc pl-5 space-y-2 hidden lg:block">
								<li>Tithi, Nakshatra, Yoga, Karana, and Moon Rashi</li>
								<li>Sunrise and sunset for your date and coordinates</li>
								<li>Auspicious and inauspicious time windows</li>
								<li>Daily horoscope for all 12 zodiac signs</li>
								<li>Short daily guidance for planning the day</li>
							</ul>

							<div className="flex flex-col lg:flex-row gap-4 pt-4">
								<Link to="/panchang" className="btn-secondary">
									Open Daily Panchang
								</Link>
							</div>
						</div>

						{/* Visual Placeholder */}
						<div className="justify-center hidden lg:flex">
							<img
								src={dailyPanchangIllustration}
								alt="Daily Panchang illustration"
								className="w-full"
							/>
						</div>
					</div>
				</div>
			</section>
			<section className="bg-[var(--omkraft-mint-700)] text-foreground flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					<div className="grid gap-12 lg:grid-cols-2 items-center">
						<div className="justify-center hidden lg:flex">
							<img
								src={investmentIllustration}
								alt="Investment illustration"
								className="w-full"
							/>
						</div>
						<div className="space-y-4">
							<div className="flex items-center justify-between gap-4">
								<h2 className="text-3xl">
									Personal
									<br />
									<span className="text-[var(--omkraft-mint-300)]">Vault</span>
								</h2>
								<Landmark className="h-12 w-12 shrink-0 text-[var(--omkraft-mint-300)] lg:hidden" />
							</div>

							<div className="lg:hidden space-y-3">
								<p>Track your fixed and recurring deposits in one secure place.</p>
								<p>
									Review maturity details, monitor returns, and keep both FD and
									RD records organized with end-to-end encrypted storage.
								</p>
							</div>

							<div className="hidden lg:block space-y-4">
								<p>Track your fixed and recurring deposits in one secure place.</p>
								<p>
									Personal Vault is a focused space for deposits that usually end
									up scattered across bank apps, PDFs, and reminders.
								</p>
								<p>
									Keep maturity dates, returns, installment progress, and related
									reference details easy to review in the same workflow.
								</p>
								<p>
									Your records are encrypted before storage, so privacy is built
									into the tracker instead of being an afterthought.
								</p>
								<p>Simple visibility first. Better financial clarity every day.</p>
							</div>

							<ul className="list-disc pl-5 space-y-2 hidden lg:block">
								<li>Track FD and RD records with key dates and amounts</li>
								<li>
									Keep interest, maturity, and installment progress easy to review
								</li>
								<li>Store important institution and holder details in one place</li>
								<li>
									Keep sensitive deposit data protected with end-to-end encryption
								</li>
							</ul>

							<div className="flex flex-col lg:flex-row gap-4 pt-4">
								<Link to="/vault" className="btn-accent">
									Open My Vault
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
			{/* ========================= */}
			{/* Footer Hint */}
			{/* ========================= */}
			<footer className="border-t border-border bg-muted py-6 text-sm text-muted-foreground">
				<div className="app-container grid gap-6 items-center">
					More focused tools will be added here over time &mdash; all connected through
					the same Omkraft account.
				</div>
			</footer>
		</main>
	);
}
