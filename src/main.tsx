import '@fontsource/inter/latin.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { AuthProvider } from './auth/AuthContext';
import './index.scss';          // Tailwind
import './styles/global.scss'; // Omkraft styles

ReactDOM.createRoot(
	document.getElementById('root')!
).render(
	<React.StrictMode>
		<AuthProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</AuthProvider>
	</React.StrictMode>
);
