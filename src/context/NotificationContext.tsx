import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { fetchNotifications, type Notification } from '@/api/notification';

type NotificationContextType = {
	notifications: Notification[];
	unreadCount: number;
	refreshNotifications: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
	const socketRef = useRef<Socket | null>(null);
	const [notifications, setNotifications] = useState<Notification[]>([]);

	// fetch function
	const refreshNotifications = useCallback(async () => {
		try {
			const data = await fetchNotifications();

			setNotifications(data);
		} catch (error) {
			console.error('Notification fetch failed', error);
		}
	}, []);

	// initial fetch
	useEffect(() => {
		refreshNotifications();
	}, [refreshNotifications]);

	useEffect(() => {
		const token = localStorage.getItem('token');
		const storedUser = localStorage.getItem('auth');
		const userId = storedUser ? JSON.parse(storedUser).id : null;

		if (!token || !userId) return;

		// ✅ prevent React StrictMode duplicate connection
		if (socketRef.current) return;

		const socket = io(import.meta.env.VITE_API_BASE_URL, {
			transports: ['websocket'], // ✅ IMPORTANT
			auth: { token },
			withCredentials: true,
		});

		socketRef.current = socket;

		socket.on('connect', () => {
			console.log('Socket connected:', socket.id);

			// CRITICAL: join user room
			socket.emit('join', userId);
		});

		socket.on('disconnect', (reason) => {
			console.log('Notification socket disconnected:', reason);
		});

		socket.on('connect_error', (error) => {
			console.error('Socket connection error:', error.message);
		});

		// NEW notification
		socket.on('notification:new', async () => {
			await refreshNotifications();
		});

		// notification resolved (subscription paid)
		socket.on('notification:resolved', ({ subscriptionId }) => {
			setNotifications((prev) =>
				prev.map((n) =>
					n.metadata?.subscriptionId === subscriptionId ? { ...n, read: true } : n
				)
			);
		});

		// notification manually read
		socket.on('notification:read', ({ notificationId }) => {
			setNotifications((prev) =>
				prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
			);
		});

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
				socketRef.current = null;
			}
		};
	}, [refreshNotifications]);

	const unreadCount = notifications.filter((n) => !n.read).length;

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				unreadCount,
				refreshNotifications,
			}}
		>
			{children}
		</NotificationContext.Provider>
	);
}

export function useNotifications() {
	const context = useContext(NotificationContext);

	if (!context) {
		throw new Error('useNotifications must be used inside NotificationProvider');
	}

	return context;
}
