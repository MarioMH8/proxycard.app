import font from '@components/font';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { PropertiesWithAsChild } from '@shared/types';
import { Label as RadixLabel, Slot } from 'radix-ui';
import type { ReactElement, ReactNode } from 'react';
import { Children } from 'react';

const variants = cva({
	base: 'block',
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type LabelProperties = PropertiesWithAsChild<RadixLabel.LabelProps & VariantProperties<typeof variants>> & {
	children: [string, ReactElement];
};

function Label({ asChild = false, children, className, ...properties }: LabelProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : RadixLabel.Label;
	const strings = Children.toArray(children).filter(
		chi => typeof chi === 'string' || typeof chi === 'number' || typeof chi === 'bigint'
	);
	const nonStrings = Children.toArray(children).find(
		chi => typeof chi !== 'string' && typeof chi !== 'number' && typeof chi !== 'bigint'
	);

	return (
		<Comp
			className={cn(
				font({ dimension: 'sm', variant: 'muted', weight: 'medium' }),
				variants({ className }),
				className
			)}
			{...properties}>
			{strings.length > 0 && <span>{strings}</span>}
			<Slot.Slot className='mt-2'>{nonStrings}</Slot.Slot>
		</Comp>
	);
}

Label.displayName = 'Label';

export type { LabelProperties };

export default Label;
