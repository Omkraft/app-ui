export interface WeatherData {
	current: {
		temperature_2m: number;
		wind_speed_10m: number;
		weather_code: number;
		relative_humidity_2m: number;
		is_day: number;
		cloud_cover: string;
		apparent_temperature: number;
	};

	hourly: {
		uv_index: number[];
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
