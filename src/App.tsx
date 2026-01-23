import { Header } from './components/Header';

export default function App() {
	return (
		<div className="min-h-screen bg-background text-foreground font-system">
			<Header />

			<main className="app-container py-8">
				<div className="rounded-lg bg-white/5 p-6">
					{/* Temporary placeholder content */}
					<h1 className="text-xl font-semibold mb-4">
						Omkraft UI 🚀
					</h1>

					<p className="text-sm opacity-80">
						Product UI foundation in progress.
					</p>
				</div>
			</main>
		</div>
	);
}
