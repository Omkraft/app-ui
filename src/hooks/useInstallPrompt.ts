import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function useInstallPrompt() {
	const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

	const [isInstallable, setIsInstallable] = useState(false);

	useEffect(() => {
		const handler = (e: Event) => {
			e.preventDefault();
			setPrompt(e as BeforeInstallPromptEvent);
			setIsInstallable(true);
		};

		window.addEventListener('beforeinstallprompt', handler);

		return () => window.removeEventListener('beforeinstallprompt', handler);
	}, []);

	const install = async () => {
		if (!prompt) return;

		await prompt.prompt();

		const choice = await prompt.userChoice;

		if (choice.outcome === 'accepted') {
			setPrompt(null);
			setIsInstallable(false);
		}
	};

	return { isInstallable, install };
}
