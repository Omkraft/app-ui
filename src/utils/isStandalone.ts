interface NavigatorStandalone extends Navigator {
	standalone?: boolean;
}

export function isStandalone(): boolean {
	const navigatorStandalone = (window.navigator as NavigatorStandalone).standalone === true;

	const displayModeStandalone = window.matchMedia('(display-mode: standalone)').matches;

	return navigatorStandalone || displayModeStandalone;
}
