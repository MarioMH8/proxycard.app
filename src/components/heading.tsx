import type { FontVariantsProperties } from '@components/font';
import font from '@components/font';
import type { VariantProperties } from '@lib/cva';
import { cn, cva } from '@lib/cva';
import type { PropertiesWithAsChild } from '@lib/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: '',
	compoundVariants: [],
	defaultVariants: {},
	variants: {
		bordered: {
			true: 'pb-3 border-b border-foreground-300 dark:border-foreground-800',
		},
		icon: {
			true: 'flex items-center gap-2',
		},
	},
});

type HeadingProperties = PropertiesWithAsChild<
	ComponentPropsWithRef<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> &
		FontVariantsProperties &
		VariantProperties<typeof variants> & {
			heading: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
		}
>;

function Heading({
	asChild = false,
	bordered,
	className,
	dimension,
	heading,
	icon,
	leading,
	tracking,
	uppercase,
	variant,
	weight,
	...properties
}: HeadingProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : heading;

	return (
		<Comp
			className={cn(
				font({ dimension, leading, tracking, uppercase, variant, weight }),
				variants({ bordered, className, icon }),
				className
			)}
			{...properties}
		/>
	);
}

Heading.displayName = 'Heading';

export type { HeadingProperties };

export default Heading;
