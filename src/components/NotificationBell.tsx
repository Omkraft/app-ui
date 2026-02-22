import { Bell } from 'lucide-react';

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useNotifications } from '@/context/NotificationContext';

import { Separator } from '@/components/ui/separator';
import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function NotificationBell() {
	const { unreadCount, notifications } = useNotifications();

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button className="relative" aria-label="Notifications">
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

			<PopoverContent className="bg-primary border-primary-foreground">
				<div className="space-y-2">
					{notifications.length === 0 ? (
						<p>No notifications</p>
					) : (
						notifications.map((n, i) => (
							<React.Fragment key={n._id}>
								<div
									className={`flex flex-col gap-1${n.read && ' text-muted-foreground'}`}
								>
									<p className="font-semibold">{n.title}</p>
									<p className="text-sm">{n.message}</p>
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
