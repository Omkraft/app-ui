import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import Loading from './components/Loading';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import { isAuthenticated } from './utils/auth';
import Dashboard from './pages/Dashboard';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));

export default function App() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<Header />

			<Suspense fallback={<Loading />}>
				<Routes>
					{/* Home */}
					<Route
						path="/"
						element={
							isAuthenticated()
								? <Navigate to="/dashboard" replace />
								: <Navigate to="/login" replace />
						}
					/>

					{/* Public auth routes */}
					<Route
						path="/login"
						element={
							<PublicRoute>
								<Login />
							</PublicRoute>
						}
					/>

					<Route
						path="/register"
						element={
							<PublicRoute>
								<Register />
							</PublicRoute>
						}
					/>

					<Route
						path="/forgot-password"
						element={
							<PublicRoute>
								<ForgotPassword />
							</PublicRoute>
						}
					/>

					{/* Protected routes */}
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>

					<Route path="/verify-email" element={<VerifyEmail />} />

					{/* 404 */}
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
