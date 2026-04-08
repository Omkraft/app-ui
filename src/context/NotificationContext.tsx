import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { fetchNotifications, markNotificationRead, type Notification } from '@/api/notification';
import { reportUiError } from '@/lib/error';

type NotificationContextType = {
	notifications: Notification[];
	unreadCount: number;
	refreshNotifications: () => Promise<void>;
	markAsRead: (notificationId: string) => Promise<void>;
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

	const markAsRead = useCallback(
		async (notificationId: string) => {
			setNotifications((prev) =>
				prev.map((notification) =>
					notification._id === notificationId
						? { ...notification, read: true }
						: notification
				)
			);

			try {
				await markNotificationRead(notificationId);
			} catch (error) {
				reportUiError('notifications:mark-read', error, { notificationId });
				await refreshNotifications();
			}
		},
		[refreshNotifications]
	);

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
			socket.emit('presence:heartbeat');
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

		const heartbeatInterval = window.setInterval(() => {
			if (socket.connected) {
				socket.emit('presence:heartbeat');
			}
		}, 60 * 1000);

		const handleVisibility = () => {
			if (document.visibilityState === 'visible' && socket.connected) {
				socket.emit('presence:heartbeat');
			}
		};

		document.addEventListener('visibilitychange', handleVisibility);

		return () => {
			window.clearInterval(heartbeatInterval);
			document.removeEventListener('visibilitychange', handleVisibility);
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
				markAsRead,
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
