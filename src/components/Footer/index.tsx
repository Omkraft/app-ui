import { useAuth } from '@/auth/AuthContext';
import { FooterPublic } from './FooterPublic';
import { FooterApp } from './FooterApp';

export default function Footer() {
	const { isAuthenticated } = useAuth();

	// React will re-render automatically when auth state changes
	return isAuthenticated ? <FooterApp /> : <FooterPublic />;
}
