import { Bell, CheckCheck } from 'lucide-react';

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useNotifications } from '@/context/NotificationContext';

import { Separator } from '@/components/ui/separator';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function NotificationBell() {
	const { unreadCount, notifications, markAsRead } = useNotifications();

	return (
		<Popover>
			<PopoverTrigger
				asChild
				className="justify-center items-center inline-flex hover:bg-muted"
			>
				<button className="relative h-9 w-9" aria-label="Notifications">
					<Bell />
					{unreadCount > 0 && (
						<Badge
							className="
							absolute
							-top-1
							-right-1
							p-0
							bg-destructive
							text-destructive-foreground
							text-xs
							rounded-full
							w-4
							h-4
							flex
							items-center
							justify-center"
						>
							{unreadCount <= 9 ? unreadCount : '!'}
						</Badge>
					)}
				</button>
			</PopoverTrigger>

			<PopoverContent className="border-muted-foreground bg-primary p-4 lg:p-6">
				<div className="space-y-2">
					{notifications.length === 0 ? (
						<p>No notifications</p>
					) : (
						notifications.map((n, i) => (
							<React.Fragment key={n._id}>
								<div
									className={`flex items-start justify-between gap-3${n.read ? ' text-muted-foreground' : ''}`}
								>
									<div className="flex flex-col gap-1">
										<p className="flex items-center gap-2 font-semibold">
											{!n.read ? (
												<span className="inline-block h-2 w-2 rounded-full bg-primary-foreground" />
											) : null}
											{n.title}
										</p>
										<p className="text-sm">{n.message}</p>
									</div>
									{!n.read ? (
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="h-7 w-7 shrink-0"
											onClick={(event) => {
												event.preventDefault();
												event.stopPropagation();
												void markAsRead(n._id);
											}}
										>
											<CheckCheck className="h-4 w-4" />
											<span className="sr-only">
												Mark notification as read
											</span>
										</Button>
									) : null}
								</div>
								{i !== notifications.length - 1 && (
									<Separator role="listitem" className="border border-border" />
								)}
							</React.Fragment>
						))
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
