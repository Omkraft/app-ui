import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

type Props = {
	value?: Date;
	onChange: (date: Date) => void;
	placeholder?: string;
};

export function StartDatePicker({ value, onChange, placeholder = 'Select start date' }: Props) {
	const [open, setOpen] = React.useState(false);
	const currentYear = new Date().getFullYear();
	const startMonth = new Date(currentYear - 100, 0);
	const endMonth = new Date(currentYear + 25, 11);

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
					{value ? format(value, 'PPP') : <span>{placeholder}</span>}
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
					captionLayout="dropdown"
					startMonth={startMonth}
					endMonth={endMonth}
					onSelect={(date) => {
						if (!date) return;

						onChange(date);
						setOpen(false);
					}}
					autoFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
