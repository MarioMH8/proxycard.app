import type { VariantProperties } from '@lib/cva';
import { cn, cva } from '@lib/cva';
import { AlertDialog as RadixAlertDialog } from 'radix-ui';
import type { ReactNode } from 'react';

const variants = cva({
	base: [
		'fixed',
		'left-1/2',
		'top-1/2',
		'z-50',
		'w-full',
		'max-w-md',
		'-tranforeground-x-1/2',
		'-tranforeground-y-1/2',
		'rounded-lg',
		'p-6',
	],
	compoundVariants: [],
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: 'bg-foreground-100 dark:bg-foreground-950',
		},
	},
});

type AlertDialogContentProps = RadixAlertDialog.AlertDialogContentProps & VariantProperties<typeof variants>;

function AlertDialogContent({ className, variant = 'default', ...properties }: AlertDialogContentProps): ReactNode {
	return (
		<RadixAlertDialog.Portal>
			<RadixAlertDialog.Content
				className={cn(variants({ className, variant }), className)}
				{...properties}
			/>
		</RadixAlertDialog.Portal>
	);
}

AlertDialogContent.displayName = 'AlertDialogContent';

export default AlertDialogContent;
