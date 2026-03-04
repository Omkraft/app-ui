import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowUpDown, IndianRupee, Pencil, Trash } from 'lucide-react';
import { useAuth } from '@/context/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import OmkraftAlert from '@/components/ui/omkraft-alert';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { StartDatePicker } from '@/components/subscription/StartDatePicker';
import type { AdminUser, UserRole } from '@/api/adminUsers';
import { deleteAdminUser, listUsers, updateAdminUser } from '@/api/adminUsers';
import type { AdminSubscription } from '@/api/adminSubscriptions';
import {
	type AdminSubscriptionRemovalMode,
	deleteAdminSubscription,
	listAdminSubscriptions,
	updateAdminSubscription,
} from '@/api/adminSubscriptions';
import { isPositiveNumeric } from '@/utils/format';

type UserSortBy = 'firstName' | 'lastName' | 'email' | 'createdAt' | 'role';
type SubscriptionSortBy =
	| 'name'
	| 'user'
	| 'provider'
	| 'amount'
	| 'status'
	| 'nextBillingDate'
	| 'createdAt';
type SortOrder = 'asc' | 'desc';

function formatDate(dateLike: string | Date) {
	const d = new Date(dateLike);
	if (Number.isNaN(d.getTime())) return '-';
	return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function subtractMonthsSafe(date: Date, months: number) {
	const d = new Date(date);
	const originalDay = d.getDate();

	d.setDate(1);
	d.setMonth(d.getMonth() - months);

	const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

	d.setDate(Math.min(originalDay, lastDay));

	return d;
}

function subtractYearsSafe(date: Date, years: number) {
	const d = new Date(date);
	const originalDay = d.getDate();

	d.setDate(1);
	d.setFullYear(d.getFullYear() - years);

	const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

	d.setDate(Math.min(originalDay, lastDay));

	return d;
}

function calculateLastChargedDate(nextBillingDate: Date, cycleInDays: number) {
	if (cycleInDays === 30) {
		return subtractMonthsSafe(nextBillingDate, 1);
	}

	if (cycleInDays === 365) {
		return subtractYearsSafe(nextBillingDate, 1);
	}

	const prev = new Date(nextBillingDate);
	prev.setDate(prev.getDate() - cycleInDays);
	return prev;
}

export default function ManageUsers() {
	const { user } = useAuth();
	const [tab, setTab] = useState<'users' | 'subscriptions'>('users');

	const [users, setUsers] = useState<AdminUser[]>([]);
	const [usersLoading, setUsersLoading] = useState(false);
	const [usersError, setUsersError] = useState<unknown | null>(null);
	const [userSearchInput, setUserSearchInput] = useState('');
	const [userSearch, setUserSearch] = useState('');
	const [userPage, setUserPage] = useState(1);
	const [userTotalPages, setUserTotalPages] = useState(1);
	const [userTotal, setUserTotal] = useState(0);
	const [userSortBy, setUserSortBy] = useState<UserSortBy>('createdAt');
	const [userSortOrder, setUserSortOrder] = useState<SortOrder>('desc');

	const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
	const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
	const [subscriptionsError, setSubscriptionsError] = useState<unknown | null>(null);
	const [subscriptionSearchInput, setSubscriptionSearchInput] = useState('');
	const [subscriptionSearch, setSubscriptionSearch] = useState('');
	const [subscriptionPage, setSubscriptionPage] = useState(1);
	const [subscriptionTotalPages, setSubscriptionTotalPages] = useState(1);
	const [subscriptionTotal, setSubscriptionTotal] = useState(0);
	const [subscriptionSortBy, setSubscriptionSortBy] =
		useState<SubscriptionSortBy>('nextBillingDate');
	const [subscriptionSortOrder, setSubscriptionSortOrder] = useState<SortOrder>('asc');

	useEffect(() => {
		const timer = setTimeout(() => {
			setUserPage(1);
			setUserSearch(userSearchInput.trim());
		}, 350);
		return () => clearTimeout(timer);
	}, [userSearchInput]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setSubscriptionPage(1);
			setSubscriptionSearch(subscriptionSearchInput.trim());
		}, 350);
		return () => clearTimeout(timer);
	}, [subscriptionSearchInput]);

	useEffect(() => {
		if (tab === 'users') {
			void fetchUsers();
		}
	}, [tab, userPage, userSearch, userSortBy, userSortOrder]);

	useEffect(() => {
		if (tab === 'subscriptions') {
			void fetchSubscriptions();
		}
	}, [tab, subscriptionPage, subscriptionSearch, subscriptionSortBy, subscriptionSortOrder]);

	async function fetchUsers() {
		setUsersError(null);
		try {
			setUsersLoading(true);
			const res = await listUsers({
				page: userPage,
				limit: 10,
				search: userSearch,
				sortBy: userSortBy,
				sortOrder: userSortOrder,
			});
			setUsers(res.data);
			setUserTotalPages(res.pagination.totalPages);
			setUserTotal(res.pagination.total);
		} catch (err) {
			setUsersError(err instanceof Error ? err : 'Failed to load users');
		} finally {
			setUsersLoading(false);
		}
	}

	async function fetchSubscriptions() {
		setSubscriptionsError(null);
		try {
			setSubscriptionsLoading(true);
			const res = await listAdminSubscriptions({
				page: subscriptionPage,
				limit: 10,
				search: subscriptionSearch,
				sortBy: subscriptionSortBy,
				sortOrder: subscriptionSortOrder,
			});
			setSubscriptions(res.data);
			setSubscriptionTotalPages(res.pagination.totalPages);
			setSubscriptionTotal(res.pagination.total);
		} catch (err) {
			setSubscriptionsError(err instanceof Error ? err : 'Failed to load subscriptions');
		} finally {
			setSubscriptionsLoading(false);
		}
	}

	function onUserSort(column: UserSortBy) {
		if (userSortBy === column) {
			setUserSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
			return;
		}
		setUserSortBy(column);
		setUserSortOrder('asc');
	}

	function onSubscriptionSort(column: SubscriptionSortBy) {
		if (subscriptionSortBy === column) {
			setSubscriptionSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
			return;
		}
		setSubscriptionSortBy(column);
		setSubscriptionSortOrder('asc');
	}

	if (user?.role !== 'ADMIN') {
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<main className="min-h-[calc(100vh-178px)] bg-[var(--omkraft-blue-100)]">
			<section className="flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink
									asChild
									className="text-[var(--omkraft-blue-700)] hover:text-background"
								>
									<Link to="/dashboard">Dashboard</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="text-background" />
							<BreadcrumbItem>
								<BreadcrumbPage className="text-background">
									Admin Dashboard
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</section>

			<section className="flex items-center py-6">
				<div className="app-container grid gap-6 items-center">
					<header className="space-y-4">
						<h1 className="text-4xl font-semibold">
							Admin <span className="text-primary">Dashboard</span>
						</h1>
						<p className="text-background">
							Manage users and subscriptions from one place
						</p>
					</header>

					<Tabs
						value={tab}
						onValueChange={(value) => setTab(value as 'users' | 'subscriptions')}
						className="space-y-4 min-w-0"
					>
						<TabsList className="grid h-auto w-full grid-cols-1 border border-primary bg-foreground p-1 sm:grid-cols-2">
							<TabsTrigger
								value="users"
								className="h-auto min-w-0 whitespace-normal px-3 py-2 text-center text-sm leading-tight text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
							>
								User Management
							</TabsTrigger>
							<TabsTrigger
								value="subscriptions"
								className="h-auto min-w-0 whitespace-normal px-3 py-2 text-center text-sm leading-tight text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
							>
								Subscription Management
							</TabsTrigger>
						</TabsList>

						<div className="min-w-0 rounded-lg border border-background bg-[var(--omkraft-surface-0)] p-4 text-background">
							<TabsContent value="users" className="space-y-4 mt-0">
								<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
									<Input
										value={userSearchInput}
										onChange={(e) => setUserSearchInput(e.target.value)}
										placeholder="Search by name, email, phone"
										className="w-full lg:max-w-sm bg-[var(--omkraft-surface-0)] text-background border-background placeholder:text-background"
									/>
									<p className="text-xs text-background">
										Sorted by {userSortBy} ({userSortOrder}) | Total:{' '}
										{userTotal}
									</p>
								</div>

								<OmkraftAlert
									error={usersError}
									fallbackTitle="Could not load users"
								/>
								<div className="space-y-3 lg:hidden">
									{usersLoading ? (
										<div className="rounded-lg border border-[var(--omkraft-border-strong)] p-4 text-center">
											<Spinner className="mr-2 inline size-5" />
											Loading users...
										</div>
									) : users.length ? (
										users.map((row) => (
											/* mobile card: admin users get elevated dark treatment */
											<Card
												key={row.id}
												className={`space-y-2 border-background p-3 text-background shadow-none transition-colors ${
													row.role === 'ADMIN'
														? 'bg-background hover:bg-[var(--omkraft-navy-700)]'
														: 'bg-[var(--omkraft-surface-0)] hover:bg-[var(--omkraft-blue-50)]'
												}`}
											>
												<div className="space-y-1">
													<p
														className={`font-semibold ${
															row.role === 'ADMIN'
																? 'text-[var(--omkraft-white)]'
																: ''
														}`}
													>
														{row.firstName} {row.lastName}
													</p>
													<p
														className={`text-sm ${
															row.role === 'ADMIN'
																? 'text-muted-foreground'
																: ''
														}`}
													>
														Role: {row.role}
													</p>
													<p
														className={`break-all text-sm ${
															row.role === 'ADMIN'
																? 'text-muted-foreground'
																: ''
														}`}
													>
														{row.email}
													</p>
													<p
														className={`text-sm ${
															row.role === 'ADMIN'
																? 'text-muted-foreground'
																: ''
														}`}
													>
														{row.phone}
													</p>
												</div>
												<div className="flex flex-wrap gap-2 pt-1">
													<EditUserDialog
														user={row}
														onSuccess={fetchUsers}
													/>
													<DeleteUserDialog
														user={row}
														onSuccess={fetchUsers}
														disableDelete={row.id === user.id}
													/>
												</div>
											</Card>
										))
									) : (
										<div className="rounded-lg border border-[var(--omkraft-border-strong)] p-4 text-center">
											No users found
										</div>
									)}
								</div>
								<div className="hidden w-full max-w-full overflow-x-auto rounded-lg border border-background bg-[var(--omkraft-surface-0)] lg:block">
									<Table className="text-background [&_td]:break-words [&_td]:whitespace-normal [&_th]:whitespace-nowrap">
										<TableHeader className="bg-[var(--omkraft-blue-50)]">
											<TableRow>
												<TableHead>
													<button
														type="button"
														className="inline-flex items-center gap-1 text-primary"
														onClick={() => onUserSort('firstName')}
													>
														Name <ArrowUpDown size={14} />
													</button>
												</TableHead>
												<TableHead>
													<button
														type="button"
														className="inline-flex items-center gap-1 text-primary"
														onClick={() => onUserSort('email')}
													>
														Email <ArrowUpDown size={14} />
													</button>
												</TableHead>
												<TableHead>Phone</TableHead>
												<TableHead>
													<button
														type="button"
														className="inline-flex items-center gap-1 text-primary"
														onClick={() => onUserSort('role')}
													>
														Role <ArrowUpDown size={14} />
													</button>
												</TableHead>
												<TableHead className="text-right">
													Actions
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{usersLoading ? (
												<TableRow>
													<TableCell
														colSpan={5}
														className="text-center py-6"
													>
														<Spinner className="inline size-5 mr-2" />
														Loading users...
													</TableCell>
												</TableRow>
											) : users.length ? (
												users.map((row) => (
													<TableRow
														key={row.id}
														className={`border-b border-[var(--omkraft-border-strong)] ${
															row.role === 'ADMIN'
																? 'bg-background hover:bg-[var(--omkraft-navy-700)]'
																: 'hover:bg-[var(--omkraft-blue-50)]'
														}`}
													>
														<TableCell
															className={`font-semibold ${
																row.role === 'ADMIN'
																	? 'text-[var(--omkraft-white)]'
																	: ''
															}`}
														>
															{row.firstName} {row.lastName}
														</TableCell>
														<TableCell
															className={`break-all ${
																row.role === 'ADMIN'
																	? 'text-muted-foreground'
																	: ''
															}`}
														>
															{row.email}
														</TableCell>
														<TableCell
															className={
																row.role === 'ADMIN'
																	? 'text-muted-foreground'
																	: ''
															}
														>
															{row.phone}
														</TableCell>
														<TableCell
															className={
																row.role === 'ADMIN'
																	? 'text-muted-foreground'
																	: ''
															}
														>
															{row.role}
														</TableCell>
														<TableCell>
															<div className="flex flex-wrap justify-end gap-2">
																<EditUserDialog
																	user={row}
																	onSuccess={fetchUsers}
																/>
																<DeleteUserDialog
																	user={row}
																	onSuccess={fetchUsers}
																	disableDelete={
																		row.id === user.id
																	}
																/>
															</div>
														</TableCell>
													</TableRow>
												))
											) : (
												<TableRow className="border-b border-[var(--omkraft-border-strong)]">
													<TableCell
														colSpan={5}
														className="text-center py-6"
													>
														No users found
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</div>
								<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
									<p className="text-xs text-background">
										Page {userPage} of {userTotalPages}
									</p>
									<div className="flex gap-2">
										<Button
											variant="outline"
											className="h-7 px-2 text-xs border-background text-background hover:bg-[var(--omkraft-navy-50)]"
											disabled={userPage <= 1}
											onClick={() => setUserPage((p) => p - 1)}
										>
											Previous
										</Button>
										<Button
											variant="outline"
											className="h-7 px-2 text-xs border-background text-background hover:bg-[var(--omkraft-navy-50)]"
											disabled={userPage >= userTotalPages}
											onClick={() => setUserPage((p) => p + 1)}
										>
											Next
										</Button>
									</div>
								</div>
							</TabsContent>

							<TabsContent value="subscriptions" className="space-y-4 mt-0">
								<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
									<Input
										value={subscriptionSearchInput}
										onChange={(e) => setSubscriptionSearchInput(e.target.value)}
										placeholder="Search by user, email, provider, category"
										className="w-full lg:max-w-sm bg-[var(--omkraft-surface-0)] text-background border-background placeholder:text-background"
									/>
									<p className="text-xs text-background">
										Sorted by {subscriptionSortBy} ({subscriptionSortOrder}) |
										Total: {subscriptionTotal}
									</p>
								</div>

								<OmkraftAlert
									error={subscriptionsError}
									fallbackTitle="Could not load subscriptions"
								/>
								<div className="space-y-3 lg:hidden">
									{subscriptionsLoading ? (
										<div className="rounded-lg border border-[var(--omkraft-border-strong)] p-4 text-center">
											<Spinner className="mr-2 inline size-5" />
											Loading subscriptions...
										</div>
									) : subscriptions.length ? (
										subscriptions.map((row) => (
											<Card
												key={row._id}
												className="space-y-2 border-background bg-[var(--omkraft-surface-0)] p-3 text-background shadow-none transition-colors hover:bg-[var(--omkraft-blue-50)]"
											>
												<div className="space-y-1">
													<p className="font-semibold">{row.name}</p>
													<p className="text-sm">Status: {row.status}</p>
													<p className="text-sm">
														User:{' '}
														{row.user
															? `${row.user.firstName} ${row.user.lastName}`
															: 'Unknown user'}
													</p>
													<p className="break-all text-sm">
														{row.user?.email ?? '-'}
													</p>
													<p className="text-sm">
														Provider: {row.provider}
													</p>
													<p className="text-sm">
														Amount:{' '}
														<IndianRupee className="mr-1 inline size-3.5" />
														{row.amount.toFixed(2)}
													</p>
													<p className="text-sm">
														Next Billing:{' '}
														{formatDate(row.nextBillingDate)}
													</p>
												</div>
												<div className="flex flex-wrap gap-2 pt-1">
													<EditSubscriptionDialog
														subscription={row}
														onSuccess={fetchSubscriptions}
													/>
													<DeleteSubscriptionDialog
														subscription={row}
														onSuccess={fetchSubscriptions}
													/>
												</div>
											</Card>
										))
									) : (
										<div className="rounded-lg border border-[var(--omkraft-border-strong)] p-4 text-center">
											No subscriptions found
										</div>
									)}
								</div>
								<div className="hidden w-full max-w-full overflow-x-auto rounded-lg border border-background bg-[var(--omkraft-surface-0)] lg:block">
									<Table className="text-background [&_td]:break-words [&_td]:whitespace-normal [&_th]:whitespace-nowrap">
										<TableHeader className="bg-[var(--omkraft-blue-50)]">
											<TableRow>
												<TableHead>
													<button
														type="button"
														className="inline-flex items-center gap-1 text-primary"
														onClick={() => onSubscriptionSort('name')}
													>
														Subscription <ArrowUpDown size={14} />
													</button>
												</TableHead>
												<TableHead>
													<button
														type="button"
														className="inline-flex items-center gap-1 text-primary"
														onClick={() => onSubscriptionSort('user')}
													>
														User <ArrowUpDown size={14} />
													</button>
												</TableHead>
												<TableHead>Provider</TableHead>
												<TableHead>
													<button
														type="button"
														className="inline-flex items-center gap-1 text-primary"
														onClick={() => onSubscriptionSort('amount')}
													>
														Amount <ArrowUpDown size={14} />
													</button>
												</TableHead>
												<TableHead>
													<button
														type="button"
														className="inline-flex items-center gap-1 text-primary"
														onClick={() => onSubscriptionSort('status')}
													>
														Status <ArrowUpDown size={14} />
													</button>
												</TableHead>
												<TableHead>
													<button
														type="button"
														className="inline-flex items-center gap-1 text-primary"
														onClick={() =>
															onSubscriptionSort('nextBillingDate')
														}
													>
														Next Billing <ArrowUpDown size={14} />
													</button>
												</TableHead>
												<TableHead className="text-right">
													Actions
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{subscriptionsLoading ? (
												<TableRow>
													<TableCell
														colSpan={7}
														className="text-center py-6"
													>
														<Spinner className="inline size-5 mr-2" />
														Loading subscriptions...
													</TableCell>
												</TableRow>
											) : subscriptions.length ? (
												subscriptions.map((row) => (
													<TableRow
														key={row._id}
														className="border-b border-[var(--omkraft-border-strong)] hover:bg-[var(--omkraft-blue-50)]"
													>
														<TableCell className="font-semibold">
															{row.name}
														</TableCell>
														<TableCell>
															{row.user
																? `${row.user.firstName} ${row.user.lastName}`
																: 'Unknown user'}
														</TableCell>
														<TableCell>{row.provider}</TableCell>
														<TableCell>
															<IndianRupee className="mr-1 inline size-3.5" />
															{row.amount.toFixed(2)}
														</TableCell>
														<TableCell>{row.status}</TableCell>
														<TableCell>
															{formatDate(row.nextBillingDate)}
														</TableCell>
														<TableCell>
															<div className="flex flex-wrap justify-end gap-2">
																<EditSubscriptionDialog
																	subscription={row}
																	onSuccess={fetchSubscriptions}
																/>
																<DeleteSubscriptionDialog
																	subscription={row}
																	onSuccess={fetchSubscriptions}
																/>
															</div>
														</TableCell>
													</TableRow>
												))
											) : (
												<TableRow className="border-b border-[var(--omkraft-border-strong)]">
													<TableCell
														colSpan={7}
														className="text-center py-6"
													>
														No subscriptions found
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</div>
								<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
									<p className="text-xs text-background">
										Page {subscriptionPage} of {subscriptionTotalPages}
									</p>
									<div className="flex gap-2">
										<Button
											variant="outline"
											className="h-7 px-2 text-xs border-background text-background hover:bg-[var(--omkraft-navy-50)]"
											disabled={subscriptionPage <= 1}
											onClick={() => setSubscriptionPage((p) => p - 1)}
										>
											Previous
										</Button>
										<Button
											variant="outline"
											className="h-7 px-2 text-xs border-background text-background hover:bg-[var(--omkraft-navy-50)]"
											disabled={subscriptionPage >= subscriptionTotalPages}
											onClick={() => setSubscriptionPage((p) => p + 1)}
										>
											Next
										</Button>
									</div>
								</div>
							</TabsContent>
						</div>
					</Tabs>
				</div>
			</section>
		</main>
	);
}

function EditUserDialog({ user, onSuccess }: { user: AdminUser; onSuccess: () => Promise<void> }) {
	const [open, setOpen] = useState(false);
	const [firstName, setFirstName] = useState(user.firstName);
	const [lastName, setLastName] = useState(user.lastName);
	const [email, setEmail] = useState(user.email);
	const [phone, setPhone] = useState(user.phone);
	const [role, setRole] = useState<UserRole>(user.role);
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<unknown | null>(null);

	useEffect(() => {
		if (open) {
			setFirstName(user.firstName);
			setLastName(user.lastName);
			setEmail(user.email);
			setPhone(user.phone);
			setRole(user.role);
			setPassword('');
			setError(null);
		}
	}, [open, user]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		try {
			setLoading(true);
			await updateAdminUser(user.id, {
				firstName,
				lastName,
				email,
				phone,
				role,
				password: password.trim() ? password : undefined,
			});
			setOpen(false);
			await onSuccess();
		} catch (err) {
			setError(err instanceof Error ? err : 'Failed to update user');
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					size="sm"
					className="flex items-center gap-1 border border-primary bg-transparent text-sm text-primary hover:bg-[var(--omkraft-blue-100)]"
				>
					<Pencil size={16} />
					<span className="hidden text-sm lg:inline">Edit</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="text-foreground">
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-3">
					<FieldGroup>
						<Field>
							<FieldLabel>
								First name <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								required
							/>
						</Field>
						<Field>
							<FieldLabel>
								Last name <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								required
							/>
						</Field>
						<Field>
							<FieldLabel>
								Email <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</Field>
						<Field>
							<FieldLabel>
								Phone <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								required
							/>
						</Field>
						<Field>
							<FieldLabel>
								Role <span className="text-destructive">*</span>
							</FieldLabel>
							<Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
								<SelectTrigger className="border-border bg-muted">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-[var(--omkraft-blue-700)] text-foreground">
									<SelectItem value="USER" className="focus:text-background">
										User
									</SelectItem>
									<SelectItem value="ADMIN" className="focus:text-background">
										Admin
									</SelectItem>
								</SelectContent>
							</Select>
						</Field>
						<Field>
							<FieldLabel>Password</FieldLabel>
							<Input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter new password"
							/>
							<FieldDescription className="text-xs">
								Leave blank to keep the current password.
							</FieldDescription>
						</Field>
					</FieldGroup>
					<OmkraftAlert error={error} fallbackTitle="Could not update user" />
					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? (
							<>
								<Spinner data-icon="inline-start" /> Saving...
							</>
						) : (
							'Save Changes'
						)}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function DeleteUserDialog({
	user,
	onSuccess,
	disableDelete,
}: {
	user: AdminUser;
	onSuccess: () => Promise<void>;
	disableDelete: boolean;
}) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<unknown | null>(null);

	async function handleDelete() {
		setError(null);
		try {
			setLoading(true);
			await deleteAdminUser(user.id);
			setOpen(false);
			await onSuccess();
		} catch (err) {
			setError(err instanceof Error ? err : 'Failed to delete user');
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="destructive"
					size="sm"
					className="flex items-center gap-1 text-sm"
					disabled={disableDelete}
				>
					<Trash size={16} />
					<span className="hidden text-sm lg:inline">Delete</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="text-foreground">
				<DialogHeader>
					<DialogTitle>Delete User</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<p className="text-sm text-muted-foreground">
						Are you sure you want to delete this user account?
					</p>
					<OmkraftAlert error={error} fallbackTitle="Could not delete user" />
					<div className="flex gap-2">
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDelete} disabled={loading}>
							{loading ? (
								<>
									<Spinner data-icon="inline-start" /> Deleting...
								</>
							) : (
								'Delete User'
							)}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function EditSubscriptionDialog({
	subscription,
	onSuccess,
}: {
	subscription: AdminSubscription;
	onSuccess: () => Promise<void>;
}) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(subscription.name);
	const [provider, setProvider] = useState(subscription.provider);
	const [price, setPrice] = useState(String(subscription.amount));
	const [billingCycleDays, setBillingCycleDays] = useState(String(subscription.cycleInDays));
	const [category, setCategory] = useState(subscription.category);
	const [startDate, setStartDate] = useState<Date>(
		calculateLastChargedDate(new Date(subscription.nextBillingDate), subscription.cycleInDays)
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<unknown | null>(null);

	useEffect(() => {
		if (open) {
			setName(subscription.name);
			setProvider(subscription.provider);
			setPrice(String(subscription.amount));
			setBillingCycleDays(String(subscription.cycleInDays));
			setCategory(subscription.category);
			setStartDate(
				calculateLastChargedDate(
					new Date(subscription.nextBillingDate),
					subscription.cycleInDays
				)
			);
			setError(null);
		}
	}, [open, subscription]);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		let localError: unknown | null = null;

		if (
			!name.trim() ||
			!provider.trim() ||
			!price.trim() ||
			!billingCycleDays ||
			!category ||
			!startDate
		) {
			setError('All fields are required');
			return;
		}

		if (!isPositiveNumeric(Number(price))) {
			setError('Price must be positive number');
			return;
		}

		try {
			setLoading(true);
			await updateAdminSubscription(subscription._id, {
				name,
				category,
				provider,
				amount: Number(price),
				billingCycleDays: Number(billingCycleDays),
				startDate: startDate.toISOString(),
			});
		} catch (err) {
			localError = err instanceof Error ? err : 'Failed to update subscription';
			setError(localError);
		} finally {
			setLoading(false);
			if (!localError) {
				setOpen(false);
				await onSuccess();
			}
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					size="sm"
					className="flex items-center gap-1 border border-primary bg-transparent text-sm text-primary hover:bg-[var(--omkraft-blue-100)]"
				>
					<Pencil size={16} />
					<span className="hidden text-sm lg:inline">Edit</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="text-foreground">
				<DialogHeader>
					<DialogTitle>Edit Subscription</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="admin-category">
								Category <span className="text-destructive">*</span>
							</FieldLabel>
							<Select
								value={category}
								onValueChange={(value) => setCategory(value)}
								required
							>
								<SelectTrigger
									id="admin-category"
									className="border-border bg-muted"
								>
									<SelectValue placeholder="Select category" />
								</SelectTrigger>
								<SelectContent className="bg-[var(--omkraft-blue-700)] text-foreground">
									<SelectItem value="OTT" className="focus:text-background">
										OTT / Streaming
									</SelectItem>
									<SelectItem value="MUSIC" className="focus:text-background">
										Music
									</SelectItem>
									<SelectItem
										value="SIM_PREPAID"
										className="focus:text-background"
									>
										Mobile (Prepaid)
									</SelectItem>
									<SelectItem
										value="SIM_POSTPAID"
										className="focus:text-background"
									>
										Mobile (Postpaid)
									</SelectItem>
									<SelectItem value="INTERNET" className="focus:text-background">
										Internet / Broadband
									</SelectItem>
									<SelectItem value="DTH" className="focus:text-background">
										DTH / TV
									</SelectItem>
									<SelectItem value="SOFTWARE" className="focus:text-background">
										Software / SaaS
									</SelectItem>
									<SelectItem value="CLOUD" className="focus:text-background">
										Cloud Storage
									</SelectItem>
									<SelectItem value="GAMING" className="focus:text-background">
										Gaming
									</SelectItem>
									<SelectItem value="OTHER" className="focus:text-background">
										Other
									</SelectItem>
								</SelectContent>
							</Select>
						</Field>
						<Field>
							<FieldLabel htmlFor="admin-subscription-name">
								Name <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id="admin-subscription-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="admin-subscription-provider">
								Provider <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id="admin-subscription-provider"
								value={provider}
								onChange={(e) => setProvider(e.target.value)}
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="admin-subscription-price">
								Price <span className="text-destructive">*</span>
							</FieldLabel>
							<InputGroup className="bg-input border border-border">
								<InputGroupInput
									id="admin-subscription-price"
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									required
								/>
								<InputGroupAddon>
									<IndianRupee size={14} strokeWidth={2.5} />
								</InputGroupAddon>
							</InputGroup>
						</Field>
						<Field>
							<FieldLabel htmlFor="admin-billing-cycle">Billing cycle</FieldLabel>
							<Select
								value={billingCycleDays}
								onValueChange={(value) => setBillingCycleDays(value)}
							>
								<SelectTrigger
									id="admin-billing-cycle"
									className="border-border bg-muted"
								>
									<SelectValue />
								</SelectTrigger>

								<SelectContent className="bg-[var(--omkraft-blue-700)] text-foreground">
									<SelectItem value="28" className="focus:text-background">
										28 calendar days (Mobile)
									</SelectItem>
									<SelectItem value="30" className="focus:text-background">
										30 calendar days
									</SelectItem>
									<SelectItem value="31" className="focus:text-background">
										Monthly
									</SelectItem>
									<SelectItem value="84" className="focus:text-background">
										84 calendar days
									</SelectItem>
									<SelectItem value="90" className="focus:text-background">
										Quarterly
									</SelectItem>
									<SelectItem value="365" className="focus:text-background">
										Yearly
									</SelectItem>
								</SelectContent>
							</Select>
						</Field>
						<Field>
							<FieldLabel htmlFor="admin-start-date">
								Start date <span className="text-destructive">*</span>
							</FieldLabel>
							<StartDatePicker value={startDate} onChange={setStartDate} />
						</Field>
					</FieldGroup>
					<OmkraftAlert error={error} fallbackTitle="Could not update subscription" />
					{loading ? (
						<div className="flex gap-2">
							<Button className="w-full btn-primary flex gap-1" disabled>
								<Spinner data-icon="inline-start" />
								Please wait...
							</Button>
						</div>
					) : (
						<Button type="submit" className="w-full btn-primary">
							Save Subscription
						</Button>
					)}
				</form>
			</DialogContent>
		</Dialog>
	);
}

function DeleteSubscriptionDialog({
	subscription,
	onSuccess,
}: {
	subscription: AdminSubscription;
	onSuccess: () => Promise<void>;
}) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [mode, setMode] = useState<AdminSubscriptionRemovalMode>('inactive');
	const [error, setError] = useState<unknown | null>(null);

	async function handleDelete() {
		setError(null);
		const reason =
			mode === 'mistake'
				? 'Added by mistake'
				: 'No longer subscribed / actively using this service';
		try {
			setLoading(true);
			await deleteAdminSubscription(subscription._id, { mode, reason });
			setOpen(false);
			await onSuccess();
		} catch (err) {
			setError(err instanceof Error ? err : 'Failed to remove subscription');
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive" size="sm" className="flex items-center gap-1 text-sm">
					<Trash size={16} />
					<span className="hidden text-sm lg:inline">Remove</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="text-foreground">
				<DialogHeader>
					<DialogTitle>Remove Subscription</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<p className="text-sm text-muted-foreground">
						Why are you removing this subscription?
					</p>
					<RadioGroup
						value={mode}
						onValueChange={(value) => setMode(value as AdminSubscriptionRemovalMode)}
						className="grid gap-3"
					>
						<div
							className={`flex items-start gap-3 rounded-md border p-3 ${
								mode === 'mistake' ? 'border-primary bg-muted/50' : 'border-border'
							}`}
						>
							<RadioGroupItem
								value="mistake"
								id={`admin-remove-${subscription._id}-mistake`}
								className="mt-1 border-foreground"
							/>
							<label
								htmlFor={`admin-remove-${subscription._id}-mistake`}
								className="cursor-pointer"
							>
								<p className="font-medium">Added by mistake</p>
								<p className="text-xs text-muted-foreground">
									This will permanently remove the subscription and all its
									payment history.
								</p>
							</label>
						</div>
						<div
							className={`flex items-start gap-3 rounded-md border p-3 ${
								mode === 'inactive' ? 'border-primary bg-muted/50' : 'border-border'
							}`}
						>
							<RadioGroupItem
								value="inactive"
								id={`admin-remove-${subscription._id}-inactive`}
								className="mt-1 border-foreground"
							/>
							<label
								htmlFor={`admin-remove-${subscription._id}-inactive`}
								className="cursor-pointer"
							>
								<p className="font-medium">No longer active</p>
								<p className="text-xs text-muted-foreground">
									This will move the subscription to Inactive while retaining
									payment history.
								</p>
							</label>
						</div>
					</RadioGroup>
					<OmkraftAlert error={error} fallbackTitle="Could not remove subscription" />
					<div className="flex gap-4">
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						{loading ? (
							<div className="flex gap-2">
								<Button
									variant="destructive"
									className="flex items-center gap-1"
									disabled
								>
									<Spinner data-icon="inline-start" /> Removing...
								</Button>
							</div>
						) : (
							<Button variant="destructive" onClick={handleDelete}>
								Remove
							</Button>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
