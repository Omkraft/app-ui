// src/services/socket.ts

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectSocket(token: string): Socket {
	if (socket?.connected) {
		return socket;
	}

	socket = io(import.meta.env.VITE_API_URL, {
		transports: ['websocket'],
		withCredentials: true,
		auth: {
			token: token, // ✅ explicitly provided
		},
	});

	return socket;
}

export function getSocket(): Socket | null {
	return socket;
}

export function disconnectSocket() {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
}
