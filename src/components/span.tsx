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
	variants: {},
});

type SpanProperties = PropertiesWithAsChild<
	ComponentPropsWithRef<'span'> & FontVariantsProperties & VariantProperties<typeof variants>
>;

function Span({
	asChild = false,
	className,
	dimension,
	leading,
	tracking,
	uppercase,
	variant,
	weight,
	...properties
}: SpanProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'span';

	return (
		<Comp
			className={cn(
				font({ dimension, leading, tracking, uppercase, variant, weight }),
				variants({ className }),
				className
			)}
			{...properties}
		/>
	);
}

Span.displayName = 'Span';

export type { SpanProperties };

export default Span;
