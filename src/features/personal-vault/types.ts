export type InvestmentType = 'FD' | 'RD';
export type RdMaturityInstruction = 'Credit to savings' | 'Renew on maturity' | 'Manual settlement';
export type RdPaymentStatus = 'paid' | 'pending';
export type VaultTab = 'all' | 'fd' | 'rd';
export type VaultSortBy =
	| 'institutionName'
	| 'holderNames'
	| 'depositDate'
	| 'maturityDate'
	| 'amountInvested'
	| 'roi'
	| 'maturityAmount';

export interface RdPaymentEntry {
	installmentNumber: number;
	dueDate: string;
	amount: number;
	status: RdPaymentStatus;
	paidDate?: string;
}

export interface RdPlan {
	monthlyInstallment: number;
	dueDayOfMonth: number;
	tenureMonths: number;
	actualInstallmentsPaid: number;
	expectedInstallmentsByToday: number;
	expectedInvestedAmount: number;
	actualInvestedAmount: number;
	projectedMaturityAmount: number;
	autoDebitEnabled: boolean;
	maturityInstruction: RdMaturityInstruction;
	nextDueDate: string | null;
	paymentEntries: RdPaymentEntry[];
}

export interface InvestmentRecord {
	id: string;
	type: InvestmentType;
	holderNames: string[];
	firstHolder: string;
	institutionName: string;
	institutionReference: string;
	depositDate: string;
	maturityDate: string;
	amountInvested: number;
	roi: number;
	maturityAmount: number;
	interestEarned: number;
	payoutType: string;
	nominee: string;
	isTaxSaving: boolean;
	rdPlan?: RdPlan;
}

export interface InvestmentFormState {
	type: InvestmentType;
	holderNames: string;
	firstHolder: string;
	institutionName: string;
	institutionReference: string;
	depositDate: string;
	maturityDate: string;
	amountInvested: string;
	roi: string;
	maturityAmount: string;
	payoutType: string;
	nominee: string;
	isTaxSaving: 'yes' | 'no';
	monthlyInstallment: string;
	dueDayOfMonth: string;
	tenureMonths: string;
	actualInstallmentsPaid: string;
	maturityInstruction: RdMaturityInstruction;
	autoDebitEnabled: 'yes' | 'no';
}
