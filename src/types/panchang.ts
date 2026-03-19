export type PanchangTimeRange = {
	label: string;
	start: string | null;
	end: string | null;
	reason: string;
	quality: 'good' | 'avoid' | 'neutral';
};

export type PanchangObservance = {
	id: string;
	name: string;
	significance: string;
	regions: string[];
};

export type PanchangData = {
	date: string;
	timeZone: string;
	location: {
		lat: number;
		lng: number;
	};
	sunrise: string | null;
	sunset: string | null;
	tithi: {
		number: number;
		name: string;
	};
	nakshatra: {
		number: number;
		name: string;
	};
	yoga: {
		number: number;
		name: string;
	};
	karana: {
		name: string;
	};
	moonRashi: {
		number: number;
		name: string;
	};
	rahuKalam: PanchangTimeRange;
	yamagandam: PanchangTimeRange;
	gulikaKalam: PanchangTimeRange;
	daytimeChoghadiya: PanchangTimeRange[];
	goodTimes: PanchangTimeRange[];
	avoidTimes: PanchangTimeRange[];
	observances: PanchangObservance[];
	guidance: {
		summary: string;
		favorable: string[];
		avoid: string[];
	};
};
