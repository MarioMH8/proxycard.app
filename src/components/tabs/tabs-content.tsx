import { cn, cva } from '@lib/cva';
import { Tabs as RadixTabs } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: [
		'grow rounded-b-md px-2 py-4 outline-none',
		'focus:shadow-[0_0_0_2px]',
		'focus:shadow-primary-700 dark:focus:shadow-primary-300',
	],
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type TabsContentProps = RadixTabs.TabsContentProps;

function TabsContent({ className, ...properties }: TabsContentProps): ReactNode {
	return (
		<RadixTabs.Content
			className={cn(variants({ className }), className)}
			{...properties}
		/>
	);
}

TabsContent.displayName = 'TabsContent';

export default TabsContent;
