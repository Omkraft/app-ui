import { type CSSProperties, useState } from 'react';
import { Link } from 'react-router-dom';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import OmkraftAlert from '@/components/ui/omkraft-alert';
import { StartDatePicker } from '@/components/subscription/StartDatePicker';
import { IndianRupee, LockKeyhole } from 'lucide-react';
import { resolveInvestmentLogo } from '@/utils/investmentBrand';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth/AuthContext';
import {
	DeleteInvestmentDialog,
	DetailTile,
	DialogField,
	FormField,
	InstitutionMark,
	LockedVaultState,
	StatCard,
	TypeBadge,
	UnlockVaultDialog,
	VaultRecordsSection,
	vaultStatIcons,
} from '@/features/personal-vault/components';
import type {
	InvestmentFormState,
	InvestmentRecord,
	InvestmentType,
	RdMaturityInstruction,
} from '@/features/personal-vault/types';
import { usePersonalVault } from '@/features/personal-vault/usePersonalVault';
import {
	buildRdProjection,
	CurrencyValue,
	formatDate,
	formatRate,
	getInitialFormState,
	getMaturityDuration,
	parseFormDate,
	toInputDate,
} from '@/features/personal-vault/utils';

export default function PersonalVault() {
	const { user } = useAuth();
	const userVaultId = user?.id ?? user?.email ?? '';
	const {
		records,
		fdRecords,
		rdRecords,
		totalInvested,
		totalMaturityValue,
		totalInterest,
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
	} = usePersonalVault(userVaultId);
	const allRecords = records;

	return (
		<main className="min-h-[calc(100vh-178px)] bg-[var(--omkraft-blue-50)] text-background">
			<section className="flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink
									asChild
									className="text-primary hover:text-background"
								>
									<Link to="/dashboard">Dashboard</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="text-background" />
							<BreadcrumbItem>
								<BreadcrumbPage className="text-background">
									Personal Vault
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</section>

			<section className="flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					<header className="space-y-4">
						<div
							className="alert-ripple-frame overflow-visible rounded-xl"
							style={
								{
									'--alert-ripple-color': 'var(--info-border)',
								} as CSSProperties
							}
						>
							<OmkraftAlert
								error="Your investment details are end-to-end encrypted, so only you can unlock and view the full record. To send reminders at the right time, we securely store only a few basic details needed for alerts and emails."
								severity="info"
								fallbackTitle="Your vault is private by design"
								fallbackMessage="Your investment details are end-to-end encrypted, so only you can unlock and view the full record. To send reminders at the right time, we securely store only a few basic details needed for alerts and emails."
								icon={LockKeyhole}
							/>
						</div>
						<h1 className="text-4xl font-semibold text-background">
							Personal <span className="text-[var(--omkraft-mint-700)]">Vault</span>
						</h1>
						<p className="text-[var(--omkraft-navy-700)]">
							Track fixed deposits and recurring deposits in one place, with quick
							scanning for the basics and a deeper view for maturity, holders, and
							recurring deposit progress.
						</p>
						<div className="flex flex-wrap gap-3">
							<InvestmentFormDialog
								mode="add"
								disabled={!vaultUnlocked}
								onSubmit={handleAddInvestment}
							/>
							<Button
								type="button"
								variant={vaultUnlocked ? 'outline' : 'default'}
								className="text-sm"
								onClick={() => {
									if (vaultUnlocked) {
										handleLockVault();
										return;
									}

									setUnlockDialogOpen(true);
								}}
							>
								{vaultUnlocked ? 'Lock vault' : 'Unlock vault'}
							</Button>
						</div>
						{vaultError ? (
							<OmkraftAlert error={vaultError} fallbackTitle="Vault error" />
						) : null}
					</header>
				</div>
			</section>

			<section className="py-6 bg-[var(--omkraft-mint-200)]">
				<div className="app-container grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
					<StatCard
						label="Active deposits"
						value={vaultUnlocked ? String(allRecords.length) : 'N/A'}
						helper="All active instruments in view"
						icon={vaultStatIcons.active}
					/>
					<StatCard
						label="Amount invested"
						value={vaultUnlocked ? <CurrencyValue value={totalInvested} /> : 'N/A'}
						helper="Actual principal across tracked records"
						icon={vaultStatIcons.invested}
					/>
					<StatCard
						label="Maturity value"
						value={vaultUnlocked ? <CurrencyValue value={totalMaturityValue} /> : 'N/A'}
						helper="Projected value at maturity"
						icon={vaultStatIcons.maturity}
					/>
					<StatCard
						label="Interest earned"
						value={vaultUnlocked ? <CurrencyValue value={totalInterest} /> : 'N/A'}
						helper="Expected interest across records"
						icon={vaultStatIcons.interest}
					/>
				</div>
			</section>

			<section className="py-6">
				<div className="app-container grid gap-6">
					<Tabs defaultValue="all" className="w-full">
						<Card className="border-[var(--omkraft-blue-200)] bg-foreground text-background shadow-sm">
							<CardHeader className="gap-4 border-b border-[var(--omkraft-blue-100)]">
								<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
									<div className="space-y-2">
										<CardTitle className="text-2xl text-background">
											Deposit records
										</CardTitle>
										<CardDescription className="text-[var(--omkraft-navy-700)]">
											Use the table for a quick scan, then open any record for
											full details including holder information, institution
											branding, and recurring deposit progress.
										</CardDescription>
									</div>
									<TabsList className="grid h-auto w-full grid-cols-3 border border-background bg-primary p-1 text-foreground sm:w-[220px] rounded-lg">
										<TabsTrigger
											value="all"
											className="justify-center whitespace-nowrap"
										>
											All
										</TabsTrigger>
										<TabsTrigger
											value="fd"
											className="justify-center whitespace-nowrap"
										>
											FD
										</TabsTrigger>
										<TabsTrigger
											value="rd"
											className="justify-center whitespace-nowrap"
										>
											RD
										</TabsTrigger>
									</TabsList>
								</div>
							</CardHeader>
							<CardContent className="p-4 lg:p-6">
								<TabsContent value="all" className="mt-0">
									{vaultUnlocked ? (
										<VaultRecordsSection
											loading={loading}
											records={allRecords}
											onViewDetails={setSelectedRecord}
											onEdit={setEditingRecord}
											onDelete={setDeletingRecord}
										/>
									) : (
										<LockedVaultState
											onUnlock={() => setUnlockDialogOpen(true)}
										/>
									)}
								</TabsContent>
								<TabsContent value="fd" className="mt-0">
									{vaultUnlocked ? (
										<VaultRecordsSection
											loading={loading}
											records={fdRecords}
											onViewDetails={setSelectedRecord}
											onEdit={setEditingRecord}
											onDelete={setDeletingRecord}
										/>
									) : (
										<LockedVaultState
											onUnlock={() => setUnlockDialogOpen(true)}
										/>
									)}
								</TabsContent>
								<TabsContent value="rd" className="mt-0">
									{vaultUnlocked ? (
										<VaultRecordsSection
											loading={loading}
											records={rdRecords}
											onViewDetails={setSelectedRecord}
											onEdit={setEditingRecord}
											onDelete={setDeletingRecord}
										/>
									) : (
										<LockedVaultState
											onUnlock={() => setUnlockDialogOpen(true)}
										/>
									)}
								</TabsContent>
							</CardContent>
						</Card>
					</Tabs>
				</div>
			</section>

			<InvestmentDetailsDialog
				record={selectedRecord}
				open={Boolean(selectedRecord)}
				onOpenChange={(open) => {
					if (!open) {
						setSelectedRecord(null);
					}
				}}
			/>
			<InvestmentFormDialog
				mode="edit"
				record={editingRecord}
				open={Boolean(editingRecord)}
				onOpenChange={(open) => {
					if (!open) {
						setEditingRecord(null);
					}
				}}
				onSubmit={(input) => {
					if (!editingRecord) return;
					return handleUpdateInvestment(editingRecord.id, input).then(() => {
						setEditingRecord(null);
					});
				}}
			/>
			<DeleteInvestmentDialog
				record={deletingRecord}
				open={Boolean(deletingRecord)}
				onOpenChange={(open) => {
					if (!open) {
						setDeletingRecord(null);
					}
				}}
				onConfirm={() => {
					if (!deletingRecord) return;
					return handleDeleteInvestment(deletingRecord.id).then(() => {
						setDeletingRecord(null);
					});
				}}
			/>
			<UnlockVaultDialog
				open={unlockDialogOpen}
				onOpenChange={setUnlockDialogOpen}
				onUnlock={handleUnlockVault}
			/>
		</main>
	);
}

function InvestmentFormDialog({
	mode,
	record,
	open,
	onOpenChange,
	disabled = false,
	onSubmit,
}: {
	mode: 'add' | 'edit';
	record?: InvestmentRecord | null;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
	onSubmit: (input: InvestmentFormState) => Promise<void> | void;
}) {
	const [localOpen, setLocalOpen] = useState(false);
	const [form, setForm] = useState<InvestmentFormState>(getInitialFormState(record));
	const [submitting, setSubmitting] = useState(false);

	const dialogOpen = open ?? localOpen;
	const setDialogOpen = onOpenChange ?? setLocalOpen;
	const isRd = form.type === 'RD';
	const rdProjection = isRd ? buildRdProjection(form) : null;

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			{mode === 'add' && (
				<DialogTrigger asChild>
					<Button disabled={disabled}>Add investment</Button>
				</DialogTrigger>
			)}
			<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto text-foreground">
				<DialogHeader>
					<DialogTitle>
						{mode === 'add' ? 'Add investment' : 'Edit investment'}
					</DialogTitle>
				</DialogHeader>

				<form
					className="space-y-4"
					onSubmit={async (event) => {
						event.preventDefault();
						try {
							setSubmitting(true);
							await onSubmit(form);
							setDialogOpen(false);
						} finally {
							setSubmitting(false);
						}
					}}
				>
					<FieldGroup className="gap-5">
						<div className="grid gap-5 sm:grid-cols-2">
							<Field>
								<FieldLabel htmlFor="investment-type">
									Investment type <span className="text-destructive">*</span>
								</FieldLabel>
								<Select
									value={form.type}
									onValueChange={(value) =>
										setForm((current) => ({
											...current,
											type: value as InvestmentType,
										}))
									}
								>
									<SelectTrigger
										id="investment-type"
										className="border-border bg-muted"
									>
										<SelectValue placeholder="Select investment type" />
									</SelectTrigger>
									<SelectContent className="bg-[var(--omkraft-blue-700)] text-foreground">
										<SelectItem value="FD" className="focus:text-background">
											Fixed Deposit
										</SelectItem>
										<SelectItem value="RD" className="focus:text-background">
											Recurring Deposit
										</SelectItem>
									</SelectContent>
								</Select>
							</Field>
							<Field>
								<FieldLabel htmlFor="institution-name">
									Institution name <span className="text-destructive">*</span>
								</FieldLabel>
								<Input
									id="institution-name"
									value={form.institutionName}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											institutionName: event.target.value,
										}))
									}
									required
								/>
							</Field>
						</div>

						<div className="grid gap-5 sm:grid-cols-2">
							<Field>
								<FieldLabel htmlFor="holder-names">
									Holder names <span className="text-destructive">*</span>
								</FieldLabel>
								<Input
									id="holder-names"
									value={form.holderNames}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											holderNames: event.target.value,
										}))
									}
									required
								/>
								<FieldDescription className="text-xs">
									Separate multiple names with commas.
								</FieldDescription>
							</Field>
							<Field>
								<FieldLabel htmlFor="first-holder">
									First holder <span className="text-destructive">*</span>
								</FieldLabel>
								<Input
									id="first-holder"
									value={form.firstHolder}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											firstHolder: event.target.value,
										}))
									}
									required
								/>
							</Field>
						</div>

						<Field>
							<FieldLabel htmlFor="institution-reference">
								Branch / reference details
							</FieldLabel>
							<Input
								id="institution-reference"
								value={form.institutionReference}
								onChange={(event) =>
									setForm((current) => ({
										...current,
										institutionReference: event.target.value,
									}))
								}
								placeholder="Branch, FD/RD number, folio, or any helpful note"
							/>
							<FieldDescription className="text-xs">
								Keep the institution name simple above. Use this field for branch,
								reference, or identifying notes.
							</FieldDescription>
						</Field>

						{isRd ? (
							<>
								<div className="grid gap-5 sm:grid-cols-2">
									<Field>
										<FieldLabel htmlFor="deposit-date">
											Start date <span className="text-destructive">*</span>
										</FieldLabel>
										<StartDatePicker
											placeholder="Select start date"
											value={parseFormDate(form.depositDate)}
											onChange={(date) =>
												setForm((current) => ({
													...current,
													depositDate: toInputDate(date),
												}))
											}
										/>
									</Field>
									<FormField
										id="due-day"
										label="Due day of month"
										value={form.dueDayOfMonth}
										onChange={(value) =>
											setForm((current) => ({
												...current,
												dueDayOfMonth: value,
											}))
										}
										type="number"
									/>
									<FormField
										id="tenure-months"
										label="Tenure months"
										value={form.tenureMonths}
										onChange={(value) =>
											setForm((current) => ({
												...current,
												tenureMonths: value,
											}))
										}
										type="number"
									/>
									<FormField
										id="actual-paid"
										label="Actual installments paid"
										value={form.actualInstallmentsPaid}
										onChange={(value) =>
											setForm((current) => ({
												...current,
												actualInstallmentsPaid: value,
											}))
										}
										type="number"
									/>
								</div>

								<div className="grid gap-5 sm:grid-cols-2">
									<Field>
										<FieldLabel htmlFor="monthly-installment">
											Monthly installment{' '}
											<span className="text-destructive">*</span>
										</FieldLabel>
										<InputGroup className="border border-border bg-input">
											<InputGroupInput
												id="monthly-installment"
												value={form.monthlyInstallment}
												onChange={(event) =>
													setForm((current) => ({
														...current,
														monthlyInstallment: event.target.value,
													}))
												}
												required
											/>
											<InputGroupAddon>
												<IndianRupee size={14} strokeWidth={2.5} />
											</InputGroupAddon>
										</InputGroup>
									</Field>
									<Field>
										<FieldLabel htmlFor="roi">
											Interest rate{' '}
											<span className="text-destructive">*</span>
										</FieldLabel>
										<InputGroup className="border border-border bg-input">
											<InputGroupInput
												id="roi"
												value={form.roi}
												onChange={(event) =>
													setForm((current) => ({
														...current,
														roi: event.target.value,
													}))
												}
												required
											/>
											<InputGroupAddon align="inline-end">%</InputGroupAddon>
										</InputGroup>
									</Field>
									<Field>
										<FieldLabel htmlFor="maturity-amount">
											Projected maturity value{' '}
											<span className="text-destructive">*</span>
										</FieldLabel>
										<InputGroup className="border border-border bg-input">
											<InputGroupInput
												id="maturity-amount"
												value={form.maturityAmount}
												onChange={(event) =>
													setForm((current) => ({
														...current,
														maturityAmount: event.target.value,
													}))
												}
												required
											/>
											<InputGroupAddon>
												<IndianRupee size={14} strokeWidth={2.5} />
											</InputGroupAddon>
										</InputGroup>
									</Field>
									<Field>
										<FieldLabel htmlFor="maturity-date">
											Maturity date{' '}
											<span className="text-destructive">*</span>
										</FieldLabel>
										<Input
											id="maturity-date"
											value={
												rdProjection
													? formatDate(rdProjection.maturityDate)
													: ''
											}
											readOnly
											disabled
										/>
									</Field>
								</div>

								<div className="grid gap-5 sm:grid-cols-2">
									<Field>
										<FieldLabel htmlFor="maturity-instruction">
											Maturity instruction{' '}
											<span className="text-destructive">*</span>
										</FieldLabel>
										<Select
											value={form.maturityInstruction}
											onValueChange={(value) =>
												setForm((current) => ({
													...current,
													maturityInstruction:
														value as RdMaturityInstruction,
												}))
											}
										>
											<SelectTrigger
												id="maturity-instruction"
												className="border-border bg-muted"
											>
												<SelectValue placeholder="Select instruction" />
											</SelectTrigger>
											<SelectContent className="bg-[var(--omkraft-blue-700)] text-foreground">
												<SelectItem
													value="Credit to savings"
													className="focus:text-background"
												>
													Credit to savings
												</SelectItem>
												<SelectItem
													value="Renew on maturity"
													className="focus:text-background"
												>
													Renew on maturity
												</SelectItem>
												<SelectItem
													value="Manual settlement"
													className="focus:text-background"
												>
													Manual settlement
												</SelectItem>
											</SelectContent>
										</Select>
									</Field>
									<Field>
										<FieldLabel htmlFor="auto-debit">
											Auto debit enabled{' '}
											<span className="text-destructive">*</span>
										</FieldLabel>
										<Select
											value={form.autoDebitEnabled}
											onValueChange={(value) =>
												setForm((current) => ({
													...current,
													autoDebitEnabled: value as 'yes' | 'no',
												}))
											}
										>
											<SelectTrigger
												id="auto-debit"
												className="border-border bg-muted"
											>
												<SelectValue placeholder="Select option" />
											</SelectTrigger>
											<SelectContent className="bg-[var(--omkraft-blue-700)] text-foreground">
												<SelectItem
													value="yes"
													className="focus:text-background"
												>
													Yes
												</SelectItem>
												<SelectItem
													value="no"
													className="focus:text-background"
												>
													No
												</SelectItem>
											</SelectContent>
										</Select>
									</Field>
									<FormField
										id="nominee"
										label="Nominee"
										value={form.nominee}
										onChange={(value) =>
											setForm((current) => ({ ...current, nominee: value }))
										}
									/>
									<Field>
										<FieldLabel htmlFor="tax-saving">
											Tax saving <span className="text-destructive">*</span>
										</FieldLabel>
										<Select
											value={form.isTaxSaving}
											onValueChange={(value) =>
												setForm((current) => ({
													...current,
													isTaxSaving: value as 'yes' | 'no',
												}))
											}
										>
											<SelectTrigger
												id="tax-saving"
												className="border-border bg-muted"
											>
												<SelectValue placeholder="Select option" />
											</SelectTrigger>
											<SelectContent className="bg-[var(--omkraft-blue-700)] text-foreground">
												<SelectItem
													value="no"
													className="focus:text-background"
												>
													No
												</SelectItem>
												<SelectItem
													value="yes"
													className="focus:text-background"
												>
													Yes
												</SelectItem>
											</SelectContent>
										</Select>
									</Field>
								</div>

								{rdProjection ? (
									<Card className="border-[var(--omkraft-blue-100)] bg-[var(--omkraft-blue-50)] shadow-none">
										<CardContent className="grid gap-4 p-4 md:grid-cols-3">
											<DialogField
												label="Expected invested by today"
												value={
													<CurrencyValue
														value={rdProjection.expectedInvestedAmount}
													/>
												}
											/>
											<DialogField
												label="Actual invested"
												value={
													<CurrencyValue
														value={rdProjection.actualInvestedAmount}
													/>
												}
											/>
											<DialogField
												label="Next due date"
												value={
													rdProjection.nextDueDate
														? formatDate(rdProjection.nextDueDate)
														: 'Completed'
												}
											/>
										</CardContent>
									</Card>
								) : null}
							</>
						) : (
							<>
								<div className="grid gap-5 sm:grid-cols-2">
									<Field>
										<FieldLabel htmlFor="deposit-date">
											Deposit date <span className="text-destructive">*</span>
										</FieldLabel>
										<StartDatePicker
											placeholder="Select deposit date"
											value={parseFormDate(form.depositDate)}
											onChange={(date) =>
												setForm((current) => ({
													...current,
													depositDate: toInputDate(date),
												}))
											}
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor="maturity-date">
											Maturity date{' '}
											<span className="text-destructive">*</span>
										</FieldLabel>
										<StartDatePicker
											placeholder="Select maturity date"
											value={parseFormDate(form.maturityDate)}
											onChange={(date) =>
												setForm((current) => ({
													...current,
													maturityDate: toInputDate(date),
												}))
											}
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor="amount-invested">
											Amount invested{' '}
											<span className="text-destructive">*</span>
										</FieldLabel>
										<InputGroup className="border border-border bg-input">
											<InputGroupInput
												id="amount-invested"
												value={form.amountInvested}
												onChange={(event) =>
													setForm((current) => ({
														...current,
														amountInvested: event.target.value,
													}))
												}
												required
											/>
											<InputGroupAddon>
												<IndianRupee size={14} strokeWidth={2.5} />
											</InputGroupAddon>
										</InputGroup>
									</Field>
									<Field>
										<FieldLabel htmlFor="roi">
											ROI <span className="text-destructive">*</span>
										</FieldLabel>
										<InputGroup className="border border-border bg-input">
											<InputGroupInput
												id="roi"
												value={form.roi}
												onChange={(event) =>
													setForm((current) => ({
														...current,
														roi: event.target.value,
													}))
												}
												required
											/>
											<InputGroupAddon align="inline-end">%</InputGroupAddon>
										</InputGroup>
									</Field>
								</div>

								<div className="grid gap-5 sm:grid-cols-2">
									<Field>
										<FieldLabel htmlFor="maturity-amount">
											Maturity amount{' '}
											<span className="text-destructive">*</span>
										</FieldLabel>
										<InputGroup className="border border-border bg-input">
											<InputGroupInput
												id="maturity-amount"
												value={form.maturityAmount}
												onChange={(event) =>
													setForm((current) => ({
														...current,
														maturityAmount: event.target.value,
													}))
												}
												required
											/>
											<InputGroupAddon>
												<IndianRupee size={14} strokeWidth={2.5} />
											</InputGroupAddon>
										</InputGroup>
									</Field>
									<Field>
										<FieldLabel htmlFor="payout-type">
											Payout type <span className="text-destructive">*</span>
										</FieldLabel>
										<Select
											value={form.payoutType}
											onValueChange={(value) =>
												setForm((current) => ({
													...current,
													payoutType: value,
												}))
											}
										>
											<SelectTrigger
												id="payout-type"
												className="border-border bg-muted"
											>
												<SelectValue placeholder="Select payout type" />
											</SelectTrigger>
											<SelectContent className="bg-[var(--omkraft-blue-700)] text-foreground">
												<SelectItem
													value="Cumulative"
													className="focus:text-background"
												>
													Cumulative
												</SelectItem>
												<SelectItem
													value="Monthly payout"
													className="focus:text-background"
												>
													Monthly payout
												</SelectItem>
												<SelectItem
													value="Quarterly payout"
													className="focus:text-background"
												>
													Quarterly payout
												</SelectItem>
											</SelectContent>
										</Select>
									</Field>
									<FormField
										id="nominee"
										label="Nominee"
										value={form.nominee}
										onChange={(value) =>
											setForm((current) => ({ ...current, nominee: value }))
										}
									/>
									<Field>
										<FieldLabel htmlFor="tax-saving">
											Tax saving <span className="text-destructive">*</span>
										</FieldLabel>
										<Select
											value={form.isTaxSaving}
											onValueChange={(value) =>
												setForm((current) => ({
													...current,
													isTaxSaving: value as 'yes' | 'no',
												}))
											}
										>
											<SelectTrigger
												id="tax-saving"
												className="border-border bg-muted"
											>
												<SelectValue placeholder="Select option" />
											</SelectTrigger>
											<SelectContent className="bg-[var(--omkraft-blue-700)] text-foreground">
												<SelectItem
													value="no"
													className="focus:text-background"
												>
													No
												</SelectItem>
												<SelectItem
													value="yes"
													className="focus:text-background"
												>
													Yes
												</SelectItem>
											</SelectContent>
										</Select>
									</Field>
								</div>
							</>
						)}
					</FieldGroup>

					<Button type="submit" className="w-full btn-primary" disabled={submitting}>
						{submitting
							? mode === 'add'
								? 'Saving...'
								: 'Updating...'
							: mode === 'add'
								? 'Save investment'
								: 'Update investment'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function InvestmentDetailsDialog({
	record,
	open,
	onOpenChange,
}: {
	record: InvestmentRecord | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	if (!record) {
		return null;
	}

	const logo = resolveInvestmentLogo(record.institutionName);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-[var(--omkraft-blue-200)] bg-foreground p-6 pt-10 text-background sm:p-7 sm:pt-10">
				<Card className="border-accent bg-[var(--omkraft-mint-50)] text-background shadow-none">
					<CardContent className="p-5 lg:p-6">
						<DialogHeader className="space-y-4 text-left">
							<div className="flex items-start gap-4">
								<InstitutionMark
									logo={logo}
									institutionName={record.institutionName}
									className="h-16 w-16"
								/>
								<div className="space-y-2">
									<div className="flex flex-wrap items-center gap-2">
										<DialogTitle className="text-2xl">
											{record.institutionName}
										</DialogTitle>
										<TypeBadge type={record.type} />
										<Badge className="border-transparent bg-[var(--omkraft-mint-200)] text-[var(--omkraft-mint-900)] shadow-none">
											{record.payoutType}
										</Badge>
									</div>
									<DialogDescription className="text-sm text-[var(--omkraft-navy-700)]">
										{record.institutionReference ||
											'No branch or reference details added.'}
									</DialogDescription>
								</div>
							</div>
						</DialogHeader>
					</CardContent>
				</Card>

				<div
					className={`grid grid-cols-1 gap-5 ${
						record.rdPlan ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
					}`}
				>
					<DetailTile
						label={record.type === 'RD' ? 'Actual invested' : 'Amount invested'}
						value={<CurrencyValue value={record.amountInvested} />}
					/>
					{record.rdPlan ? (
						<DetailTile
							label="Expected invested"
							value={<CurrencyValue value={record.rdPlan.expectedInvestedAmount} />}
						/>
					) : null}
					<DetailTile
						label="Maturity amount"
						value={<CurrencyValue value={record.maturityAmount} />}
					/>
					<DetailTile
						label="Interest earned"
						value={<CurrencyValue value={record.interestEarned} />}
					/>
				</div>

				<Card className="border-[var(--omkraft-blue-100)] bg-[var(--omkraft-blue-50)] text-background shadow-none">
					<CardContent className="grid gap-x-3 gap-y-8 p-6 sm:grid-cols-2 lg:grid-cols-3">
						<DialogField label="Holder names" value={record.holderNames.join(', ')} />
						<DialogField label="First holder" value={record.firstHolder} />
						<DialogField label="Nominee" value={record.nominee} />
						<DialogField
							label={record.type === 'RD' ? 'Start date' : 'Deposit date'}
							value={formatDate(record.depositDate)}
						/>
						<DialogField
							label="Maturity date"
							value={formatDate(record.maturityDate)}
						/>
						<DialogField label="ROI" value={formatRate(record.roi)} />
						<DialogField
							label={record.type === 'RD' ? 'Maturity instruction' : 'Payout type'}
							value={record.payoutType}
						/>
						<DialogField label="Tax saving" value={record.isTaxSaving ? 'Yes' : 'No'} />
						<DialogField
							label="Time to maturity"
							value={getMaturityDuration(record.maturityDate)}
						/>
						{record.rdPlan ? (
							<>
								<DialogField
									label="Monthly installment"
									value={
										<CurrencyValue value={record.rdPlan.monthlyInstallment} />
									}
								/>
								<DialogField
									label="Due day"
									value={`Every month on ${record.rdPlan.dueDayOfMonth}`}
								/>
								<DialogField
									label="Tenure"
									value={`${record.rdPlan.tenureMonths} months`}
								/>
								<DialogField
									label="Expected installments"
									value={String(record.rdPlan.expectedInstallmentsByToday)}
								/>
								<DialogField
									label="Actual installments"
									value={String(record.rdPlan.actualInstallmentsPaid)}
								/>
								<DialogField
									label="Auto debit"
									value={record.rdPlan.autoDebitEnabled ? 'Enabled' : 'Disabled'}
								/>
								<DialogField
									label="Next due date"
									value={
										record.rdPlan.nextDueDate
											? formatDate(record.rdPlan.nextDueDate)
											: 'Completed'
									}
								/>
							</>
						) : null}
					</CardContent>
				</Card>

				{record.rdPlan ? (
					<Card className="border-[var(--omkraft-blue-100)] bg-foreground text-background shadow-none">
						<CardHeader className="space-y-2">
							<CardTitle className="text-lg">Installment progress</CardTitle>
							<CardDescription className="text-[var(--omkraft-navy-700)]">
								Expected schedule is auto-generated from the RD master record, while
								paid installments are tracked separately.
							</CardDescription>
						</CardHeader>
						<CardContent className="p-0">
							<div className="hidden md:block">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-transparent">
											<TableHead>Installment</TableHead>
											<TableHead>Due date</TableHead>
											<TableHead className="text-right">Amount</TableHead>
											<TableHead>Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{record.rdPlan.paymentEntries.map((entry) => (
											<TableRow key={entry.installmentNumber}>
												<TableCell>{entry.installmentNumber}</TableCell>
												<TableCell>{formatDate(entry.dueDate)}</TableCell>
												<TableCell className="text-right">
													<CurrencyValue
														value={entry.amount}
														className="justify-end"
														iconClassName="size-3.5"
													/>
												</TableCell>
												<TableCell>
													<Badge
														className={
															entry.status === 'paid'
																? 'border-transparent bg-[var(--omkraft-mint-200)] text-[var(--omkraft-mint-900)] shadow-none'
																: 'border-transparent bg-[var(--omkraft-blue-100)] text-[var(--omkraft-blue-900)] shadow-none'
														}
													>
														{entry.status === 'paid'
															? 'Paid'
															: 'Pending'}
													</Badge>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
							<div className="grid gap-3 p-4 md:hidden">
								{record.rdPlan.paymentEntries.map((entry) => (
									<Card
										key={entry.installmentNumber}
										className="border-[var(--omkraft-blue-100)] bg-[var(--omkraft-blue-50)] shadow-none"
									>
										<CardContent className="grid gap-2 p-4">
											<div className="flex items-center justify-between gap-3">
												<p className="font-medium">
													Installment {entry.installmentNumber}
												</p>
												<Badge
													className={
														entry.status === 'paid'
															? 'border-transparent bg-[var(--omkraft-mint-200)] text-[var(--omkraft-mint-900)] shadow-none'
															: 'border-transparent bg-[var(--omkraft-blue-100)] text-[var(--omkraft-blue-900)] shadow-none'
													}
												>
													{entry.status === 'paid' ? 'Paid' : 'Pending'}
												</Badge>
											</div>
											<p className="text-sm text-[var(--omkraft-navy-700)]">
												Due {formatDate(entry.dueDate)}
											</p>
											<p className="font-medium">
												<CurrencyValue
													value={entry.amount}
													iconClassName="size-3.5"
												/>
											</p>
										</CardContent>
									</Card>
								))}
							</div>
						</CardContent>
					</Card>
				) : null}
			</DialogContent>
		</Dialog>
	);
}
