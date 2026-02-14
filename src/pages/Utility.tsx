import { useCallback, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/api/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatDate, formatTimeLocal, round } from '@/utils/format';
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
	Cloud,
	Wind,
	Sun,
	Moon,
	Sunrise,
	Sunset,
	Gauge,
	AlertCircleIcon
} from 'lucide-react';
import { getWeatherTheme } from '@/utils/weatherTheme';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface NewsArticle {
	title: string;
	url: string;
	description: string;
	source: string;
	publishedAt: string;
}

interface NewsResponse {
	articles: NewsArticle[];
}

interface QuoteResponse {
	q: string;
	a: string;
}

export default function Utility() {
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [quote, setQuote] = useState<QuoteResponse | null>(null);
	const [news, setNews] = useState<NewsResponse | null>(null);
	const [locationLabel, setLocationLabel] = useState<string | null>(null);
	const [weatherError, setWeatherError] = useState<string | null>(null);

	const fetchWeather = useCallback(async () => {
		setWeather(null);
		setWeatherError(null);
		try {
			navigator.geolocation.getCurrentPosition(
				async position => {
					try {
						const { latitude, longitude } = position.coords;

						// 🔹 Reverse geocode to get city name
						const geoRes = await fetch(
							`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
						);

						const geoData = await geoRes.json();

						const cityName =
							geoData.city ||
							geoData.locality ||
							null;

						const state =
							geoData.principalSubdivision ||
							null;

						const countryCode =
							geoData.countryCode ||
							null;

						// Build formatted location string
						const locationParts = [cityName, state, countryCode].filter(Boolean);
						const formattedLocation =
							locationParts.length > 0
								? locationParts.join(', ')
								: 'Unknown';


						const weather = await apiRequest<WeatherData>(
							`/api/utility/weather?lat=${latitude}&lon=${longitude}`
						);
						setLocationLabel(formattedLocation);
						setWeather(weather);
					} catch (error) {
						console.error(error);
						setWeatherError(error instanceof Error
							? error.message
							: 'Failed to fetch weather.');
					}
				},
				error => {
					console.error(error);
					setWeatherError(error instanceof GeolocationPositionError
						? error.message
						: 'Location permission denied.');
				}, {
					enableHighAccuracy: true,
  					timeout: 5000,
				}
			);
		} catch (err) {
			setWeatherError(err instanceof Error
				? err.message
				: 'Failed to fetch weather.');
		}
	}, []);

	async function fetchQuote() {
		setQuote(null);
		try {
			const data = await apiRequest<QuoteResponse>('/api/utility/quote');
			setQuote(data);
		} catch (error) {
			console.error(error);
		}
	}

	const fetchNews = useCallback(async (category: string) => {
		setNews(null);
		try {
			const data = await apiRequest<NewsArticle[]>(
				`/api/utility/news?category=${category}`
			);
			setNews({
				articles: data
			});
		} catch (error) {
			console.error(error);
		}
	}, []);

	useEffect(() => {
		fetchWeather();
		fetchQuote();
		fetchNews('india');
	}, [fetchWeather, fetchNews]);

	return (
		<main className="min-h-[calc(100vh-135px)] bg-background">
			<section className="text-foreground flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					{/* ========================= */}
					{/* Page Header */}
					{/* ========================= */}
					<header className="space-y-4">
						<h1 className="text-4xl font-semibold">
							Personal {' '}<span className="text-primary">Utility Hub</span>
						</h1>
						<p className="text-muted-foreground">
							Daily essentials, in one calm place.
						</p>
					</header>
				</div>
			</section>
			
			{/* ================= Weather ================= */}
			<section className={`relative overflow-hidden text-foreground py-6 transition-all duration-700 ${getWeatherTheme(weather?.current?.weather_code, weather?.current?.is_day)}`}>
				<div className="app-container space-y-8 align-items-center">
					{weather ? (
						<>
							<h2 className={`text-3xl font-semibold${!(weather.current.weather_code) || [71, 73, 75, 85, 86].includes(weather.current.weather_code) ? ' text-background' : ' text-foreground'}`}>Weather</h2>
							{/* Current */}
							<div className={`flex items-center justify-between${!(weather.current.weather_code) || [71, 73, 75, 85, 86, 51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weather.current.weather_code) ? ' bg-[var(--omkraft-blue-700)] ' : ' bg-muted '}p-6 rounded-xl`}>
								<div className='flex flex-col gap-2'>
									<div>
										<p className="text-lg font-medium">{locationLabel?.split(',')[0]}</p>
										<p className="text-sm opacity-70">
											{locationLabel?.split(',').slice(1).join(',')}
										</p>
									</div>

									<p className="text-5xl font-bold">
										{round(weather.current.temperature_2m)}°C
									</p>
									<p>
										Feels like {round(weather.current.apparent_temperature)}°C
									</p>
								</div>

								<div className="text-6xl">
									{getWeatherIcon(weather.current.weather_code)}
								</div>
							</div>

							<Accordion
								type="multiple"
								className={`rounded-xl border ${weather.current.weather_code === 0 && weather.current.is_day ? 'bg-[var(--omkraft-blue-700)]' : 'bg-muted'}`}
							>
								<AccordionItem value="metrix" className="border-b px-4 last:border-b-0">
									<AccordionTrigger className="text-2xl font-semibold hover:no-underline">Weather Details</AccordionTrigger>
									<AccordionContent>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
											<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted rounded-xl">
												<Droplets className="w-7 h-7 text-accent" />
												<div>
													<p className="text-sm opacity-70">Humidity</p>
													<p className="text-xl font-semibold">
														{weather.current.relative_humidity_2m}%
													</p>
												</div>
											</Card>

											<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted rounded-xl">
												<Cloud className="w-7 h-7 text-accent" />
												<div>
													<p className="text-sm opacity-70">Cloud Cover</p>
													<p className="text-xl font-semibold">
														{weather.current.cloud_cover}%
													</p>
												</div>
											</Card>

											<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted rounded-xl">
												<Wind className="w-7 h-7 text-accent" />
												<div>
													<p className="text-sm opacity-70">Wind</p>
													<p className="text-xl font-semibold">
														{round(weather.current.wind_speed_10m)} km/h
													</p>
												</div>
											</Card>

											<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted rounded-xl">
												<Gauge className="w-7 h-7 text-accent" />
												<div>
													<p className="text-sm opacity-70">UV Index</p>
													<p className="text-lg font-semibold">
														{round(weather?.hourly?.uv_index?.[0], 0)}
													</p>
												</div>
											</Card>
										</div>
									</AccordionContent>
								</AccordionItem>

								<AccordionItem value="sunriseset" className="border-b px-4 last:border-b-0">
									<AccordionTrigger className="text-2xl font-semibold hover:no-underline">Sunrise &amp; Sunset</AccordionTrigger>
									<AccordionContent>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted rounded-xl">
												<Sunrise className="w-7 h-7 text-yellow-400" />
												<div>
													<p className="text-sm opacity-70">Sunrise</p>
													<p className="text-lg font-semibold">
														{weather.daily.sunrise[0] && formatTimeLocal(weather.daily.sunrise[0])}
													</p>
												</div>
											</Card>

											<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted rounded-xl">
												<Sunset className="w-7 h-7 text-orange-400" />
												<div>
													<p className="text-sm opacity-70">Sunset</p>
													<p className="text-lg font-semibold">
														{weather.daily.sunset[0] && formatTimeLocal(weather.daily.sunset[0])}
													</p>
												</div>
											</Card>
										</div>
									</AccordionContent>
								</AccordionItem>

								<AccordionItem value="forecast" className="border-b px-4 last:border-b-0">
									<AccordionTrigger className="text-2xl font-semibold hover:no-underline">5-Day Forecast</AccordionTrigger>
									<AccordionContent>
										<div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
											{weather?.daily?.time?.slice(1, 6).map((day: string, index: number) => (
												<Card key={day} className="flex justify-around lg:block p-4 text-center bg-muted rounded-xl">
													<p className="text-lg font-semibold">
														{new Date(day).toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' })}
													</p>
													<p className="font-semibold flex items-center justify-center gap-1">
														<Sun className="w-4 h-4 text-yellow-400" />{round(weather.daily.temperature_2m_max[index])}°
													</p>
													<p className="opacity-70 flex items-center justify-center gap-1">
														<Moon className="w-4 h-4 text-blue-300" />
														{round(weather.daily.temperature_2m_min[index])}°
													</p>
													<p className="text-lg flex items-center justify-center gap-1">
														{getWeatherIcon(weather.daily.weather_code[index])}
													</p>
												</Card>
											))}
										</div>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</>
					) : (
						<>
							<h2 className="text-3xl font-semibold">Weather</h2>
							{!weatherError ? (
								<p><Spinner className='inline size-6' /> Loading weather...</p>
							) : (
								<Alert variant="destructive">
									<AlertCircleIcon />
									<AlertTitle>Weather service failed</AlertTitle>
									<AlertDescription className="text-sm">
										{weatherError}
									</AlertDescription>
								</Alert>
							)}
						</>
					)}
				</div>
			</section>

			{/* ================= News ================= */}
			<section className="flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					<h2 className='text-3xl text-foreground'>News</h2>

					<Tabs
						defaultValue="india"
						onValueChange={(value) => fetchNews(value)}
					>
						<TabsList className='bg-primary text-foreground'>
							<TabsTrigger value="india">India</TabsTrigger>
							<TabsTrigger value="global">Global</TabsTrigger>
						</TabsList>

						<TabsContent value="india" />
						<TabsContent value="global" />

						<div className="pt-4 space-y-4">
							{!news ? (
								<div className="grid gap-8 lg:grid-cols-2">
									{Array.from({ length: 4 }).map((_, i) => (
										<Card key={i} className='bg-foreground border border-muted-foreground'>
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
								<div className='grid gap-8 lg:grid-cols-2'>
									{news?.articles.map((item, index) => (
										<Card
											key={index}
											className="bg-foreground text-background transition-all hover:shadow-xl hover:-translate-y-1 duration-300 border border-muted-foreground"
										>
											<CardHeader>
												<a
													href={item.url}
													target="_blank"
													rel="noopener noreferrer"
													className="hover:text-primary transition-colors"
												>
													<div className="flex flex-col-reverse lg:flex-row items-start lg:items-center gap-3">
														<CardTitle className="text-lg leading-snug">
															{item.title}
														</CardTitle>
														<NewsSourceLogo source={item.source} className={`${item.source === 'Hindustan Times' || item.source === 'BBC News' || item.source === 'CNN' ? 'h-4 ' : ''}`} />
													</div>
												</a>

												<CardDescription className="text-background flex justify-between text-xs mt-1">
													<span>
														{item.source}
													</span>
													<span>
														{formatDate(item.publishedAt)}
													</span>
												</CardDescription>
											</CardHeader>

											<CardContent>
												<p className="text-sm line-clamp-3">
													{item.description}
												</p>
											</CardContent>
										</Card>
									))}
								</div>
							)}
						</div>
					</Tabs>
				</div>
			</section>

			{/* ================= Quote ================= */}
			<section className="bg-gradient-to-br from-accent to-primary flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					<h2 className='text-3xl'>Daily Quote</h2>

					{quote ? (
						<>
							<p className="italic">"{quote.q}"</p>
							<p>— {quote.a}</p>
						</>
					) : (
						<p><Spinner className='inline size-6' /> Loading quote...</p>
					)}
				</div>
			</section>
		</main>
	);
}
