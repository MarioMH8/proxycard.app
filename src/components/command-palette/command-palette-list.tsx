import { Command } from 'cmdk';
import type { ComponentPropsWithRef, ReactNode } from 'react';

type CommandPaletteListProps = Pick<ComponentPropsWithRef<typeof Command.List>, 'children'>;

/**
 * Scrollable results list for the command palette.
 */
function CommandPaletteList({ children }: CommandPaletteListProps): ReactNode {
	return <Command.List className='max-h-72 overflow-y-auto py-2'>{children}</Command.List>;
}

CommandPaletteList.displayName = 'CommandPaletteList';

export type { CommandPaletteListProps };
export default CommandPaletteList;
