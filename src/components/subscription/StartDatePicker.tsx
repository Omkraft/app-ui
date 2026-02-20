import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

type Props = {
  value?: Date
  onChange: (date: Date | undefined) => void
}

export function StartDatePicker({ value, onChange }: Props) {

	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						'w-full justify-start font-normal bg-[var(--omkraft-surface-1)] border-[var(--border)]',
						!value && 'text-muted-foreground'
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
					{value ? (
						format(value, 'PPP')
					) : (
						<span>Select start date</span>
					)}

				</Button>
			</PopoverTrigger>

			<PopoverContent
				className="w-auto bg-[var(--omkraft-blue-700)] p-0 border-border"
				align="start"
			>
				<Calendar
					mode="single"
					selected={value}
					className="rounded-xl bg-[var(--omkraft-blue-700)]"
					onSelect={(date) => {
						onChange(date);
						setOpen(false);
					}}
					autoFocus
				/>
			</PopoverContent>
		</Popover>

	);
}
