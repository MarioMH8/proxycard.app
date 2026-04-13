import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: 'font-bold text-2xl tracking-tight',
	compoundVariants: [],
	defaultVariants: {
		dimension: 'base',
	},
	variants: {
		dimension: {
			base: 'text-2xl',
			small: 'text-xl',
		},
	},
});

const accentVariants = cva({
	base: 'font-bold text-primary-500',
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type LogotipoProperties = PropertiesWithAsChild<ComponentPropsWithRef<'button'> & VariantProperties<typeof variants>>;

function Logotipo({ asChild = false, className, dimension, ...properties }: LogotipoProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'span';

	return (
		<Comp
			className={cn(variants({ className, dimension }), className)}
			{...properties}>
			Proxy<span className={cn(accentVariants())}>Studio</span>
		</Comp>
	);
}

Logotipo.displayName = 'Logotipo';

export type { LogotipoProperties };

export default Logotipo;
