export function isIos() {
	return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

export function isIosSafari() {
	const ua = navigator.userAgent;

	return isIos() && ua.includes('Safari') && !ua.includes('CriOS');
}
