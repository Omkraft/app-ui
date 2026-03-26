import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { parseISO } from 'date-fns';
import {
	CalendarDays,
	ChevronDown,
	Clock3,
	Compass,
	Flag,
	Lightbulb,
	Orbit,
	MoonStar,
	Sparkles,
	ScrollText,
	Sunrise,
	Sunset,
	TriangleAlert,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import aquariusSvg from '@/assets/zodiac-signs/aquarius.svg';
import ariesSvg from '@/assets/zodiac-signs/aries.svg';
import cancerSvg from '@/assets/zodiac-signs/cancer.svg';
import capricornSvg from '@/assets/zodiac-signs/capricorn.svg';
import geminiSvg from '@/assets/zodiac-signs/gemini.svg';
import leoSvg from '@/assets/zodiac-signs/leo.svg';
import libraSvg from '@/assets/zodiac-signs/libra.svg';
import piscesSvg from '@/assets/zodiac-signs/pisces.svg';
import sagittariusSvg from '@/assets/zodiac-signs/sagittarius.svg';
import scorpioSvg from '@/assets/zodiac-signs/scorpio.svg';
import taurusSvg from '@/assets/zodiac-signs/taurus.svg';
import virgoSvg from '@/assets/zodiac-signs/virgo.svg';

import { fetchDailyHoroscopes, fetchPanchang } from '@/api/panchang';
import { StartDatePicker } from '@/components/subscription/StartDatePicker';
import {
	KaranaIcon,
	NakshatraIcon,
	RashiIcon,
	TithiIcon,
	YogaIcon,
} from '@/components/panchang/PanchangIcons';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import OmkraftAlert from '@/components/ui/omkraft-alert';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { reportUiError, toDisplayError } from '@/lib/error';
import type { DailyHoroscopeResponse, PanchangData, PanchangTimeRange } from '@/types/panchang';

type PanchangCoords = {
	lat: number;
	lng: number;
	source: 'current' | 'cached' | 'reference';
};

type MoonPhaseName =
	| 'New Moon'
	| 'Waxing Crescent'
	| 'First Quarter'
	| 'Waxing Gibbous'
	| 'Full Moon'
	| 'Waning Gibbous'
	| 'Last Quarter'
	| 'Waning Crescent';

const moonPhaseImages: Record<string, string> = {
	'new-moon': '/moon-phases/new.png',
	'waxing-crescent': '/moon-phases/waxing-crescent.png',
	'first-quarter': '/moon-phases/first-quarter.png',
	'waxing-gibbous': '/moon-phases/waxing-gibbous.png',
	'full-moon': '/moon-phases/full.png',
	'waning-gibbous': '/moon-phases/waning-gibbous.png',
	'last-quarter': '/moon-phases/last-quarter.png',
	'waning-crescent': '/moon-phases/waning-crescent.png',
};

const PANCHANG_REFERENCE_COORDS: PanchangCoords = {
	lat: 23.1765,
	lng: 75.7885,
	source: 'reference',
};

const SIMPLIFIED_PANCHANG_NOTE =
	'This is a simplified Panchang that highlights key daily timings and guidance. It is not a full muhurat calculator, so specialized decisions such as vehicle purchases, griha pravesh, marriage, or other major rituals may differ from a detailed Panchang or regional almanac.';
const MOON_PHASES: Array<{
	key:
		| 'new-moon'
		| 'waxing-crescent'
		| 'first-quarter'
		| 'waxing-gibbous'
		| 'full-moon'
		| 'waning-gibbous'
		| 'last-quarter'
		| 'waning-crescent';
	label: MoonPhaseName;
}> = [
	{ key: 'new-moon', label: 'New Moon' },
	{ key: 'waxing-crescent', label: 'Waxing Crescent' },
	{ key: 'first-quarter', label: 'First Quarter' },
	{ key: 'waxing-gibbous', label: 'Waxing Gibbous' },
	{ key: 'full-moon', label: 'Full Moon' },
	{ key: 'waning-gibbous', label: 'Waning Gibbous' },
	{ key: 'last-quarter', label: 'Last Quarter' },
	{ key: 'waning-crescent', label: 'Waning Crescent' },
];
const ZODIAC_SIGNS = [
	{ key: 'aries', label: 'Aries', image: ariesSvg },
	{ key: 'taurus', label: 'Taurus', image: taurusSvg },
	{ key: 'gemini', label: 'Gemini', image: geminiSvg },
	{ key: 'cancer', label: 'Cancer', image: cancerSvg },
	{ key: 'leo', label: 'Leo', image: leoSvg },
	{ key: 'virgo', label: 'Virgo', image: virgoSvg },
	{ key: 'libra', label: 'Libra', image: libraSvg },
	{ key: 'scorpio', label: 'Scorpio', image: scorpioSvg },
	{ key: 'sagittarius', label: 'Sagittarius', image: sagittariusSvg },
	{ key: 'capricorn', label: 'Capricorn', image: capricornSvg },
	{ key: 'aquarius', label: 'Aquarius', image: aquariusSvg },
	{ key: 'pisces', label: 'Pisces', image: piscesSvg },
] as const;
const PANCHANG_TABS = [
	{ key: 'panchang', label: 'Panchang' },
	{ key: 'horoscope', label: 'Horoscope' },
] as const;

function getTodayDateString() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

function getCachedCoords(): PanchangCoords | null {
	try {
		const raw = localStorage.getItem('omkraft-panchang-location');
		if (!raw) return null;

		const parsed = JSON.parse(raw) as { lat?: number; lng?: number } | null;
		if (!parsed || typeof parsed.lat !== 'number' || typeof parsed.lng !== 'number') {
			return null;
		}

		return {
			lat: parsed.lat,
			lng: parsed.lng,
			source: 'cached',
		};
	} catch {
		return null;
	}
}

function cacheCoords(coords: PanchangCoords) {
	localStorage.setItem(
		'omkraft-panchang-location',
		JSON.stringify({ lat: coords.lat, lng: coords.lng })
	);
}

function requestCurrentCoords(): Promise<PanchangCoords> {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error('Geolocation is not available in this browser.'));
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const coords = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
					source: 'current' as const,
				};
				cacheCoords(coords);
				resolve(coords);
			},
			(error) => {
				reject(new Error(error.message));
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 300000,
			}
		);
	});
}

function formatRange(range: Pick<PanchangTimeRange, 'start' | 'end'>) {
	if (!range.start || !range.end) {
		return 'Unavailable';
	}

	return `${formatTime(range.start)} - ${formatTime(range.end)}`;
}

function formatTime(value: string | null) {
	if (!value) {
		return 'Unavailable';
	}

	const match = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
	if (!match) {
		return value;
	}

	const [, hoursPart, minutes] = match;
	const hours = Number(hoursPart);

	if (Number.isNaN(hours) || hours < 0 || hours > 23) {
		return value;
	}

	const period = hours >= 12 ? 'PM' : 'AM';
	const displayHour = hours % 12 || 12;

	return `${displayHour}:${minutes} ${period}`;
}

function getRangeBadgeClass(quality: PanchangTimeRange['quality']) {
	if (quality === 'good') {
		return 'border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success-foreground)]';
	}

	if (quality === 'avoid') {
		return 'border-[var(--warning-border)] bg-[var(--warning-bg)] text-[var(--warning-foreground)]';
	}

	return 'border-[var(--info-border)] bg-[var(--info-bg)] text-[var(--info-foreground)]';
}

function formatCoordinatePair(lat: number, lng: number) {
	return `Latitude ${lat.toFixed(2)}, Longitude ${lng.toFixed(2)}`;
}

function formatDisplayDate(value: string) {
	const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if (!match) {
		return value;
	}

	const [, year, month, day] = match;
	return `${day}-${month}-${year}`;
}

function formatObservedRegions(regions: string[]) {
	if (regions.length === 1 && regions[0] === 'Across India') {
		return 'Observed across India';
	}

	return `Observed in ${regions.join(', ')}`;
}

function getObservanceSectionTitle(count: number) {
	return count === 1 ? 'Significant Observance' : 'Significant Observances';
}

function getPurchaseGuidance(panchang: PanchangData) {
	const bestTimes = panchang.goodTimes.filter((item) => item.start && item.end).slice(0, 2);
	const avoidTimes = [panchang.rahuKalam, panchang.yamagandam, panchang.gulikaKalam].filter(
		(item) => item.start && item.end
	);

	return {
		summary:
			bestTimes.length > 0
				? 'Use these windows only as light planning guidance for non-ritual purchases such as a vehicle, TV, computer, phone, or appliance. For a true purchase muhurat, consult a detailed Panchang.'
				: 'This simplified Panchang does not show a clearly supportive purchase window right now. For an important purchase muhurat, rely on a detailed Panchang.',
		bestTimes,
		avoidTimes,
	};
}

function getMoonPhaseFromTithiNumber(tithiNumber: number): MoonPhaseName {
	if (tithiNumber === 30) {
		return 'New Moon';
	}

	if (tithiNumber <= 4) {
		return 'Waxing Crescent';
	}

	if (tithiNumber <= 8) {
		return 'First Quarter';
	}

	if (tithiNumber <= 11) {
		return 'Waxing Gibbous';
	}

	if (tithiNumber <= 15) {
		return 'Full Moon';
	}

	if (tithiNumber <= 19) {
		return 'Waning Gibbous';
	}

	if (tithiNumber <= 23) {
		return 'Last Quarter';
	}

	if (tithiNumber <= 29) {
		return 'Waning Crescent';
	}

	return 'New Moon';
}

function PanchangTimeCard({ item }: { item: PanchangTimeRange }) {
	return (
		<Card className="border-muted-foreground bg-muted">
			<CardHeader className="space-y-3 p-4 lg:p-6">
				<div className="flex items-start justify-between gap-3">
					<div>
						<CardTitle className="text-lg">{item.label}</CardTitle>
						<CardDescription className="text-foreground/80">
							{item.reason}
						</CardDescription>
					</div>
					<Badge className={getRangeBadgeClass(item.quality)}>
						{item.quality === 'good'
							? 'Auspicious'
							: item.quality === 'avoid'
								? 'Avoid'
								: 'Watch'}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="p-4 pt-0 lg:px-6 lg:pb-6">
				<p className="text-xl font-semibold">{formatRange(item)}</p>
			</CardContent>
		</Card>
	);
}

function PanchangValueCard({
	label,
	value,
	icon,
}: {
	label: string;
	value: string;
	icon: React.ReactNode;
}) {
	return (
		<Card className="border-muted-foreground bg-muted">
			<CardHeader className="p-4">
				<div className="flex flex-col text-center items-center">
					<div className="flex h-12 w-12 shrink-0 items-center justify-center text-primary [&_svg]:h-full [&_svg]:w-full">
						{icon}
					</div>
					<div className="grid gap-1">
						<CardDescription className="text-foreground/80">{label}</CardDescription>
						<CardTitle className="text-lg font-semibold">{value}</CardTitle>
					</div>
				</div>
			</CardHeader>
		</Card>
	);
}

export default function Panchang() {
	const [selectedDate, setSelectedDate] = useState(getTodayDateString);
	const [coords, setCoords] = useState<PanchangCoords | null>(null);
	const [panchang, setPanchang] = useState<PanchangData | null>(null);
	const [horoscopes, setHoroscopes] = useState<DailyHoroscopeResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [horoscopesLoading, setHoroscopesLoading] = useState(false);
	const [error, setError] = useState<unknown | null>(null);
	const [horoscopesError, setHoroscopesError] = useState<unknown | null>(null);
	const [activeTab, setActiveTab] = useState<'panchang' | 'horoscope'>('panchang');
	const [daytimeChoghadiyaOpen, setDaytimeChoghadiyaOpen] = useState(
		() => typeof window !== 'undefined' && window.innerWidth >= 1024
	);
	const panchangSectionRef = useRef<HTMLDivElement | null>(null);
	const panchangHeadingRef = useRef<HTMLHeadingElement | null>(null);
	const panchangTabsSentinelRef = useRef<HTMLDivElement | null>(null);
	const [isTabsSticky, setIsTabsSticky] = useState(false);

	const locationHint = useMemo(() => {
		if (!coords) {
			return 'Resolving location...';
		}

		if (coords.source === 'current') {
			return `Current location: ${formatCoordinatePair(coords.lat, coords.lng)}`;
		}

		if (coords.source === 'cached') {
			return `Saved location: ${formatCoordinatePair(coords.lat, coords.lng)}`;
		}

		return `Reference location: ${formatCoordinatePair(coords.lat, coords.lng)}`;
	}, [coords]);

	const refreshCoords = useCallback(async () => {
		try {
			setError(null);
			const nextCoords = await requestCurrentCoords();
			setCoords(nextCoords);
		} catch (locationError) {
			const cachedCoords = getCachedCoords();
			if (cachedCoords) {
				setCoords(cachedCoords);
				return;
			}

			setCoords(PANCHANG_REFERENCE_COORDS);
			reportUiError('panchang:location', locationError);
		}
	}, []);

	const loadPanchang = useCallback(
		async (activeCoords: PanchangCoords, signal?: AbortSignal) => {
			setLoading(true);
			setError(null);

			try {
				const data = await fetchPanchang(
					{
						date: selectedDate,
						lat: activeCoords.lat,
						lng: activeCoords.lng,
					},
					signal
				);
				setPanchang(data);
			} catch (fetchError) {
				if (signal?.aborted) {
					return;
				}

				reportUiError('panchang:load', fetchError, {
					date: selectedDate,
					lat: activeCoords.lat,
					lng: activeCoords.lng,
				});
				setError(toDisplayError(fetchError, 'Failed to load Panchang.'));
			} finally {
				if (!signal?.aborted) {
					setLoading(false);
				}
			}
		},
		[selectedDate]
	);

	const loadHoroscopes = useCallback(async (signal?: AbortSignal) => {
		setHoroscopesLoading(true);
		setHoroscopesError(null);

		try {
			const data = await fetchDailyHoroscopes(signal);
			setHoroscopes(data);
		} catch (fetchError) {
			if (signal?.aborted) {
				return;
			}

			reportUiError('panchang:horoscopes', fetchError);
			setHoroscopesError(toDisplayError(fetchError, 'Failed to load daily horoscopes.'));
		} finally {
			if (!signal?.aborted) {
				setHoroscopesLoading(false);
			}
		}
	}, []);

	useEffect(() => {
		let isMounted = true;
		void (async () => {
			const nextCoords =
				(await requestCurrentCoords().catch(() => getCachedCoords())) ??
				PANCHANG_REFERENCE_COORDS;
			if (isMounted) {
				setCoords(nextCoords);
			}
		})();

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		if (!coords) {
			return undefined;
		}

		const controller = new AbortController();
		void loadPanchang(coords, controller.signal);

		return () => {
			controller.abort();
		};
	}, [coords, loadPanchang]);

	useEffect(() => {
		const handleResize = () => {
			setDaytimeChoghadiyaOpen(window.innerWidth >= 1024);
		};

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		if (activeTab !== 'horoscope' || horoscopes) {
			return undefined;
		}

		const controller = new AbortController();
		void loadHoroscopes(controller.signal);

		return () => {
			controller.abort();
		};
	}, [activeTab, horoscopes, loadHoroscopes]);

	useEffect(() => {
		const handleScroll = () => {
			const sentinel = panchangTabsSentinelRef.current;
			if (!sentinel) {
				return;
			}

			setIsTabsSticky(sentinel.getBoundingClientRect().top <= 0);
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const todaysPanchang = panchang
		? [
				{
					label: 'Tithi',
					value: panchang.tithi.name,
					icon: <TithiIcon className="h-full w-full" />,
				},
				{
					label: 'Nakshatra',
					value: panchang.nakshatra.name,
					icon: <NakshatraIcon className="h-full w-full" />,
				},
				{
					label: 'Yoga',
					value: panchang.yoga.name,
					icon: <YogaIcon className="h-full w-full" />,
				},
				{
					label: 'Karana',
					value: panchang.karana.name,
					icon: <KaranaIcon className="h-full w-full" />,
				},
				{
					label: 'Moon Rashi',
					value: panchang.moonRashi.name,
					icon: <RashiIcon rashi={panchang.moonRashi.name} className="h-full w-full" />,
				},
			]
		: [];

	const purchaseGuidance = panchang ? getPurchaseGuidance(panchang) : null;
	const currentMoonPhase = panchang ? getMoonPhaseFromTithiNumber(panchang.tithi.number) : null;
	const orderedHoroscopes = horoscopes
		? ZODIAC_SIGNS.map((sign) => ({
				...sign,
				entry: horoscopes.signs.find((item) => item.sign.toLowerCase() === sign.key),
			})).filter((item) => item.entry)
		: [];

	const scrollContentToTop = useCallback(() => {
		const target = panchangSectionRef.current ?? panchangHeadingRef.current;
		if (!target) {
			return;
		}

		panchangHeadingRef.current?.focus({ preventScroll: true });
		const targetTop = Math.max(target.getBoundingClientRect().top + window.scrollY - 96, 0);
		window.scrollTo({
			top: targetTop,
			behavior: 'smooth',
		});
	}, []);

	const handleTabChange = useCallback(
		(value: string) => {
			setActiveTab(value as 'panchang' | 'horoscope');
			window.requestAnimationFrame(() => {
				scrollContentToTop();
			});
		},
		[scrollContentToTop]
	);

	return (
		<main className="min-h-[calc(100vh-178px)] bg-background">
			<section className="flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link to="/dashboard">Dashboard</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Daily Panchang</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</section>
			<section className="text-foreground flex items-center py-6">
				<div ref={panchangSectionRef} className="app-container grid gap-6 items-center">
					{/* ========================= */}
					{/* Page Header */}
					{/* ========================= */}
					<header className="space-y-4">
						<h1
							ref={panchangHeadingRef}
							tabIndex={-1}
							className="text-4xl font-semibold focus:outline-none"
						>
							Daily <span className="text-primary">Panchang</span>
						</h1>
						<p className="text-foreground/80">
							A local, calculation-based Panchang and daily horoscope view for the
							selected day and your location.
						</p>
					</header>
				</div>
			</section>

			<Tabs value={activeTab} onValueChange={handleTabChange} className="text-foreground">
				{!(loading && !panchang) ? (
					<>
						<div
							ref={panchangTabsSentinelRef}
							aria-hidden="true"
							className="app-container h-px w-full"
						/>
						<div
							className={`sticky top-0 z-20 w-full max-w-full overflow-hidden${
								isTabsSticky ? ' bg-background' : ''
							}`}
						>
							<div
								className={`${
									isTabsSticky
										? 'border-b border-[var(--omkraft-border-subtle)] py-3'
										: 'py-3'
								}`}
							>
								<div className="app-container">
									<TabsList className="h-auto w-full flex-wrap border border-muted-foreground bg-primary text-foreground">
										{PANCHANG_TABS.map((tab) => (
											<TabsTrigger
												key={tab.key}
												value={tab.key}
												className="justify-start lg:justify-center"
											>
												{tab.label}
											</TabsTrigger>
										))}
									</TabsList>
								</div>
							</div>
						</div>

						{activeTab === 'panchang' ? (
							<section className="py-6 text-foreground">
								<div className="app-container">
									<Card className="border-muted-foreground bg-muted">
										<CardContent className="grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-end lg:p-6">
											<div className="grid gap-3">
												<div className="flex items-center gap-2 text-sm text-foreground/80">
													<Compass className="h-6 w-6" />
													<span>{locationHint}</span>
												</div>
												<div className="flex items-center gap-2 text-sm text-foreground/80">
													<CalendarDays className="h-6 w-6" />
													<span>
														{panchang?.timeZone ??
															'Timezone will appear after calculation'}
													</span>
												</div>
											</div>
											<div className="flex flex-col gap-3 lg:flex-row">
												<div>
													<StartDatePicker
														value={parseISO(selectedDate)}
														onChange={(date) => {
															const year = date.getFullYear();
															if (year < 1900 || year > 2100) {
																return;
															}

															const isoDate = new Date(
																Date.UTC(
																	date.getFullYear(),
																	date.getMonth(),
																	date.getDate()
																)
															)
																.toISOString()
																.slice(0, 10);
															setSelectedDate(isoDate);
														}}
													/>
												</div>
												<Button
													variant="outline"
													onClick={() => void refreshCoords()}
												>
													Use Current Location
												</Button>
											</div>
										</CardContent>
									</Card>
								</div>
							</section>
						) : null}
					</>
				) : null}

				{loading && !panchang ? (
					<section className="py-6 text-foreground">
						<div className="app-container">
							<p className="flex items-center gap-2 text-foreground/80">
								<Spinner className="inline size-6" />
								Calculating Panchang...
							</p>
						</div>
					</section>
				) : null}

				{error ? (
					<section className="bg-[var(--omkraft-red-900)] py-6 text-foreground">
						<div className="app-container">
							<OmkraftAlert error={error} fallbackTitle="Panchang unavailable" />
						</div>
					</section>
				) : null}

				{panchang && activeTab === 'panchang' ? (
					<section className="py-6 text-foreground bg-[var(--omkraft-amber-100)]">
						<div className="app-container">
							<OmkraftAlert
								severity="warning"
								error={SIMPLIFIED_PANCHANG_NOTE}
								fallbackTitle="Important Note"
							/>
						</div>
					</section>
				) : null}

				{panchang ? (
					<>
						{activeTab === 'panchang' ? (
							<>
								{panchang.observances.length > 0 ? (
									<section className="bg-[var(--omkraft-blue-800)] py-6 text-foreground">
										<div className="app-container grid gap-4">
											<div className="flex items-center gap-2">
												<Flag className="h-8 w-8 text-[var(--omkraft-blue-100)]" />
												<h2 className="text-2xl font-semibold">
													{getObservanceSectionTitle(
														panchang.observances.length
													)}
												</h2>
											</div>
											<div
												className={`grid gap-4 ${
													panchang.observances.length > 1
														? 'lg:grid-cols-2'
														: ''
												}`}
											>
												{panchang.observances.map((item) => (
													<Card
														key={item.id}
														className="border-muted-foreground bg-muted"
													>
														<CardHeader className="p-4 lg:p-6">
															<CardTitle className="text-lg">
																{item.name}
															</CardTitle>
															<CardDescription className="text-base text-foreground/80">
																{item.significance}
															</CardDescription>
														</CardHeader>
														<CardContent className="p-4 pt-0 lg:px-6 lg:pb-6">
															<p className="text-sm text-foreground/75">
																{formatObservedRegions(
																	item.regions
																)}
															</p>
														</CardContent>
													</Card>
												))}
											</div>
										</div>
									</section>
								) : null}

								<section className="bg-[var(--omkraft-blue-900)] py-6 text-foreground">
									<div className="app-container grid gap-4">
										<div className="flex items-center gap-2">
											<MoonStar className="h-8 w-8 text-[var(--omkraft-blue-200)]" />
											<h2 className="text-2xl font-semibold">
												Today's Panchang
											</h2>
										</div>
										<div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
											{todaysPanchang.map((item) => (
												<PanchangValueCard
													key={item.label}
													label={item.label}
													value={item.value}
													icon={item.icon}
												/>
											))}
										</div>
									</div>
								</section>

								<section className="bg-[var(--omkraft-indigo-900)] py-6 text-foreground">
									<div className="app-container grid gap-4">
										<div className="flex items-center gap-2">
											<Clock3 className="h-8 w-8 text-[var(--omkraft-indigo-200)]" />
											<h2 className="text-2xl font-semibold">
												Sunrise / Sunset
											</h2>
										</div>
										<div className="grid gap-4 lg:grid-cols-2">
											<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted lg:flex-col border-muted-foreground">
												<Sunrise className="w-7 h-7 text-[var(--omkraft-yellow-500)]" />
												<div>
													<p className="text-sm text-foreground/80">
														Sunrise
													</p>
													<p className="text-lg font-semibold">
														{formatTime(panchang.sunrise)}
													</p>
												</div>
											</Card>
											<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted lg:flex-col border-muted-foreground">
												<Sunset className="w-7 h-7 text-[var(--omkraft-orange-500)]" />
												<div>
													<p className="text-sm text-foreground/80">
														Sunset
													</p>
													<p className="text-lg font-semibold">
														{formatTime(panchang.sunset)}
													</p>
												</div>
											</Card>
										</div>
									</div>
								</section>

								{currentMoonPhase ? (
									<section className="bg-[var(--omkraft-indigo-900)] py-6 text-foreground">
										<div className="app-container grid gap-4">
											<div className="flex items-center gap-2">
												<Orbit className="h-8 w-8 text-[var(--omkraft-blue-100)]" />
												<h2 className="text-2xl font-semibold">
													Moon Phase
												</h2>
											</div>
											<p className="text-sm text-[var(--omkraft-indigo-100)]">
												Today's moon phase is{' '}
												<span className="font-semibold text-foreground">
													{currentMoonPhase}
												</span>
												.
											</p>
											<div className="grid grid-cols-1 gap-3 lg:grid-cols-8 lg:gap-4">
												{MOON_PHASES.map((phase) => {
													const isCurrent =
														phase.label === currentMoonPhase;

													return (
														<Card
															key={phase.key}
															className={`border-muted-foreground bg-muted ${isCurrent ? 'ring-2 ring-[var(--omkraft-blue-100)]' : ''}`}
														>
															<CardContent className="flex flex-row items-center justify-start gap-4 p-4 text-left lg:flex-col lg:justify-center lg:gap-3 lg:text-center">
																<div className="flex h-10 w-10 shrink-0 items-center justify-center lg:h-12 lg:w-12">
																	<img
																		src={
																			moonPhaseImages[
																				phase.key
																			]
																		}
																		alt={phase.label}
																		className="h-full w-full object-contain"
																	/>
																</div>
																<div className="flex flex-1 items-center justify-between gap-3 lg:grid lg:gap-1">
																	<p
																		className={`text-sm font-medium ${isCurrent ? 'text-foreground' : 'text-[var(--omkraft-indigo-100)]'}`}
																	>
																		{phase.label}
																	</p>
																	{isCurrent ? (
																		<Badge className="shrink-0 justify-center border-[var(--info-border)] bg-[var(--info-bg)] text-[var(--info-foreground)]">
																			Today
																		</Badge>
																	) : null}
																</div>
															</CardContent>
														</Card>
													);
												})}
											</div>
										</div>
									</section>
								) : null}
							</>
						) : null}

						{activeTab === 'horoscope' ? (
							<section className="bg-[var(--omkraft-indigo-900)] py-6 text-foreground">
								<div className="app-container grid gap-4">
									<div className="flex items-center gap-2">
										<ScrollText className="h-8 w-8 text-foreground" />
										<h2 className="text-2xl font-semibold">
											Today's Horoscope
										</h2>
									</div>
									{horoscopesError ? (
										<OmkraftAlert
											error={horoscopesError}
											fallbackTitle="Horoscope unavailable"
										/>
									) : null}
									{horoscopesLoading && !horoscopes ? (
										<p className="flex items-center gap-2 text-sm text-[var(--omkraft-blue-100)]">
											<Spinner className="inline size-5" />
											Loading daily horoscope...
										</p>
									) : null}
									{orderedHoroscopes.length > 0 ? (
										<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
											{orderedHoroscopes.map(
												({ key, label, image, entry }) => (
													<Card
														key={key}
														className="overflow-hidden border border-primary bg-foreground text-background transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
													>
														<CardHeader className="space-y-4 p-4 lg:p-6">
															<div className="flex items-center gap-4">
																<div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-muted-foreground/40 bg-background/5 p-3">
																	<img
																		src={image}
																		alt={label}
																		className="h-full w-full object-contain"
																	/>
																</div>
																<div className="space-y-1">
																	<CardTitle className="text-xl text-background">
																		{label}
																	</CardTitle>
																	<CardDescription className="text-background/75">
																		{formatDisplayDate(
																			entry?.date ??
																				horoscopes?.date ??
																				''
																		)}
																	</CardDescription>
																</div>
															</div>
														</CardHeader>
														<CardContent className="p-4 pt-0 lg:px-6 lg:pb-6">
															<p className="text-sm leading-6 text-background/88">
																{entry?.horoscope}
															</p>
														</CardContent>
													</Card>
												)
											)}
										</div>
									) : null}
								</div>
							</section>
						) : null}

						{activeTab === 'panchang' ? (
							<>
								<section className="bg-[var(--omkraft-mint-900)] py-6 text-foreground">
									<div className="app-container grid gap-4">
										<div className="flex items-center gap-2">
											<Sparkles className="h-8 w-8 text-[var(--omkraft-mint-200)]" />
											<h2 className="text-2xl font-semibold">
												Auspicious Times
											</h2>
										</div>
										<div className="grid gap-4 lg:grid-cols-3">
											{panchang.goodTimes.map((item) => (
												<PanchangTimeCard key={item.label} item={item} />
											))}
										</div>
									</div>
								</section>

								<section className="bg-[var(--omkraft-amber-900)] py-6 text-foreground">
									<div className="app-container grid gap-4">
										<div className="flex items-center gap-2">
											<TriangleAlert className="h-8 w-8 text-[var(--omkraft-amber-200)]" />
											<h2 className="text-2xl font-semibold">
												Inauspicious Times
											</h2>
										</div>
										<div className="grid gap-4 lg:grid-cols-3">
											{[
												panchang.rahuKalam,
												panchang.yamagandam,
												panchang.gulikaKalam,
											].map((item) => (
												<PanchangTimeCard key={item.label} item={item} />
											))}
										</div>
									</div>
								</section>

								<section className="bg-[var(--omkraft-indigo-500)] py-6 text-foreground">
									<div className="app-container grid gap-4">
										<Collapsible
											open={daytimeChoghadiyaOpen}
											onOpenChange={setDaytimeChoghadiyaOpen}
											className="w-full"
										>
											<CollapsibleTrigger asChild>
												<button className="flex w-full items-start justify-between gap-4 text-left hover:text-background">
													<div className="grid gap-3">
														<div className="flex items-center gap-2">
															<CalendarDays className="h-8 w-8" />
															<h2 className="text-2xl font-semibold">
																Full Daytime Choghadiya
															</h2>
														</div>
														<p className="text-sm">
															The full daytime Choghadiya schedule
															helps explain time windows that may not
															appear in the shorter auspicious and
															avoid summaries above.
														</p>
													</div>
													<ChevronDown
														className={`mt-1 size-6 shrink-0 transition-transform duration-200 ${daytimeChoghadiyaOpen ? 'rotate-180' : ''}`}
													/>
												</button>
											</CollapsibleTrigger>
											<CollapsibleContent className="mt-4 border-t border-border pt-4">
												<div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
													{panchang.daytimeChoghadiya.map((item) => (
														<PanchangTimeCard
															key={item.label}
															item={item}
														/>
													))}
												</div>
											</CollapsibleContent>
										</Collapsible>
									</div>
								</section>

								<section className="py-6 text-foreground bg-accent">
									<div className="app-container grid gap-4">
										<div className="flex items-center gap-2">
											<Lightbulb className="h-8 w-8 text-[var(--omkraft-mint-100)]" />
											<h2 className="text-2xl font-semibold">
												Today's Guidance
											</h2>
										</div>
										<Card className="border-muted-foreground bg-background">
											<CardHeader className="p-4 lg:p-6">
												<CardTitle className="text-lg">
													General Day Guidance
												</CardTitle>
												<CardDescription className="text-base text-muted-foreground">
													{panchang.guidance.summary}
												</CardDescription>
											</CardHeader>
											<CardContent className="grid gap-6 p-4 pt-0 lg:grid-cols-2 lg:px-6 lg:pb-6">
												<div className="grid gap-3">
													<p className="font-semibold text-accent">
														Today is generally favorable for
													</p>
													<ul className="grid gap-2 pl-5 text-sm list-disc">
														{panchang.guidance.favorable.map((item) => (
															<li key={item}>{item}</li>
														))}
													</ul>
												</div>
												<div className="grid gap-3">
													<p className="font-semibold text-destructive">
														Avoid
													</p>
													<ul className="grid gap-2 pl-5 text-sm list-disc">
														{panchang.guidance.avoid.map((item) => (
															<li key={item}>{item}</li>
														))}
													</ul>
												</div>
											</CardContent>
										</Card>
										{purchaseGuidance ? (
											<Card className="border-muted-foreground bg-background">
												<CardHeader className="p-4 lg:p-6">
													<CardTitle className="text-lg">
														Buying New Things Today
													</CardTitle>
													<CardDescription className="text-base text-muted-foreground">
														{purchaseGuidance.summary}
													</CardDescription>
												</CardHeader>
												<CardContent className="grid gap-6 p-4 pt-0 lg:grid-cols-2 lg:px-6 lg:pb-6">
													<div className="grid gap-3">
														<p className="font-semibold text-accent">
															Prefer these time windows
														</p>
														{purchaseGuidance.bestTimes.length > 0 ? (
															<ul className="grid gap-2 pl-5 text-sm list-disc">
																{purchaseGuidance.bestTimes.map(
																	(item) => (
																		<li key={item.label}>
																			{item.label}:{' '}
																			{formatRange(item)}
																		</li>
																	)
																)}
															</ul>
														) : (
															<p className="text-sm text-muted-foreground">
																No clearly favorable buying window
																is available.
															</p>
														)}
													</div>
													<div className="grid gap-3">
														<p className="font-semibold text-destructive">
															Avoid these time windows
														</p>
														<ul className="grid gap-2 pl-5 text-sm list-disc">
															{purchaseGuidance.avoidTimes.map(
																(item) => (
																	<li key={item.label}>
																		{item.label}:{' '}
																		{formatRange(item)}
																	</li>
																)
															)}
														</ul>
													</div>
												</CardContent>
											</Card>
										) : null}
									</div>
								</section>

								<section className="bg-[var(--omkraft-navy-200)] py-6 text-background">
									<div className="app-container text-sm">
										<p>
											Calculated for {formatDisplayDate(selectedDate)} using{' '}
											{formatCoordinatePair(
												panchang.location.lat,
												panchang.location.lng
											)}{' '}
											and local astronomical calculations.
										</p>
									</div>
								</section>
							</>
						) : null}
					</>
				) : null}
			</Tabs>
		</main>
	);
}
