import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
	'inline-flex items-center justify-center whitespace-nowrap transition-all select-none \
	text-button tracking-button rounded-md',
	{
		variants: {
			variant: {
				default:
          'bg-primary text-primary-foreground hover:opacity-90',

				secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',

				outline:
          'border border-primary bg-transparent hover:bg-white/5',

				ghost:
          'hover:bg-white/5',

				destructive:
          'bg-[var(--destructive-bg)] text-destructive-foreground \
           hover:bg-[var(--destructive-hover)] focus-visible:ring-[var(--destructive)]',
			},
			size: {
				sm: 'h-7 px-2.5 rounded-sm',
				default: 'h-8 px-3 rounded-md',
				lg: 'h-9 px-4 rounded-md',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
