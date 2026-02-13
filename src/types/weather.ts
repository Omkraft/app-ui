export interface OpenMeteoWeather {
	city: string;

	current: {
		temperature: number;
		windspeed: number;
		winddirection: number;
		weathercode: number;
		is_day: number;
		humidity: number;
	};

	daily: {
		time: string[];
		temperature_2m_max: number[];
		temperature_2m_min: number[];
	};

	hourly: {
		time: string[];
		relativehumidity_2m: number[];
		apparent_temperature: number[];
		cloudcover: number[];
		precipitation: number[];
	};
}
