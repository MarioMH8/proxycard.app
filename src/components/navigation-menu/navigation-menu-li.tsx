import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: 'contents',
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type NavigationMenuLiProperties = PropertiesWithAsChild<
	ComponentPropsWithRef<'li'> & VariantProperties<typeof variants>
>;

function NavigationMenuLi({ asChild = false, className, ...properties }: NavigationMenuLiProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'li';

	return (
		<Comp
			className={cn(variants({ className }), className)}
			{...properties}
		/>
	);
}

NavigationMenuLi.displayName = 'NavigationMenuLi';

export type { NavigationMenuLiProperties };

export default NavigationMenuLi;
