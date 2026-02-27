import { useEffect, useState } from 'react';
import { getStoredVersion } from '@/lib/versionStore';
import { fetchLatestVersion } from '@/lib/version';

export function useVersion() {
	const [version, setVersion] = useState<string | null>(getStoredVersion());

	useEffect(() => {
		if (version) return;

		fetchLatestVersion().then((v) => {
			if (v) setVersion(v);
		});
	}, []);

	return version;
}
