import type { InputVariantProperties } from '@components/input';
import { className } from '@components/input';
import type { PropertiesWithAsChild } from '@shared/types';
import { Slot } from 'radix-ui';
import type { ComponentPropsWithRef, ReactNode } from 'react';

type SelectProperties = PropertiesWithAsChild<ComponentPropsWithRef<'select'> & InputVariantProperties>;

function Select({
	asChild = false,
	className: cls,
	dimension,
	transparent,
	...properties
}: SelectProperties): ReactNode {
	const Comp = asChild ? Slot.Slot : 'select';

	return (
		<Comp
			className={className(cls, dimension, transparent)}
			{...properties}
		/>
	);
}

Select.displayName = 'Select';

export type { SelectProperties };

export default Select;
