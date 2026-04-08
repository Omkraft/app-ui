import { type ReactNode, useEffect, useState } from 'react';
import {
	ArrowRight,
	BadgeIndianRupee,
	Building2,
	ChartNoAxesColumn,
	Ellipsis,
	Eye,
	EyeOff,
	Landmark,
	Lock,
	PiggyBank,
	WalletCards,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import OmkraftAlert from '@/components/ui/omkraft-alert';
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
import { resolveInvestmentLogo } from '@/utils/investmentBrand';
import type { InvestmentFormState, InvestmentRecord, InvestmentType } from './types';
import {
	CurrencyValue,
	formatDate,
	formatRate,
	getInitialFormState,
	getInvestmentAttentionState,
} from './utils';

export const vaultStatIcons = {
	active: WalletCards,
	invested: PiggyBank,
	maturity: ChartNoAxesColumn,
	interest: BadgeIndianRupee,
};

export function StatCard({
	label,
	value,
	helper,
	icon: Icon,
}: {
	label: string;
	value: ReactNode;
	helper: string;
	icon: typeof PiggyBank;
}) {
	return (
		<Card className="border-accent bg-foreground text-background">
			<CardContent className="flex items-start justify-between gap-4 p-5">
				<div className="space-y-2">
					<p className="text-sm text-[var(--omkraft-navy-700)]">{label}</p>
					<p className="text-2xl font-semibold text-background">{value}</p>
					<p className="text-xs text-[var(--omkraft-navy-700)]">{helper}</p>
				</div>
				<div className="rounded-2xl bg-[var(--omkraft-mint-100)] p-3 text-accent">
					<Icon className="size-6" />
				</div>
			</CardContent>
		</Card>
	);
}

export function VaultRecordsSection({
	loading,
	records,
	onViewDetails,
	onEdit,
	onDelete,
}: {
	loading: boolean;
	records: InvestmentRecord[];
	onViewDetails: (record: InvestmentRecord) => void;
	onEdit: (record: InvestmentRecord) => void;
	onDelete: (record: InvestmentRecord) => void;
}) {
	if (loading) {
		return (
			<EmptyVaultState
				title="Loading investments..."
				description="Decrypting your investment records for this session."
			/>
		);
	}

	if (!records.length) {
		return (
			<EmptyVaultState
				title="No deposit records to show yet."
				description="Once records are added, this view will summarize the essentials first and keep every secondary detail one click away."
			/>
		);
	}

	return (
		<div className="space-y-4">
			<div className="hidden lg:block">
				<Table>
					<TableHeader>
						<TableRow className="border-[var(--omkraft-mint-100)] hover:bg-transparent">
							<TableHead className="text-[var(--omkraft-navy-700)]">
								Institution
							</TableHead>
							<TableHead className="text-[var(--omkraft-navy-700)]">
								Holders
							</TableHead>
							<TableHead className="text-[var(--omkraft-navy-700)]">
								Deposit Date
							</TableHead>
							<TableHead className="text-[var(--omkraft-navy-700)]">
								Maturity Date
							</TableHead>
							<TableHead className="text-right text-[var(--omkraft-navy-700)]">
								Amount Invested
							</TableHead>
							<TableHead className="text-right text-[var(--omkraft-navy-700)]">
								ROI
							</TableHead>
							<TableHead className="text-right text-[var(--omkraft-navy-700)]">
								Maturity Amount
							</TableHead>
							<TableHead className="text-right text-[var(--omkraft-navy-700)]">
								Action
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{records.map((record) => (
							// Highlight records that are close to maturity or already matured.
							<TableRow
								key={record.id}
								className={getVaultRecordRowClassName(record)}
							>
								<TableCell className="font-medium text-background">
									<div className="flex items-center gap-2">
										<span>{record.institutionName}</span>
										<MaturityAttentionBadge
											maturityDate={record.maturityDate}
										/>
									</div>
								</TableCell>
								<TableCell className="text-background">
									{record.holderNames.join(', ')}
								</TableCell>
								<TableCell className="text-background">
									{formatDate(record.depositDate)}
								</TableCell>
								<TableCell className="text-background">
									{formatDate(record.maturityDate)}
								</TableCell>
								<TableCell className="text-right font-medium text-background">
									<CurrencyValue
										value={record.amountInvested}
										className="justify-end"
									/>
								</TableCell>
								<TableCell className="text-right text-background">
									{formatRate(record.roi)}
								</TableCell>
								<TableCell className="text-right font-medium text-background">
									<CurrencyValue
										value={record.maturityAmount}
										className="justify-end"
									/>
								</TableCell>
								<TableCell className="text-right">
									<div className="flex items-center justify-end gap-3 text-sm">
										<ActionLink
											label="View"
											onClick={() => onViewDetails(record)}
										/>
										<ActionLink label="Edit" onClick={() => onEdit(record)} />
										<ActionLink
											label="Delete"
											onClick={() => onDelete(record)}
											className="text-[var(--destructive)] hover:text-[var(--omkraft-red-700)]"
										/>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<div className="grid gap-4 lg:hidden">
				{records.map((record) => (
					<InvestmentMobileCard
						key={record.id}
						record={record}
						onViewDetails={() => onViewDetails(record)}
						onEdit={() => onEdit(record)}
						onDelete={() => onDelete(record)}
					/>
				))}
			</div>
		</div>
	);
}

export function InvestmentFormDialog({
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

	useEffect(() => {
		if (!dialogOpen) {
			return;
		}

		setForm(getInitialFormState(record));
	}, [dialogOpen, record]);

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

export function DeleteInvestmentDialog({
	record,
	open,
	onOpenChange,
	onConfirm,
}: {
	record: InvestmentRecord | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => Promise<void> | void;
}) {
	const [submitting, setSubmitting] = useState(false);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md bg-foreground text-background">
				<DialogHeader className="space-y-3 text-left">
					<DialogTitle>Delete investment</DialogTitle>
					<DialogDescription className="text-[var(--omkraft-navy-700)]">
						{record
							? `Remove ${record.institutionName} from your Personal Vault?`
							: 'Remove this investment from your Personal Vault?'}
					</DialogDescription>
				</DialogHeader>
				<div className="flex justify-end gap-3">
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						type="button"
						variant="destructive"
						disabled={submitting}
						onClick={async () => {
							try {
								setSubmitting(true);
								await onConfirm();
							} finally {
								setSubmitting(false);
							}
						}}
					>
						{submitting ? 'Deleting...' : 'Delete'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export function LockedVaultState({
	onUnlock,
	btnClassName,
}: {
	onUnlock: () => void;
	btnClassName?: string;
}) {
	return (
		<div className="space-y-4">
			<OmkraftAlert
				error="Your investment details are end-to-end encrypted. Enter your password to unlock and view them."
				severity="info"
				fallbackTitle="Vault locked"
				fallbackMessage="Your investment details are end-to-end encrypted. Enter your password to unlock and view them."
				icon={Lock}
			/>
			<Button type="button" className={btnClassName} onClick={onUnlock}>
				Unlock vault
			</Button>
		</div>
	);
}

export function UnlockVaultDialog({
	open,
	onOpenChange,
	onUnlock,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onUnlock: (password: string) => Promise<void>;
}) {
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [unlocking, setUnlocking] = useState(false);
	const [error, setError] = useState<unknown | null>(null);

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				onOpenChange(nextOpen);
				if (!nextOpen) {
					setPassword('');
					setShowPassword(false);
					setError(null);
				}
			}}
		>
			<DialogContent className="max-w-md text-foreground">
				<DialogHeader>
					<DialogTitle>Unlock vault</DialogTitle>
					<DialogDescription>
						Enter your password to open your private investment records.
					</DialogDescription>
				</DialogHeader>
				<form
					className="space-y-4"
					onSubmit={async (event) => {
						event.preventDefault();
						setError(null);
						try {
							setUnlocking(true);
							await onUnlock(password);
						} catch (unlockError) {
							setError(unlockError);
						} finally {
							setUnlocking(false);
						}
					}}
				>
					<Field>
						<FieldLabel htmlFor="vault-password">
							Password <span className="text-destructive">*</span>
						</FieldLabel>
						<InputGroup className="border border-border bg-input">
							<InputGroupInput
								id="vault-password"
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								required
							/>
							<InputGroupAddon align="inline-end">
								<Button
									className="hover:bg-transparent"
									onClick={() => setShowPassword((current) => !current)}
									size="icon"
									type="button"
									variant="ghost"
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4 text-muted-foreground" />
									) : (
										<Eye className="h-4 w-4 text-muted-foreground" />
									)}
								</Button>
							</InputGroupAddon>
						</InputGroup>
					</Field>
					<OmkraftAlert error={error} fallbackTitle="Unlock failed" />
					<Button type="submit" className="w-full" disabled={unlocking}>
						{unlocking ? 'Unlocking...' : 'Unlock vault'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export function InvestmentDetailsDialog({
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
			</DialogContent>
		</Dialog>
	);
}

function InvestmentMobileCard({
	record,
	onViewDetails,
	onEdit,
	onDelete,
}: {
	record: InvestmentRecord;
	onViewDetails: () => void;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const logo = resolveInvestmentLogo(record.institutionName);

	return (
		<Card className={getVaultRecordCardClassName(record)}>
			<CardHeader className="space-y-4">
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-center gap-3">
						<InstitutionMark logo={logo} institutionName={record.institutionName} />
						<div>
							<CardTitle className="text-base text-background">
								{record.institutionName}
							</CardTitle>
							<CardDescription className="mt-1 text-background">
								{record.holderNames.join(', ')}
							</CardDescription>
							<div className="mt-2">
								<MaturityAttentionBadge maturityDate={record.maturityDate} />
							</div>
						</div>
					</div>
					<TypeBadge type={record.type} />
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
					<DetailTile
						label="Amount"
						value={<CurrencyValue value={record.amountInvested} />}
					/>
					<DetailTile label="Matures on" value={formatDate(record.maturityDate)} />
					<DetailTile label="ROI" value={formatRate(record.roi)} />
					<DetailTile
						label="Mat Amt"
						value={<CurrencyValue value={record.maturityAmount} />}
					/>
				</div>
				<div className="flex items-center justify-between gap-3">
					<ActionLink label="View" onClick={onViewDetails} withIcon />
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon">
								<Ellipsis className="size-4" />
								<span className="sr-only">More actions</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
							<DropdownMenuItem
								onClick={onDelete}
								className="text-[var(--destructive)] focus:text-[var(--destructive)]"
							>
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardContent>
		</Card>
	);
}

function EmptyVaultState({ title, description }: { title: string; description: string }) {
	return (
		<OmkraftAlert
			error={description}
			severity="info"
			fallbackTitle={title}
			fallbackMessage={description}
		/>
	);
}

export function DetailTile({ label, value }: { label: string; value: ReactNode }) {
	return (
		<Card className="border-[var(--omkraft-mint-200)] bg-[var(--omkraft-mint-50)] text-background shadow-none">
			<CardContent className="p-4">
				<p className="text-xs uppercase tracking-[0.18em] text-[var(--omkraft-navy-700)]">
					{label}
				</p>
				<p className="mt-2 text-base font-semibold text-background">{value}</p>
			</CardContent>
		</Card>
	);
}

export function DialogField({ label, value }: { label: string; value: ReactNode }) {
	return (
		<div className="space-y-1">
			<p className="text-xs uppercase tracking-[0.18em] text-[var(--omkraft-navy-700)]">
				{label}
			</p>
			<div className="text-base font-semibold text-background">{value}</div>
		</div>
	);
}

export function FormField({
	id,
	label,
	value,
	onChange,
	type = 'text',
	required = false,
	placeholder,
}: {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	type?: string;
	required?: boolean;
	placeholder?: string;
}) {
	return (
		<Field>
			<FieldLabel htmlFor={id}>
				{label} {required ? <span className="text-destructive">*</span> : null}
			</FieldLabel>
			<Input
				id={id}
				type={type}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				required={required}
				placeholder={placeholder}
			/>
		</Field>
	);
}

export function ActionLink({
	label,
	onClick,
	className = '',
	withIcon = false,
}: {
	label: string;
	onClick: () => void;
	className?: string;
	withIcon?: boolean;
}) {
	return (
		<button
			type="button"
			className={`inline-flex items-center gap-2 font-medium text-[var(--omkraft-blue-800)] underline-offset-4 transition-colors hover:text-[var(--omkraft-blue-900)] hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
			onClick={onClick}
		>
			{label}
			{withIcon && <ArrowRight className="size-4" />}
		</button>
	);
}

export function TypeBadge({ type }: { type: InvestmentRecord['type'] }) {
	return (
		<Badge
			className={
				type === 'FD'
					? 'border-transparent bg-[var(--omkraft-blue-100)] text-[var(--omkraft-blue-900)] shadow-none'
					: 'border-transparent bg-[var(--omkraft-indigo-100)] text-[var(--omkraft-indigo-900)] shadow-none'
			}
		>
			{type}
		</Badge>
	);
}

export function InstitutionMark({
	logo,
	institutionName,
	className,
}: {
	logo: ReturnType<typeof resolveInvestmentLogo>;
	institutionName: string;
	className?: string;
}) {
	const [imageFailed, setImageFailed] = useState(false);
	const FallbackIcon = institutionName.trim().toLowerCase().includes('finance')
		? Landmark
		: Building2;

	return (
		<div className={`flex items-center justify-center ${className}`}>
			{logo.type === 'image' && !imageFailed ? (
				<img
					src={logo.src}
					alt={logo.alt ?? `${institutionName} logo`}
					className="h-14 w-14 object-contain"
					onError={() => setImageFailed(true)}
				/>
			) : logo.Icon ? (
				<logo.Icon className="size-8 text-[var(--omkraft-mint-900)]" />
			) : (
				<FallbackIcon className="size-8 text-[var(--omkraft-mint-900)]" />
			)}
		</div>
	);
}

function getVaultRecordRowClassName(record: InvestmentRecord) {
	const attentionState = getInvestmentAttentionState(record.maturityDate);

	if (attentionState === 'matured') {
		return 'border-[var(--omkraft-red-200)] bg-[var(--omkraft-red-50)]/60';
	}

	if (attentionState === 'maturing-soon') {
		return 'border-[var(--omkraft-yellow-300)] bg-[var(--omkraft-yellow-50)]/70';
	}

	return 'border-[var(--omkraft-mint-100)] bg-foreground/60';
}

function getVaultRecordCardClassName(record: InvestmentRecord) {
	const attentionState = getInvestmentAttentionState(record.maturityDate);

	if (attentionState === 'matured') {
		return 'border-[var(--omkraft-red-200)] bg-[var(--omkraft-red-50)] text-background shadow-sm';
	}

	if (attentionState === 'maturing-soon') {
		return 'border-[var(--omkraft-yellow-300)] bg-[var(--omkraft-yellow-50)] text-background shadow-sm';
	}

	return 'border-accent bg-foreground text-background shadow-sm';
}

function MaturityAttentionBadge({ maturityDate }: { maturityDate: string }) {
	const attentionState = getInvestmentAttentionState(maturityDate);

	if (attentionState === 'matured') {
		return (
			<Badge className="border-transparent bg-[var(--omkraft-red-100)] text-[var(--omkraft-red-800)] shadow-none">
				Matured
			</Badge>
		);
	}

	if (attentionState === 'maturing-soon') {
		return (
			<Badge className="border-transparent bg-[var(--omkraft-yellow-100)] text-[var(--omkraft-yellow-900)] shadow-none">
				Maturing soon
			</Badge>
		);
	}

	return null;
}
