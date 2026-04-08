import { IndianRupee } from 'lucide-react';
import type { InvestmentFormState, InvestmentRecord, RdPaymentEntry } from './types';

export function getInitialFormState(record?: InvestmentRecord | null): InvestmentFormState {
	if (!record) {
		return {
			type: 'FD',
			holderNames: '',
			firstHolder: '',
			institutionName: '',
			institutionReference: '',
			depositDate: '',
			maturityDate: '',
			amountInvested: '',
			roi: '',
			maturityAmount: '',
			payoutType: 'Cumulative',
			nominee: '',
			isTaxSaving: 'no',
			monthlyInstallment: '',
			dueDayOfMonth: '',
			tenureMonths: '',
			actualInstallmentsPaid: '0',
			maturityInstruction: 'Credit to savings',
			autoDebitEnabled: 'yes',
		};
	}

	return {
		type: record.type,
		holderNames: record.holderNames.join(', '),
		firstHolder: record.firstHolder,
		institutionName: record.institutionName,
		institutionReference: record.institutionReference,
		depositDate: record.depositDate,
		maturityDate: record.maturityDate,
		amountInvested: String(record.amountInvested),
		roi: String(record.roi),
		maturityAmount: String(record.maturityAmount),
		payoutType: record.payoutType,
		nominee: record.nominee,
		isTaxSaving: record.isTaxSaving ? 'yes' : 'no',
		monthlyInstallment: record.rdPlan ? String(record.rdPlan.monthlyInstallment) : '',
		dueDayOfMonth: record.rdPlan ? String(record.rdPlan.dueDayOfMonth) : '',
		tenureMonths: record.rdPlan ? String(record.rdPlan.tenureMonths) : '',
		actualInstallmentsPaid: record.rdPlan ? String(record.rdPlan.actualInstallmentsPaid) : '0',
		maturityInstruction: record.rdPlan?.maturityInstruction ?? 'Credit to savings',
		autoDebitEnabled: record.rdPlan?.autoDebitEnabled ? 'yes' : 'no',
	};
}

export function buildRdProjection(input: InvestmentFormState) {
	const startDate = parseFormDate(input.depositDate) ?? new Date();
	const dueDayOfMonth = clampNumber(Number(input.dueDayOfMonth) || startDate.getDate(), 1, 31);
	const tenureMonths = Math.max(1, Number(input.tenureMonths) || 1);
	const monthlyInstallment = Math.max(0, Number(input.monthlyInstallment) || 0);
	const actualInstallmentsPaid = clampNumber(
		Number(input.actualInstallmentsPaid) || 0,
		0,
		tenureMonths
	);
	const projectedMaturityAmount =
		Math.max(0, Number(input.maturityAmount) || 0) ||
		calculateRdProjectedMaturity(monthlyInstallment, Number(input.roi) || 0, tenureMonths);

	const paymentEntries = Array.from({ length: tenureMonths }, (_, index) => {
		const dueDate = toInputDate(getRdDueDate(startDate, dueDayOfMonth, index));
		const isPaid = index < actualInstallmentsPaid;

		return {
			installmentNumber: index + 1,
			dueDate,
			amount: monthlyInstallment,
			status: isPaid ? 'paid' : 'pending',
			paidDate: isPaid ? dueDate : undefined,
		} satisfies RdPaymentEntry;
	});

	const today = new Date();
	const expectedInstallmentsByToday = paymentEntries.filter(
		(entry) => parseFormDate(entry.dueDate) && parseFormDate(entry.dueDate)! <= today
	).length;

	return {
		monthlyInstallment,
		dueDayOfMonth,
		tenureMonths,
		actualInstallmentsPaid,
		expectedInstallmentsByToday,
		expectedInvestedAmount: expectedInstallmentsByToday * monthlyInstallment,
		actualInvestedAmount: actualInstallmentsPaid * monthlyInstallment,
		projectedMaturityAmount,
		autoDebitEnabled: input.autoDebitEnabled === 'yes',
		maturityInstruction: input.maturityInstruction,
		nextDueDate: paymentEntries.find((entry) => entry.status === 'pending')?.dueDate ?? null,
		paymentEntries,
		maturityDate: paymentEntries[paymentEntries.length - 1]?.dueDate ?? toInputDate(startDate),
	};
}

export function buildInvestmentRecord(
	input: InvestmentFormState,
	existingId?: string
): InvestmentRecord {
	if (input.type === 'RD') {
		const rdPlan = buildRdProjection(input);

		return {
			id: existingId ?? `${input.type.toLowerCase()}-${Date.now()}`,
			type: input.type,
			holderNames: input.holderNames
				.split(',')
				.map((value) => value.trim())
				.filter(Boolean),
			firstHolder: input.firstHolder.trim(),
			institutionName: input.institutionName.trim(),
			institutionReference: input.institutionReference.trim(),
			depositDate: input.depositDate,
			maturityDate: rdPlan.maturityDate,
			amountInvested: rdPlan.actualInvestedAmount,
			roi: Number(input.roi) || 0,
			maturityAmount: rdPlan.projectedMaturityAmount,
			interestEarned: rdPlan.projectedMaturityAmount - rdPlan.expectedInvestedAmount,
			payoutType: input.maturityInstruction,
			nominee: input.nominee.trim(),
			isTaxSaving: input.isTaxSaving === 'yes',
			rdPlan,
		};
	}

	const amountInvested = Number(input.amountInvested) || 0;
	const maturityAmount = Number(input.maturityAmount) || 0;

	return {
		id: existingId ?? `${input.type.toLowerCase()}-${Date.now()}`,
		type: input.type,
		holderNames: input.holderNames
			.split(',')
			.map((value) => value.trim())
			.filter(Boolean),
		firstHolder: input.firstHolder.trim(),
		institutionName: input.institutionName.trim(),
		institutionReference: input.institutionReference.trim(),
		depositDate: input.depositDate,
		maturityDate: input.maturityDate,
		amountInvested,
		roi: Number(input.roi) || 0,
		maturityAmount,
		interestEarned: maturityAmount - amountInvested,
		payoutType: input.payoutType,
		nominee: input.nominee.trim(),
		isTaxSaving: input.isTaxSaving === 'yes',
	};
}

export function toPersistedInvestment(record: InvestmentRecord): Omit<InvestmentRecord, 'id'> {
	const { id, ...persistedRecord } = record;
	void id;
	return persistedRecord;
}

export function formatCurrencyNumber(value: number) {
	return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
}

export function formatRate(value: number) {
	return `${value.toFixed(2)}%`;
}

export function parseFormDate(value: string) {
	if (!value) return undefined;

	const [year, month, day] = value.split('-').map(Number);
	if (!year || !month || !day) return undefined;

	const date = new Date(year, month - 1, day);
	return Number.isNaN(date.getTime()) ? undefined : date;
}

export function toInputDate(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function formatDate(value: string) {
	const date = parseFormDate(value);
	if (!date) return '';

	return date.toLocaleDateString('en-IN', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
}

export function getMaturityDuration(maturityDate: string) {
	const today = new Date();
	const maturity = parseFormDate(maturityDate);
	if (!maturity) return 'Maturity date unavailable';

	const differenceInMs = maturity.getTime() - today.getTime();
	const differenceInDays = Math.max(0, Math.ceil(differenceInMs / (1000 * 60 * 60 * 24)));

	if (differenceInDays === 0) return 'Matures today';
	if (differenceInDays === 1) return '1 day remaining';
	return `${differenceInDays} days remaining`;
}

export function CurrencyValue({
	value,
	className = '',
	iconClassName = 'size-4',
}: {
	value: number;
	className?: string;
	iconClassName?: string;
}) {
	return (
		<span className={`inline-flex items-center gap-1 ${className}`}>
			<IndianRupee className={iconClassName} strokeWidth={2.2} />
			<span>{formatCurrencyNumber(value)}</span>
		</span>
	);
}

function getRdDueDate(startDate: Date, dueDayOfMonth: number, installmentIndex: number) {
	const candidate = addMonthsSafe(startDate, installmentIndex);
	const dueDate = setDayWithinMonth(candidate, dueDayOfMonth);

	if (installmentIndex === 0 && dueDate < startDate) {
		return setDayWithinMonth(addMonthsSafe(startDate, 1), dueDayOfMonth);
	}

	return dueDate;
}

function setDayWithinMonth(date: Date, dayOfMonth: number) {
	const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	return new Date(date.getFullYear(), date.getMonth(), Math.min(dayOfMonth, lastDay));
}

function addMonthsSafe(date: Date, months: number) {
	const working = new Date(date);
	const originalDay = working.getDate();

	working.setDate(1);
	working.setMonth(working.getMonth() + months);

	const lastDay = new Date(working.getFullYear(), working.getMonth() + 1, 0).getDate();
	working.setDate(Math.min(originalDay, lastDay));

	return working;
}

function calculateRdProjectedMaturity(
	monthlyInstallment: number,
	rate: number,
	tenureMonths: number
) {
	if (!monthlyInstallment || !tenureMonths) return 0;

	const monthlyRate = rate / 100 / 12;
	if (!monthlyRate) return monthlyInstallment * tenureMonths;

	let total = 0;
	for (let index = 0; index < tenureMonths; index += 1) {
		const monthsRemaining = tenureMonths - index;
		total += monthlyInstallment * Math.pow(1 + monthlyRate, monthsRemaining);
	}

	return Math.round(total);
}

function clampNumber(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}
