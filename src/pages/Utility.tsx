import { useCallback, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/api/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatDate } from '@/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
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
	Gauge
} from 'lucide-react';

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
	const [loadingNews, setLoadingNews] = useState(true);
	const [locationLabel, setLocationLabel] = useState<string | null>(null);
	const [, setError] = useState<string | null>(null);


	const fetchWeather = useCallback(async () => {
		try {
			navigator.geolocation.getCurrentPosition(
				async position => {
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
				},
				error => {
					console.error(error);
					setError('Location permission denied');
				}
			);
		} catch (_err) {
			setError('Failed to fetch weather');
		}
	}, []);

	async function fetchQuote() {
		try {
			const data = await apiRequest<QuoteResponse>('/api/utility/quote');
			setQuote(data);
		} catch (error) {
			console.error(error);
		}
	}

	const fetchNews = useCallback(async (category: string) => {
		try {
			setLoadingNews(true);
			const data = await apiRequest<NewsArticle[]>(
				`/api/utility/news?category=${category}`
			);
			setNews({
				articles: data
			});
		} catch (error) {
			console.error(error);
		} finally {
			setLoadingNews(false);
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
			<section className="bg-gradient-to-br from-[var(--omkraft-primary)] to-background text-foreground py-8">
				<div className="app-container space-y-8">

					<h2 className="text-3xl font-semibold">Weather</h2>

					{weather ? (
						<>
							{/* Current */}
							<div className="flex items-center justify-between bg-muted backdrop-blur-md p-6 rounded-xl">
								<div className='flex flex-col gap-2'>
									<div>
										<p className="text-lg font-medium">{locationLabel?.split(',')[0]}</p>
										<p className="text-sm opacity-60">
											{locationLabel?.split(',').slice(1).join(',')}
										</p>
									</div>

									<p className="text-5xl font-bold">
										{weather.current.temperature}°C
									</p>
									<p>
										Feels like {weather.hourly.apparent_temperature[0]}°C
									</p>
								</div>

								<div className="text-6xl">
									{getWeatherIcon(weather.current.weathercode)}
								</div>
							</div>

							{/* METRICS GRID */}
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
								<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted rounded-xl">
									<Droplets className="w-7 h-7 text-accent" />
									<div>
										<p className="text-sm opacity-70">Humidity</p>
										<p className="text-xl font-semibold">
											{weather.hourly.relativehumidity_2m?.[0]}%
										</p>
									</div>
								</Card>

								<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted rounded-xl">
									<Cloud className="w-7 h-7 text-accent" />
									<div>
										<p className="text-sm opacity-70">Cloud Cover</p>
										<p className="text-xl font-semibold">
											{weather.hourly.cloudcover[0]}%
										</p>
									</div>
								</Card>

								<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted rounded-xl">
									<Wind className="w-7 h-7 text-accent" />
									<div>
										<p className="text-sm opacity-70">Wind</p>
										<p className="text-xl font-semibold">
											{weather.current.windspeed} km/h
										</p>
									</div>
								</Card>

								<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted rounded-xl">
									<Gauge className="w-7 h-7 text-accent" />
									<div>
										<p className="text-sm opacity-70">UV Index</p>
										<p className="text-lg font-semibold">
											{weather?.daily?.uv_index_max?.[0]}
										</p>
									</div>
								</Card>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted rounded-xl">
									<Sunrise className="w-7 h-7 text-yellow-400" />
									<div>
										<p className="text-sm opacity-70">Sunrise</p>
										<p className="text-lg font-semibold">
											{weather?.daily?.sunrise?.[0] && new Date(weather.daily.sunrise[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
										</p>
									</div>
								</Card>

								<Card className="p-4 flex flex-row justify-center items-center gap-2 text-center bg-muted rounded-xl">
									<Sunset className="w-7 h-7 text-orange-400" />
									<div>
										<p className="text-sm opacity-70">Sunset</p>
										<p className="text-lg font-semibold">
											{weather?.daily?.sunset?.[0] && new Date(weather.daily.sunset[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
										</p>
									</div>
								</Card>
							</div>

							{/* 5 DAY FORECAST */}
							<div>
								<h2 className="text-2xl font-semibold mb-4">5-Day Forecast</h2>
								<div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
									{weather?.daily?.time?.slice(1, 6).map((day: string, index: number) => (
										<Card key={day} className="p-4 text-center bg-muted rounded-xl">
											<p className="text-lg font-semibold">
												{new Date(day).toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' })}
											</p>
											<p className="font-semibold flex items-center justify-center gap-1">
												<Sun className="w-4 h-4 text-yellow-400" />{weather.daily.temperature_2m_max[index]}°
											</p>
											<p className="text-sm opacity-70 flex items-center justify-center gap-1">
												<Moon className="w-4 h-4 text-blue-300" />
												{weather.daily.temperature_2m_min[index]}°
											</p>
										</Card>
									))}
								</div>
							</div>
						</>
					) : (
						<p><Spinner className='inline size-6' /> Loading weather...</p>
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
							{loadingNews ? (
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
