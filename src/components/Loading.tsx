import loadingIllustration from '@/assets/loading-illustration.svg';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Loading() {
	return (
		<div className="min-h-[calc(100vh-145px)] bg-background text-foreground flex items-center">
			<div className="app-container grid gap-12 items-center py-6 justify-items-center">
				<Card className="w-full text-center">
					<CardHeader>
						<CardTitle>
							<h1 className="text-4xl font-semibold leading-tight text-primary">Loading...</h1>
						</CardTitle>
						<CardDescription>
							Please wait while we load the content for you.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<img
							src={loadingIllustration}
							alt="Loading illustration"
							className="w-full max-w-md mx-auto opacity-90"
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}