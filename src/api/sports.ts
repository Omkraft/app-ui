import { apiRequest } from '@/api/client';

export interface Match {
	_id: string;

	sport: string;

	league?: string;
	leagueLogo?: string;

	country?: string;
	countryFlag?: string;

	teamA: string;
	teamALogo?: string;

	teamB: string;
	teamBLogo?: string;

	scoreA?: string;
	scoreB?: string;

	status?: string;

	startTime: string;
}

export async function fetchMatches(sport: string, region: string, signal?: AbortSignal) {
	const params = new URLSearchParams({
		sport,
		region,
	});

	return apiRequest<Match[]>(`/api/sports/matches?${params.toString()}`, { signal });
}
