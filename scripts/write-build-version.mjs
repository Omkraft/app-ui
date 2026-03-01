import process from 'node:process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

function resolveAppVersion() {
	const releaseVersion = process.env.APP_RELEASE_VERSION?.trim();
	if (releaseVersion) return releaseVersion;

	const commitSha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA;
	if (commitSha) return commitSha.slice(0, 12);

	const pkgVersion = process.env.npm_package_version;
	if (pkgVersion) return `v${pkgVersion}`;

	return 'dev';
}

const version = resolveAppVersion();
const publicDir = resolve(process.cwd(), 'public');
const versionFile = resolve(publicDir, 'version.json');

mkdirSync(publicDir, { recursive: true });
writeFileSync(versionFile, `${JSON.stringify({ version }, null, 2)}\n`, 'utf8');

process.stdout.write(`[build-version] wrote ${versionFile} -> ${version}\n`);
