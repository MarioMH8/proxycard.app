import type { VariantProperties } from '@lib/cva';
import { cn, cva } from '@lib/cva';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: [
		'min-w-36',
		'p-1',
		'space-y-1',
		'shadow-lg',
		'rounded-md',
		'will-change-[transform,opacity]',
		'data-[side=bottom]:animate-slide-down',
		'data-[side=left]:animate-slide-right',
		'data-[side=right]:animate-slide-left',
		'data-[side=top]:animate-slide-top',
	],
	compoundVariants: [],
	defaultVariants: {},
	variants: {
		variant: {
			default: [
				'bg-foreground-200 dark:bg-foreground-800',
				'border border-foreground-300 dark:border-foreground-700',
				'shadow-foreground-300/70 dark:shadow-foreground-700/70',
			],
			primary: [
				'bg-primary-200 dark:bg-primary-800',
				'border border-primary-500/30 dark:border-primary-500/30',
				'shadow-primary-200/60 dark:shadow-primary-800/60',
			],
		},
	},
});

type DropdownMenuContentProps = RadixDropdownMenu.DropdownMenuContentProps & VariantProperties<typeof variants>;

function DropdownMenuContent({
	className,
	sideOffset = 5,
	variant = 'default',
	...properties
}: DropdownMenuContentProps): ReactNode {
	return (
		<RadixDropdownMenu.Portal>
			<RadixDropdownMenu.Content
				className={cn(variants({ className, variant }), className)}
				sideOffset={sideOffset}
				{...properties}
			/>
		</RadixDropdownMenu.Portal>
	);
}

DropdownMenuContent.displayName = 'DropdownMenuContent';

export { variants };

export default DropdownMenuContent;
