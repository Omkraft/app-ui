const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type LogoProxyInput =
	| { domain: string; name?: never; format?: string; retina?: boolean }
	| { name: string; domain?: never; format?: string; retina?: boolean };

export function getCachedLogoUrl(input: LogoProxyInput) {
	const params: string[] = [];

	if ('domain' in input && input.domain) {
		params.push(`domain=${encodeURIComponent(input.domain)}`);
	}

	if ('name' in input && input.name) {
		params.push(`name=${encodeURIComponent(input.name)}`);
	}

	params.push(`format=${encodeURIComponent(input.format ?? 'png')}`);
	params.push(`retina=${encodeURIComponent(String(input.retina ?? true))}`);

	return `${API_BASE_URL}/api/logo?${params.join('&')}`;
}
