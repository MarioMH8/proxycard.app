import font from '@components/font';
import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: [
		'group relative flex items-center',
		'h-8',
		'px-4 py-2',
		'rounded-sm',
		'select-none outline-none',
		'data-[disabled]:pointer-events-none data-[disabled]:text-mauve8',
		'text-foreground-950 hover:bg-foreground-400/40 data-[highlighted]:bg-foreground-400/40',
		'dark:text-foreground-50 dark:hover:bg-foreground-700 dark:data-[highlighted]:bg-foreground-700',
	],
	compoundVariants: [],
	defaultVariants: {},
	variants: {},
});

type DropdownMenuItemProps = RadixDropdownMenu.DropdownMenuItemProps & VariantProperties<typeof variants>;

function DropdownMenuItem({ className, ...properties }: DropdownMenuItemProps): ReactNode {
	return (
		<RadixDropdownMenu.Item
			className={cn(font({ dimension: 'sm', variant: 'default' }), variants({ className }), className)}
			{...properties}
		/>
	);
}

DropdownMenuItem.displayName = 'DropdownMenuItem';

export { variants };
export default DropdownMenuItem;
