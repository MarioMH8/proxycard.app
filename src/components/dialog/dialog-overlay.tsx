import type { VariantProperties } from '@shared/cva';
import { cn, cva } from '@shared/cva';
import { Dialog as RadixDialog } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: ['fixed', 'inset-0', 'z-40'],
	compoundVariants: [],
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: 'bg-foreground-950/50 dark:bg-foreground-950/80',
		},
	},
});

type DialogOverlayProps = RadixDialog.DialogOverlayProps & VariantProperties<typeof variants>;

function DialogOverlay({ className, variant = 'default', ...properties }: DialogOverlayProps): ReactNode {
	return (
		<RadixDialog.Overlay
			className={cn(variants({ className, variant }), className)}
			{...properties}
		/>
	);
}

DialogOverlay.displayName = 'DialogOverlay';

export default DialogOverlay;
