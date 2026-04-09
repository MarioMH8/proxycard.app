import { cn, cva } from '@lib/cva';
import { Tabs as RadixTabs } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: 'flex shrink-0 border-b border-primary-200 dark:border-primary-800',
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type TabsListProps = RadixTabs.TabsListProps;

function TabsList({ className, ...properties }: TabsListProps): ReactNode {
	return (
		<RadixTabs.List
			className={cn(variants({ className }), className)}
			{...properties}
		/>
	);
}

TabsList.displayName = 'TabsList';

export default TabsList;
