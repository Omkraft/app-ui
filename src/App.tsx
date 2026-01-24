import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';

import Login from './pages/Login';

export default function App() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<Header />

			<Routes>
				{/* Default route */}
				<Route path="/" element={<Navigate to="/login" replace />} />

				{/* Auth */}
				<Route path="/login" element={<Login />} />

				{/* Placeholder dashboard */}
				<Route
					path="/dashboard"
					element={
						<div className="app-container py-8">
							<h1 className="text-2xl font-semibold">
								Dashboard
							</h1>
						</div>
					}
				/>

				{/* Catch-all */}
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		</div>
	);
}
