import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import Login from './pages/Login';

export default function App() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<Header />

			<Routes>
				{/* Home */}
				<Route path="/" element={<Navigate to="/login" replace />} />

				{/* Auth */}
				<Route path="/login" element={<Login />} />

				{/* Dashboard */}
				<Route
					path="/dashboard"
					element={
						<div className="app-container py-8">
							<h1 className="text-2xl font-semibold">Dashboard</h1>
						</div>
					}
				/>

				{/* 🚨 IMPORTANT: do NOT redirect everything */}
				<Route
					path="*"
					element={
						<div className="app-container py-8">
							<h1 className="text-xl font-semibold">
								404 – Page not found
							</h1>
						</div>
					}
				/>
			</Routes>
		</div>
	);
}
