import focus from '@components/focus';
import Isotipo from '@components/isotipo';
import Logotipo from '@components/logotipo';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { Fragment } from 'react';

const variants = cva({
	base: 'flex items-center gap-4 p-2',
	compoundVariants: [],
	defaultVariants: {
		dimension: 'base',
	},
	variants: {
		dimension: {
			base: '',
			small: '',
		},
	},
});

type ImagotipoProperties = PropertiesWithAsChild<ComponentPropsWithRef<'div'> & VariantProperties<typeof variants>>;

function Imagotipo({ asChild = false, className, dimension, ...properties }: ImagotipoProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'div';

	return (
		<Comp
			className={cn(focus({ variant: 'primary' }), variants({ className }), className)}
			{...properties}>
			<Fragment>
				<Isotipo dimension={dimension} />
				<Logotipo />
			</Fragment>
		</Comp>
	);
}

Imagotipo.displayName = 'Imagotipo';

export type { ImagotipoProperties };

export { variants };

export default Imagotipo;
