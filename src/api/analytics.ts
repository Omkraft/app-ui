import { apiRequest } from './client';

export type DashboardAnalytics = {
	totalMonthly: number;

	yearlyProjection: number;

	categoryBreakdown: {
		category: string;
		total: number;
	}[];

	monthlyTrend: {
		month: string;
		total: number;
	}[];

	upcomingRenewals: {
		name: string;
		amount: number;
		nextBillingDate: string;
	}[];
};

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
	return apiRequest<DashboardAnalytics>('/api/protected/analytics/dashboard');
}
