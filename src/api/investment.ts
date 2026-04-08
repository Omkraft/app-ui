import { apiRequest } from './client';

export interface EncryptedInvestmentPayload {
	encryptedPayload: string;
	iv: string;
	encryptionAlgorithm: string;
	keyDerivation: string;
	encryptionVersion: number;
}

export interface EncryptedInvestmentRecord extends EncryptedInvestmentPayload {
	_id: string;
	createdAt: string;
	updatedAt: string;
}

export function getInvestments() {
	return apiRequest<EncryptedInvestmentRecord[]>('/api/investment', {
		method: 'GET',
	});
}

export function addInvestment(payload: EncryptedInvestmentPayload) {
	return apiRequest<EncryptedInvestmentRecord>('/api/investment', {
		method: 'POST',
		body: JSON.stringify(payload),
	});
}

export function updateInvestment(id: string, payload: EncryptedInvestmentPayload) {
	return apiRequest<EncryptedInvestmentRecord>(`/api/investment/${id}`, {
		method: 'PUT',
		body: JSON.stringify(payload),
	});
}

export function deleteInvestment(id: string) {
	return apiRequest<{ success: true; data: EncryptedInvestmentRecord }>(`/api/investment/${id}`, {
		method: 'DELETE',
	});
}
