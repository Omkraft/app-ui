import '@fontsource/inter/latin.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AuthProvider } from './context/auth/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import './index.scss'; // Tailwind
import './styles/global.scss'; // Omkraft styles

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AuthProvider>
			<NotificationProvider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</NotificationProvider>
		</AuthProvider>
	</React.StrictMode>
);
