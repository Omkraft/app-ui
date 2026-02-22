import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import Loading from './components/Loading';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import { isAuthenticated } from './utils/auth';
import Footer from './components/Footer';
import Maintenance from './pages/Maintenance';
import Subscription from './pages/Subscription';

const Welcome = lazy(() => import('./pages/Welcome'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Utility = lazy(() => import('./pages/Utility'));

export default function App() {
	return (
		<div className="flex flex-col">
			<Header />

			<div className="flex-1">
				<Suspense fallback={<Loading />}>
					<Routes>
						{/* Home */}
						<Route
							path="/"
							element={
								isAuthenticated() ? (
									<Navigate to="/dashboard" replace />
								) : (
									<Navigate to="/welcome" replace />
								)
							}
						/>

						{/* Public auth routes */}
						<Route
							path="/welcome"
							element={
								<PublicRoute>
									<Welcome />
								</PublicRoute>
							}
						/>

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

						<Route
							path="/utility"
							element={
								<ProtectedRoute>
									<Utility />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/subscription"
							element={
								<ProtectedRoute>
									<Subscription />
								</ProtectedRoute>
							}
						/>

						<Route path="/verify-email" element={<VerifyEmail />} />
						<Route path="/maintenance" element={<Maintenance />} />

						{/* 404 */}
						<Route
							path="*"
							element={
								<div className="app-container py-8">
									<h1 className="text-xl font-semibold">404 – Page not found</h1>
								</div>
							}
						/>
					</Routes>
				</Suspense>
			</div>

			<Footer />
		</div>
	);
}
