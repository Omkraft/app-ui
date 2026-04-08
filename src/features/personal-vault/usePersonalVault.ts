import { createElement, useCallback, useEffect, useMemo, useState } from 'react';
import {
	addInvestment,
	deleteInvestment as deleteInvestmentApi,
	getInvestments,
	updateInvestment,
} from '@/api/investment';
import { verifyPassword } from '@/api/auth';
import { reportUiError, toDisplayError } from '@/lib/error';
import { Lock, LockOpen } from 'lucide-react';
import {
	clearVaultSessionKey,
	decryptInvestmentRecord,
	encryptInvestmentRecord,
	hasVaultSessionKey,
	storeVaultSessionKey,
} from '@/lib/investmentVaultCrypto';
import { omkraftToast } from '@/lib/toast';
import type { InvestmentFormState, InvestmentRecord } from './types';
import { buildInvestmentRecord, toPersistedInvestment } from './utils';

export function usePersonalVault(userVaultId: string) {
	const [records, setRecords] = useState<InvestmentRecord[]>([]);
	const [selectedRecord, setSelectedRecord] = useState<InvestmentRecord | null>(null);
	const [editingRecord, setEditingRecord] = useState<InvestmentRecord | null>(null);
	const [deletingRecord, setDeletingRecord] = useState<InvestmentRecord | null>(null);
	const [loading, setLoading] = useState(false);
	const [vaultError, setVaultError] = useState<unknown | null>(null);
	const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);
	const vaultUnlocked = Boolean(userVaultId) && hasVaultSessionKey(userVaultId);

	const hydrateRecord = useCallback(
		async (encryptedRecord: { _id: string; encryptedPayload: string; iv: string }) => {
			const decrypted = await decryptInvestmentRecord<Omit<InvestmentRecord, 'id'>>(
				userVaultId,
				encryptedRecord
			);

			return {
				...decrypted,
				id: encryptedRecord._id,
			} satisfies InvestmentRecord;
		},
		[userVaultId]
	);

	const refreshInvestments = useCallback(async () => {
		if (!userVaultId || !vaultUnlocked) {
			setRecords([]);
			return;
		}

		setVaultError(null);
		try {
			setLoading(true);
			const encryptedRecords = await getInvestments();
			const decryptedRecords = await Promise.all(encryptedRecords.map(hydrateRecord));
			setRecords(decryptedRecords);
		} catch (error) {
			reportUiError('investment:fetch', error);
			setVaultError(toDisplayError(error, 'Failed to load investments.'));
		} finally {
			setLoading(false);
		}
	}, [hydrateRecord, userVaultId, vaultUnlocked]);

	useEffect(() => {
		if (vaultUnlocked) {
			void refreshInvestments();
			return;
		}

		setRecords([]);
	}, [refreshInvestments, vaultUnlocked]);

	const handleAddInvestment = useCallback(
		async (input: InvestmentFormState) => {
			if (!userVaultId) return;

			try {
				const nextRecord = buildInvestmentRecord(input);
				const encryptedPayload = await encryptInvestmentRecord(
					userVaultId,
					toPersistedInvestment(nextRecord)
				);
				const savedRecord = await addInvestment(encryptedPayload);
				const hydratedRecord = await hydrateRecord(savedRecord);
				setRecords((current) => [hydratedRecord, ...current]);
				omkraftToast.success('Investment saved');
			} catch (error) {
				reportUiError('investment:create', error);
				setVaultError(toDisplayError(error, 'Failed to save investment.'));
				throw error;
			}
		},
		[hydrateRecord, userVaultId]
	);

	const handleUpdateInvestment = useCallback(
		async (id: string, input: InvestmentFormState) => {
			if (!userVaultId) return;

			try {
				const nextRecord = buildInvestmentRecord(input, id);
				const encryptedPayload = await encryptInvestmentRecord(
					userVaultId,
					toPersistedInvestment(nextRecord)
				);
				const savedRecord = await updateInvestment(id, encryptedPayload);
				const hydratedRecord = await hydrateRecord(savedRecord);
				setRecords((current) =>
					current.map((record) => (record.id === id ? hydratedRecord : record))
				);
				omkraftToast.success('Investment updated');
			} catch (error) {
				reportUiError('investment:update', error, { id });
				setVaultError(toDisplayError(error, 'Failed to update investment.'));
				throw error;
			}
		},
		[hydrateRecord, userVaultId]
	);

	const handleDeleteInvestment = useCallback(async (id: string) => {
		try {
			await deleteInvestmentApi(id);
			setRecords((current) => current.filter((record) => record.id !== id));
			omkraftToast.success('Investment deleted');
		} catch (error) {
			reportUiError('investment:delete', error, { id });
			setVaultError(toDisplayError(error, 'Failed to delete investment.'));
			throw error;
		}
	}, []);

	const handleUnlockVault = useCallback(
		async (password: string) => {
			if (!userVaultId) return;

			try {
				await verifyPassword(password);
				await storeVaultSessionKey(password, userVaultId);
				setUnlockDialogOpen(false);
				omkraftToast.success('Vault unlocked', {
					icon: createElement(LockOpen, { size: 18, strokeWidth: 2.5 }),
				});
				await refreshInvestments();
			} catch (error) {
				reportUiError('investment:unlock', error);
				setVaultError(toDisplayError(error, 'Failed to unlock vault.'));
				throw error;
			}
		},
		[refreshInvestments, userVaultId]
	);

	const handleLockVault = useCallback(() => {
		if (!userVaultId) return;

		clearVaultSessionKey(userVaultId);
		setRecords([]);
		setSelectedRecord(null);
		setEditingRecord(null);
		setDeletingRecord(null);
		setUnlockDialogOpen(false);
		setVaultError(null);
		omkraftToast.success('Vault locked', {
			icon: createElement(Lock, { size: 18, strokeWidth: 2.5 }),
		});
	}, [userVaultId]);

	return {
		records,
		fdRecords: useMemo(() => records.filter((record) => record.type === 'FD'), [records]),
		rdRecords: useMemo(() => records.filter((record) => record.type === 'RD'), [records]),
		totalInvested: useMemo(
			() => records.reduce((sum, record) => sum + record.amountInvested, 0),
			[records]
		),
		totalMaturityValue: useMemo(
			() => records.reduce((sum, record) => sum + record.maturityAmount, 0),
			[records]
		),
		totalInterest: useMemo(
			() => records.reduce((sum, record) => sum + record.interestEarned, 0),
			[records]
		),
		selectedRecord,
		setSelectedRecord,
		editingRecord,
		setEditingRecord,
		deletingRecord,
		setDeletingRecord,
		loading,
		vaultError,
		vaultUnlocked,
		unlockDialogOpen,
		setUnlockDialogOpen,
		handleAddInvestment,
		handleUpdateInvestment,
		handleDeleteInvestment,
		handleUnlockVault,
		handleLockVault,
	};
}
