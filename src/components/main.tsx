import type { VariantProperties } from '@lib/cva';
import { cn } from '@lib/cva';
import type { PropertiesWithAsChild } from '@lib/types';
import { cva } from 'cva';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: 'py-32 space-y-12',
	compoundVariants: [
		{
			className: 'xl:max-w-5xl',
			container: true,
			dimension: 'base',
		},
		{
			className: 'xl:max-w-7xl',
			container: true,
			dimension: 'lg',
		},
	],
	defaultVariants: {
		container: false,
		dimension: 'lg',
	},
	variants: {
		container: {
			true: 'container mx-auto',
		},
		dimension: {
			base: '',
			lg: '',
		},
	},
});

type MainProperties = PropertiesWithAsChild<ComponentPropsWithRef<'main'> & VariantProperties<typeof variants>>;

function Main({ asChild, className, container, dimension, ...properties }: MainProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'main';

	return (
		<Comp
			className={cn(variants({ className, container, dimension }), className)}
			{...properties}
		/>
	);
}

Main.displayName = 'Main';

export default Main;
