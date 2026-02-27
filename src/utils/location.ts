export type LocationData = {
	latitude: number;
	longitude: number;
	cityName: string | null;
	state: string | null;
	countryCode: string | null;
};

/**
 * Reverse geocode using primary + fallback providers
 */
async function reverseGeocode(latitude: number, longitude: number) {
	const res = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/api/location/reverse-geocode?latitude=${latitude}&longitude=${longitude}`
	);

	if (!res.ok) throw new Error('Reverse geocode failed');

	return res.json();
}

/**
 * Get current location with full reliability
 */
export async function getCurrentLocation(): Promise<LocationData> {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error('Geolocation not supported.'));
			return;
		}

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				try {
					const { latitude, longitude } = position.coords;

					const geo = await reverseGeocode(latitude, longitude);

					const locationData: LocationData = {
						latitude,
						longitude,
						cityName: geo.cityName,
						state: geo.state,
						countryCode: geo.countryCode,
					};

					// cache for offline / fallback
					localStorage.setItem('omkraft-last-location', JSON.stringify(locationData));

					resolve(locationData);
				} catch (error) {
					reject(error instanceof Error ? error : new Error('Failed to get location.'));
				}
			},
			(error) => {
				reject(new Error(error.message));
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 300000,
			}
		);
	});
}
