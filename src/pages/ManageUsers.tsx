import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import OmkraftAlert from '@/components/ui/omkraft-alert';
import type { AdminUser, UserRole } from '@/api/adminUsers';
import { deleteAdminUser, listUsers, updateAdminUser } from '@/api/adminUsers';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Trash, Pencil, ArrowUpDown } from 'lucide-react';
import { useAuth } from '@/context/auth/AuthContext';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

type SortBy = 'firstName' | 'lastName' | 'email' | 'createdAt' | 'role';
type SortOrder = 'asc' | 'desc';

export default function ManageUsers() {
	const { user } = useAuth();
	const [rows, setRows] = useState<AdminUser[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<unknown | null>(null);
	const [searchInput, setSearchInput] = useState('');
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [sortBy, setSortBy] = useState<SortBy>('createdAt');
	const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);

	const canGoPrev = page > 1;
	const canGoNext = page < totalPages;

	useEffect(() => {
		const timer = setTimeout(() => {
			setPage(1);
			setSearch(searchInput.trim());
		}, 350);

		return () => clearTimeout(timer);
	}, [searchInput]);

	useEffect(() => {
		void fetchUsers();
	}, [page, search, sortBy, sortOrder]);

	async function fetchUsers() {
		setError(null);
		try {
			setLoading(true);
			const response = await listUsers({
				page,
				limit,
				search,
				sortBy,
				sortOrder,
			});
			setRows(response.data);
			setTotalPages(response.pagination.totalPages);
			setTotal(response.pagination.total);
		} catch (err) {
			setError(err instanceof Error ? err : 'Failed to load users');
		} finally {
			setLoading(false);
		}
	}

	function onSort(column: SortBy) {
		if (sortBy === column) {
			setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
			return;
		}
		setSortBy(column);
		setSortOrder('asc');
	}

	if (user?.role !== 'ADMIN') {
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<main className="min-h-[calc(100vh-178px)] bg-[var(--omkraft-blue-200)]">
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
									Manage Users
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					<header className="space-y-2">
						<h1 className="text-4xl font-semibold">
							Manage <span className="text-primary">Users</span>
						</h1>
						<p className="text-background">
							Admin console for user search, sorting, updates, and removal
						</p>
					</header>

					<div className="bg-[var(--omkraft-surface-0)] text-background rounded-lg border border-background p-4 space-y-4">
						<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
							<div className="w-full lg:max-w-sm">
								<Input
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									placeholder="Search by name, email, phone"
									className="bg-[var(--omkraft-surface-0)] text-background border-background placeholder:text-background"
								/>
							</div>
							<p className="text-xs text-background">
								Sorted by {sortBy} (
								{sortOrder === 'asc' ? 'ascending' : 'descending'}) | Total: {total}
							</p>
						</div>

						<OmkraftAlert error={error} fallbackTitle="Could not load users" />

						<div className="lg:hidden space-y-4">
							{loading ? (
								<div className="rounded-md border border-background px-3 py-4 text-sm text-background">
									<Spinner className="inline size-5 mr-2" />
									Loading users...
								</div>
							) : rows.length ? (
								rows.map((row) => (
									<Card
										key={row.id}
										className={`border border-background transition-colors ${
											row.role === 'ADMIN'
												? 'bg-background hover:bg-[var(--omkraft-navy-600)]'
												: 'bg-[var(--omkraft-surface-0)] hover:bg-[var(--omkraft-blue-50)]'
										}`}
									>
										<CardContent className="p-3 space-y-2">
											<div
												className={`text-base font-semibold ${
													row.role === 'ADMIN'
														? 'text-foreground'
														: 'text-background'
												}`}
											>
												{row.firstName} {row.lastName}
											</div>
											<p
												className={`text-sm break-all ${
													row.role === 'ADMIN'
														? 'text-muted-foreground'
														: 'text-background'
												}`}
											>
												{row.email}
											</p>
											<p
												className={`text-sm ${
													row.role === 'ADMIN'
														? 'text-muted-foreground'
														: 'text-background'
												}`}
											>
												{row.phone}
											</p>
											<p
												className={`text-sm ${
													row.role === 'ADMIN'
														? 'text-muted-foreground'
														: 'text-background'
												}`}
											>
												{row.role}
											</p>
											<div className="flex gap-2 pt-1">
												<EditUserDialog user={row} onSuccess={fetchUsers} />
												<DeleteUserDialog
													user={row}
													onSuccess={fetchUsers}
													disableDelete={row.id === user?.id}
												/>
											</div>
										</CardContent>
									</Card>
								))
							) : (
								<div className="rounded-md border border-background px-3 py-4 text-sm text-background text-center">
									No users found
								</div>
							)}
						</div>

						<div className="hidden lg:block bg-[var(--omkraft-surface-0)] rounded-lg border border-background overflow-x-auto">
							<Table className="text-background bg-[var(--omkraft-surface-0)]">
								<TableHeader className="bg-[var(--omkraft-blue-50)]">
									<TableRow className="rounded-lg">
										<TableHead className="px-3 py-2 text-background">
											<button
												type="button"
												className="inline-flex items-center gap-1 text-primary hover:text-[var(--omkraft-blue-700)]"
												onClick={() => onSort('firstName')}
											>
												Name <ArrowUpDown size={14} />
											</button>
										</TableHead>
										<TableHead className="px-3 py-2 text-background">
											<button
												type="button"
												className="inline-flex items-center gap-1 text-primary hover:text-[var(--omkraft-blue-700)]"
												onClick={() => onSort('email')}
											>
												Email <ArrowUpDown size={14} />
											</button>
										</TableHead>
										<TableHead className="px-3 py-2 text-background">
											Phone
										</TableHead>
										<TableHead className="px-3 py-2 text-background">
											<button
												type="button"
												className="inline-flex items-center gap-1 text-primary hover:text-[var(--omkraft-blue-700)]"
												onClick={() => onSort('role')}
											>
												Role <ArrowUpDown size={14} />
											</button>
										</TableHead>
										<TableHead className="text-right px-3 py-2 text-background">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{loading ? (
										<TableRow>
											<TableCell
												colSpan={5}
												className="px-3 py-6 text-center"
											>
												<Spinner className="inline size-5 mr-2" />
												Loading users...
											</TableCell>
										</TableRow>
									) : rows.length ? (
										rows.map((row) => (
											<TableRow
												key={row.id}
												className={`border-t border-[var(--omkraft-blue-100)] ${
													row.role === 'ADMIN'
														? 'bg-background hover:bg-[var(--omkraft-navy-600)]'
														: 'bg-[var(--omkraft-surface-0)] hover:bg-[var(--omkraft-blue-50)]'
												}`}
											>
												<TableCell
													className={`px-3 py-3 ${
														row.role === 'ADMIN'
															? 'text-foreground font-semibold'
															: 'text-background'
													}`}
												>
													{row.firstName} {row.lastName}
												</TableCell>
												<TableCell
													className={`px-3 py-3 ${
														row.role === 'ADMIN'
															? 'text-muted-foreground'
															: 'text-background'
													}`}
												>
													{row.email}
												</TableCell>
												<TableCell
													className={`px-3 py-3 ${
														row.role === 'ADMIN'
															? 'text-muted-foreground'
															: 'text-background'
													}`}
												>
													{row.phone}
												</TableCell>
												<TableCell
													className={`px-3 py-3 ${
														row.role === 'ADMIN'
															? 'text-muted-foreground'
															: 'text-background'
													}`}
												>
													{row.role}
												</TableCell>
												<TableCell className="px-3 py-3">
													<div className="flex justify-end gap-2">
														<EditUserDialog
															user={row}
															onSuccess={fetchUsers}
														/>
														<DeleteUserDialog
															user={row}
															onSuccess={fetchUsers}
															disableDelete={row.id === user?.id}
														/>
													</div>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell
												colSpan={5}
												className="px-3 py-6 text-center text-background"
											>
												No users found
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</div>

						<div className="flex items-center justify-between">
							<p className="text-xs text-background">
								Page {page} of {totalPages}
							</p>
							<div className="flex gap-2">
								<Button
									variant="outline"
									className="h-7 px-2 text-xs border-background text-background hover:bg-[var(--omkraft-blue-50)]"
									disabled={!canGoPrev}
									onClick={() => setPage((p) => p - 1)}
								>
									Previous
								</Button>
								<Button
									variant="outline"
									className="h-7 px-2 text-xs border-background text-background hover:bg-[var(--omkraft-blue-50)]"
									disabled={!canGoNext}
									onClick={() => setPage((p) => p + 1)}
								>
									Next
								</Button>
							</div>
						</div>
					</div>
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

	async function handleSave(e: React.FormEvent) {
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
					className="flex items-center gap-1 bg-transparent border border-primary text-primary"
				>
					<Pencil size={16} />
					<span className="hidden lg:block">Edit</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="text-foreground">
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSave} className="space-y-3">
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor={`edit-user-first-name-${user.id}`}>
								First name <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id={`edit-user-first-name-${user.id}`}
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								placeholder="First name"
								required
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor={`edit-user-last-name-${user.id}`}>
								Last name <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id={`edit-user-last-name-${user.id}`}
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								placeholder="Last name"
								required
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor={`edit-user-email-${user.id}`}>
								Email <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id={`edit-user-email-${user.id}`}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Email"
								required
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor={`edit-user-phone-${user.id}`}>
								Phone <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								id={`edit-user-phone-${user.id}`}
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								placeholder="Phone"
								required
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor={`edit-user-role-${user.id}`}>
								Role <span className="text-destructive">*</span>
							</FieldLabel>
							<Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
								<SelectTrigger
									id={`edit-user-role-${user.id}`}
									className="border-border bg-muted"
								>
									<SelectValue placeholder="Select role" />
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
							<FieldLabel htmlFor={`edit-user-password-${user.id}`}>
								Password
							</FieldLabel>
							<Input
								id={`edit-user-password-${user.id}`}
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
					className="flex items-center gap-1"
					disabled={disableDelete}
				>
					<Trash size={16} />
					<span className="hidden lg:block">Delete</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="text-foreground">
				<DialogHeader>
					<DialogTitle>Delete User</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<p className="text-sm text-muted-foreground">
						Are you sure you want to delete this user account? This action cannot be
						undone.
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
