import type { VariantProperties } from '@lib/cva';
import { cn, cva } from '@lib/cva';
import { Dialog as RadixDialog } from 'radix-ui';
import type { ReactNode } from 'react';

import DialogOverlay from './dialog-overlay';

const variants = cva({
	base: [
		'fixed',
		'left-1/2',
		'top-1/2',
		'z-50',
		'flex',
		'max-h-[85vh]',
		'w-full',
		'max-w-4xl',
		'-translate-x-1/2',
		'-translate-y-1/2',
		'flex-col',
		'overflow-visible',
		'rounded-lg',
		'p-6',
		'shadow-xl',
	],
	compoundVariants: [],
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: 'bg-foreground-100 dark:bg-foreground-800 dark:border dark:border-foreground-700',
		},
	},
});

type DialogContentProps = RadixDialog.DialogContentProps & VariantProperties<typeof variants>;

function DialogContent({ className, variant = 'default', ...properties }: DialogContentProps): ReactNode {
	return (
		<RadixDialog.Portal>
			<DialogOverlay />
			<RadixDialog.Content
				className={cn(variants({ className, variant }), className)}
				{...properties}
			/>
		</RadixDialog.Portal>
	);
}

DialogContent.displayName = 'DialogContent';

export default DialogContent;
