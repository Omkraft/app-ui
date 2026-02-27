import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export function InstallButton() {
	const { isInstallable, install } = useInstallPrompt();

	if (!isInstallable) return null;

	return (
		<>
			<Button
				variant="outline"
				size="sm"
				onClick={install}
				className="gap-2 hidden lg:inline-flex"
			>
				<Download className="h-4 w-4" />
				Install
			</Button>
			<Button variant="ghost" size="icon" onClick={install} className="lg:hidden">
				<Download className="h-6 w-6" />
			</Button>
		</>
	);
}
