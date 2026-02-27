export function retryFailedServices() {
	window.dispatchEvent(new CustomEvent('omkraft:retry-services'));
}
