export async function fetchLatestVersion(): Promise<string | null> {
	try {
		const res = await fetch('https://api.github.com/repos/Omkraft/app-ui/releases/latest', {
			cache: 'force-cache',
		});

		if (!res.ok) return null;

		const data = await res.json();

		return data.tag_name ?? null;
	} catch {
		return null;
	}
}
