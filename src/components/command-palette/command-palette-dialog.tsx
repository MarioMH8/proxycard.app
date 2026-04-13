import { Command } from 'cmdk';
import type { ComponentPropsWithRef, ReactNode } from 'react';

type CommandPaletteDialogProps = Pick<
	ComponentPropsWithRef<typeof Command.Dialog>,
	'children' | 'onOpenChange' | 'open'
>;

/**
 * Styled wrapper for the cmdk Command.Dialog.
 * Renders a modal overlay + centered panel above all other content (z-50).
 */
function CommandPaletteDialog({ children, onOpenChange, open }: CommandPaletteDialogProps): ReactNode {
	return (
		<Command.Dialog
			contentClassName='fixed inset-x-4 top-[20%] z-50 mx-auto max-w-xl overflow-hidden rounded-xl border border-foreground-200 bg-foreground-50 shadow-2xl dark:border-foreground-700 dark:bg-foreground-900'
			onOpenChange={onOpenChange}
			open={open}
			overlayClassName='fixed inset-0 z-50 bg-black/40 backdrop-blur-sm'>
			{children}
		</Command.Dialog>
	);
}

CommandPaletteDialog.displayName = 'CommandPaletteDialog';

export type { CommandPaletteDialogProps };
export default CommandPaletteDialog;
