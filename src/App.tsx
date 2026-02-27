import { lazy, Suspense, useEffect } from 'react';
import { isIosSafari } from '@/utils/isIos';
import { omkraftToast } from '@/lib/toast';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import Loading from './components/Loading';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import { isAuthenticated } from './utils/auth';
import Footer from './components/Footer';
import Maintenance from './pages/Maintenance';
import { PWAUpdateToast } from './components/pwa/PWAUpdateToast';
import { ConnectionToast } from './components/pwa/ConnectionToast';
import { isStandalone } from '@/utils/isStandalone';
import { useAppVersion } from '@/hooks/useAppVersion';

import './App.css';
import { Save } from 'lucide-react';

const Welcome = lazy(() => import('./pages/Welcome'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Utility = lazy(() => import('./pages/Utility'));
const Subscription = lazy(() => import('./pages/Subscription'));

export default function App() {
	useAppVersion();
	useEffect(() => {
		// Only for iOS Safari
		if (!isIosSafari()) return;

		// Do not show if already installed
		if (isStandalone()) return;

		// Do not show if already shown before
		const lastShown = localStorage.getItem('omkraft-install-toast-shown');

		if (lastShown && Date.now() - Number(lastShown) < 7 * 24 * 60 * 60 * 1000) return;

		omkraftToast.info('Install Omkraft', {
			description: 'Tap Share → Add to Home Screen',
			icon: <Save size={18} strokeWidth={2.5} />,
			duration: Infinity,
		});

		localStorage.setItem('omkraft-install-toast-shown', Date.now().toString());
	}, []);
	return (
		<div className="flex flex-col">
			<ConnectionToast />
			<PWAUpdateToast />
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
