import type { FontVariantsProperties } from '@components/font';
import font from '@components/font';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { LinkProps as RRLinkProps } from 'react-router';
import { Link as RRLink } from 'react-router';

const variants = cva({
	base: [
		'hover:text-primary-400 dark:hover:text-primary-600',
		'outline-none focus-visible:text-primary-400 dark:focus-visible:hover:text-primary-600',
		'focus-visible:underline focus-visible:underline-offset-4',
	],
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type LinkBaseProperties = ComponentPropsWithRef<'a'> & FontVariantsProperties & VariantProperties<typeof variants>;

type LinkProperties =
	| (LinkBaseProperties & Partial<RRLinkProps> & { asChild: true })
	| (LinkBaseProperties & RRLinkProps & { asChild?: false });

function Link({
	asChild = false,
	className,
	dimension,
	tracking,
	variant,
	weight,
	...properties
}: LinkProperties): ReactNode {
	const classes = cn(font({ dimension, tracking, variant, weight }), variants(), className);

	if (asChild) {
		return (
			<Slot.Slot
				className={classes}
				{...properties}
			/>
		);
	}

	return (
		<RRLink
			className={classes}
			{...(properties as RRLinkProps)}
		/>
	);
}

Link.displayName = 'Link';

export type { LinkProperties };

export default Link;
