import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: 'flex-nowrap items-center',
	compoundVariants: [],
	defaultVariants: {},
	variants: {
		mobileMenuOpened: {
			false: 'hidden lg:flex lg:flex-row lg:justify-end lg:gap-4',
			true: 'flex flex-col w-full',
		},
	},
});

type NavigationMenuUlProperties = PropertiesWithAsChild<
	ComponentPropsWithRef<'ul'> & VariantProperties<typeof variants>
> & {
	mobileMenuOpened?: boolean;
};

function NavigationMenuUl({
	asChild = false,
	className,
	mobileMenuOpened,
	...properties
}: NavigationMenuUlProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'ul';

	return (
		<Comp
			className={cn(variants({ className, mobileMenuOpened }), className)}
			{...properties}
		/>
	);
}

NavigationMenuUl.displayName = 'NavigationMenuUl';

export type { NavigationMenuUlProperties };

export default NavigationMenuUl;
