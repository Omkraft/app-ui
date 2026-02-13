export interface WeatherData {
	city?: string;

	current: {
		temperature: string,
		temperature_2m: number;
		windspeed: number;
		weathercode: number;
		apparent_temperature: number;
		is_day: number;
	};

	hourly: {
		relativehumidity_2m: number[];
		cloudcover: number[];
		precipitation: number[];
		apparent_temperature: number[];
	};

	daily: {
		time: string[];
		sunrise: string[];
		sunset: string[];
		temperature_2m_max: number[];
		temperature_2m_min: number[];
		uv_index_max: number[];
		weathercode: number[];
	};
}
