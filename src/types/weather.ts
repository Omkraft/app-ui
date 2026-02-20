export interface WeatherData {
	current: {
		time: string;
		temperature_2m: number;
		wind_speed_10m: number;
		weather_code: number;
		relative_humidity_2m: number;
		is_day: number;
		cloud_cover: string;
		apparent_temperature: number;
		precipitation: string,
	};

	hourly: {
		uv_index_clear_sky: number[];
		time: string[],
		temperature_2m: number[],
		weather_code: number[],
	};

	daily: {
		time: string[];
		sunrise: string[];
		sunset: string[];
		temperature_2m_max: number[];
		temperature_2m_min: number[];
		weather_code: number[];
	};
}
