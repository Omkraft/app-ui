import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchMatches, type Match } from '@/api/sports';
import { sportIcons } from '@/utils/sportsIcons';
import ReactCountryFlag from 'react-country-flag';
import OmkraftAlert from '@/components/ui/omkraft-alert';

const REGION_SPORTS = {
	india: ['cricket', 'hockey'],
	world: ['cricket', 'football', 'tennis'],
} as const;

type Region = keyof typeof REGION_SPORTS;
type MatchStatusTab = 'live' | 'upcoming' | 'history';

const DEFAULT_SPORT_BY_REGION: Record<Region, string> = {
	india: 'cricket',
	world: 'cricket',
};

function getInitials(value: string) {
	return value
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('');
}

function formatMatchTime(startTime: string) {
	const date = new Date(startTime);

	if (Number.isNaN(date.getTime())) {
		return 'Time unavailable';
	}

	return new Intl.DateTimeFormat(undefined, {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(date);
}

function getStatusBadge(status: MatchStatusTab) {
	if (status === 'live') {
		return {
			label: 'LIVE',
			variant: 'destructive' as const,
			className: 'border-transparent bg-destructive text-destructive-foreground',
		};
	}

	if (status === 'history') {
		return {
			label: 'HISTORY',
			variant: 'secondary' as const,
			className:
				'border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success-foreground)] hover:bg-[var(--success-bg)]',
		};
	}

	return {
		label: 'UPCOMING',
		variant: 'secondary' as const,
		className:
			'border-[var(--warning-border)] bg-[var(--warning-bg)] text-[var(--warning-foreground)] hover:bg-[var(--warning-bg)]',
	};
}

function isLiveByStatus(status?: string) {
	const value = (status || '').toLowerCase();

	return (
		value.includes('live') ||
		value.includes('progress') ||
		value.includes('innings break') ||
		value.includes('stumps')
	);
}

function isHistoryByStatus(status?: string) {
	const value = (status || '').toLowerCase();

	return (
		value.includes('complete') ||
		value.includes('result') ||
		value.includes('won') ||
		value.includes('finished') ||
		value.includes('ended')
	);
}

function getMatchBucket(match: Match): MatchStatusTab | null {
	const start = new Date(match.startTime);

	if (Number.isNaN(start.getTime())) {
		return null;
	}

	const now = Date.now();
	const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
	const sixMonthsAhead = now + 183 * 24 * 60 * 60 * 1000;
	const startTime = start.getTime();

	if (
		isLiveByStatus(match.status) ||
		(startTime <= now && startTime >= now - 6 * 60 * 60 * 1000)
	) {
		return 'live';
	}

	if (isHistoryByStatus(match.status) || (startTime < now && startTime >= thirtyDaysAgo)) {
		return 'history';
	}

	if (startTime > now && startTime <= sixMonthsAhead) {
		return 'upcoming';
	}

	return null;
}

function TeamLogo({ name, logo }: { name: string; logo?: string }) {
	const [error, setError] = useState(false);

	if (!logo || error) {
		return (
			<div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground text-xs font-semibold">
				{getInitials(name)}
			</div>
		);
	}

	return (
		<img
			src={logo}
			alt={name}
			onError={() => setError(true)}
			className="h-7 object-contain border border-muted-foreground"
		/>
	);
}

function TeamRow({
	name,
	score,
	logo,
	align = 'left',
}: {
	name: string;
	score?: string;
	logo?: string;
	align?: 'left' | 'right';
}) {
	const isRight = align === 'right';

	return (
		<div className="flex justify-between items-center gap-4">
			<div className={`flex items-center gap-3 ${isRight ? 'order-2 text-right' : ''}`}>
				<TeamLogo name={name} logo={logo} />

				<p className="font-semibold">{name}</p>
			</div>

			<p className="text-lg font-bold">{score || 'TBD'}</p>
		</div>
	);
}

function MatchCard({ match, activeStatus }: { match: Match; activeStatus: MatchStatusTab }) {
	const badge = getStatusBadge(activeStatus);

	const summaryText =
		activeStatus === 'live'
			? match.status || 'Match in progress'
			: activeStatus === 'history'
				? match.status || 'Result recorded'
				: `Starts ${formatMatchTime(match.startTime)}`;

	return (
		<Card className="border border-primary bg-background text-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
			<CardHeader className="flex flex-row items-center justify-between gap-4">
				<CardTitle className="text-sm font-semibold">
					<div className="flex items-center gap-2">
						<span className="text-muted-foreground capitalize">
							{match.league || 'Match'}
						</span>
					</div>
				</CardTitle>

				<Badge
					variant={badge.variant}
					className={`${badge.className} ${activeStatus === 'live' ? 'animate-pulse' : ''}`}
				>
					{badge.label}
				</Badge>
			</CardHeader>

			<CardContent className="space-y-2">
				<TeamRow name={match.teamA} score={match.scoreA} logo={match.teamALogo} />

				<TeamRow
					name={match.teamB}
					score={match.scoreB}
					logo={match.teamBLogo}
					align="right"
				/>

				<Separator className="border-t border-muted" />

				<div className="space-y-1">
					<p className="text-sm">{summaryText}</p>
				</div>
			</CardContent>
		</Card>
	);
}

function LeagueSectionHeader({
	league,
	matchCount,
	leagueLogo,
}: {
	league: string;
	matchCount: number;
	leagueLogo?: string;
}) {
	const logoSrc = leagueLogo;

	return (
		<div className="flex flex-wrap items-center gap-3">
			<h2 className="flex gap-2 text-2xl font-semibold items-center">
				{logoSrc ? (
					<img src={logoSrc} alt={`${league} Logo`} className="h-10 w-10" />
				) : null}
				<span>{league}</span>
			</h2>
			<Badge className="bg-primary text-foreground border border-muted-foreground">
				{matchCount} matches
			</Badge>
		</div>
	);
}

export default function SportsCentral() {
	const [matches, setMatches] = useState<Match[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [region, setRegion] = useState<Region>('india');
	const [sport, setSport] = useState<string>(DEFAULT_SPORT_BY_REGION.india);
	const [status, setStatus] = useState<MatchStatusTab>('live');

	const loadMatches = useCallback(
		async (sportParam: string, regionParam: Region, signal?: AbortSignal) => {
			setLoading(true);
			setError(null);

			try {
				const data = await fetchMatches(sportParam, regionParam, signal);

				setMatches(data);
			} catch (err) {
				if (err instanceof DOMException && err.name === 'AbortError') {
					return;
				}

				setError('Failed to load matches. Please try again.');
			} finally {
				if (!signal?.aborted) {
					setLoading(false);
				}
			}
		},
		[]
	);

	useEffect(() => {
		const controller = new AbortController();
		loadMatches(sport, region, controller.signal);

		if (status !== 'live') {
			return () => controller.abort();
		}

		const interval = setInterval(() => {
			if (document.visibilityState !== 'visible') {
				return;
			}

			loadMatches(sport, region);
		}, 30000);

		return () => {
			controller.abort();
			clearInterval(interval);
		};
	}, [loadMatches, sport, region, status]);

	const filteredMatches = useMemo(
		() =>
			matches
				.filter((match) => getMatchBucket(match) === status)
				.sort((a, b) => {
					const aTime = new Date(a.startTime).getTime();
					const bTime = new Date(b.startTime).getTime();

					return status === 'history' ? bTime - aTime : aTime - bTime;
				}),
		[matches, status]
	);

	const groupedMatches = useMemo(
		() =>
			filteredMatches.reduce<Record<string, Match[]>>((acc, match) => {
				const league = match.league || 'Other';

				if (!acc[league]) {
					acc[league] = [];
				}

				acc[league].push(match);

				return acc;
			}, {}),
		[filteredMatches]
	);

	const currentSports = REGION_SPORTS[region];

	return (
		<main className="min-h-[calc(100vh-178px)] bg-[var(--omkraft-indigo-300)] text-background">
			<section className="flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink
									asChild
									className="text-background hover:text-primary"
								>
									<Link to="/dashboard">Dashboard</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>

							<BreadcrumbSeparator className="text-background" />

							<BreadcrumbItem>
								<BreadcrumbPage className="text-primary">
									Sports Central
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</section>

			<section className="flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					{/* ========================= */}
					{/* Page Header */}
					{/* ========================= */}
					<header className="space-y-4">
						<h1 className="text-4xl font-semibold">
							Sports <span className="text-primary">Central</span>{' '}
							<span className="text-2xl">(Beta)</span>
						</h1>
						<p>Find the latest matches and results for all your favorite sports.</p>
					</header>
					<Tabs
						value={region}
						onValueChange={(value) => {
							const nextRegion = value as Region;

							setRegion(nextRegion);

							setSport(DEFAULT_SPORT_BY_REGION[nextRegion]);

							setStatus('live');
						}}
					>
						<TabsList className="border border-foreground bg-primary text-foreground">
							<TabsTrigger value="india" className="gap-2">
								<ReactCountryFlag
									countryCode="IN"
									svg
									style={{ width: '1.25rem', height: '1.25rem' }}
								/>
								India
							</TabsTrigger>

							<TabsTrigger value="world" className="gap-2">
								<Globe size={20} />
								World
							</TabsTrigger>
						</TabsList>
					</Tabs>

					<Tabs value={sport} onValueChange={setSport}>
						<TabsList className="flex h-auto flex-wrap border border-foreground bg-background text-foreground">
							{currentSports.map((sportName) => (
								<TabsTrigger
									key={sportName}
									value={sportName}
									className="capitalize data-[state=active]:bg-primary"
								>
									{sportIcons[sportName] ? (
										<span className="mr-2 inline-flex">
											{(() => {
												const Icon = sportIcons[sportName];
												return <Icon size={20} />;
											})()}
										</span>
									) : null}

									{sportName}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>

					<Tabs
						value={status}
						onValueChange={(value) => setStatus(value as MatchStatusTab)}
					>
						<TabsList className="bg-[var(--omkraft-indigo-600)] text-foreground">
							<TabsTrigger value="live">Live</TabsTrigger>
							<TabsTrigger value="upcoming">Upcoming</TabsTrigger>
							<TabsTrigger value="history">History</TabsTrigger>
						</TabsList>
					</Tabs>

					<div className="space-y-4">
						{loading && (
							<div className="flex items-center gap-3 text-sm">
								<Spinner className="inline size-6" /> Loading matches...
							</div>
						)}

						{error && (
							<OmkraftAlert error={error} fallbackTitle="Failed to load matches" />
						)}

						{!loading && !error && (
							<div className="space-y-4">
								{filteredMatches.length === 0 ? (
									<p className="text-sm text-background/80">
										{status === 'live'
											? `No live ${sport} matches are happening right now.`
											: status === 'upcoming'
												? `No upcoming ${sport} fixtures are available in the next 6 months.`
												: `No ${sport} history is available from the last 30 days.`}
									</p>
								) : null}

								{Object.entries(groupedMatches).map(([league, leagueMatches]) => (
									<section key={league} className="space-y-4">
										<LeagueSectionHeader
											league={league}
											matchCount={leagueMatches.length}
											leagueLogo={leagueMatches[0]?.leagueLogo}
										/>

										<div className="grid gap-6 lg:grid-cols-2">
											{leagueMatches.map((match) => (
												<MatchCard
													key={match._id}
													match={match}
													activeStatus={status}
												/>
											))}
										</div>
									</section>
								))}
							</div>
						)}
					</div>
				</div>
			</section>
		</main>
	);
}
