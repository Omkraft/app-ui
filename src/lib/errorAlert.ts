import { ApiError } from '@/api/client';

export type ErrorAlertDetails = {
	title: string;
	message: string;
	status?: number;
};

function fromStatus(status: number): ErrorAlertDetails {
	switch (status) {
		case 400:
			return {
				title: 'Invalid request',
				message: 'Please review your input and try again.',
				status,
			};
		case 401:
			return {
				title: 'Session expired',
				message: 'Please login again to continue.',
				status,
			};
		case 403:
			return {
				title: 'Access denied',
				message: 'You do not have permission to perform this action.',
				status,
			};
		case 404:
			return {
				title: 'Not found',
				message: 'The requested resource could not be found.',
				status,
			};
		case 409:
			return {
				title: 'Conflict detected',
				message: 'This action conflicts with existing data.',
				status,
			};
		case 422:
			return {
				title: 'Validation error',
				message: 'Some fields are invalid. Please correct and submit again.',
				status,
			};
		case 429:
			return {
				title: 'Too many requests',
				message: 'Please wait for a moment and try again.',
				status,
			};
		default:
			if (status >= 500) {
				return {
					title: 'Service unavailable',
					message: 'Server is temporarily unavailable. Please try again shortly.',
					status,
				};
			}

			return {
				title: 'Request failed',
				message: 'Something went wrong while processing the request.',
				status,
			};
	}
}

export function getErrorAlertDetails(
	error: unknown,
	fallbackTitle = 'Action failed',
	fallbackMessage = 'Something went wrong. Please try again.'
): ErrorAlertDetails {
	if (error instanceof ApiError && typeof error.status === 'number') {
		if (error.status === 401) {
			const msg = (error.message || '').toLowerCase();
			if (msg.includes('invalid credential') || msg.includes('invalid credentials')) {
				return {
					title: 'Login failed',
					message: error.message,
					status: 401,
				};
			}

			if (msg.includes('session expired')) {
				return {
					title: 'Session expired',
					message: error.message,
					status: 401,
				};
			}

			return {
				title: 'Authentication required',
				message: error.message || 'Please login to continue.',
				status: 401,
			};
		}

		const mapped = fromStatus(error.status);
		return {
			...mapped,
			message: error.message || mapped.message,
		};
	}

	if (typeof error === 'object' && error !== null) {
		const maybeStatus = (error as { status?: unknown }).status;
		const maybeMessage = (error as { message?: unknown }).message;
		if (typeof maybeStatus === 'number') {
			const mapped = fromStatus(maybeStatus);
			return {
				...mapped,
				message:
					typeof maybeMessage === 'string' && maybeMessage
						? maybeMessage
						: mapped.message,
			};
		}

		if (typeof maybeMessage === 'string' && maybeMessage) {
			return {
				title: fallbackTitle,
				message: maybeMessage,
			};
		}
	}

	if (typeof error === 'string' && error) {
		return {
			title: fallbackTitle,
			message: error,
		};
	}

	return {
		title: fallbackTitle,
		message: fallbackMessage,
	};
}
