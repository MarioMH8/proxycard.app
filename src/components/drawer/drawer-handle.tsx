import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { ReactNode } from 'react';
import type { HandleProps } from 'vaul';
import { Drawer as VaulDrawer } from 'vaul';

const variants = cva({
	base: ['mx-auto', 'mt-2', 'mb-0', 'h-1', 'w-10', 'shrink-0', 'rounded-full'],
	compoundVariants: [],
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: 'bg-foreground-300 dark:bg-foreground-600',
		},
	},
});

type DrawerHandleProps = HandleProps & VariantProperties<typeof variants>;

function DrawerHandle({ className, variant = 'default', ...properties }: DrawerHandleProps): ReactNode {
	return (
		<VaulDrawer.Handle
			className={cn(variants({ className, variant }), className)}
			{...properties}
		/>
	);
}

DrawerHandle.displayName = 'DrawerHandle';

export type { DrawerHandleProps };
export default DrawerHandle;
