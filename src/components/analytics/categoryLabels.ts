export const CATEGORY_LABELS: Record<string, string> = {
	OTT: 'OTT / Streaming',
	MUSIC: 'Music',
	SIM_PREPAID: 'SIM (Prepaid)',
	SIM_POSTPAID: 'SIM (Postpaid)',
	INTERNET: 'Internet / Broadband',
	DTH: 'DTH / TV',
	SOFTWARE: 'Software / SaaS',
	CLOUD: 'Cloud Storage',
	GAMING: 'Gaming',
	OTHER: 'Other',
};

export function getCategoryLabel(category: string): string {
	return CATEGORY_LABELS[category] ?? category;
}
