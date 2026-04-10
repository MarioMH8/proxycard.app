import focus from '@components/focus';
import font from '@components/font';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: [
		'w-full border rounded-lg',
		'motion-safe:transition-colors',
		'disabled:opacity-50',
		'placeholder-foreground-800/30 dark:placeholder-foreground-200/30',
	],
	compoundVariants: [
		{
			className: 'py-2',
			dimension: 'base',
			transparent: true,
		},
		{
			className: 'py-1',
			dimension: 'sm',
			transparent: true,
		},
		{
			className: 'py-0.5',
			dimension: 'xs',
			transparent: true,
		},
	],
	defaultVariants: {},
	variants: {
		dimension: {
			base: 'px-4 py-3',
			sm: 'px-3 py-2',
			xs: 'px-2 py-1',
		},
		transparent: {
			false: 'bg-foreground-50 border-foreground-300 dark:bg-foreground-950 dark:border-foreground-700',
			true: 'border-0 bg-foreground-100 dark:bg-foreground-950',
		},
	},
});

type InputVariantProperties = VariantProperties<typeof variants>;

type InputProperties = PropertiesWithAsChild<ComponentPropsWithRef<'input'> & InputVariantProperties>;

function className(
	className?: string,
	dimension: InputVariantProperties['dimension'] = 'base',
	transparent = false
): string {
	return cn(
		font({ dimension, variant: transparent ? 'muted' : 'default' }),
		focus({ noBorder: true, variant: 'default' }),
		variants({ className, dimension, transparent }),
		className
	);
}

function Input({ asChild = false, className: cls, dimension, transparent, ...properties }: InputProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'input';

	return (
		<Comp
			className={className(cls, dimension, transparent)}
			{...properties}
		/>
	);
}

Input.displayName = 'Input';

export type { InputProperties, InputVariantProperties };

export { className };

export default Input;
