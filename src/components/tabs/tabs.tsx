import { cn, cva } from '@shared/cva';
import { Tabs as RadixTabs } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: 'flex flex-col',
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type TabsProps = RadixTabs.TabsProps;

function Tabs({ className, ...properties }: TabsProps): ReactNode {
	return (
		<RadixTabs.Root
			className={cn(variants({ className }), className)}
			{...properties}
		/>
	);
}

Tabs.displayName = 'Tabs';

export default Tabs;
