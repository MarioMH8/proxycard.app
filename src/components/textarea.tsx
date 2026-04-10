import type { InputVariantProperties } from '@components/input';
import { className } from '@components/input';
import type { PropertiesWithAsChild } from '@shared/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

type TextareaProperties = PropertiesWithAsChild<ComponentPropsWithRef<'textarea'> & InputVariantProperties>;

function Textarea({
	asChild = false,
	className: cls,
	dimension,
	transparent,
	...properties
}: TextareaProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'textarea';

	return (
		<Comp
			className={className(cls, dimension, transparent)}
			{...properties}
		/>
	);
}

Textarea.displayName = 'Textarea';

export type { TextareaProperties };

export default Textarea;
