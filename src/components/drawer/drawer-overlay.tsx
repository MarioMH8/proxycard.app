import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Drawer as VaulDrawer } from 'vaul';

const variants = cva({
	base: ['fixed inset-0 z-20'],
	compoundVariants: [],
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: 'bg-black/30 backdrop-blur-sm',
		},
	},
});

type DrawerOverlayProps = ComponentPropsWithoutRef<typeof VaulDrawer.Overlay> & VariantProperties<typeof variants>;

function DrawerOverlay({ className, variant = 'default', ...properties }: DrawerOverlayProps): ReactNode {
	return (
		<VaulDrawer.Overlay
			className={cn(variants({ className, variant }), className)}
			{...properties}
		/>
	);
}

DrawerOverlay.displayName = 'DrawerOverlay';

export type { DrawerOverlayProps };
export default DrawerOverlay;
