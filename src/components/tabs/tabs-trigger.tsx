import font from '@components/font';
import { cn, cva } from '@shared/cva';
import { Tabs as RadixTabs } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: [
		'h-10',
		'px-5',
		'flex flex-1 items-center justify-center',
		'hover:text-primary-600 dark:hover:text-primary-300',
		'data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400',
		'data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current',
		'data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px]',
		'data-[state=active]:focus:shadow-primary-700 dark:data-[state=active]:focus:shadow-primary-300',
		'first:rounded-tl-md last:rounded-tr-md',
		'select-none outline-none',
		'has-[a]:hover:cursor-pointer',
	],
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type TabsTriggerProps = RadixTabs.TabsTriggerProps;

function TabsTrigger({ className, ...properties }: TabsTriggerProps): ReactNode {
	return (
		<RadixTabs.Trigger
			className={cn(font(), variants({ className }), className)}
			{...properties}
		/>
	);
}

TabsTrigger.displayName = 'TabsTrigger';

export default TabsTrigger;
