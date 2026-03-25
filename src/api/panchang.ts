import { apiRequest } from '@/api/client';
import type { DailyHoroscopeResponse, PanchangData } from '@/types/panchang';

export async function fetchPanchang(
	params: {
		date: string;
		lat: number;
		lng: number;
	},
	signal?: AbortSignal
) {
	const searchParams = new URLSearchParams({
		date: params.date,
		lat: String(params.lat),
		lng: String(params.lng),
	});

	return apiRequest<PanchangData>(`/api/panchang?${searchParams.toString()}`, { signal });
}

export async function fetchDailyHoroscopes(signal?: AbortSignal) {
	return apiRequest<DailyHoroscopeResponse>('/api/panchang/horoscope', { signal });
}
