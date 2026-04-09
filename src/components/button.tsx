import focus from '@components/focus';
import type { VariantProperties } from '@lib/cva';
import { cn, cva } from '@lib/cva';
import type { PropertiesWithAsChild } from '@lib/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: 'motion-safe:transition-all flex items-center justify-center gap-2',
	compoundVariants: [
		{
			className: 'p-3 w-12 h-12',
			dimension: 'base',
			icon: true,
		},
		{
			className: 'px-6 py-3 rounded-lg',
			dimension: 'base',
			icon: false,
		},
		{
			className: 'p-2 w-8 h-8',
			dimension: 'sm',
			icon: true,
		},
		{
			className: 'px-4 py-2 rounded',
			dimension: 'sm',
			icon: false,
		},
		{
			className: 'bg-foreground-300/50 dark:bg-foreground-700/50',
			transparent: false,
			variant: 'default',
		},
		{
			className: 'bg-primary-600',
			transparent: false,
			variant: 'primary',
		},
		{
			className: 'bg-error-600',
			transparent: false,
			variant: 'danger',
		},
		{
			className: 'bg-success-600',
			transparent: false,
			variant: 'success',
		},
		{
			className: 'text-primary-600 hover:text-white',
			transparent: true,
			variant: 'primary',
		},
		{
			className: 'text-error-600 hover:bg-error-600/10 dark:text-error-400 dark:hover:bg-error-400/10',
			transparent: true,
			variant: 'danger',
		},
		{
			className: 'text-success-600 hover:bg-success-600/10 dark:text-success-400 dark:hover:bg-success-400/10',
			transparent: true,
			variant: 'success',
		},
	],
	defaultVariants: {
		dimension: 'base',
		transparent: false,
		variant: 'default',
		weight: 'bold',
	},
	variants: {
		dimension: {
			base: 'text-base',
			sm: 'text-sm',
		},
		disabled: {
			false: [],
			true: 'opacity-50 pointer-events-none',
		},
		icon: {
			false: '',
			true: 'rounded-full',
		},
		transparent: {
			false: '',
			true: 'rounded-full',
		},
		variant: {
			danger: 'text-white hover:bg-error-600 dark:hover:bg-error-400',
			default:
				'text-foreground-950 hover:bg-foreground-400/40 dark:text-foreground-50 dark:hover:bg-foreground-700',
			primary: 'text-white hover:bg-primary-500',
			success: 'text-white hover:bg-success-600 dark:hover:bg-success-400',
		},
		weight: {
			bold: 'font-bold',
			medium: 'font-medium',
			normal: 'font-normal',
			semibold: 'font-semibold',
		},
	},
});

type ButtonProperties = PropertiesWithAsChild<ComponentPropsWithRef<'button'> & VariantProperties<typeof variants>>;

function Button({
	asChild = false,
	className,
	dimension = 'base',
	disabled,
	icon = false,
	transparent = false,
	variant,
	weight = 'medium',
	...properties
}: ButtonProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'button';

	return (
		<Comp
			className={cn(
				focus({ variant }),
				variants({ className, dimension, disabled, icon, transparent, variant, weight }),
				className
			)}
			disabled={disabled}
			{...properties}
		/>
	);
}

Button.displayName = 'Button';

export type { ButtonProperties };

export { variants };

export default Button;
