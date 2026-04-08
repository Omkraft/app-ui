const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type LogoProxyInput =
	| { domain: string; name?: never; format?: string; retina?: boolean }
	| { name: string; domain?: never; format?: string; retina?: boolean };

export function getCachedLogoUrl(input: LogoProxyInput) {
	const searchParams = new URLSearchParams();

	if ('domain' in input && input.domain) {
		searchParams.set('domain', input.domain);
	}

	if ('name' in input && input.name) {
		searchParams.set('name', input.name);
	}

	searchParams.set('format', input.format ?? 'png');
	searchParams.set('retina', String(input.retina ?? true));

	return `${API_BASE_URL}/api/logo?${searchParams.toString()}`;
}
