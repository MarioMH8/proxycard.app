import type { VariantProperties } from '@lib/cva';
import { cn, cva } from '@lib/cva';
import type { PropertiesWithAsChild } from '@lib/types';
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
