import type { VariantProperties } from '@lib/cva';
import { cn, cva } from '@lib/cva';
import { AlertDialog as RadixAlertDialog } from 'radix-ui';
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

type AlertDialogOverlayProps = RadixAlertDialog.AlertDialogOverlayProps & VariantProperties<typeof variants>;

function AlertDialogOverlay({ className, variant = 'default', ...properties }: AlertDialogOverlayProps): ReactNode {
	return (
		<RadixAlertDialog.Overlay
			className={cn(variants({ className, variant }), className)}
			{...properties}
		/>
	);
}

AlertDialogOverlay.displayName = 'AlertDialogOverlay';

export default AlertDialogOverlay;
