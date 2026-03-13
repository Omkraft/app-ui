import React, { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '@/api/client';
import { useLayoutEffect, useRef } from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card';
import { formatDate, formatTimeLocal, round } from '@/utils/format';
import { getCurrentLocation } from '@/utils/location';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import type { WeatherData } from '@/types/weather';
import { NewsSourceLogo } from '@/components/news/NewsSourceLogo';
import { getWeatherIcon } from '@/utils/weatherIcons';
import { Spinner } from '@/components/ui/spinner';
import {
	Droplets,
	Wind,
	Sun,
	Moon,
	Sunrise,
	Sunset,
	Gauge,
	Quote,
	CalendarClock,
	Umbrella,
	CircleUser,
} from 'lucide-react';
import { getWeatherTheme } from '@/utils/weatherTheme';
import { Button } from '@/components/ui/button';
import type { OnThisDayResponse } from '@/types/insights';
import { Separator } from '@radix-ui/react-separator';
import { Item, ItemContent, ItemDescription, ItemGroup } from '@/components/ui/item';
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { getNext5Hours } from '@/utils/weatherHelpers';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import OmkraftAlert from '@/components/ui/omkraft-alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { reportUiError, toDisplayError } from '@/lib/error';

interface NewsArticle {
	title: string;
	url: string;
	description: string;
	source: string;
	publishedAt: string;
	thumbnail?: string | null;
}

interface QuoteResponse {
	quote: string;
	author: string;
	authorImage: string | null;
	authorImageThumb: string | null;
}

function getNewsSourceLogoSizeClass(source: string) {
	return ['BBC News', 'Hindustan Times'].includes(source) ? 'h-4' : 'h-3';
}

function renderNewsCard(item: NewsArticle, index: number, newsView: 'comfortable' | 'compact') {
	const isBbcCard =
		newsView === 'comfortable' && item.source === 'BBC News' && Boolean(item.thumbnail);

	if (isBbcCard) {
		return (
			<div key={item.url || `news-${index}`}>
				<Card className="overflow-hidden border border-primary bg-foreground text-background transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
					<div className="flex min-h-[152px]">
						<div className="w-[112px] shrink-0 bg-[var(--omkraft-navy-700)] sm:w-[132px]">
							<img
								src={item.thumbnail || undefined}
								alt={item.title}
								className="h-full w-full object-cover"
								loading="lazy"
							/>
						</div>
						<CardHeader className="flex flex-1 justify-between p-4">
							<a
								href={item.url}
								target="_blank"
								rel="noopener noreferrer"
								className="transition-colors hover:text-primary"
							>
								<div className="flex flex-col-reverse justify-between gap-3 items-start">
									<CardTitle className="line-clamp-2 text-lg leading-snug">
										{item.title}
									</CardTitle>

									<NewsSourceLogo
										source={item.source}
										className={getNewsSourceLogoSizeClass(item.source)}
									/>
								</div>
							</a>

							<CardDescription className="mt-3 flex justify-between gap-3 text-xs text-background">
								<span>{item.source}</span>
								<span className="shrink-0">{formatDate(item.publishedAt)}</span>
							</CardDescription>
						</CardHeader>
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div key={item.url || `news-${index}`}>
			<Card className="border border-primary bg-foreground text-background transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
				{newsView === 'comfortable' && item.thumbnail && (
					<div className="overflow-hidden rounded-t-xl">
						<img
							src={item.thumbnail}
							alt={item.title}
							className="h-48 w-full object-cover lg:h-56"
							loading="lazy"
						/>
					</div>
				)}
				<CardHeader className="p-4 lg:p-6">
					<a
						href={item.url}
						target="_blank"
						rel="noopener noreferrer"
						className="transition-colors hover:text-primary"
					>
						<div className="flex flex-col-reverse justify-between gap-3">
							<CardTitle className="text-lg leading-snug">{item.title}</CardTitle>

							<NewsSourceLogo
								source={item.source}
								className={getNewsSourceLogoSizeClass(item.source)}
							/>
						</div>
					</a>

					<CardDescription className="mt-1 flex justify-between text-xs text-background">
						<span>{item.source}</span>
						<span>{formatDate(item.publishedAt)}</span>
					</CardDescription>
				</CardHeader>

				{item.description && (
					<CardContent className="p-4 lg:p-6">
						<p className="line-clamp-3 text-sm">{item.description}</p>
					</CardContent>
				)}
			</Card>
		</div>
	);
}

function DesktopNewsMasonry({
	articles,
	newsView,
}: {
	articles: NewsArticle[];
	newsView: 'comfortable' | 'compact';
}) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
	const [layout, setLayout] = useState<{
		positions: Array<{ left: number; top: number; width: number }>;
		height: number;
	}>({
		positions: [],
		height: 0,
	});

	const recomputeLayout = useCallback(() => {
		const container = containerRef.current;
		if (!container) return;

		const containerWidth = container.clientWidth;
		if (!containerWidth) return;

		const gap = 24;
		const columnCount = 2;
		const columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;
		const columnHeights = Array.from({ length: columnCount }, () => 0);

		const positions = articles.map((_, index) => {
			const item = itemRefs.current[index];
			const shortestColumnHeight = Math.min(...columnHeights);
			const columnIndex = columnHeights.indexOf(shortestColumnHeight);
			const left = columnIndex * (columnWidth + gap);
			const top = columnHeights[columnIndex];
			const itemHeight = item?.offsetHeight ?? 0;

			columnHeights[columnIndex] = top + itemHeight + gap;

			return {
				left,
				top,
				width: columnWidth,
			};
		});

		setLayout({
			positions,
			height: Math.max(0, ...columnHeights) - gap,
		});
	}, [articles]);

	useLayoutEffect(() => {
		itemRefs.current = itemRefs.current.slice(0, articles.length);
		recomputeLayout();
	}, [articles.length, newsView, recomputeLayout]);

	useEffect(() => {
		if (typeof ResizeObserver === 'undefined') return undefined;

		const observer = new ResizeObserver(() => {
			recomputeLayout();
		});

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		itemRefs.current.forEach((item) => {
			if (item) observer.observe(item);
		});

		return () => {
			observer.disconnect();
		};
	}, [articles, newsView, recomputeLayout]);

	return (
		<div
			ref={containerRef}
			className="relative"
			style={{ height: `${Math.max(layout.height, 1)}px` }}
		>
			{articles.map((item, index) => {
				const position = layout.positions[index];

				return (
					<div
						key={item.url || `desktop-${index}`}
						ref={(node) => {
							itemRefs.current[index] = node;
						}}
						className="absolute"
						style={{
							width: position ? `${position.width}px` : 'calc((100% - 24px) / 2)',
							transform: position
								? `translate(${position.left}px, ${position.top}px)`
								: undefined,
							visibility:
								layout.positions.length === articles.length ? 'visible' : 'hidden',
						}}
					>
						{renderNewsCard(item, index, newsView)}
					</div>
				);
			})}
		</div>
	);
}

const NEWS_TABS = [
	{ key: 'india', label: 'India' },
	{ key: 'global', label: 'Global' },
	{ key: 'business', label: 'Business' },
	{ key: 'technology', label: 'Technology' },
	{ key: 'entertainment', label: 'Entertainment' },
	{ key: 'sports', label: 'Sports' },
	{ key: 'science', label: 'Science' },
];

export default function Utility() {
	const weatherAccordionItems = ['forecast', 'metrix', 'sunriseset'];
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [quote, setQuote] = useState<QuoteResponse | null>(null);
	const [quoteError, setQuoteError] = useState<unknown | null>(null);
	const [newsError, setNewsError] = useState<unknown | null>(null);
	const [locationLabel, setLocationLabel] = useState<string | null>(null);
	const [weatherError, setWeatherError] = useState<unknown | null>(null);
	const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({
		india: 10,
		global: 10,
		business: 10,
		technology: 10,
		entertainment: 10,
		sports: 10,
		science: 10,
	});
	const [activeNewsTab, setActiveNewsTab] = useState('india');
	const [onThisDay, setOnThisDay] = useState<OnThisDayResponse | null>(null);
	const [onThisDayError, setOnThisDayError] = useState<unknown | null>(null);
	const [newsSections, setNewsSections] = useState<Record<string, NewsArticle[]>>({});
	const [newsView, setNewsView] = useState<'comfortable' | 'compact'>('comfortable');
	const [isDesktopNewsLayout, setIsDesktopNewsLayout] = useState(window.innerWidth >= 1024);
	const [weatherDefaultOpenItems] = useState<string[]>(
		window.innerWidth >= 1024 ? weatherAccordionItems : []
	);
	const nextFiveHours = weather ? getNext5Hours(weather) : [];

	const fetchWeather = useCallback(async () => {
		setWeather(null);
		setWeatherError(null);
		try {
			const { latitude, longitude, cityName, state, countryCode } =
				await getCurrentLocation();

			const locationParts = [cityName, state, countryCode].filter(Boolean);
			const formattedLocation =
				locationParts.length > 0 ? locationParts.join(', ') : 'Unknown';

			const weather = await apiRequest<WeatherData>(
				`/api/utility/weather?lat=${latitude}&lon=${longitude}`
			);

			setLocationLabel(formattedLocation);
			setWeather(weather);
		} catch (error) {
			reportUiError('utility:weather', error);
			setWeatherError(toDisplayError(error, 'Failed to fetch weather.'));
		}
	}, []);

	const fetchQuote = useCallback(async () => {
		setQuote(null);
		setQuoteError(null);
		try {
			const data = await apiRequest<QuoteResponse>('/api/utility/quote');
			setQuote(data);
		} catch (error) {
			reportUiError('utility:quote', error);
			setQuoteError(toDisplayError(error, 'Failed to load quote'));
		}
	}, []);

	const fetchOnThisDay = useCallback(async () => {
		setOnThisDayError(null);
		setOnThisDay(null);
		try {
			const data = await apiRequest<OnThisDayResponse>('/api/utility/on-this-day');

			setOnThisDay(data);
		} catch (error) {
			reportUiError('utility:on-this-day', error);
			setOnThisDayError(toDisplayError(error, 'Failed to fetch historical events'));
		}
	}, []);

	const fetchNews = useCallback(async (category: string) => {
		setNewsError(null);
		try {
			const data = await apiRequest<NewsArticle[]>(`/api/utility/news?category=${category}`);

			setNewsSections((prev) => ({
				...prev,
				[category]: data,
			}));
		} catch (error) {
			reportUiError('utility:news', error, { category });
			setNewsError(toDisplayError(error, 'Failed to fetch news.'));
		}
	}, []);

	useEffect(() => {
		void Promise.allSettled([
			fetchNews('india'),
			fetchNews('global'),
			fetchQuote(),
			fetchOnThisDay(),
			fetchWeather(),
		]);
		const retryHandler = () => fetchWeather();
		window.addEventListener('omkraft:retry-services', retryHandler);
		return () => {
			window.removeEventListener('omkraft:retry-services', retryHandler);
		};
	}, [fetchOnThisDay, fetchQuote, fetchWeather, fetchNews]);

	useEffect(() => {
		const handleResize = () => {
			setIsDesktopNewsLayout(window.innerWidth >= 1024);
		};

		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		if (!newsSections[activeNewsTab]) {
			fetchNews(activeNewsTab);
		}
	}, [activeNewsTab, newsSections, fetchNews]);

	useEffect(() => {
		const interval = setInterval(
			() => {
				if (document.visibilityState !== 'visible') {
					return;
				}

				Object.keys(newsSections).forEach((category) => {
					if (newsSections[category]?.length) {
						void fetchNews(category);
					}
				});
			},
			30 * 60 * 1000
		);

		return () => clearInterval(interval);
	}, [newsSections, fetchNews]);

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
								<BreadcrumbPage>Utility Hub</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</section>
			<section className="text-foreground flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					{/* ========================= */}
					{/* Page Header */}
					{/* ========================= */}
					<header className="space-y-4">
						<h1 className="text-4xl font-semibold">
							Personal <span className="text-primary">Utility Hub</span>
						</h1>
						<p className="text-muted-foreground">
							Daily essentials, in one calm place.
						</p>
					</header>
				</div>
			</section>

			{/* ================= Weather ================= */}
			<section
				className={`relative overflow-hidden text-foreground py-6 transition-all duration-700 ${getWeatherTheme(weather?.current?.weather_code, weather?.current?.is_day)}`}
			>
				<div className="app-container grid gap-6 align-items-center">
					{weather ? (
						<>
							<h2
								className={`text-3xl font-semibold${(!weather.current.weather_code || [71, 73, 75, 85, 86].includes(weather.current.weather_code)) && weather.current.is_day ? ' text-background' : ' text-foreground'}`}
							>
								Weather
							</h2>
							{/* Current */}
							<Card
								className={`${(!weather.current.weather_code || [71, 73, 75, 85, 86, 51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weather.current.weather_code)) && weather.current.is_day ? 'bg-[var(--omkraft-blue-700)] ' : 'bg-muted '}border border-foreground`}
							>
								<CardContent className="p-0">
									<div className="flex items-center justify-between p-6">
										<div className="flex flex-col gap-2">
											<div>
												<p className="text-lg font-medium">
													{locationLabel?.split(',')[0]}
												</p>
												<p className="text-sm opacity-70">
													{locationLabel?.split(',').slice(1).join(',')}
												</p>
											</div>

											<p className="text-5xl font-bold">
												{round(weather.current.temperature_2m)}°C
											</p>
											<p>
												Feels like{' '}
												{round(weather.current.apparent_temperature)}°C
											</p>
										</div>

										<div>
											{(() => {
												const Icon = getWeatherIcon(
													weather.current.weather_code,
													weather.current.is_day
												);
												return <Icon size={80} />;
											})()}
										</div>
									</div>

									<div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-6">
										{nextFiveHours.map((hour, index) => (
											<React.Fragment key={hour.time.toISOString()}>
												<div className="flex justify-around lg:block space-y-2 text-center justify-items-center items-center">
													<div className="text-sm opacity-80">
														{hour.time.toLocaleTimeString('en-IN', {
															hour: 'numeric',
															hour12: true,
														})}
													</div>

													<div className="text-center">
														{(() => {
															const Icon = getWeatherIcon(
																hour.weather_code,
																weather.current.is_day
															);
															return <Icon size={30} />;
														})()}
													</div>

													<div className="font-semibold">
														{Math.round(hour.temperature)}°
													</div>
												</div>
												{index !== nextFiveHours.length - 1 && (
													<Separator className="lg:hidden border" />
												)}
											</React.Fragment>
										))}
									</div>
								</CardContent>
							</Card>

							<Accordion
								type="multiple"
								defaultValue={weatherDefaultOpenItems}
								className={`rounded-xl border border-foreground${(!weather.current.weather_code || [71, 73, 75, 85, 86, 51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weather.current.weather_code)) && weather.current.is_day ? ' bg-[var(--omkraft-blue-700)]' : ' bg-muted'}`}
							>
								<AccordionItem
									value="forecast"
									className="border-b px-6 last:border-b-0"
								>
									<AccordionTrigger className="text-2xl font-semibold hover:no-underline">
										5-Day Forecast
									</AccordionTrigger>
									<AccordionContent className="pb-6">
										<div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
											{weather.daily.time
												.slice(1, 6)
												.map((day: string, index: number) => (
													<Card
														key={day}
														className="flex justify-around lg:block p-4 space-y-2 text-center bg-muted items-center"
													>
														<p className="text-lg font-semibold">
															{new Date(day).toLocaleDateString(
																undefined,
																{
																	weekday: 'short',
																	day: '2-digit',
																	month: 'short',
																}
															)}
														</p>
														<p className="font-semibold flex items-center justify-center gap-1">
															<Sun className="w-5 h-5 text-[var(--omkraft-yellow-500)]" />
															{round(
																weather.daily.temperature_2m_max[
																	index
																],
																0
															)}
															°
														</p>
														<p className="opacity-70 flex items-center justify-center gap-1">
															<Moon className="w-5 h-5 text-[var(--omkraft-blue-300)]" />
															{round(
																weather.daily.temperature_2m_min[
																	index
																],
																0
															)}
															°
														</p>
														<p className="text-lg flex items-center justify-center gap-1">
															{(() => {
																const Icon = getWeatherIcon(
																	weather.current.weather_code,
																	weather.current.is_day
																);
																return <Icon />;
															})()}
														</p>
													</Card>
												))}
										</div>
									</AccordionContent>
								</AccordionItem>
								<AccordionItem
									value="metrix"
									className="border-b px-6 last:border-b-0"
								>
									<AccordionTrigger className="text-2xl font-semibold hover:no-underline">
										Weather Details
									</AccordionTrigger>
									<AccordionContent className="pb-6">
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
											<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted">
												<Droplets className="w-7 h-7 text-accent" />
												<div>
													<p className="text-sm opacity-70">Humidity</p>
													<p className="text-xl font-semibold">
														{weather.current.relative_humidity_2m}%
													</p>
												</div>
											</Card>

											<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted">
												<Umbrella className="w-7 h-7 text-accent" />
												<div>
													<p className="text-sm opacity-70">
														Precipitation
													</p>
													<p className="text-xl font-semibold">
														{weather.current.precipitation} mm
													</p>
												</div>
											</Card>

											<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted">
												<Wind className="w-7 h-7 text-accent" />
												<div>
													<p className="text-sm opacity-70">Wind</p>
													<p className="text-xl font-semibold">
														{round(weather.current.wind_speed_10m)} km/h
													</p>
												</div>
											</Card>

											<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted">
												<Gauge className="w-7 h-7 text-accent" />
												<div>
													<p className="text-sm opacity-70">UV Index</p>
													<p className="text-lg font-semibold">
														{round(
															weather.hourly.uv_index_clear_sky?.[0],
															0
														)}
													</p>
												</div>
											</Card>
										</div>
									</AccordionContent>
								</AccordionItem>

								<AccordionItem
									value="sunriseset"
									className="border-b px-6 last:border-b-0"
								>
									<AccordionTrigger className="text-2xl font-semibold hover:no-underline">
										Sunrise &amp; Sunset
									</AccordionTrigger>
									<AccordionContent className="pb-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted">
												<Sunrise className="w-7 h-7 text-[var(--omkraft-yellow-500)]" />
												<div>
													<p className="text-sm opacity-70">Sunrise</p>
													<p className="text-lg font-semibold">
														{weather.daily.sunrise[0] &&
															formatTimeLocal(
																weather.daily.sunrise[0]
															)}
													</p>
												</div>
											</Card>

											<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted">
												<Sunset className="w-7 h-7 text-[var(--omkraft-orange-500)]" />
												<div>
													<p className="text-sm opacity-70">Sunset</p>
													<p className="text-lg font-semibold">
														{weather.daily.sunset[0] &&
															formatTimeLocal(
																weather.daily.sunset[0]
															)}
													</p>
												</div>
											</Card>
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
							<p className="text-sm text-muted-foreground text-right">
								Updated on:{' '}
								{new Date(weather.current.time).toLocaleString(undefined, {
									day: '2-digit',
									month: 'short',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									hour12: true,
								})}
							</p>
						</>
					) : (
						<>
							<h2 className="text-3xl font-semibold">Weather</h2>
							{!weatherError ? (
								<p>
									<Spinner className="inline size-6" /> Loading weather...
								</p>
							) : (
								<OmkraftAlert
									error={weatherError}
									fallbackTitle="Weather unavailable"
								/>
							)}
						</>
					)}
				</div>
			</section>

			{/* ================= News ================= */}
			<section className="flex items-center py-6">
				<div className="app-container flex flex-col gap-6">
					<h2 className="text-3xl text-foreground">News</h2>

					<div className="flex flex-col lg:flex-row lg:justify-between gap-4">
						<p className="text-sm text-muted-foreground">Select preferred view</p>

						<RadioGroup
							value={newsView}
							onValueChange={(value) =>
								setNewsView(value as 'comfortable' | 'compact')
							}
							className="flex gap-6 text-muted-foreground"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="comfortable"
									id="comfortable"
									className="border-muted-foreground"
								/>
								<Label htmlFor="comfortable">Comfortable</Label>
							</div>

							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="compact"
									id="compact"
									className="border-muted-foreground"
								/>
								<Label htmlFor="compact">Compact</Label>
							</div>
						</RadioGroup>
					</div>
					<Separator className="border-t border-primary" />

					{/* Navigation */}
					<Tabs
						value={activeNewsTab}
						onValueChange={setActiveNewsTab}
						className="flex flex-col items-center"
					>
						<TabsList className="bg-primary text-foreground h-auto flex-wrap border border-muted-foreground">
							{NEWS_TABS.map((tab) => (
								<TabsTrigger
									key={tab.key}
									value={tab.key}
									className="justify-start lg:justify-center"
								>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>
						<TabsContent value={activeNewsTab} className="mt-6 w-full">
							{(() => {
								const articles = newsSections[activeNewsTab] || [];
								const visible = visibleCounts[activeNewsTab] || 10;
								const visibleArticles = articles.slice(0, visible);

								return (
									<>
										{!newsSections[activeNewsTab] ? (
											<>
												{!newsError ? (
													<div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
														{Array.from({ length: 4 }).map((_, i) => (
															<Card
																key={i}
																className="bg-foreground border border-primary"
															>
																<CardHeader>
																	<Skeleton className="h-5 w-3/4 bg-background" />
																	<Skeleton className="h-4 w-1/3 mt-2 bg-background" />
																</CardHeader>

																<CardContent>
																	<Skeleton className="h-4 w-full mb-2 bg-background" />
																	<Skeleton className="h-4 w-5/6 bg-background" />
																</CardContent>
															</Card>
														))}
													</div>
												) : (
													<OmkraftAlert
														error={newsError}
														fallbackTitle="News unavailable"
													/>
												)}
											</>
										) : (
											<>
												{articles?.length === 0 && (
													<OmkraftAlert
														severity="info"
														error={`We couldn't find any recent headlines in ${activeNewsTab} category right now. Please check back later.`}
														fallbackTitle="No news available"
													/>
												)}
												{isDesktopNewsLayout ? (
													<DesktopNewsMasonry
														articles={visibleArticles}
														newsView={newsView}
													/>
												) : (
													<div className="space-y-6">
														{visibleArticles.map((item, index) =>
															renderNewsCard(item, index, newsView)
														)}
													</div>
												)}

												{visible < articles.length && (
													<div className="text-center mt-6">
														<Button
															onClick={() =>
																setVisibleCounts((prev) => ({
																	...prev,
																	[activeNewsTab]: visible + 10,
																}))
															}
															className="w-full lg:w-auto"
														>
															Show more
														</Button>
													</div>
												)}
											</>
										)}
									</>
								);
							})()}
						</TabsContent>
					</Tabs>
				</div>
			</section>

			{/* ================= Quote ================= */}
			<section className="bg-accent text-accent-foreground items-center py-6">
				<div className="app-container grid gap-6 items-center">
					<h2 className="text-3xl">Daily Insights</h2>
					{/* ================= On This Day ================= */}
					<Card className="bg-foreground text-background border border-background">
						<CardHeader className="flex flex-col gap-2">
							<CardTitle className="flex align-center gap-2 items-center">
								<h3 className="text-2xl flex items-center gap-2">
									<CalendarClock /> On This Day
								</h3>
								{onThisDay && (
									<span>
										(
										{new Date(onThisDay.date).toLocaleDateString(undefined, {
											day: '2-digit',
											month: 'long',
										})}
										)
									</span>
								)}
							</CardTitle>

							<CardDescription className="text-background">
								Significant events from history
							</CardDescription>
						</CardHeader>

						<CardContent>
							{!onThisDay ? (
								<>
									{!onThisDayError ? (
										<p className="text-sm">
											<Spinner className="inline size-6" /> Loading historical
											events...
										</p>
									) : (
										<OmkraftAlert
											error={onThisDayError}
											fallbackTitle="Could not load historical events"
										/>
									)}
								</>
							) : (
								<ItemGroup>
									{onThisDay.events.map((event, index) => (
										<React.Fragment key={`${event.year}-${index}`}>
											<Item role="listitem">
												<ItemContent>
													<ItemDescription className="flex gap-3">
														<span className="text-[var(--omkraft-mint-700)] font-semibold min-w-[60px]">
															{event.year}
														</span>

														<span className="text-sm text-background">
															{event.text}
														</span>
													</ItemDescription>
												</ItemContent>
											</Item>
											{index !== onThisDay.events.length - 1 && (
												<Separator
													role="listitem"
													className="border border-[var(--omkraft-mint-700)]"
												/>
											)}
										</React.Fragment>
									))}
								</ItemGroup>
							)}
						</CardContent>
					</Card>

					<Card className="bg-foreground text-background border border-background">
						<CardHeader>
							<CardTitle>
								<h3 className="text-2xl text-center flex flex-col items-center gap-2">
									<Quote />
									Quote of the Day
								</h3>
							</CardTitle>
						</CardHeader>
						<CardContent>
							{quote ? (
								<div className="text-center grid gap-4">
									<p className="italic text-xl font-medium ">
										"{quote.quote}" -{' '}
									</p>
								</div>
							) : (
								<>
									{quoteError ? (
										<OmkraftAlert
											error={quoteError}
											fallbackTitle="Quote unavailable"
										/>
									) : (
										<p className="text-sm text-center">
											<Spinner className="inline size-6" /> Loading quote...
										</p>
									)}
								</>
							)}
						</CardContent>
						<CardFooter className="flex flex-col gap-2 justify-center">
							{quote && Object.keys(quote).length !== 0 && (
								<>
									<p className="text-[var(--omkraft-mint-700)] italic text-xl font-medium">
										{quote.author}
									</p>

									{quote.authorImageThumb || quote.authorImage ? (
										<Avatar className="h-12 w-12 border-2 p-0.5 border-background box-content">
											<AvatarImage
												className="rounded-full"
												src={
													quote.authorImageThumb ||
													quote.authorImage ||
													undefined
												}
												alt={quote.author}
											/>
										</Avatar>
									) : (
										<Avatar className="h-12 w-12 border-2 p-0.5 box-content">
											<CircleUser className="w-full h-full" />
										</Avatar>
									)}
								</>
							)}
						</CardFooter>
					</Card>
				</div>
			</section>
		</main>
	);
}
