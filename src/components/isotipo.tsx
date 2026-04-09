import type { VariantProperties } from '@lib/cva';
import { cn, cva } from '@lib/cva';
import type { ComponentPropsWithRef, ReactNode } from 'react';

const variants = cva({
	base: '',
	compoundVariants: [],
	defaultVariants: {
		dimension: 'base',
	},
	variants: {
		dimension: {
			base: 'w-10 h-10',
			small: 'w-8 h-8',
		},
	},
});

type IsotipoProperties = Omit<ComponentPropsWithRef<'img'>, 'src' | 'srcSet'> & VariantProperties<typeof variants>;

function Isotipo({ alt = 'Card Conjurer isotipo', className, dimension, ...properties }: IsotipoProperties): ReactNode {
	return (
		<img
			alt={alt}
			className={cn(variants({ className, dimension }), className)}
			src='/favicon.svg'
			{...properties}
		/>
	);
}

Isotipo.displayName = 'Isotipo';

export type { IsotipoProperties };

export default Isotipo;
