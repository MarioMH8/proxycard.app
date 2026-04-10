import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { NavLinkProps } from 'react-router';
import { NavLink } from 'react-router';

const variants = cva({
	base: [
		'py-4 px-6',
		'text-base font-medium',
		'border-b-2 border-b-transparent',
		'hover:cursor-pointer',
		'hover:border-b-primary-400/50',
		'focus-visible:border-b-primary-400/50',
		'focus-visible:outline-none',
		'max-lg:text-xl',
		'whitespace-nowrap',
	],
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type NavigationMenuLinkProperties = PropertiesWithAsChild<
	ComponentPropsWithRef<'a'> & NavLinkProps & VariantProperties<typeof variants>
>;

function NavigationMenuLink({ asChild = false, className, ...properties }: NavigationMenuLinkProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : NavLink;

	return (
		<Comp
			className={cn(variants({ className }), className)}
			{...properties}
		/>
	);
}

NavigationMenuLink.displayName = 'NavigationMenuLink';

export type { NavigationMenuLinkProperties };

export default NavigationMenuLink;
