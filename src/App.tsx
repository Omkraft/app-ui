import { lazy, Suspense, useEffect, useState } from 'react';
import { isIosSafari } from '@/utils/isIos';
import { omkraftToast } from '@/lib/toast';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

import './App.css';
import { ArrowUp, Save } from 'lucide-react';

const Welcome = lazy(() => import('./pages/Welcome'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Utility = lazy(() => import('./pages/Utility'));
const Panchang = lazy(() => import('./pages/Panchang'));
const Subscription = lazy(() => import('./pages/Subscription'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const ManageUsers = lazy(() => import('./pages/ManageUsers'));

function ScrollToTopOnRouteChange() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'auto',
		});
	}, [pathname]);

	return null;
}

function ScrollToTopButton() {
	const { pathname } = useLocation();
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setVisible(window.scrollY > 480);
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	useEffect(() => {
		setVisible(false);
	}, [pathname]);

	return (
		<button
			type="button"
			aria-label="Scroll to top"
			onClick={() =>
				window.scrollTo({
					top: 0,
					left: 0,
					behavior: 'smooth',
				})
			}
			className={`fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-muted-foreground bg-primary text-primary-foreground shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl lg:bottom-6 lg:right-6 lg:h-auto lg:w-auto lg:px-5 lg:py-3 ${
				visible
					? 'pointer-events-auto translate-y-0 opacity-100'
					: 'pointer-events-none translate-y-4 opacity-0'
			}`}
		>
			<ArrowUp className="size-5 shrink-0" />
			<span className="hidden lg:inline">Scroll to top</span>
		</button>
	);
}

export default function App() {
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
			<ScrollToTopOnRouteChange />
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
							path="/panchang"
							element={
								<ProtectedRoute>
									<Panchang />
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

						<Route
							path="/profile/edit"
							element={
								<ProtectedRoute>
									<EditProfile />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/dashboard"
							element={
								<ProtectedRoute>
									<ManageUsers />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/users"
							element={<Navigate to="/admin/dashboard" replace />}
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
			<ScrollToTopButton />
			<Footer />
		</div>
	);
}
