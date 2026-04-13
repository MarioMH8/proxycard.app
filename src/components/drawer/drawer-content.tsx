import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Drawer as VaulDrawer } from 'vaul';

import DrawerOverlay from './drawer-overlay';

const variants = cva({
	base: ['fixed', 'bottom-0', 'left-0', 'right-0', 'z-30', 'flex', 'flex-col', 'outline-none'],
	compoundVariants: [],
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: [
				'rounded-t-2xl',
				'border-t',
				'border-foreground-200',
				'dark:border-foreground-700',
				'bg-foreground-50',
				'dark:bg-foreground-950',
				'shadow-2xl',
			],
		},
	},
});

type DrawerContentProps = ComponentPropsWithoutRef<typeof VaulDrawer.Content> & VariantProperties<typeof variants>;

function DrawerContent({ className, variant = 'default', ...properties }: DrawerContentProps): ReactNode {
	return (
		<VaulDrawer.Portal>
			<DrawerOverlay />
			<VaulDrawer.Content
				className={cn(variants({ className, variant }), className)}
				{...properties}
			/>
		</VaulDrawer.Portal>
	);
}

DrawerContent.displayName = 'DrawerContent';

export type { DrawerContentProps };
export default DrawerContent;
