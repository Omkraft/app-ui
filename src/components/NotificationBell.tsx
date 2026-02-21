import { Bell } from 'lucide-react';

import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '@/components/ui/popover';

import { useEffect, useState } from 'react';

import {
	fetchNotifications,
	type Notification,
} from '@/api/notification';
import { Separator } from '@/components/ui/separator';
import React from 'react';

export default function NotificationBell()
{
	const [notifications,
		setNotifications] =
		useState<Notification[]>([]);

	useEffect(() =>
	{
		load();
	}, []);

	async function load()
	{
		const data =
			await fetchNotifications();
		setNotifications(data);
	}

	const unread =
		notifications.filter(n => !n.read).length;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button className="relative">
					<Bell />
					{unread > 0 && (
						<span className="
							absolute
							top-0
							right-0
							bg-destructive
							text-xs
							rounded-full
							w-4
							h-4
							flex
							items-center
							justify-center">
							{unread}
						</span>
					)}
				</button>
			</PopoverTrigger>

			<PopoverContent className="bg-primary border-primary-foreground">
				<div className="space-y-2">
					{notifications.length === 0
						? (
							<p>
								No notifications
							</p>
						)
						: notifications.map((n, i) => (
							<React.Fragment key={n._id}>
								<div className="flex flex-col gap-1">
									<p className="font-semibold">
										{n.title}
									</p>
									<p className="text-sm">
										{n.message}
									</p>
								</div>
								{i !== notifications.length-1 && (
									<Separator role='listitem' className="border border-border" />
								)}
							</React.Fragment>
						))
					}
				</div>
			</PopoverContent>
		</Popover>
	);
}