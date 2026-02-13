import { useCallback, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/api/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatDate } from '@/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
import type { OpenMeteoWeather } from '@/types/weather';
import { NewsSourceLogo } from '@/components/news/NewsSourceLogo';
import { getWeatherIcon } from '@/utils/weatherIcons';
import { Spinner } from '@/components/ui/spinner';

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
	const [weather, setWeather] = useState<OpenMeteoWeather | null>(null);
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


					const weather = await apiRequest<OpenMeteoWeather>(
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
							<div className="flex items-center justify-between bg-white/10 backdrop-blur-md p-6 rounded-xl">
								<div>
									<p className="text-lg font-medium">{locationLabel?.split(',')[0]}</p>
									<p className="text-sm opacity-60">
										{locationLabel?.split(',').slice(1).join(',')}
									</p>

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

							{/* Stats */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="bg-white/10 p-4 rounded-lg">
									<p>Humidity</p>
									<p className="text-xl font-semibold">
										{weather.hourly.relativehumidity_2m[0]}%
									</p>
								</div>

								<div className="bg-white/10 p-4 rounded-lg">
									<p>Wind</p>
									<p className="text-xl font-semibold">
										{weather.current.windspeed} km/h
									</p>
								</div>

								<div className="bg-white/10 p-4 rounded-lg">
									<p>Cloud Cover</p>
									<p className="text-xl font-semibold">
										{weather.hourly.cloudcover[0]}%
									</p>
								</div>

								<div className="bg-white/10 p-4 rounded-lg">
									<p>Precipitation</p>
									<p className="text-xl font-semibold">
										{weather.hourly.precipitation[0]} mm
									</p>
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
													<div className="flex items-center justify-between gap-3">
														<CardTitle className="text-lg leading-snug">
															{item.title}
														</CardTitle>
														<NewsSourceLogo source={item.source} />
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
							<p className="italic">“{quote.q}”</p>
							<p>— {quote.a}</p>
						</>
					) : (
						<p>Loading quote...</p>
					)}
				</div>
			</section>
		</main>
	);
}
