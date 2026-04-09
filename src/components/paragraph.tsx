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
		wrap: {
			balance: 'text-balance',
			pretty: 'text-pretty',
		},
	},
});

type ParagraphProperties = PropertiesWithAsChild<
	ComponentPropsWithRef<'p'> & FontVariantsProperties & VariantProperties<typeof variants>
>;

function Paragraph({
	asChild = false,
	className,
	dimension,
	leading,
	tracking,
	uppercase,
	variant,
	weight,
	...properties
}: ParagraphProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'p';

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

Paragraph.displayName = 'Paragraph';

export type { ParagraphProperties };

export default Paragraph;
