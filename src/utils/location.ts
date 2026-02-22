export type LocationData = {
	latitude: number;
	longitude: number;
	cityName: string | null;
	state: string | null;
	countryCode: string | null;
};

/**
 * Get current browser location + reverse geocode
 */
export async function getCurrentLocation(): Promise<LocationData> {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error('Geolocation is not supported by this browser.'));
			return;
		}

		navigator.geolocation.getCurrentPosition(
			async (position) => {
				try {
					const { latitude, longitude } = position.coords;

					// Reverse geocode
					const geoRes = await fetch(
						`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
					);

					if (!geoRes.ok) {
						throw new Error('Failed to reverse geocode location.');
					}

					const geoData = await geoRes.json();

					const cityName = geoData.city || geoData.locality || null;

					const state = geoData.principalSubdivision || null;

					const countryCode = geoData.countryCode || null;

					resolve({
						latitude,
						longitude,
						cityName,
						state,
						countryCode,
					});
				} catch (error) {
					reject(
						error instanceof Error ? error : new Error('Failed to fetch location data.')
					);
				}
			},
			(error) => {
				reject(
					error instanceof GeolocationPositionError
						? new Error(error.message)
						: new Error('Location permission denied.')
				);
			},
			{
				enableHighAccuracy: true,
			}
		);
	});
}
