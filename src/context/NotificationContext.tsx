import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { fetchNotifications, type Notification } from '@/api/notification';
import { reportUiError } from '@/lib/error';

type NotificationContextType = {
	notifications: Notification[];
	unreadCount: number;
	refreshNotifications: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function getStoredUserId() {
	const storedUser = localStorage.getItem('auth');

	if (!storedUser) {
		return null;
	}

	try {
		return JSON.parse(storedUser).id ?? null;
	} catch {
		localStorage.removeItem('auth');
		return null;
	}
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
	const socketRef = useRef<Socket | null>(null);
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const refreshNotifications = useCallback(async () => {
		try {
			const data = await fetchNotifications();
			setNotifications(data);
		} catch (error) {
			reportUiError('notifications:fetch', error);
		}
	}, []);

	useEffect(() => {
		refreshNotifications();
	}, [refreshNotifications]);

	useEffect(() => {
		const token = localStorage.getItem('token');
		const userId = getStoredUserId();

		if (!token || !userId || socketRef.current) {
			return;
		}

		const socket = io(import.meta.env.VITE_API_BASE_URL, {
			transports: ['websocket'],
			auth: { token },
			withCredentials: true,
		});

		socketRef.current = socket;

		socket.on('connect', () => {
			socket.emit('join', userId);
		});

		socket.on('connect_error', (error) => {
			reportUiError('notifications:socket-connect', error, { message: error.message });
		});

		socket.on('notification:new', async () => {
			await refreshNotifications();
		});

		socket.on('notification:resolved', ({ subscriptionId }) => {
			setNotifications((prev) =>
				prev.map((notification) =>
					notification.metadata?.subscriptionId === subscriptionId
						? { ...notification, read: true }
						: notification
				)
			);
		});

		socket.on('notification:read', ({ notificationId }) => {
			setNotifications((prev) =>
				prev.map((notification) =>
					notification._id === notificationId
						? { ...notification, read: true }
						: notification
				)
			);
		});

		return () => {
			socket.disconnect();
			socketRef.current = null;
		};
	}, [refreshNotifications]);

	const unreadCount = notifications.filter((notification) => !notification.read).length;

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
