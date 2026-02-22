import {
	Sun,
	Cloud,
	CloudRain,
	CloudLightning,
	CloudFog,
	CloudSun,
	CloudSunRain,
	Snowflake,
	MoonStar,
	CloudMoon,
	CloudMoonRain,
} from 'lucide-react';

export function getWeatherIcon(code: number, isDay: number) {
	if (code === 0) return isDay ? Sun : MoonStar;
	if (code === 1) return isDay ? CloudSun : CloudMoon;
	if ([2, 3].includes(code)) return Cloud;
	if ([51, 80].includes(code)) return isDay ? CloudSunRain : CloudMoonRain;
	if ([61, 63, 65].includes(code)) return CloudRain;
	if ([71, 73, 75].includes(code)) return Snowflake;
	if ([95, 96, 99].includes(code)) return CloudLightning;
	if ([45, 48].includes(code)) return CloudFog;

	return Cloud;
}
