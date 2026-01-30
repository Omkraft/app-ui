import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

export default function App() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<Header />

			<Suspense
				fallback={
					<div className="app-container py-8">
						<p className="text-sm text-muted-foreground">
							Loading…
						</p>
					</div>
				}
			>
				<Routes>
					{/* Home */}
					<Route path="/" element={<Navigate to="/login" replace />} />

					{/* Auth */}
					<Route path="/login" element={<Login />} />

					<Route path="/register" element={<Register />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />

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
			</Suspense>
		</div>
	);
}
