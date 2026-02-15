export interface OnThisDayEvent {
	year: number;
	text: string;
}

export interface OnThisDayResponse {
	date: string;
	events: OnThisDayEvent[];
}
